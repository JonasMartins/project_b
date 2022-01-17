import { Entity, Column, JoinColumn, OneToOne, ManyToOne } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { EmotionType } from "./../enum/emotionType.enum";
import { Post } from "./post.entity";

@ObjectType()
@Entity()
export class Emotion extends Base {
    @Field(() => EmotionType)
    @Column({
        type: "enum",
        enum: EmotionType,
    })
    public type: EmotionType;

    @Field(() => User)
    @ManyToOne(() => User, (creator) => creator.emotions, { eager: true })
    @JoinColumn()
    public creator: User;

    @Field(() => Post)
    @ManyToOne(() => Post, (post) => post.emotions, { eager: true })
    @JoinColumn()
    public post: Post;
}
