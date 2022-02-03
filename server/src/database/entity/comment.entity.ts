import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Post } from "./post.entity";
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { CommentValidator } from "../validators/comment.validator";

@ObjectType()
@Entity()
export class Comment extends Base {
    @Field()
    @Column()
    public body: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.comments)
    @JoinTable()
    public author: User;

    @Field(() => Post)
    @ManyToOne(() => Post, (post) => post.comments, { onDelete: "CASCADE" })
    @JoinTable()
    public post: Post;

    @Field(() => Number)
    @Column({ default: 1 })
    public order: Number;

    @Field(() => Comment, { nullable: true })
    @ManyToOne(() => Comment, (parent: Comment) => parent.replies, {
        nullable: true,
        onDelete: "CASCADE",
    })
    public parent: Comment;

    @Field(() => [Comment])
    @OneToMany(() => Comment, (replies: Comment) => replies.parent, {
        nullable: true,
        cascade: true,
    })
    public replies: Comment[];

    constructor(body?: CommentValidator) {
        super();
        if (body) {
            this.body = body.body;
        }
    }
}
