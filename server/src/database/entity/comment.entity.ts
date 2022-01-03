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
    @ManyToOne(() => Post, (post) => post.comments)
    @JoinTable()
    public post: Post;

    @Field(() => Comment, { nullable: true })
    @ManyToOne(() => Comment, { nullable: true })
    public parent: Comment;

    @Field(() => [Comment])
    @OneToMany(() => Comment, (replies: Comment) => replies.parent, {
        nullable: true,
        eager: true,
        orphanedRowAction: "delete",
    })
    public replies: [Comment];

    constructor(body?: CommentValidator) {
        super();
        if (body) {
            this.body = body.body;
        }
    }
}
