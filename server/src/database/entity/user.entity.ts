import { Field, ObjectType } from "type-graphql";
import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@ObjectType()
@Entity()
export class User extends Base {
    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    email: string;
    
    @Field()
    @Column()
    password: string;
}
