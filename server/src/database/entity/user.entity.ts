import { ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@ObjectType()
@Entity()
export class User extends Base {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;
}
