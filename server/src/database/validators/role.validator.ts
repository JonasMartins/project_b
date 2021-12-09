import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class RoleValidator {
    @Field()
    @IsString()
    public name: string;

    @Field()
    @IsString()
    public description: string;

    @Field()
    @IsString()
    public code: string;
}
