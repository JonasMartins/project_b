import { Service } from "typedi";
import { User } from "../entity/user.entity";
import { CreateUserInput, UpdateUserInput } from "./../../schema/user.schema";

@Service()
export class UserService {
    getAll = async (): Promise<User[]> => {
        return await User.find();
    };

    getOne = async (id: string): Promise<User | undefined> => {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error(`User with id: ${id} could not be found!`);
        }
        return user;
    };

    create = async (options: CreateUserInput): Promise<User> => {
        return await User.create(options).save();
    };

    update = async (id: string, options: UpdateUserInput): Promise<User> => {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error(`Could not found the user with id: ${id}.`);
        }

        Object.assign(user, options);
        const updatedUser = await user.save();

        return updatedUser;
    };
}
