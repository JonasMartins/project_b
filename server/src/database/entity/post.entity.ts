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
import { PostValidator } from "../validators/post.validator";

@ObjectType()
@Entity()
export class Post extends Base {
    @Field()
    @Column()
    public body: string;

    @Field(() => [String], { nullable: true })
    @Column({ type: "text", array: true, nullable: true })
    files: string[];

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts, { eager: true })
    @JoinTable()
    creator: User;

    @Field(() => [Comment], { nullable: true })
    @OneToMany(() => Comment, (comment) => comment.post, {
        nullable: true,
        cascade: true,
    })
    public comments: Comment[];

    @Field(() => [Emotion], { nullable: true })
    @ManyToMany(() => Emotion, { nullable: true, onDelete: "CASCADE" })
    @JoinTable()
    public emotions: Emotion[];

    constructor(body?: PostValidator) {
        super();
        if (body) {
            this.body = body.body;
        }
    }
}
