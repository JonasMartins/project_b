import { Connection, SelectQueryBuilder } from "typeorm";
import { Post } from "./../../../database/entity/post.entity";
import { User } from "./../../../database/entity/user.entity";
import { Comment } from "./../../../database/entity/comment.entity";
import { Emotion } from "./../../../database/entity/emotion.entity";
import { EmotionType } from "./../../../database/enum/emotionType.enum";

export interface userPostsCommentsRepliesRaw {
    user_id: string;
    user_name: string;
    user_email: string;
    user_picture: string;
    u1_id: string;
    u1_name: string;
    u1_picture: string;
    reply_id: string;
    reply_body: string;
    reply_author_picture: string;
    reply_author_name: string;
    reply_author_id: string;
    reply_order: number;
    reply_created_at: Date;
    p_id: string;
    p_body: string;
    p_created_at: Date;
    p_creator_id: string;
    p_creator_name: string;
    p_creator_picture: string;
    p_files: string[];
    e_id: string;
    e_type: string;
    u2_id: string;
    u2_name: string;
    comment_id: string;
    comment_body: string;
    comment_created_at: Date;
    comment_order: number;
    comment_author_picture: string;
    comment_author_name: string;
    comment_author_id: string;
}

export const mapGetUserByIdRaw = async (
    qb: SelectQueryBuilder<User>
): Promise<User> => {
    let qbRaw: userPostsCommentsRepliesRaw[] = await qb.getRawMany();

    let posts: Post[] = [];
    let emotion_creator = new User();
    let post_creator = new User();
    let connections: User[] = [];
    let currentPostId = "";
    let currentConn = "";
    let currentComment = "";
    let currentEmotionId = "";
    let currentCommentObj: Comment;
    let commentsAux: Comment[] = [];
    let post: Post = new Post();

    qbRaw.forEach((rawObj) => {
        if (rawObj.u1_id !== currentConn) {
            currentConn = rawObj.u1_id;
            let conn = new User();
            conn.id = rawObj.u1_id;
            conn.name = rawObj.u1_name;
            conn.picture = rawObj.u1_picture;
            connections.push(conn);
        }

        if (rawObj.comment_id && rawObj.comment_id !== currentComment) {
            if (currentComment.length) {
                if (!commentsAux.find((x) => x.id === currentComment)) {
                    commentsAux.push(currentCommentObj);
                }
            }
            let comment_author = new User();
            currentComment = rawObj.comment_id;
            currentCommentObj = new Comment();
            currentCommentObj.id = rawObj.comment_id;
            currentCommentObj.body = rawObj.comment_body;
            currentCommentObj.createdAt = rawObj.comment_created_at;
            comment_author.id = rawObj.comment_author_id;
            comment_author.name = rawObj.comment_author_name;
            comment_author.picture = rawObj.comment_author_picture;
            currentCommentObj.author = comment_author;
            currentCommentObj.order = rawObj.comment_order;
            let _replies = new Array<Comment>();
            currentCommentObj.replies = _replies;
        }

        if (rawObj.reply_id) {
            let reply = new Comment();
            let reply_author = new User();
            reply.id = rawObj.reply_id;
            reply.body = rawObj.reply_body;
            reply.order = rawObj.reply_order;
            reply.createdAt = rawObj.reply_created_at;
            reply_author.id = rawObj.reply_author_id;
            reply_author.name = rawObj.reply_author_name;
            reply_author.picture = rawObj.reply_author_picture;
            reply.author = reply_author;
            if (!currentCommentObj.replies.find((x) => x.id === reply.id)) {
                currentCommentObj.replies.push(reply);
            }
        }

        if (rawObj.p_id !== currentPostId) {
            if (!posts.find((x) => x.id === currentPostId)) {
                if (currentPostId.length) {
                    posts.push(post);
                }
                currentPostId = rawObj.p_id;
                post = new Post();
                post.id = rawObj.p_id;
                post.body = rawObj.p_body;
                post.createdAt = rawObj.p_created_at;
                post.files = rawObj.p_files;
                post_creator.id = rawObj.user_id;
                post_creator.name = rawObj.user_name;
                post_creator.picture = rawObj.user_picture;
                post.creator = post_creator;
                let _comments = new Array<Comment>();
                let _emotions = new Array<Emotion>();
                post.comments = _comments;
                post.emotions = _emotions;
            }
        }

        if (rawObj.e_id && rawObj.e_id !== currentEmotionId) {
            let emotion = new Emotion();
            emotion.id = rawObj.e_id;
            emotion.type = getCorrectEnumEmotionType(rawObj.e_type);
            emotion_creator.id = rawObj.u2_id;
            emotion_creator.name = rawObj.u2_name;
            emotion.creator = emotion_creator;
            if (!post.emotions.find((x) => x.id === emotion.id)) {
                post.emotions.push(emotion);
            }
        }
    });

    if (!posts.length && post?.id) {
        posts.push(post);
    }

    let user = new User();
    let indexPost = -1;
    commentsAux.forEach((x) => {
        let qbRawFound = qbRaw.findIndex((y) => y.comment_id === x.id);
        if (qbRawFound > -1) {
            indexPost = posts.findIndex((z) => z.id === qbRaw[qbRawFound].p_id);

            if (indexPost > -1) {
                if (posts[indexPost].comments) {
                    posts[indexPost].comments.push(x);
                } else {
                    let _comments = new Array<Comment>();
                    post.comments = _comments;
                    posts[indexPost].comments.push(x);
                }
            }
        }
    });

    if (qbRaw.length) {
        user.id = qbRaw[0].user_id;
        user.name = qbRaw[0].user_name;
        user.email = qbRaw[0].user_email;
        user.picture = qbRaw[0].user_picture;
        user.posts = posts;
        user.connections = connections;
    }

    return user;
};

const getCorrectEnumEmotionType = (value: string): EmotionType => {
    let result: EmotionType = EmotionType.ANGRY;
    switch (value) {
        case "FIRE":
            result = EmotionType.FIRE;
            break;
        case "HEART":
            result = EmotionType.HEART;
            break;
        case "HEART_EYE":
            result = EmotionType.HEART_EYE;
            break;
        case "PREY":
            result = EmotionType.PREY;
            break;
        case "SAD":
            result = EmotionType.SAD;
            break;
        case "SMILE":
            result = EmotionType.SMILE;
            break;
        case "SUN_GLASS":
            result = EmotionType.SUN_GLASS;
            break;
        case "SURPRISE":
            result = EmotionType.SURPRISE;
            break;
        case "THUMBSDOWN":
            result = EmotionType.THUMBSDOWN;
            break;
        case "THUMBSUP":
            result = EmotionType.THUMBSUP;
            break;
        case "VOMIT":
            result = EmotionType.VOMIT;
            break;
        default:
            result = EmotionType.ANGRY;
    }
    return result;
};
