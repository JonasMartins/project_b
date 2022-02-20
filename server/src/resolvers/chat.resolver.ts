import { ErrorFieldHandler } from "./../helpers/errorFieldHandler";
import {
    Query,
    Resolver,
    Mutation,
    Arg,
    Ctx,
    ObjectType,
    Field,
    PubSub,
    Subscription,
    Root,
    Publisher,
} from "type-graphql";
import { Chat } from "./../database/entity/chat.entity";
import { Context } from "./../context";
import { genericError } from "./../helpers/generalAuxMethods";
import { User } from "./../database/entity/user.entity";
import { Message } from "./../database/entity/message.entity";
import { GeneralResponse } from "./../helpers/generalTypeReturns";
import { PubSubEngine } from "graphql-subscriptions";

interface user_chats_chat {
    user_id: string;
    chat_id: string;
}

@ObjectType()
class MessageNotification {
    @Field(() => Message)
    message: Message;

    @Field(() => String)
    loggedUserId: string;
}

@ObjectType()
class MessageSubscription {
    @Field(() => Message, { nullable: true })
    newMessage?: Message;
}

@ObjectType()
class MessageResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => Message, { nullable: true })
    message?: Message;
}

@ObjectType()
class ChatResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => Chat, { nullable: true })
    chat?: Chat;
}

@ObjectType()
class ChatsResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => [Chat], { nullable: true })
    chats?: Chat[];
}

@Resolver()
export class ChatResolver {
    @Query(() => ChatsResponse)
    async getChats(
        @Arg("participant") participant: string,
        @Ctx() { em }: Context
    ): Promise<ChatsResponse> {
        try {
            const chats_ids = await em
                .getRepository(Chat)
                .createQueryBuilder("chat")
                .leftJoin("chat.participants", "participant")
                .select(["chat.id"])
                .where("participant.id = :id", { id: participant })
                .getMany();

            let str_chat_ids: string[] = [];
            chats_ids.forEach((x) => {
                str_chat_ids.push(x.id);
            });

            const qb = await em
                .getRepository(Chat)
                .createQueryBuilder("chat")
                .leftJoinAndSelect("chat.participants", "participant")
                .leftJoinAndSelect("chat.messages", "message")
                .leftJoinAndSelect("message.creator", "creator")
                .select([
                    "chat.id",
                    "message.body",
                    "message.id",
                    "message.createdAt",
                    "creator.id",
                    "creator.name",
                    "creator.picture",
                    "participant.id",
                    "participant.name",
                    "participant.picture",
                ])
                .where("chat.id IN (:...ids)", { ids: str_chat_ids });

            const chats = await qb.getMany();

            return { chats };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getChats",
                    __filename,
                    `Details: ${e.message}`
                ),
            };
        }
    }

    @Mutation(() => GeneralResponse)
    async addUserSeenMessage(
        @Arg("messageId") messageId: string,
        @Arg("userId") userId: string,
        @Ctx() { em }: Context
    ): Promise<GeneralResponse> {
        try {
            const message = await em.findOne(Message, { id: messageId });

            if (!message) {
                return {
                    errors: genericError(
                        "messageId",
                        "addUserSeenMessage",
                        __filename,
                        `Could not find message with id ${messageId}`
                    ),
                };
            }

            if (message.userSeen && !message.userSeen.includes(userId)) {
                message.userSeen.push(userId);
                await em.save(message);
            }

            return { done: true };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "addUserSeenMessage",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }

    @Subscription(() => MessageSubscription, {
        topics: "MESSAGE_CREATED",
    })
    async newMessageNotification(
        @Root("notification") notification: MessageNotification
    ): Promise<MessageSubscription> {
        const { message, loggedUserId } = notification;
        if (message && message.chat.participants) {
            let participant = message.chat.participants.find(
                (x) => x.id === loggedUserId
            );
            if (participant) {
                return { newMessage: message };
            }
        }
        return {};
    }

    @Mutation(() => MessageResponse)
    async createMessage(
        @Arg("creatorId") creatorId: string,
        @Arg("chatId", () => String, { nullable: true }) chatId: string,
        @Arg("participants", () => [String], { nullable: false })
        participants: string[],
        @Arg("body") body: string,
        @PubSub() pubSub: PubSubEngine,
        @Ctx() { em, req }: Context
    ): Promise<MessageResponse> {
        try {
            const users = await em
                .getRepository(User)
                .createQueryBuilder("user")
                .where("user.id IN (:...ids)", { ids: participants })
                .getMany();

            if (!users) {
                return {
                    errors: genericError(
                        "chatId",
                        "createMessage",
                        __filename,
                        "Could not find the chat participants"
                    ),
                };
            }
            let chat: Chat | undefined = undefined;

            if (chatId) {
                chat = await em
                    .getRepository(Chat)
                    .createQueryBuilder("chat")
                    .leftJoinAndSelect("chat.participants", "participants")
                    .select([
                        "chat.id",
                        "chat.created_at",
                        "participants.id",
                        "participants.name",
                        "participants.picture",
                    ])
                    .where("chat.id = :id", { id: chatId })
                    .getOne();
            } else {
                chat = new Chat();
                chat = await em.save(chat);

                if (!chat) {
                    return {
                        errors: genericError(
                            "chatId",
                            "createMessage",
                            __filename,
                            "Could not find the chat"
                        ),
                    };
                }

                let chat_participants: user_chats_chat[] = [];
                users.forEach((x) => {
                    chat_participants.push({
                        user_id: x.id,
                        chat_id: chat!.id,
                    });
                });

                await em.connection
                    .createQueryBuilder()
                    .insert()
                    .into("user_chats_chat")
                    .values(chat_participants)
                    .execute();

                chat.participants = users;
            }

            if (chat === undefined) {
                return {
                    errors: genericError(
                        "chatId",
                        "createMessage",
                        __filename,
                        "Could not find the chat"
                    ),
                };
            }

            const creator = users.filter((x) => x.id === creatorId);

            if (!creator) {
                return {
                    errors: genericError(
                        "creatorId",
                        "createMessage",
                        __filename,
                        "The Creator to this message is not among the chat participants"
                    ),
                };
            }
            const message = await em.create(Message, {
                creator: creator[0],
                body,
                chat,
                userSeen: [creator[0].id],
            });

            await em.save(message);

            await em.connection
                .createQueryBuilder()
                .insert()
                .into("chat_messages_message")
                .values({ chat_id: chat.id, message_id: message.id })
                .execute();

            await pubSub.publish("MESSAGE_CREATED", {
                notification: {
                    message: message,
                    loggedUserId:
                        req.session.userId ||
                        "63eb77ce-1e4c-432b-9cff-9a31b1298b7c",
                },
            });

            return { message };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createMessage",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }
}
