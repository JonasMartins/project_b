import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Column, Entity, JoinTable, ManyToOne } from "typeorm";
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

    constructor(body?: PostValidator) {
        super();
        if (body) {
            this.body = body.body;
        }
    }
}
