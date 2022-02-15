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
    Link,
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
import BeatLoader from "react-spinners/BeatLoader";
import { handleChangeEmotions } from "utils/emotions/auxFunctions";
import NexLink from "next/link";
import { HiUserAdd } from "react-icons/hi";

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
    const [loadEffect, setLoadEffect] = useState(false);
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

    // *************************************************** FORM

    const [userReactState, setUserReactState] = useState<EmotionType | null>(
        null
    );

    const [createEmotion, { error }] = useMutation<CreateEmotionMutation>(
        CreateEmotionDocument
    );

    const handleCreateEmotion = async (type: EmotionType) => {
        setLoadEffect(true);

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

        if (result.data?.createEmotion?.emotion) {
            let aux: emotionElement = {
                id: result.data.createEmotion.emotion.id,
                type,
                creator: {
                    id: user?.id || "123",
                    name: user?.name || "Doe",
                },
            };

            setTimeout(() => {
                if (user?.id) {
                    const resultFront = handleChangeEmotions(
                        user.id,
                        aux,
                        uniqueEmotions,
                        userReactions
                    );
                    setUniqueEmotions(resultFront.uniqueEmotions);
                }
                setLoadEffect(false);
            }, 500);
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
    }, [post.emotions.length, user?.id]);

    return (
        <Flex mt={3} justifyContent="space-between" alignItems="center">
            <Flex>
                {loadEffect ? (
                    <BeatLoader color="#E10DFF" />
                ) : (
                    uniqueEmotions.map((item) => (
                        <Button
                            leftIcon={getEmotionTypeIcon(item.type)}
                            variant="outline"
                            size="sm"
                            mr={1}
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
                    ))
                )}
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
                    <Popover placement="top-end" trigger="hover">
                        <PopoverTrigger>
                            <ChakraImage
                                mr={1}
                                borderRadius="full"
                                boxSize="32px"
                                src={getServerPathImage(post.creator.picture)}
                            />
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverArrow />
                            <PopoverBody>
                                <NexLink href={`/user/${post.creator.id}`}>
                                    <Flex
                                        justifyContent="space-between"
                                        p={2}
                                        alignItems="center"
                                    >
                                        <Flex alignItems="center">
                                            <ChakraImage
                                                cursor="pointer"
                                                mr={2}
                                                borderRadius="full"
                                                boxSize="32px"
                                                src={getServerPathImage(
                                                    post.creator.picture
                                                )}
                                            />
                                            {post.creator.name}
                                        </Flex>
                                        <Tooltip
                                            hasArrow
                                            aria-label="connect"
                                            label="Connect"
                                            colorScheme="white"
                                        >
                                            <IconButton
                                                isRound={true}
                                                aria-label="connect"
                                                isDisabled={loadEffect}
                                                icon={
                                                    <HiUserAdd color="teal" />
                                                }
                                                m={1}
                                                onClick={() => {}}
                                            />
                                        </Tooltip>
                                    </Flex>
                                </NexLink>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default PostEmotionsRecord;
