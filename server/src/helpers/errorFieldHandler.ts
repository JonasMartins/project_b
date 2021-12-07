import { ObjectType, Field } from "type-graphql";

/**
 *  @field: field that originated the error
 *  @message: message describing the error and cause
 *  @method: method in which the error occurred
 *
 */
@ObjectType()
export class ErrorFieldHandler {
    @Field()
    field: string;

    @Field()
    message: string;

    @Field()
    method: string;
}
