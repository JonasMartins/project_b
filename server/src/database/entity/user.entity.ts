import { Field, ObjectType } from "type-graphql";
import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { UserValidator } from "../validators/user.validator";
import { Base } from "./base.entity";
import { Role } from "./role.entity";
import { Post } from "./post.entity";
import { Message } from "./message.entity";
import { Chat } from "./chat.entity";
import { Emotion } from "./emotion.entity";
import { Comment } from "./comment.entity";
import { Notification } from "./notification.entity";
import { Request } from "./request.entity";
import argon2 from "argon2";

@ObjectType()
@Entity()
export class User extends Base {
    @Field()
    @Column({ length: 100 })
    public name: string;

    @Field()
    @Column({ length: 200 })
    public email: string;

    @Field()
    @Column({ length: 200 })
    public password: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    public picture: string;

    @Field(() => Role)
    @ManyToOne(() => Role, { eager: true })
    @JoinColumn({ name: "role_id" })
    public role: Role;

    @Field(() => [Post], { nullable: true })
    @OneToMany(() => Post, (post) => post.creator)
    public posts: Post[];

    @Field(() => Message)
    @OneToMany(() => Message, (message) => message.creator)
    public messages: Message[];

    @Field(() => [Chat], { nullable: true })
    @ManyToMany(() => Chat, (chat) => chat.participants)
    @JoinTable({
        name: "user_chats_chat",
        joinColumns: [{ name: "user_id" }],
        inverseJoinColumns: [{ name: "chat_id" }],
    })
    public chats: Chat[];

    @Field(() => Notification)
    @OneToMany(() => Notification, (notification) => notification.creator)
    public nofiticationsCreated: Notification[];

    @Field(() => [Notification], { nullable: true })
    @ManyToMany(() => Notification, (notification) => notification.relatedUsers)
    @JoinTable({
        name: "user_notifications_notification",
        joinColumns: [{ name: "user_id" }],
        inverseJoinColumns: [{ name: "notification_id" }],
    })
    public relatedNotifications: Notification[];

    @Field(() => [Request], { nullable: true })
    @OneToMany(() => Request, (request) => request.requestor)
    public requests: Request[];

    @Field(() => [Request], { nullable: true })
    @OneToMany(() => Request, (request) => request.requested)
    public invitations: Request[];

    @Field(() => [Comment], { nullable: true })
    @OneToMany(() => Comment, (comment) => comment.author, {
        nullable: true,
        cascade: true,
    })
    public comments: Comment[];

    @Field(() => [Emotion], { nullable: true })
    @ManyToMany(() => Emotion, { nullable: true, onDelete: "CASCADE" })
    @JoinTable()
    public emotions: Emotion[];

    @Field(() => [User], { nullable: true })
    @ManyToMany(() => User, { nullable: true, onDelete: "SET NULL" })
    @JoinTable()
    public connections: User[];

    @Field(() => Date, { nullable: true })
    @Column({ nullable: true })
    public lastSeen: Date;

    @Field(() => Date, { nullable: true })
    @Column({ nullable: true })
    public lastTyped: Date;

    @BeforeInsert()
    async hashPassword() {
        const hashedPasswWord = await argon2.hash(this.password);
        this.password = hashedPasswWord;
    }

    constructor(body?: UserValidator) {
        super();
        if (body) {
            this.name = body.name;
            this.email = body.email;
            this.password = body.password;
        }
    }
}
