import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { PostValidator } from "../validators/post.validator";

@ObjectType()
@Entity()
export class Post extends Base {
    @Field()
    @Column({ length: 200 })
    public title: string;

    @Field()
    @Column()
    public body: string;

    @Field()
    @Column()
    public file: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts)
    creator: User;

    constructor(body?: PostValidator) {
        super();
        if (body) {
            this.title = body.title;
            this.body = body.body;
        }
    }
}
