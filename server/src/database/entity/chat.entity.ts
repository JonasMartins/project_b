import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Emotion } from "./emotion.entity";
import { Comment } from "./comment.entity";
import {
    Column,
    Entity,
    JoinTable,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinColumn,
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Message } from "./message.entity";

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
