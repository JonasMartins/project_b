import { useMutation } from "@apollo/client";
import { useColorMode, Text, Button, Tooltip } from "@chakra-ui/react";
import {
    DeleteEmotionDocument,
    DeleteEmotionMutation,
    EmotionType,
} from "generated/graphql";
import { NextPage } from "next";
import { memo, useEffect, useState } from "react";
import { useUser } from "utils/hooks/useUser";
import { getEmotionTypeIcon } from "utils/posts/postsUtils";
import { emotion as emotionElement } from "utils/types/post/post.types";

interface PostEmotionsRecordProps {
    emotions: emotionElement[] | undefined | null;
}

interface EmotionCreator {
    [key: string]: Set<string>;
}

const PostEmotionsRecord: NextPage<PostEmotionsRecordProps> = ({
    emotions,
}) => {
    const user = useUser();
    const { colorMode } = useColorMode();
    const color = { dark: "#FFFFFF", light: "#16161D" };

    const [deleteEmotion, deleteResult] = useMutation<DeleteEmotionMutation>(
        DeleteEmotionDocument
    );

    const handleRemoveEmotion = async (
        id: string
    ): Promise<DeleteEmotionMutation> => {
        const result = await deleteEmotion({
            variables: {
                emotionId: id,
                onError: () => {
                    console.error(deleteResult.error?.message);
                },
            },
        });
        if (!result.data) {
            throw new Error(deleteResult.error?.message);
        }
        return result.data;
    };

    if (!emotions) {
        return <></>;
    }

    let uniqueEmotions: emotionElement[] = [];
    let singleEmotions: EmotionType[] = [];

    const [userReactions, setUserReactions] = useState<EmotionCreator>({
        ANGRY: new Set([]),
        FIRE: new Set([]),
        HEART: new Set([]),
        HEART_EYE: new Set([]),
        PREY: new Set([]),
        SAD: new Set([]),
        SMILE: new Set([]),
        SUN_GLASS: new Set([]),
        SURPRISE: new Set([]),
        THUMBSDOWN: new Set([]),
        THUMBSUP: new Set([]),
        VOMIT: new Set([]),
    });

    emotions.forEach((item) => {
        if (!singleEmotions.includes(item.type)) {
            uniqueEmotions.push(item);
            singleEmotions.push(item.type);
        }
    });

    const toggleUserReaction = (type: EmotionType) => {
        if (!user) return;

        if (userReactions[type].has(user.id)) {
            userReactions[type].delete(user.id);
            let aux = userReactions[type];
            setUserReactions((prevReactions) => ({
                ...prevReactions,
                [type]: aux,
            }));
        } else {
            setUserReactions((prevReactions) => ({
                ...prevReactions,
                [type]: prevReactions[type].add(user.id),
            }));
        }
    };

    useEffect(() => {
        if (!user) return;
        emotions.forEach((item) => {
            setUserReactions((prevReactions) => ({
                ...prevReactions,
                [item.type]: prevReactions[item.type].add(item.creator.id),
            }));
        });
    }, [user]);

    return (
        <>
            {uniqueEmotions.map((item) => (
                <Tooltip
                    hasArrow
                    aria-label="react to post"
                    label={
                        userReactions[item.type].has(user?.id || "")
                            ? "Cancel Reaction"
                            : "React to Post"
                    }
                    colorScheme="white"
                >
                    <Button
                        leftIcon={getEmotionTypeIcon(item.type)}
                        variant="outline"
                        size="sm"
                        mr={1}
                        onClick={() => {
                            toggleUserReaction(item.type);
                        }}
                    >
                        <Text
                            textColor={
                                userReactions[item.type].has(user?.id || "")
                                    ? "#E10DFF"
                                    : color[colorMode]
                            }
                        >
                            {userReactions[item.type].size}
                        </Text>
                    </Button>
                </Tooltip>
            ))}
        </>
    );
};

export default memo(PostEmotionsRecord);
