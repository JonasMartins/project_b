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
import { GeneralResponse } from "./../helpers/generalTypeReturns";
import { PubSubEngine } from "graphql-subscriptions";

interface user_chats_chat {
    user_id: string;
    chat_id: string;
}

@ObjectType()
class MessageSubscription {
    @Field(() => Message, { nullable: true })
    newMessage?: Message;
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
                    "message.created_at",
                    "creator.id",
                    "creator.name",
                    "creator.picture",
                    "participant.id",
                    "participant.name",
                    "participant.picture",
                ])
                .where("participant.id = :id", { id: participant });

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

    @Subscription(() => MessageSubscription, {
        topics: "MESSAGE_CREATED",
    })
    async newMessageNotification(
        @Root("message") message: Message
    ): Promise<MessageSubscription> {
        return { newMessage: message };
    }

    @Mutation(() => GeneralResponse)
    async createMessage(
        @Arg("creatorId") creatorId: string,
        @Arg("chatId", () => String, { nullable: true }) chatId: string,
        @Arg("participants", () => [String], { nullable: false })
        participants: string[],
        @Arg("body") body: string,
        @PubSub() pubSub: PubSubEngine,
        @Ctx() { em }: Context
    ): Promise<GeneralResponse> {
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

            if (!chatId) {
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
            } else {
                chat = await em.findOne(Chat, { id: chatId });
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
            });

            await em.save(message);

            await em.connection
                .createQueryBuilder()
                .insert()
                .into("chat_messages_message")
                .values({ chat_id: chat.id, message_id: message.id })
                .execute();

            await pubSub.publish("MESSAGE_CREATED", { message });

            return { done: message ? true : false };
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
