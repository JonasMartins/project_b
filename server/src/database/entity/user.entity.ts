import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { UserValidator } from "../validators/user.validator";
import { Base } from "./base.entity";
import { Role } from "./role.entity";

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
    @Column()
    public picture: string;

    @Field(() => Role)
    @ManyToOne(() => Role, { eager: true })
    public role: Role;

    constructor(body: UserValidator) {
        super();
        this.name = body.name;
        this.email = body.email;
        this.password = body.password;
    }
}
