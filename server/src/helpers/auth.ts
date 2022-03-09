import { User } from "../database/entity/user.entity";
import { sign } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { Context } from "../context";

export const createAcessToken = (user: User) => {
    return sign(
        {
            id: user.id,
            name: user.name,
            picture: user.picture,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "2d",
        }
    );
};

export const AuthMiddleWare: MiddlewareFn<Context> = async (
    { context },
    next
) => {
    if (!context.req.session.userId) {
        throw new Error("AUTH");
    }
    return next();
};
