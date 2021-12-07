import { User } from "src/database/entity/user.entity";
import { Query, Resolver, Mutation, Arg } from "type-graphql";
import { Service } from "typedi";

@Service()
@Resolver(() => User)
export class UserResolver {}
