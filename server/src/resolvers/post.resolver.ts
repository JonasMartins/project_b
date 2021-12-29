import { PostValidator } from "../database/validators/post.validator";
import {
    Arg,
    Ctx,
    Field,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { Post } from "../database/entity/post.entity";
import { User } from "../database/entity/user.entity";
import { ErrorFieldHandler } from "../helpers/errorFieldHandler";
import { Context } from "./../context";
import { genericError, manageUploadFile } from "./../helpers/generalAuxMethods";
import { FileUpload, GraphQLUpload } from "graphql-upload";

@ObjectType()
class PostsResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [Post], { nullable: true })
    posts?: Post[];
}

@ObjectType()
class PostResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Post, { nullable: true })
    post?: Post;
}

@Resolver()
export class PostResolver {
    @Query(() => PostsResponse)
    async getPosts(
        @Arg("limit", () => Number, { nullable: true }) limit: number,
        @Arg("offset", () => Number, { nullable: true }) offset: number,
        @Ctx() { em }: Context
    ): Promise<PostsResponse> {
        const max = Math.min(20, limit ? limit : 5);
        const maxOffset = Math.min(10, offset ? offset : 0);

        try {
            const qb = await em
                .getRepository(Post)
                .createQueryBuilder("post")
                .leftJoinAndSelect("post.creator", "user")
                .limit(max)
                .offset(maxOffset);

            // console.log("query: ", qb.getQuery());

            const posts = await qb.getMany();

            return { posts };
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

    // @Arg("file", () => [GraphQLUpload], { nullable: true })
    // file: FileUpload[],

    @Mutation(() => PostResponse)
    async createPost(
        @Arg("options") options: PostValidator,
        @Arg("file", () => GraphQLUpload, { nullable: true })
        file: FileUpload,

        @Ctx() { em }: Context
    ): Promise<PostResponse> {
        try {
            const user = await em.findOne(User, { id: options.creator_id });

            if (!user) {
                return {
                    errors: genericError(
                        "creatorId",
                        "createUser",
                        __filename,
                        `Could not find the user with id: ${options.creator_id}`
                    ),
                };
            }

            const post = await em.create(Post, {
                body: options.body,
            });

            /*
            if (file && file.length) {
                let result = await manageUploadFile(
                    file,
                    "file",
                    "getUniqueFolderName",
                    __filename
                );

                // throw an error if the file could note been uploaded
                if (result.paths?.length) {
                    post.files = result.paths;
                }
            } */

            if (file) {
                let result = await manageUploadFile(
                    file,
                    "file",
                    "getUniqueFolderName",
                    __filename
                );

                post.files = [];
                // throw an error if the file could note been uploaded
                if (result.path) {
                    post.files.push(result.path);
                }
            }

            post.creator = user;

            await post.save();

            return { post };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createPost",
                    __filename,
                    `Could not create the post, details: ${e.message}`
                ),
            };
        }
    }
}
