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
} from "type-graphql";
import { Chat } from "./../database/entity/chat.entity";
import { Context } from "./../context";
import { genericError } from "./../helpers/generalAuxMethods";
import { User } from "./../database/entity/user.entity";
import { Message } from "./../database/entity/message.entity";
import { GeneralResponse, UserResponse } from "./../helpers/generalTypeReturns";
import { PubSubEngine } from "graphql-subscriptions";
import { mapGetUserSeenMessages } from "./../utils/types/chat/chat.map";

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
                .where("chat.id IN (:...ids)", { ids: str_chat_ids })
                .orderBy("message.createdAt", "ASC");

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
    async addMessageSeenByUser(
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
                        "addMessageSeenByUser",
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
                    "addMessageSeenByUser",
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
            if (!req.session.userId) {
                return {
                    errors: genericError(
                        "chatId",
                        "createMessage",
                        __filename,
                        "User must be logged."
                    ),
                };
            }

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
                    loggedUserId: req.session.userId,
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

    /**
     *
     * @param userId The User id
     * @param chatId  The chat Id
     * @param param2
     * @returns true if the update works well
     * if not, it will fall into exception.
     * Given a chat, this mutation will put the userId
     * given in every message of this chat that dont have
     * this id on it.
     */
    @Mutation(() => GeneralResponse)
    async updateUnSeenChat(
        @Arg("userId") userId: string,
        @Arg("chatId") chatId: string,
        @Ctx() { em }: Context
    ): Promise<GeneralResponse> {
        try {
            const a = userId;
            const qb = await em
                .getRepository(Chat)
                .createQueryBuilder("chat")
                .leftJoinAndSelect("chat.messages", "messages")
                .leftJoinAndSelect("chat.participants", "participants")
                .select([
                    "chat.id",
                    "participants.id",
                    "messages.id",
                    "messages.userSeen",
                ])
                .where("chat.id = :id", { id: chatId });

            const chat = await qb.getOne();
            let newUserSeen: string[] = [];
            let messagesIds: string[] = [];

            chat?.participants.forEach((x) => {
                newUserSeen.push(x.id);
            });

            chat?.messages?.forEach((x) => {
                messagesIds.push(x.id);
            });

            if (newUserSeen.length) {
                await em.connection
                    .createQueryBuilder()
                    .update(Message)
                    .set({ userSeen: newUserSeen })
                    .where("id IN (:...ids)", { ids: messagesIds })
                    .execute();
            }

            return { done: true };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "updateUnSeenChat",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }

    @Query(() => UserResponse)
    async getUserUnseenMessages(
        @Arg("userId") userId: string,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        try {
            const qb = await em
                .getRepository(User)
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.chats", "chats")
                .leftJoinAndSelect("chats.messages", "messages")
                .select([
                    "messages.userSeen",
                    "chats.id",
                    "messages.id",
                    "user.id",
                ])
                .where("user.id = :id", { id: userId })
                .orderBy("chats_id", "ASC");

            const user = await mapGetUserSeenMessages(qb);

            return { user };
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
