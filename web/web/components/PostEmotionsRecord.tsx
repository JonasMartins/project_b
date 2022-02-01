import { useMutation } from "@apollo/client";
import {
    useColorMode,
    Text,
    Button,
    Tooltip,
    Flex,
    Image as ChakraImage,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
} from "@chakra-ui/react";
import {
    DeleteEmotionDocument,
    DeleteEmotionMutation,
    EmotionType,
    CreateEmotionDocument,
    CreateEmotionMutation,
} from "generated/graphql";
import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { UserType } from "utils/hooks/useUser";
import { getEmotionTypeIcon } from "utils/posts/postsUtils";
import { emotion as emotionElement } from "utils/types/post/post.types";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import {
    AngryFace,
    FireEmoji,
    HeartEmoji,
    HeartEyeFace,
    PreyingHands,
    SadFace,
    SmileFace,
    SunGlasses,
    SurpriseFace,
    ThumbsDown,
    ThumbsUp,
    VomitFace,
} from "utils/posts/postsUtils";
import { getPostsType } from "utils/types/post/post.types";
import { getServerPathImage } from "utils/generalAuxFunctions";

interface PostEmotionsRecordProps {
    user: UserType;
    post: getPostsType;
}

interface EmotionCreator {
    [key: string]: Set<string>;
}

