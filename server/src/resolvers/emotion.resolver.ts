import {
    Resolver,
    Query,
    ObjectType,
    Field,
    Arg,
    Ctx,
    Mutation,
} from "type-graphql";
import { ErrorFieldHandler } from "./../helpers/errorFieldHandler";
import { Emotion } from "./../database/entity/emotion.entity";
import { Post } from "./../database/entity/post.entity";
import { User } from "./../database/entity/user.entity";
import { Context } from "./../context";
import { genericError } from "./../helpers/generalAuxMethods";
import { EmotionType } from "./../database/enum/emotionType.enum";

@ObjectType()
class EmotionResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => Emotion, { nullable: true })
    emotion?: Emotion;
}

@ObjectType()
class EmotionDeletion {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => Boolean, { nullable: true })
    deleted?: Boolean;
}

@ObjectType()
class EmotionsResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => [Emotion], { nullable: true })
    emotions?: Emotion[];
}

@Resolver()
export class EmotionResolver {
    @Query(() => EmotionsResponse)
    async getEmotionsFromPost(
        @Arg("postId", () => String) postId: string,
        @Ctx() { em }: Context
    ): Promise<EmotionsResponse> {
        let emotions: Emotion[] | undefined = [];

        try {
            const post = await em.findOne(Post, { id: postId });

            if (!post) {
                return {
                    errors: genericError(
                        "postId",
                        "getEmotionsFromUser",
                        __filename,
                        `Could not find the post with id: ${postId}`
                    ),
                };
            }

            const postRepo = em.connection.getRepository(Post);
            const postEmotions = await postRepo.findOne({
                relations: ["emotions"],
                where: { id: postId },
            });

            emotions = postEmotions?.emotions;
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getEmotionsFromPost",
                    __filename,
                    `Details: ${e.message}`
                ),
            };
        }
        return { emotions };
    }

    @Query(() => EmotionsResponse)
    async getEmotionsFromUser(
        @Arg("userId", () => String) userId: string,
        @Ctx() { em }: Context
    ): Promise<EmotionsResponse> {
        let emotions: Emotion[] | undefined = [];

        try {
            const user = await em.findOne(User, { id: userId });

            if (!user) {
                return {
                    errors: genericError(
                        "userId",
                        "getEmotionsFromUser",
                        __filename,
                        `Could not find user with id: ${userId}`
                    ),
                };
            }

            const userRepo = em.connection.getRepository(User);
            const userEmotions = await userRepo.findOne({
                relations: ["emotions"],
                where: { id: userId },
            });

            emotions = userEmotions?.emotions;
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "getEmotionsFromUser",
                    __filename,
                    `Details: ${e.message}`
                ),
            };
        }
        return { emotions };
    }

    @Mutation(() => EmotionResponse)
    async createEmotion(
        @Arg("userId", () => String) userId: string,
        @Arg("postId", () => String) postId: string,
        @Arg("type", () => EmotionType) type: EmotionType,
        @Ctx() { em }: Context
    ): Promise<EmotionResponse> {
        const user = await em.findOne(User, { id: userId });

        if (!user) {
            return {
                errors: genericError(
                    "userId",
                    "createEmotion",
                    __filename,
                    `Could not find the user with id: ${userId}`
                ),
            };
        }

        const post = await em.findOne(Post, { id: postId });

        if (!post) {
            return {
                errors: genericError(
                    "postId",
                    "createEmotion",
                    __filename,
                    `Could not find the post with id: ${postId}`
                ),
            };
        }

        try {
            const userRepo = em.connection.getRepository(User);
            let userEmotions = await userRepo.findOne({
                relations: ["emotions"],
                where: { id: userId },
            });

            const postRepo = em.connection.getRepository(Post);
            let postEmotions = await postRepo.findOne({
                relations: ["emotions"],
                where: { id: postId },
            });

            let createEmotion = true;
            let emotionToBeUpdatedId = "";

            if (postEmotions && postEmotions.emotions.length) {
                postEmotions?.emotions.forEach((emotion) => {
                    if (emotion.creator.id === userId) {
                        createEmotion = false;
                        emotionToBeUpdatedId = emotion.id;
                        return;
                    }
                });
            }

            let emotion: Emotion;

            if (createEmotion) {
                emotion = em.create(Emotion, {
                    type,
                });
                emotion.creator = user;
                emotion.post = post;
            } else {
                emotion = await em.findOneOrFail(Emotion, {
                    id: emotionToBeUpdatedId,
                });
                if (emotion) {
                    emotion.type = type;
                }
            }
            await em.save(emotion);

            if (userEmotions && !userEmotions.emotions.length) {
                let auxUserEmo: Emotion[] = [];
                auxUserEmo.push(emotion);
                user.emotions = auxUserEmo;
            } else if (userEmotions && userEmotions.emotions.length) {
                let auxUserEmo = userEmotions.emotions;
                auxUserEmo.push(emotion);
                user.emotions = auxUserEmo;
            }

            if (postEmotions && !postEmotions.emotions.length) {
                let auxPostEmo: Emotion[] = [];
                auxPostEmo.push(emotion);
                post.emotions = auxPostEmo;
            } else if (postEmotions && postEmotions.emotions.length) {
                let auxPostEmo = postEmotions.emotions;
                auxPostEmo.push(emotion);
                post.emotions = auxPostEmo;
            }

            await em.save(user);
            await em.save(post);

            return { emotion };
        } catch (e) {
            return {
                errors: genericError(
                    "-",
                    "createEmotion",
                    __filename,
                    `Details: ${e.message}`
                ),
            };
        }
    }

    @Mutation(() => EmotionResponse)
    async updateEmotion(
        @Arg("emotionId", () => String) emotionId: string,
        @Arg("newType", () => EmotionType) newType: EmotionType,
        @Ctx() { em }: Context
    ): Promise<EmotionResponse> {
        const emotion = await em.findOne(Emotion, { id: emotionId });

        if (!emotion) {
            return {
                errors: genericError(
                    "emotionId",
                    "updateEmotion",
                    __filename,
                    `Could not find the emotion with id: ${emotionId}`
                ),
            };
        }

        if (emotion.type === newType) {
            return { emotion };
        }
        emotion.type = newType;
        emotion.save();

        return { emotion };
    }

    @Mutation(() => EmotionDeletion)
    async deleteEmotion(
        @Arg("emotionId", () => String) emotionId: string,
        @Ctx() { em }: Context
    ): Promise<EmotionDeletion> {
        try {
            const qb = await em.connection
                .createQueryBuilder()
                .delete()
                .from(Emotion)
                .where("id = :id", { id: emotionId });

            qb.execute();

            return { deleted: true };
        } catch (error) {
            return {
                errors: genericError(
                    "emotionId",
                    "deleteEmotion",
                    __filename,
                    `Error: ${error.message}`
                ),
            };
        }
    }

    @Mutation(() => EmotionDeletion)
    async deleteEmotionFromPostByUser(
        @Arg("userId", () => String) userId: string,
        @Arg("postId", () => String) postId: string,
        @Ctx() { em }: Context
    ): Promise<EmotionDeletion> {
        try {
            const postRepo = em.connection.getRepository(Post);
            let postEmotions = await postRepo.findOne({
                relations: ["emotions"],
                where: { id: postId },
            });

            let emotionToBeDeleted = "";

            if (postEmotions && postEmotions.emotions.length) {
                postEmotions?.emotions.forEach((emotion) => {
                    if (emotion.creator.id === userId) {
                        emotionToBeDeleted = emotion.id;
                        return;
                    }
                });
            }

            if (emotionToBeDeleted.length) {
                const qb = await em.connection
                    .createQueryBuilder()
                    .delete()
                    .from(Emotion)
                    .where("id = :id", { id: emotionToBeDeleted });

                qb.execute();

                return { deleted: true };
            }

            return { deleted: false };
        } catch (error) {
            return {
                errors: genericError(
                    "emotionId",
                    "deleteEmotion",
                    __filename,
                    `Error: ${error.message}`
                ),
            };
        }
    }
}
