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
import { genericError } from "./../helpers/generalAuxMethods";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { HandleUpload } from "./../helpers/handleUpload.helper";

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
                .innerJoinAndSelect("post.creator", "u1")
                .leftJoinAndSelect("post.emotions", "e")
                .leftJoinAndSelect("e.creator", "u2")
                .select([
                    "post.id",
                    "post.body",
                    "post.files",
                    "u1.id",
                    "u1.name",
                    "u1.picture",
                    "e.id",
                    "e.type",
                    "u2.id",
                    "u2.name",
                ])
                .limit(max)
                .offset(maxOffset)
                .orderBy("post.createdAt", "DESC");

            //console.log("query ", qb.getQuery());

            const posts = await qb.getMany();

            // console.log("posts ", posts);

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

    @Mutation(() => PostResponse)
    async createPost(
        @Arg("options") options: PostValidator,
        @Arg("files", () => [GraphQLUpload], { nullable: true })
        files: FileUpload[],
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

            if (files && files.length) {
                const uploader = new HandleUpload(
                    files,
                    "file",
                    "getUniqueFolderName",
                    __filename
                );

                let result = await uploader.upload();

                // throw an error if the file could note been uploaded
                if (result.paths?.length) {
                    post.files = result.paths;
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
