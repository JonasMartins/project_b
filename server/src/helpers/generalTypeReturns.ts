import { Field, ObjectType } from "type-graphql";
import { ErrorFieldHandler } from "./errorFieldHandler";

@ObjectType()
export class GeneralResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Boolean, { nullable: true })
    done?: Boolean;
}
