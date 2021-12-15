import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UserValidator {
    @Field()
    @IsString()
    public name: string;

    @Field()
    @IsString()
    public email: string;

    @Field()
    @IsString()
    public password: string;

    @Field({ nullable: true })
    @IsString()
    public roleId: string;

    @Field({ nullable: true })
    @IsString()
    public picture: string;
}
