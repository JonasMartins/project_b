import { emotion as emotionElement } from "utils/types/post/post.types";

// se o usuário não reagiu ao post ainda, significa que vai adicionar
// ou incrementar

// se já reajiu, siginifica que vai atualizar e decrementar ou aumentar quantidades
// como pode decrementar, então pode remover totalmente reações.

interface EmotionCreator {
    [key: string]: Set<string>;
}

export const handleChangeEmotions = (
    creatorId: string,
    newEmotion: emotionElement,
    uniqueEmotions: Array<emotionElement>,
    userReactions: EmotionCreator
): { uniqueEmotions: Array<emotionElement>; userReactions: EmotionCreator } => {
    let userAlreadyReacted: boolean = false;
    let postAlreadyHaveTheComingReaction: boolean = false;

    for (let item in userReactions) {
        if (userReactions[item].has(creatorId)) {
            userAlreadyReacted = true;
            break;
        }
    }

    uniqueEmotions.forEach((x) => {
        if (x.type === newEmotion.type) {
            postAlreadyHaveTheComingReaction = true;
        }
    });

    if (!userAlreadyReacted) {
        if (!postAlreadyHaveTheComingReaction) {
            uniqueEmotions.push(newEmotion);
            userReactions[newEmotion.type].add(creatorId);
        } else {
            userReactions[newEmotion.type].add(creatorId);
        }
    } else {
        if (!postAlreadyHaveTheComingReaction) {
            console.log(userReactions);
            const index = uniqueEmotions.findIndex((x) =>
                userReactions[x.type].has(creatorId)
            );

            let oldReaction = uniqueEmotions[index];
            if (userReactions[oldReaction.type].size === 1) {
                let removedUnique = uniqueEmotions.filter(
                    (x) => x.type !== oldReaction.type
                );
                uniqueEmotions = removedUnique;
                userReactions[oldReaction.type].delete(creatorId);
                userReactions[newEmotion.type].add(creatorId);
            } else {
                userReactions[oldReaction.type].delete(creatorId);
                userReactions[newEmotion.type].add(creatorId);
            }
            uniqueEmotions.push(newEmotion);
        } else {
            const index = uniqueEmotions.findIndex((x) =>
                userReactions[x.type].has(creatorId)
            );

            let oldReaction = uniqueEmotions[index];
            // incrementar do já existente, e decrementar do antigo
            userReactions[newEmotion.type].add(creatorId);

            if (userReactions[oldReaction.type].size === 1) {
                let removedUnique = uniqueEmotions.filter(
                    (x) => x.type !== oldReaction.type
                );
                uniqueEmotions = removedUnique;
                userReactions[oldReaction.type].delete(creatorId);
            } else {
                userReactions[oldReaction.type].delete(creatorId);
                userReactions[newEmotion.type].add(creatorId);
            }
        }
    }

    return { uniqueEmotions, userReactions };
};
