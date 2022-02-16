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
} from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { Chat } from "./chat.entity";

@ObjectType()
@Entity()
export class Message extends Base {
    @Field()
    @Column()
    public body: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.messages)
    @JoinTable()
    public creator: User;

    @Field(() => Chat)
    @ManyToOne(() => Chat, (chat) => chat.messages)
    @JoinTable()
    public chat: Chat;
}