const PostEmotionsRecord: NextPage<PostEmotionsRecordProps> = ({
    user,
    post,
}) => {
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

    if (!post.emotions) {
        return <></>;
    }

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

    const [uniqueEmotions, setUniqueEmotions] = useState<Array<emotionElement>>(
        []
    );

    const manageSingleEmotions = useCallback((): emotionElement[] => {
        let uniqueEmotions: emotionElement[] = [];
        let singleEmotions: EmotionType[] = [];
        post.emotions?.forEach((item) => {
            if (!singleEmotions.includes(item.type)) {
                uniqueEmotions.push(item);
                singleEmotions.push(item.type);
            }
        });

        return uniqueEmotions;
    }, [post.emotions]);

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

    // *************************************************** FORM

    const [userReactState, setUserReactState] = useState<EmotionType | null>(
        null
    );

    const [createEmotion, { error }] = useMutation<CreateEmotionMutation>(
        CreateEmotionDocument
    );

    /*
    const handleCreateEmotion = async (
        type: EmotionType
    ): Promise<CreateEmotionMutation> => {
        
        const result = await createEmotion({
            variables: {
                userId: user?.id,
                postId: post.id,
                type,
                onError: () => {
                    console.error(error);
                },
            },
        });

        if (!result.data) {
            throw new Error(error?.message);
        }
        return result.data; 
    }; */

    const handleCreateEmotion = async (type: EmotionType) => {
        let aux: emotionElement = {
            id: "5294e970-5091-46d8-a2e9-128ed87a526f",
            type,
            creator: {
                id: user?.id || "123",
                name: user?.name || "Doe",
            },
        };

        let alreadyReacted = false;
        uniqueEmotions.forEach((x) => {
            if (x.creator.id === user?.id) {
                alreadyReacted = true;
            }
        });
        if (!alreadyReacted) {
            setUniqueEmotions((prevEmo) => [...prevEmo, aux]);
        } else {
            const index = uniqueEmotions.findIndex(
                (x) => x.creator.id === user?.id
            );

            let newState = [...uniqueEmotions];

            if (index !== -1) {
                newState[index] = { ...newState[index], type: type };
                setUniqueEmotions(newState);
            }
        }
    };

    useEffect(() => {
        setUniqueEmotions(manageSingleEmotions());

        post.emotions?.forEach((item) => {
            setUserReactions((prevReactions) => ({
                ...prevReactions,
                [item.type]: prevReactions[item.type].add(item.creator.id),
            }));
        });

        if (post.emotions && post.emotions.length && user) {
            post.emotions.forEach((x) => {
                if (x.creator.id === user?.id) {
                    setUserReactState(x.type);
                    return;
                }
            });
        }
    }, [post.emotions.length, user]);

    return (
        <Flex mt={3} justifyContent="space-between" alignItems="center">
            <Flex>
                {uniqueEmotions.map((item) => (
                    <Tooltip
                        hasArrow
                        aria-label="react to post"
                        label={
                            userReactions[item.type].has(user!.id)
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
                                    userReactions[item.type].has(user!.id)
                                        ? "#E10DFF"
                                        : color[colorMode]
                                }
                            >
                                {userReactions[item.type].size}
                            </Text>
                        </Button>
                    </Tooltip>
                ))}
            </Flex>
            <Flex>
                <Popover placement="top-end" trigger="hover">
                    <PopoverTrigger>
                        <IconButton
                            aria-label="React to this post"
                            isRound={true}
                            icon={
                                <MdOutlineEmojiEmotions
                                    color={
                                        colorMode === "dark"
                                            ? "#b1becd"
                                            : "#E10DFF"
                                    }
                                />
                            }
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverHeader>Post's reaction</PopoverHeader>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverBody>
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={AngryFace}
                                isDisabled={
                                    userReactState === EmotionType.Angry
                                }
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.Angry);
                                    setUserReactState(EmotionType.Angry);
                                }}
                            />
                            <IconButton
                                aria-label="sunglasses"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={SunGlasses}
                                isDisabled={
                                    userReactState === EmotionType.SunGlass
                                }
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.SunGlass);
                                    setUserReactState(EmotionType.SunGlass);
                                }}
                            />
                            <IconButton
                                aria-label="surprise"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={SurpriseFace}
                                isDisabled={
                                    userReactState === EmotionType.Surprise
                                }
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.Surprise);
                                    setUserReactState(EmotionType.Surprise);
                                }}
                            />
                            <IconButton
                                aria-label="thumbsup"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={ThumbsUp}
                                isDisabled={
                                    userReactState === EmotionType.Thumbsup
                                }
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.Thumbsup);
                                    setUserReactState(EmotionType.Thumbsup);
                                }}
                            />
                            <IconButton
                                aria-label="thumbsdown"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={ThumbsDown}
                                isDisabled={
                                    userReactState === EmotionType.Thumbsdown
                                }
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.Thumbsdown);
                                    setUserReactState(EmotionType.Thumbsdown);
                                }}
                            />
                            <IconButton
                                aria-label="vomit"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={VomitFace}
                                isDisabled={
                                    userReactState === EmotionType.Vomit
                                }
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.Vomit);
                                    setUserReactState(EmotionType.Vomit);
                                }}
                            />
                            <IconButton
                                aria-label="smile"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={SmileFace}
                                isDisabled={
                                    userReactState === EmotionType.Smile
                                }
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.Smile);
                                    setUserReactState(EmotionType.Smile);
                                }}
                            />
                            <IconButton
                                aria-label="sad"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={SadFace}
                                isDisabled={userReactState === EmotionType.Sad}
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.Sad);
                                    setUserReactState(EmotionType.Sad);
                                }}
                            />
                            <IconButton
                                aria-label="heartEye"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={HeartEyeFace}
                                isDisabled={
                                    userReactState === EmotionType.HeartEye
                                }
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.HeartEye);
                                    setUserReactState(EmotionType.HeartEye);
                                }}
                            />
                            <IconButton
                                aria-label="heart"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={HeartEmoji}
                                isDisabled={
                                    userReactState === EmotionType.Heart
                                }
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.Heart);
                                    setUserReactState(EmotionType.Heart);
                                }}
                            />
                            <IconButton
                                aria-label="fire"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={FireEmoji}
                                isDisabled={userReactState === EmotionType.Fire}
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.Fire);
                                    setUserReactState(EmotionType.Fire);
                                }}
                            />
                            <IconButton
                                aria-label="prey"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={PreyingHands}
                                isDisabled={userReactState === EmotionType.Prey}
                                onClick={() => {
                                    handleCreateEmotion(EmotionType.Prey);
                                    setUserReactState(EmotionType.Prey);
                                }}
                            />
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                <Flex alignItems="center" ml={2}>
                    <Tooltip
                        hasArrow
                        aria-label="author"
                        label={`Author: ${post.creator.name}`}
                        colorScheme="white"
                    >
                        <ChakraImage
                            mr={1}
                            borderRadius="full"
                            boxSize="32px"
                            src={getServerPathImage(post.creator.picture)}
                        />
                    </Tooltip>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default PostEmotionsRecord;
