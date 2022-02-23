import { Message } from "./../../../database/entity/message.entity";
import { SelectQueryBuilder } from "typeorm";
import { User } from "./../../../database/entity/user.entity";
import { Chat } from "./../../../database/entity/chat.entity";

export interface userMessagesSeenRaw {
    user_id: string;
    chats_id: string;
    messages_id: string;

    messages_user_seen: string[];
}

export const mapGetUserSeenMessages = async (
    qb: SelectQueryBuilder<User>
): Promise<User> => {
    let qbRaw: userMessagesSeenRaw[] = await qb.getRawMany();
    let chats: Chat[] = [];
    let chat: Chat;
    let user: User = new User();
    let currentChatId = "";

    if (qbRaw.length) {
        user.id = qbRaw[0].user_id;
        qbRaw.forEach((x) => {
            if (
                x.messages_user_seen &&
                !x.messages_user_seen.includes(x.user_id)
            ) {
                if (x.chats_id !== currentChatId) {
                    chat = new Chat();
                    chat.id = x.chats_id;
                    chat.messages = [];
                    chats.push(chat);
                    currentChatId = x.chats_id;
                }

                let _auxMessage: Message = new Message();
                _auxMessage.id = x.messages_id;
                _auxMessage.userSeen = x.messages_user_seen;
                chat.messages.push(_auxMessage);
            }
        });
        user.chats = chats;
    }

    return user;
};
