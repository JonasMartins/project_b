import { User } from "./../database/entity/user.entity";
import argon2 from "argon2";
import {
    Query,
    Resolver,
    Mutation,
    Arg,
    Ctx,
    ObjectType,
    Field,
} from "type-graphql";
import { Context } from "./../context";
import { ErrorFieldHandler } from "./../helpers/errorFieldHandler";
import { genericError, validateEmail } from "./../helpers/generalAuxMethods";
import { createAcessToken } from "../helpers/aurth";
import { UserValidator } from "../database/validators/user.validator";
import { Role } from "../database/entity/role.entity";

@ObjectType()
class LoginResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => String, { nullable: true })
    token?: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => User, { nullable: true })
    user?: User;
}

@ObjectType()
class UsersResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [User], { nullable: true })
    users?: User[];
}

@Resolver()
export class UserResolver {
    @Query(() => UsersResponse)
    async getUsers(
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Arg("offset", () => Number, { nullable: true }) offset: number,
        @Ctx() { em }: Context
    ): Promise<UsersResponse> {
        const max = Math.min(20, limit ? limit : 5);
        const maxOffset = Math.min(10, offset ? offset : 0);

        try {
            const qb = await em
                .getRepository(User)
                .createQueryBuilder("user")
                .where("1 = 1")
                .limit(max)
                .offset(maxOffset);

            // console.log("query ", qb.getQuery());

            const users = await qb.getMany();

            return { users };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getUsers",
                    __filename,
                    `Could not get the users, details: ${e.message}`
                ),
            };
        }
    }

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
            if (options.password.length < 6) {
                return {
                    errors: genericError(
                        "password",
                        "createUser",
                        __filename,
                        "Password must be at least length 6."
                    ),
                };
            }

            if (!validateEmail(options.email)) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: `Email ${options.email} wrong email format.`,
                            method: `Method: createUser, at ${__filename}`,
                        },
                    ],
                };
            }

            const userEmail = await em.findOne(User, { email: options.email });

            if (userEmail) {
                return {
                    errors: [
                        {
                            field: "email",
                            message: `Email ${options.email} already takken.`,
                            method: `Method: createUser, at ${__filename}`,
                        },
                    ],
                };
            }

            if (options.name.length <= 2) {
                return {
                    errors: [
                        {
                            field: "name",
                            message:
                                "A user name must have length greater than 2.",
                            method: `Method: createUser, at ${__filename}`,
                        },
                    ],
                };
            }

            let role: Role | undefined | null = null;
            if (options.roleId) {
                role = await em.findOne(Role, { id: options.roleId });
            } else {
                role = await em.findOne(Role, { name: "User" });
            }

            if (!role) {
                return {
                    errors: [
                        {
                            field: "roleId",
                            message: `Could not found role with id: ${options.roleId}`,
                            method: `Method: createUser, at ${__filename}`,
                        },
                    ],
                };
            }
            const user = await em.create(User, {
                name: options.name,
                email: options.email,
                password: options.password,
            });

            user.role = role;

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

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email", () => String!) email: string,
        @Arg("password", () => String!) password: string,
        @Ctx() { em, req }: Context
    ): Promise<LoginResponse> {
        const user = await em.findOne(User, { email: email });

        if (!user) {
            return {
                errors: genericError(
                    "email",
                    "login",
                    __filename,
                    `Could not find user with email: ${email}`
                ),
            };
        }

        const validPass = await argon2.verify(user.password, password);

        if (!validPass) {
            return {
                errors: genericError(
                    "password",
                    "login",
                    __filename,
                    "Incorrect password"
                ),
            };
        }

        // const token = createAcessToken(user);
        //console.log("req ", req);
        console.log(req.session);

        const token = "Logged!";

        return { token };
    }

    @Mutation(() => Boolean)
    async deleteUser(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<Boolean> {
        try {
            const user = await em.findOne(User, { id });
            let result: boolean = false;
            if (!user) {
                throw new Error(`User with id: ${id} not found.`);
            }

            const userRemoved = await em.remove(user);
            result = userRemoved ? true : false;
            return new Promise((resolve, _) => {
                resolve(result);
            });
        } catch (e) {
            return new Promise((resolve, _) => {
                resolve(false);
            });
        }
    }
}
