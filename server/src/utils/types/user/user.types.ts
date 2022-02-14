import { SelectQueryBuilder } from "typeorm";
import { Post } from "./../../../database/entity/post.entity";
import { User } from "./../../../database/entity/user.entity";
import { Comment } from "./../../../database/entity/comment.entity";

export interface userPostsCommentsRepliesRaw {
    user_id: string;
    user_name: string;
    user_email: string;
    user_picture: string;
    reply_id: string;
    reply_body: string;
    reply_author_picture: string;
    reply_author_name: string;
    reply_author_id: string;
    reply_created_at: Date;
    p_id: string;
    p_body: string;
    p_created_at: Date;
    p_creator_id: string;
    p_creator_name: string;
    p_creator_picture: string;
    comment_id: string;
    comment_body: string;
    comment_created_at: Date;
    comment_author_picture: string;
    comment_author_name: string;
    comment_author_id: string;
}

export const mapGetUserByIdRaw = async (
    qb: SelectQueryBuilder<User>
): Promise<User> => {
    let qbRaw: userPostsCommentsRepliesRaw[] = await qb.getRawMany();

    let posts: Post[] = [];
    let reply_author = new User();
    let comment_author = new User();

    let currentPostId = "";

    let post: Post;
    qbRaw.forEach((rawObj) => {
        if (rawObj.p_id !== currentPostId) {
            post = new Post();
            post.id = rawObj.p_id;
            post.body = rawObj.p_body;
            post.createdAt = rawObj.p_created_at;

            let _comments = new Array<Comment>();
            post.comments = _comments;
        }

        if (rawObj.comment_id) {
            let comment = new Comment();
            comment.id = rawObj.comment_id;
            comment.body = rawObj.comment_body;
            comment.createdAt = rawObj.comment_created_at;
            comment_author.id = rawObj.comment_author_id;
            comment_author.name = rawObj.comment_author_name;
            comment_author.picture = rawObj.comment_author_picture;
            comment.author = comment_author;

            let _replies = new Array<Comment>();
            comment.replies = _replies;

            if (rawObj.reply_id) {
                let reply = new Comment();
                reply.id = rawObj.reply_id;
                reply.body = rawObj.reply_body;
                reply.createdAt = rawObj.reply_created_at;
                reply_author.id = rawObj.reply_author_id;
                reply_author.name = rawObj.reply_author_name;
                reply_author.picture = rawObj.reply_author_picture;
                reply.author = reply_author;
                comment.replies.push(reply);
            }

            if (!post.comments.find((x) => x.id === comment.id)) {
                post.comments.push(comment);
            }
        }

        currentPostId = rawObj.p_id;
        if (!posts.find((x) => x.id === post.id)) {
            posts.push(post);
        }
    });

    let user = new User();
    if (qbRaw.length) {
        user.id = qbRaw[0].user_id;
        user.name = qbRaw[0].user_name;
        user.email = qbRaw[0].user_email;
        user.picture = qbRaw[0].user_picture;
        user.posts = posts;
    }

    return user;
};
