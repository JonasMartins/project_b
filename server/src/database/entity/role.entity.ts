import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { RoleValidator } from "../validators/role.validator";
import { Base } from "./base.entity";
import { User } from "./user.entity";

@ObjectType()
@Entity()
export class Role extends Base {
    @Field()
    @Column({ length: 50 })
    public name: string;

    @Field()
    @Column({ length: 5 })
    public code: string;

    @Field()
    @Column({ length: 255 })
    public description: string;

    @Field(() => [User])
    @OneToMany(() => User, (user) => user.role, { lazy: true })
    public users: User[];

    constructor(body?: RoleValidator) {
        super();
        if (body) {
            this.name = body.name;
            this.code = body.code;
            this.description = body.description;
        }
    }
}
