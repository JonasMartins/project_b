import { Field, ObjectType } from "type-graphql";
import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { UserValidator } from "../validators/user.validator";
import { Base } from "./base.entity";
import { Role } from "./role.entity";
import { Post } from "./post.entity";
import { Comment } from "./comment.entity";
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
    @JoinColumn({ name: "roleId" })
    public role: Role;

    @Field(() => [Post], { nullable: true })
    @OneToMany(() => Post, (post) => post.creator)
    public posts: Post[];

    @Field(() => [Comment], { nullable: true })
    @OneToMany(() => Comment, (comment) => comment.author, {
        nullable: true,
        cascade: true,
    })
    public comments: Comment[];

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
