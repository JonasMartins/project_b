import { User } from "../database/entity/user.entity";
import { sign } from "jsonwebtoken";

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
