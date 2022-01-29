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
import { UserValidator } from "../database/validators/user.validator";
import { Role } from "../database/entity/role.entity";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { HandleUpload } from "./../helpers/handleUpload.helper";
import { Request } from "./../database/entity/request.entity";
import { RequestValidator } from "./../database/validators/request.validator";

@ObjectType()
class LoginResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => String, { nullable: true })
    token?: String;
}

@ObjectType()
class GeneralResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Boolean, { nullable: true })
    done?: Boolean;
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
    public cookieLife: number = 1000 * 60 * 60 * 24 * 4;

    @Query(() => UsersResponse)
    async getUsers(
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Arg("offset", () => Number, { nullable: true }) offset: number,
        @Ctx() { em }: Context
    ): Promise<UsersResponse> {
        const max = Math.min(20, limit ? limit : 10);
        const maxOffset = Math.min(10, offset ? offset : 0);

        try {
            const qb = await em
                .getRepository(User)
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.role", "r")
                .select([
                    "user.id",
                    "user.name",
                    "user.email",
                    "user.picture",
                    "r.id",
                    "r.name",
                ])
                .limit(max)
                .offset(maxOffset);

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
    async getUserById(@Ctx() { em, req }: Context): Promise<UserResponse> {
        try {
            if (!req.session.userId) {
                return {
                    errors: genericError(
                        "id",
                        "getUserById",
                        __filename,
                        "User id required"
                    ),
                };
            }
            // get the logged user and all his invitations still not accepeted
            const qb = await em
                .getRepository(User)
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.role", "role")
                .leftJoinAndSelect("user.invitations", "i")
                .leftJoinAndSelect("i.requestor", "r")
                .where("user.id = :id", { id: req.session.userId })
                .andWhere("i.accepted IS NULL")
                .select([
                    "user.id",
                    "user.name",
                    "user.picture",
                    "user.email",
                    "user.password",
                    "role.id",
                    "role.name",
                    "i.id",
                    "r.name",
                    "r.picture",
                ]);

            const user = await qb.getOne();

            return { user };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getUserById",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }

    @Mutation(() => UserResponse)
    async createUser(
        @Arg("options") options: UserValidator,
        @Ctx() { em, req, res }: Context
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
                    errors: genericError(
                        "email",
                        "createUser",
                        __filename,
                        `Email ${options.email} wrong email format.`
                    ),
                };
            }

            const userEmail = await em.findOne(User, { email: options.email });

            if (userEmail) {
                return {
                    errors: genericError(
                        "email",
                        "createUser",
                        __filename,
                        `Email ${options.email} already takken.`
                    ),
                };
            }

            if (options.name.length <= 2) {
                return {
                    errors: genericError(
                        "name",
                        "createUser",
                        __filename,
                        "A user name must have length greater than 2."
                    ),
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
                    errors: genericError(
                        "roleId",
                        "createUser",
                        __filename,
                        `Could not found role with id: ${options.roleId}`
                    ),
                };
            }
            const user = await em.create(User, {
                name: options.name,
                email: options.email,
                password: options.password,
            });

            user.role = role;

            await user.save();

            req.session.userId = user.id;
            req.session.userRole = user.role.name;
            res.cookie("pbTechBlog", req.sessionID, {
                httpOnly: true,
                maxAge: this.cookieLife,
            });

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

    @Query(() => Boolean)
    async loginTest(@Ctx() { req }: Context): Promise<Boolean> {
        if (req.session.userId === undefined) {
            return new Promise((resolve, _) => {
                resolve(false);
            });
        } else {
            return new Promise((resolve, _) => {
                resolve(true);
            });
        }
    }

    @Query(() => UserResponse)
    async getCurrentLoggedUser(
        @Ctx() { req, em }: Context
    ): Promise<UserResponse> {
        if (!req.session.userId) {
            return {
                errors: genericError(
                    "-",
                    "getCurrentLoggedUser",
                    __filename,
                    `Could not find user id on request info, not a user logged right now.`
                ),
            };
        }

        const qb = await em
            .getRepository(User)
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .where("user.id = :id", { id: req.session.userId })
            .select([
                "user.id",
                "user.name",
                "user.picture",
                "user.email",
                "user.password",
                "role.id",
                "role.name",
            ]);

        const user = await qb.getOne();

        if (!user) {
            return {
                errors: genericError(
                    "id",
                    "getCurrentLoggedUser",
                    __filename,
                    `Could not find user with id: ${req.session.userId}`
                ),
            };
        }

        return { user };
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { req, res }: Context): Promise<Boolean> {
        req.session.destroy(() => {});
        // resets also the cookie value
        res.cookie("pbTechBlog", "", {
            httpOnly: true,
            maxAge: this.cookieLife,
        });

        return new Promise((resolve, _) => {
            resolve(true);
        });
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("email", () => String!) email: string,
        @Arg("password", () => String!) password: string,
        @Ctx() { em, req, res }: Context
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

        req.session.userId = user.id;
        req.session.userRole = user.role.name;

        res.cookie("pbTechBlog", req.sessionID, {
            httpOnly: true,
            maxAge: this.cookieLife,
        });

        return { token: "logged" };
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

    @Mutation(() => UserResponse)
    async updateUserSettings(
        @Arg("id") id: string,
        @Arg("file", () => GraphQLUpload, { nullable: true })
        file: FileUpload,
        @Arg("options") options: UserValidator,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        try {
            const user = await em.findOne(User, id);
            if (!user) {
                return {
                    errors: genericError(
                        "-",
                        "createUser",
                        __filename,
                        `Could not found the user with id: ${id}`
                    ),
                };
            }

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
                    errors: genericError(
                        "email",
                        "createUser",
                        __filename,
                        `Email ${options.email} wrong email format.`
                    ),
                };
            }

            if (options.email !== user.email) {
                const userEmail = await em.findOne(User, {
                    email: options.email,
                });

                if (userEmail) {
                    return {
                        errors: genericError(
                            "email",
                            "createUser",
                            __filename,
                            `Email ${options.email} already takken.`
                        ),
                    };
                }
            }

            const validPass = user.password === options.password;

            if (!validPass) {
                user.password = await argon2.hash(options.password);
            }

            if (file) {
                let files: FileUpload[] = [];
                files.push(file);

                const uploader = new HandleUpload(
                    files,
                    "file",
                    "updateUserSettings",
                    __filename
                );

                let result = await uploader.upload();

                if (result.paths?.length) {
                    user.picture = result.paths[0];
                }
            }

            user.name = options.name;
            user.email = options.email;
            user.password = options.password;

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

    @Mutation(() => GeneralResponse)
    async createConnection(
        @Arg("userRequestorId") userRequestorId: string,
        @Arg("userRequestedId") userRequestedId: string,
        @Ctx() { em }: Context
    ): Promise<GeneralResponse> {
        const userRepo = em.connection.getRepository(User);

        let userRequestorConnections = await userRepo.findOne({
            relations: ["connections"],
            where: { id: userRequestorId },
        });

        if (!userRequestorConnections) {
            return {
                errors: genericError(
                    "userRequestorId",
                    "createConnection",
                    __filename,
                    `Could not found the user with id: ${userRequestorId}`
                ),
            };
        }

        let userRequestedConnections = await userRepo.findOne({
            relations: ["connections"],
            where: { id: userRequestedId },
        });

        if (!userRequestedConnections) {
            return {
                errors: genericError(
                    "userRequestedId",
                    "createConnection",
                    __filename,
                    `Could not found the user with id: ${userRequestedId}`
                ),
            };
        }

        try {
            if (
                userRequestedConnections &&
                !userRequestedConnections.connections.length
            ) {
                let auxUserConn: User[] = [];
                auxUserConn.push(userRequestorConnections);
                userRequestedConnections.connections = auxUserConn;
            } else if (
                userRequestedConnections &&
                userRequestedConnections.connections.length
            ) {
                let auxUserConn: User[] = userRequestedConnections.connections;
                auxUserConn.push(userRequestorConnections);
                userRequestedConnections.connections = auxUserConn;
            }

            if (
                userRequestorConnections &&
                !userRequestorConnections.connections.length
            ) {
                let auxUserConn: User[] = [];
                auxUserConn.push(userRequestedConnections);
                userRequestorConnections.connections = auxUserConn;
            } else if (
                userRequestorConnections &&
                userRequestorConnections.connections.length
            ) {
                let auxUserConn: User[] = userRequestorConnections.connections;
                auxUserConn.push(userRequestedConnections);
                userRequestorConnections.connections = auxUserConn;
            }

            await em.save(userRequestedConnections);
            await em.save(userRequestorConnections);

            return { done: true };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createConnection",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }

    @Mutation(() => GeneralResponse)
    async createRequest(
        @Arg("options") options: RequestValidator,
        @Ctx() { em }: Context
    ): Promise<GeneralResponse> {
        try {
            const request = await em.create(Request, {
                requestedId: options.requestedId,
                requestorId: options.requestorId,
            });

            await em.save(request);

            return { done: true };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createRequest",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }

    @Mutation(() => GeneralResponse)
    async updateRequest(
        @Arg("requestId", () => String) requestId: string,
        @Arg("accepted", () => Boolean) accepted: boolean,
        @Ctx() { em }: Context
    ): Promise<GeneralResponse> {
        try {
            const request = await em.findOne(Request, { id: requestId });

            if (!request) {
                return {
                    errors: genericError(
                        "-",
                        "updateRequest",
                        __filename,
                        `Could not foun the request with id: ${requestId}`
                    ),
                };
            }

            request.accepted = accepted;

            await em.save(request);

            return { done: true };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "updateRequest",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }

    @Query(() => UserResponse)
    async getUserConnections(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        try {
            if (!id) {
                return {
                    errors: genericError(
                        "id",
                        "getUserConnections",
                        __filename,
                        "User id required"
                    ),
                };
            }
            const qb = await em
                .getRepository(User)
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.connections", "u1")
                .leftJoinAndSelect("user.invitations", "i")
                .leftJoinAndSelect("i.requestor", "r")
                .where("user.id = :id", { id })
                .select([
                    "user.id",
                    "user.name",
                    "user.picture",
                    "user.email",
                    "u1.id",
                    "u1.name",
                    "u1.picture",
                    "i.id",
                    "i.accepted",
                    "r.id",
                    "r.name",
                    "r.picture",
                ]);

            const user = await qb.getOne();

            if (!user) {
                return {
                    errors: genericError(
                        "id",
                        "getCurrentLoggedUser",
                        __filename,
                        `Could not find user with id: ${id}`
                    ),
                };
            }
            // console.log("User: ", user.connections);

            return { user };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "updateRequest",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }

    @Query(() => UsersResponse)
    async getUserSuggestions(
        @Ctx() { req, em }: Context
    ): Promise<UsersResponse> {
        try {
            if (!req.session.userId) {
                return {
                    errors: genericError(
                        "id",
                        "getUserSuggestions",
                        __filename,
                        "User id required"
                    ),
                };
            }
            let ids: string[] = [];
            const userRepo = em.connection.getRepository(User);

            const qqb = await userRepo
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.connections", "c")
                .leftJoinAndSelect("user.requests", "r")
                .leftJoinAndSelect("user.invitations", "i")
                .where("user.id = :id", { id: req.session.userId })
                .select(["user.id", "c.id", "r.requestedId", "i.requestorId"]);

            const conn = await qqb.getOne();

            conn?.connections.forEach((x) => {
                ids.push(x.id);
            });

            conn?.requests.forEach((x) => {
                if (x.accepted !== false && !ids.includes(x.requestedId)) {
                    ids.push(x.requestedId);
                }
            });

            conn?.invitations.forEach((x) => {
                if (!ids.includes(x.requestorId)) {
                    ids.push(x.requestorId);
                }
            });

            ids.push(req.session.userId);

            const qb = await userRepo
                .createQueryBuilder("user")
                .where("user.id NOT IN (:...ids)", { ids })
                .select(["user.id", "user.name", "user.picture"])
                .limit(5);

            const users = await qb.getMany();

            return { users };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getUserById",
                    __filename,
                    `${e.message}`
                ),
            };
        }
    }
}
