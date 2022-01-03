import { Comment } from "../database/entity/comment.entity";
import { Post } from "../database/entity/post.entity";
import { User } from "../database/entity/user.entity";
import { ErrorFieldHandler } from "./../helpers/errorFieldHandler";
import {
    Field,
    ObjectType,
    Query,
    Resolver,
    Ctx,
    Arg,
    Mutation,
} from "type-graphql";
import { genericError } from "./../helpers/generalAuxMethods";
import { Context } from "./../context";
import { CommentValidator } from "../database/validators/comment.validator";

@ObjectType()
class CommentsResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => [Comment], { nullable: true })
    comments?: Comment[];
}

@ObjectType()
class CommentResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];
    @Field(() => Comment, { nullable: true })
    comment?: Comment;
}

@Resolver()
export class CommentResolver {
    @Query(() => CommentsResponse)
    async getPostComments(
        @Arg("postId", () => String) postId: string,
        @Ctx() { em }: Context
    ): Promise<CommentsResponse> {
        try {
            const qb = await em
                .getRepository(Comment)
                .createQueryBuilder("comment")
                .where("comment.postId = :postId", { postId: postId });

            const comments = await qb.getMany();

            return { comments };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getPostComments",
                    __filename,
                    `Could not get the comments, details: ${e.message}`
                ),
            };
        }
    }

    @Mutation(() => CommentResponse)
    async createComment(
        @Arg("options") options: CommentValidator,
        @Ctx() { em }: Context
    ): Promise<CommentResponse> {
        try {
            const post = await em.findOne(Post, { id: options.postId });

            if (!post) {
                return {
                    errors: genericError(
                        "postId",
                        "createComment",
                        __filename,
                        `Could not find the post with id: ${options.postId}`
                    ),
                };
            }

            const user = await em.findOne(User, { id: options.authorId });

            if (!user) {
                return {
                    errors: genericError(
                        "authorId",
                        "createComment",
                        __filename,
                        `Could not find the user with id: ${options.authorId}`
                    ),
                };
            }

            const comment = await em.create(Comment, {
                body: options.body,
            });

            comment.post = post;
            comment.author = user;

            await comment.save();

            return { comment };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createComment",
                    __filename,
                    `Could not get the comments, details: ${e.message}`
                ),
            };
        }
    }
}
