import { Field, ObjectType } from "type-graphql";
import { Entity, JoinTable, ManyToMany } from "typeorm";
import { Base } from "./base.entity";
import { Message } from "./message.entity";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Chat extends Base {
    @Field(() => [User], { nullable: false })
    @ManyToMany(() => User, (user) => user.chats, {
        nullable: true,
        cascade: true,
    })
    @JoinTable({
        name: "user_chats_chat",
        joinColumns: [{ name: "chat_id" }],
        inverseJoinColumns: [{ name: "user_id" }],
    })
    public participants: User[];

    @Field(() => [Message], { nullable: true })
    @ManyToMany(() => Message, (message) => message.chat, {
        nullable: true,
    })
    @JoinTable({
        name: "chat_messages_message",
        joinColumns: [{ name: "chat_id" }],
        inverseJoinColumns: [{ name: "message_id" }],
    })
    public messages: Message[];
}
