import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class PostValidator {
    @Field()
    @IsString()
    public title: string;

    @Field()
    @IsString()
    public body: string;

    @Field()
    @IsString()
    public creator_id: string;
}
