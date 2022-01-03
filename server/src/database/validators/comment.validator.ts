import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CommentValidator {
    @Field()
    @IsString()
    public body: string;

    @Field()
    @IsString()
    public authorId: string;

    @Field()
    @IsString()
    public postId: string;
}
