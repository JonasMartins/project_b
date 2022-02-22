import argon2 from "argon2";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Publisher,
    PubSub,
    Subscription,
    Root,
} from "type-graphql";
import { Role } from "../database/entity/role.entity";
import { UserValidator } from "../database/validators/user.validator";
import { Context } from "./../context";
import { Post } from "./../database/entity/post.entity";
import { Chat } from "./../database/entity/chat.entity";
import { Request } from "./../database/entity/request.entity";
import { User } from "./../database/entity/user.entity";
import { RequestValidator } from "./../database/validators/request.validator";
import { ErrorFieldHandler } from "./../helpers/errorFieldHandler";
import { genericError, validateEmail } from "./../helpers/generalAuxMethods";
import { GeneralResponse, UserResponse } from "./../helpers/generalTypeReturns";
import { HandleUpload } from "./../helpers/handleUpload.helper";
import { mapGetUserByIdRaw } from "./../utils/types/user/user.types";
import { PubSubEngine } from "graphql-subscriptions";

@ObjectType()
class LoginResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => String, { nullable: true })
    token?: String;
}

@ObjectType()
class RequestSubscription {
    @Field(() => Request, { nullable: true })
    newRequest?: Request;
}

@ObjectType()
class RequestNotification {
    @Field(() => Request, { nullable: true })
    request?: Request;

    @Field(() => String)
    loggedUserId: string;
}

@ObjectType()
class CountResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Number, { nullable: true })
    count?: Number;
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
        const maxOffset = offset ? offset : 0;

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
    async getUserById(
        @Arg("id") id: string,
        @Arg("post_offset", () => Number, { nullable: true })
        post_offset: number,
        @Arg("post_limit", () => Number, { nullable: true }) post_limit: number,
        @Ctx() { em }: Context
    ): Promise<UserResponse> {
        try {
            const maxPosts = Math.min(10, post_limit ? post_limit : 10);
            const maxPostOffset = post_offset ? post_offset : 0;

            if (!id) {
                return {
                    errors: genericError(
                        "id",
                        "getUserById",
                        __filename,
                        "User id required"
                    ),
                };
            }

            const qb = await em
                .getRepository(User)
                .createQueryBuilder("user")
                .leftJoinAndSelect(
                    (sQ) =>
                        sQ
                            .from(Post, "p")
                            .leftJoinAndSelect("p.comments", "comment")
                            .leftJoinAndSelect("p.creator", "p_creator")
                            .leftJoinAndSelect("comment.replies", "reply")
                            .leftJoinAndSelect("reply.author", "reply_author")
                            .leftJoinAndSelect(
                                "comment.author",
                                "comment_author"
                            )
                            .select([
                                "p.id",
                                "p.body",
                                "p.creator_id as p_creator_id",
                                "p.created_at as p_created_at",
                                "p_creator.name",
                                "p_creator.picture",
                                "comment.id",
                                "comment.body",
                                "comment_author.id",
                                "comment.created_at as comment_created_at",
                                "comment_author.name",
                                "comment_author.picture",
                                "reply.id",
                                "reply.body",
                                "reply_author.id",
                                "reply.created_at as reply_created_at",
                                "reply_author.name",
                                "reply_author.picture",
                            ])
                            .take(maxPosts)
                            .skip(maxPostOffset),
                    "post",
                    "post.p_creator_id = user.id"
                )
                .where("user.id = :id", { id })
                .select([
                    "user.id",
                    "user.name",
                    "user.email",
                    "user.picture",
                    "post.p_id",
                    "post.p_body",
                    "post.p_created_at",
                    "post.p_creator_id",
                    "post.p_creator_picture",
                    "post.p_creator_name",
                    "post.reply_id",
                    "post.reply_body",
                    "post.reply_author_id",
                    "post.reply_created_at",
                    "post.reply_author_name",
                    "post.reply_author_picture",
                    "post.comment_id",
                    "post.comment_body",
                    "post.comment_author_id",
                    "post.comment_created_at",
                    "post.comment_author_name",
                    "post.comment_author_picture",
                ]);
            const user = await mapGetUserByIdRaw(qb);

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
            .leftJoinAndSelect("user.connections", "connections")
            .where("user.id = :id", { id: req.session.userId })
            .select([
                "user.id",
                "user.name",
                "user.picture",
                "user.email",
                "user.password",
                "role.id",
                "role.name",
                "connections.id",
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
            sameSite: "lax",
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
    /**
     *
     * @param userRequestorId
     * @param userRequestedId
     * @param param2
     * @returns
     *  Create a connection between user one and user two
     *  also creates a chat with them as participants
     */
    @Mutation(() => GeneralResponse)
    async createConnection(
        @Arg("userRequestorId") userRequestorId: string,
        @Arg("userRequestedId") userRequestedId: string,
        @Ctx() { em }: Context
    ): Promise<GeneralResponse> {
        try {
            interface user_connections_user {
                user_id_1: string;
                user_id_2: string;
            }

            interface user_chats_chat {
                user_id: string;
                chat_id: string;
            }

            let user_connections: user_connections_user[] = [];

            user_connections.push({
                user_id_1: userRequestedId,
                user_id_2: userRequestorId,
            });

            user_connections.push({
                user_id_1: userRequestorId,
                user_id_2: userRequestedId,
            });

            let chat_participants: user_chats_chat[] = [];

            await em.connection
                .createQueryBuilder()
                .insert()
                .into("user_connections_user")
                .values(user_connections)
                .execute();

            const chat = new Chat();
            await em.save(chat);

            if (chat.id) {
                chat_participants.push({
                    chat_id: chat.id,
                    user_id: userRequestedId,
                });
                chat_participants.push({
                    chat_id: chat.id,
                    user_id: userRequestorId,
                });

                await em.connection
                    .createQueryBuilder()
                    .insert()
                    .into("user_chats_chat")
                    .values(chat_participants)
                    .execute();
            }

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
    @Subscription(() => RequestSubscription, {
        topics: "REQUEST_SENDED",
    })
    async newRequestSubscription(
        @Root("notification") notification: RequestNotification
    ): Promise<RequestSubscription> {
        if (notification.request) {
            return { newRequest: notification.request };
        } else {
            return {};
        }
    }

    @Mutation(() => GeneralResponse)
    async createRequest(
        @Arg("options") options: RequestValidator,
        @PubSub() pubSub: PubSubEngine,
        @Ctx() { em, req }: Context
    ): Promise<GeneralResponse> {
        if (!req.session.userId) {
            return {
                errors: genericError(
                    "-",
                    "createRequest",
                    __filename,
                    "Must be logged in."
                ),
            };
        }

        try {
            const request = await em.create(Request, {
                requestedId: options.requestedId,
                requestorId: options.requestorId,
            });

            await em.save(request);
            if (request.id) {
                // this is to eager prop to get the requestor and requested as
                // user object
                const newRequest = await em.findOne(Request, {
                    id: request.id,
                });
                await pubSub.publish("REQUEST_SENDED", {
                    notification: {
                        request: newRequest,
                        loggedUserId: req.session.userId,
                    },
                });
            }

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

    @Query(() => CountResponse)
    async getUserPendingInvitationsCount(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<CountResponse> {
        try {
            const qb = await em
                .getRepository(User)
                .createQueryBuilder("user")
                .innerJoinAndSelect("user.invitations", "i")
                .where("user.id = :id", { id })
                .andWhere("i.accepted is null")
                .select(["i.id"]);

            const requests = await qb.execute();

            return { count: requests.length };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getUserPendingInvitations",
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
