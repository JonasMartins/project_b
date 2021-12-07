import { Field, ObjectType, InputType } from "type-graphql";
import { Length } from "class-validator";

@ObjectType()
export class User {
    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
export class CreateUserInput implements Partial<User> {
    @Field()
    @Length(2, 100)
    name: string;

    @Field()
    @Length(5, 100)
    email: string;

    @Field()
    @Length(5, 100)
    password: string;
}

@InputType()
export class UpdateUserInput implements Partial<User> {
    @Field({ nullable: true })
    @Length(2, 100)
    name: string;

    @Field({ nullable: true })
    @Length(5, 100)
    email: string;

    @Field({ nullable: true })
    @Length(5, 100)
    password: string;
}
