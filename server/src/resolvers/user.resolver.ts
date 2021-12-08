import { User } from "./../database/entity/user.entity";
import {
    Query,
    Resolver,
    Mutation,
    Arg,
    Ctx,
    ObjectType,
    Field,
    InputType,
} from "type-graphql";
import { IsString } from "class-validator";
import { Context } from "./../context";
import { ErrorFieldHandler } from "./../helpers/errorFieldHandler";
import { genericError } from "./../helpers/generalAuxMethods";

@InputType()
class UserValidator {
    @Field()
    @IsString()
    public name: string;

    @Field()
    @IsString()
    public email: string;

    @Field()
    @IsString()
    public password: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {
    @Query(() => UserResponse)
    async getUserById(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { id });

        if (!user) {
            return {
                errors: genericError(
                    "id",
                    "getUserById",
                    __filename,
                    `Could not found user with id: ${id}`
                ),
            };
        }

        return { user };
    }

    @Mutation(() => UserResponse)
    async createUser(
        @Arg("options") options: UserValidator,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        try {
            const user = await em.create(User, {
                name: options.name,
                email: options.email,
                password: options.password,
            });

            await user.save();

            return { user };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createUser",
                    __filename,
                    `Could not create the user, details: ${e.message}`
                ),
            };
        }
    }
}
