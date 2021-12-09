import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { RoleValidator } from "../database/validators/role.validator";
import { Context } from "./../context";
import { Role } from "./../database/entity/role.entity";
import { ErrorFieldHandler } from "./../helpers/errorFieldHandler";
import { genericError } from "./../helpers/generalAuxMethods";

@ObjectType()
class RoleResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Role, { nullable: true })
    role?: Role;
}

@ObjectType()
class RolesResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [Role], { nullable: true })
    roles?: Role[];
}

@Resolver()
export class RoleResolver {
    @Query(() => RolesResponse)
    async getRoles(
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Ctx() { em }: Context
    ): Promise<RolesResponse> {
        const max = Math.min(20, limit);

        try {
            const qb = await em
                .getRepository(Role)
                .createQueryBuilder("role")
                .where("1 = 1")
                .limit(max);

            // saving to put on migrations
            //console.log("Query: ", qb.getQuery());

            const roles = await qb.getMany();

            return { roles };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getRoles",
                    __filename,
                    `Error getting the roles, details: ${e.message}`
                ),
            };
        }
    }

    @Query(() => RoleResponse)
    async getRoleById(
        @Arg("id") id: string,
        @Ctx() { em }: Context
    ): Promise<RoleResponse> {
        const role = await em.findOne(Role, { id });

        if (!role) {
            return {
                errors: genericError(
                    "id",
                    "getRoleById",
                    __filename,
                    `Could not found role with id: ${id}`
                ),
            };
        }

        return { role };
    }

    @Mutation(() => RoleResponse)
    async createRole(
        @Arg("options") options: RoleValidator,
        @Ctx() { em }: Context
    ): Promise<RoleResponse> {
        try {
            if (options.description.length < 5) {
                return {
                    errors: genericError(
                        "description",
                        "createRole",
                        __filename,
                        "Description must be at least length 6."
                    ),
                };
            }

            // INSERT INTO "role"("id", "createdAt", "updatedAt", "name", "code", "description")
            // VALUES (DEFAULT, DEFAULT, DEFAULT, :orm_param_0, :orm_param_1, :orm_param_2)

            const role = await em.create(Role, options).save();

            return { role };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createRole",
                    __filename,
                    `Could not create the role, details: ${e.message}`
                ),
            };
        }
    }
}
