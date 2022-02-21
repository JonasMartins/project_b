import { Field, ObjectType } from "type-graphql";
import { ErrorFieldHandler } from "./errorFieldHandler";
import { User } from "./../database/entity/user.entity";

@ObjectType()
export class GeneralResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Boolean, { nullable: true })
    done?: Boolean;
}

@ObjectType()
export class GeneralCountType {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => Number)
    count?: number;
}

@ObjectType()
export class UserResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => User, { nullable: true })
    user?: User;
}
