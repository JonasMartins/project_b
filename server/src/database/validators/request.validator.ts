import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class RequestValidator {
    @Field()
    @IsString()
    public requestorId: string;

    @Field()
    @IsString()
    public requestedId: string;
}
