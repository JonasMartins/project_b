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
import { Comment } from "../database/entity/comment.entity";
import { ErrorFieldHandler } from "../helpers/errorFieldHandler";
import { Context } from "./../context";
import { genericError } from "./../helpers/generalAuxMethods";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { HandleUpload } from "./../helpers/handleUpload.helper";

interface postAndCommentsRaw {
    post_id: string;
    c_id: string;
    c_body: string;
    created_at: Date;
}

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
        const max = Math.min(10, limit ? limit : 5);
        const maxOffset = Math.min(10, offset ? offset : 0);

        try {
            const qb = await em
                .getRepository(Post)
                .createQueryBuilder("post")
                .leftJoinAndSelect("post.creator", "u1")
                .leftJoinAndSelect("post.emotions", "e")
                .leftJoinAndSelect("e.creator", "u2")
                .leftJoinAndSelect("post.comments", "c")
                .leftJoinAndSelect("c.author", "ca")
                .leftJoinAndSelect("c.replies", "r")
                .leftJoinAndSelect("r.author", "ra")
                .select([
                    "post.id",
                    "post.body",
                    "post.files",
                    "post.createdAt",
                    "u1.id",
                    "u1.name",
                    "u1.picture",
                    "e.id",
                    "e.type",
                    "u2.id",
                    "u2.name",
                    "c.id",
                    "c.order",
                    "c.body",
                    "c.createdAt",
                    "ca.id",
                    "ca.name",
                    "ca.picture",
                    "r.id",
                    "r.body",
                    "r.order",
                    "r.createdAt",
                    "ra.id",
                    "ra.name",
                    "ra.picture",
                ])
                .take(max)
                .skip(maxOffset)
                .orderBy("post.createdAt", "DESC");

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

    @Query(() => PostResponse)
    async getPostById(
        @Arg("id") id: string,
        @Arg("comment_offset", () => Number, { nullable: true })
        comment_offset: number,
        @Arg("comment_limit", () => Number, { nullable: true })
        comment_limit: number,
        @Ctx() { em }: Context
    ): Promise<PostResponse> {
        try {
            const maxComments = Math.min(
                10,
                comment_limit ? comment_limit : 10
            );
            const maxCommentOffset = comment_offset ? comment_offset : 0;

            const qb = await em
                .getRepository(Post)
                .createQueryBuilder("post")
                .leftJoinAndSelect(
                    (sQ) =>
                        sQ
                            .select([
                                "c.id",
                                "c.created_at",
                                "c.post_id",
                                "c.body",
                            ])
                            .from(Comment, "c")
                            .take(maxComments)
                            .skip(maxCommentOffset)
                            .orderBy("c.created_at", "DESC"),
                    "comment",
                    "comment.post_id = post.id"
                )
                .where("post.id = :id", { id })
                .select([
                    "post.id",
                    "comment.c_id",
                    "comment.created_at",
                    "comment.c_body",
                ]);

            let post = new Post();

            const qbRaw: postAndCommentsRaw[] = await qb.getRawMany();

            let comments: Comment[] = [];
            qbRaw.forEach((rawObj) => {
                let comment = new Comment();
                comment.id = rawObj.c_id;
                comment.createdAt = rawObj.created_at;
                comment.body = rawObj.c_body;
                comments.push(comment);
            });

            post.id = qbRaw[0].post_id;
            post.comments = comments;

            return { post };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getPostById",
                    __filename,
                    `Could not get the post, details: ${e.message}`
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
