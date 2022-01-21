import { useMutation } from "@apollo/client";
import { useColorMode, Text, Button } from "@chakra-ui/react";
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

interface usersReactions {
    [key: string]: boolean;
}

interface PostEmotionsRecordProps {
    emotions: emotionElement[] | undefined | null;
}

interface EmotionCreator {
    [key: string]: Set<string>;
}

interface EmotionTypesObj {
    [key: string]: number;
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

    let mappingEmotionsWithUser: EmotionCreator = {};
    let uniqueEmotions: emotionElement[] = [];
    let singleEmotions: EmotionType[] = [];
    let componentType: JSX.Element | null = null;

    let emotionsCount: EmotionTypesObj = {
        ANGRY: 0,
        SUN_GLASS: 0,
        SURPRISE: 0,
        THUMBSDOWN: 0,
        THUMBSUP: 0,
        VOMIT: 0,
        SMILE: 0,
        SAD: 0,
        HEART_EYE: 0,
        HEART: 0,
        FIRE: 0,
        PREY: 0,
    };
    emotions.forEach((item) => {
        emotionsCount[item.type] = emotionsCount[item.type] + 1;
        if (!mappingEmotionsWithUser[item.type]) {
            mappingEmotionsWithUser[item.type] = new Set<string>();
            mappingEmotionsWithUser[item.type].add(item.creator.id);
        } else {
            mappingEmotionsWithUser[item.type].add(item.creator.id);
        }
    });

    emotions.map((item) => {
        if (!singleEmotions.includes(item.type)) {
            uniqueEmotions.push(item);
            singleEmotions.push(item.type);
        }
    });

    const handleUserReaction = (type: EmotionType): boolean => {
        return mappingEmotionsWithUser[type].has(user?.id || "");
    };

    const [userReactions, setUserReactions] = useState<usersReactions>({
        ANGRY: false,
        FIRE: false,
        HEART: false,
        HEART_EYE: false,
        PREY: false,
        SAD: false,
        SMILE: false,
        SUN_GLASS: false,
        SURPRISE: false,
        THUMBSDOWN: false,
        THUMBSUP: false,
        VOMIT: false,
    });

    const toggleUserReaction = (type: EmotionType) => {
        setUserReactions((prevReactions) => ({
            ...prevReactions,
            [type]: !prevReactions[type],
        }));
    };

    useEffect(() => {
        if (!user) return;
        let key = "";
        for (key in mappingEmotionsWithUser) {
            if (mappingEmotionsWithUser[key].has(user.id)) {
                setUserReactions((prevReactions) => ({
                    ...prevReactions,
                    [key]: true,
                }));
            }
        }
    }, [user]);

    useEffect(() => {}, []);

    componentType = (
        <>
            {uniqueEmotions.map((item) => (
                <Button
                    leftIcon={getEmotionTypeIcon(item.type)}
                    variant="outline"
                    size="sm"
                    borderRadius="1em"
                    mr={1}
                    border="3px solid"
                    borderColor={
                        userReactions[item.type] ? "#E10DFF" : "grey.300"
                    }
                    onClick={() => {
                        toggleUserReaction(item.type);
                    }}
                >
                    <Text
                        textColor={
                            userReactions[item.type]
                                ? "#E10DFF"
                                : color[colorMode]
                        }
                    >
                        {emotionsCount[item.type]}
                    </Text>
                </Button>
            ))}
        </>
    );

    return componentType;
};

export default memo(PostEmotionsRecord);
