import {
    Flex,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    useColorMode,
} from "@chakra-ui/react";
import type { NextPage } from "next";
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
import { emotion } from "utils/types/post/post.types";
import { UserType } from "utils/hooks/useUser";
import { useState, useEffect } from "react";
import { EmotionType } from "generated/graphql";

interface PostEmotionProps {
    postEmotions: emotion[];
    user: UserType;
}

const PostEmotion: NextPage<PostEmotionProps> = ({ postEmotions, user }) => {
    const { colorMode } = useColorMode();
    const [userReactState, setUserReactState] = useState<EmotionType | null>(
        null
    );

    useEffect(() => {
        if (postEmotions.length && user) {
            postEmotions.forEach((emotion) => {
                if (emotion.creator.id === user?.id) {
                    setUserReactState(emotion.type);
                    return;
                }
            });
        }
    }, [postEmotions.length, user]);

    useEffect(() => {}, [userReactState]);

    return (
        <Flex>
            <Popover placement="top-end" trigger="hover">
                <PopoverTrigger>
                    <IconButton
                        aria-label="React to this post"
                        isRound={true}
                        icon={
                            <MdOutlineEmojiEmotions
                                color={
                                    colorMode === "dark" ? "#b1becd" : "#E10DFF"
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
                            isDisabled={userReactState === EmotionType.Angry}
                            onClick={() => {
                                setUserReactState(EmotionType.Angry);
                            }}
                        />
                        <IconButton
                            aria-label="sunglasses"
                            m={0.5}
                            p={1}
                            isRound={true}
                            icon={SunGlasses}
                            isDisabled={userReactState === EmotionType.SunGlass}
                            onClick={() => {
                                setUserReactState(EmotionType.SunGlass);
                            }}
                        />
                        <IconButton
                            aria-label="surprise"
                            m={0.5}
                            p={1}
                            isRound={true}
                            icon={SurpriseFace}
                            isDisabled={userReactState === EmotionType.Surprise}
                            onClick={() => {
                                setUserReactState(EmotionType.Surprise);
                            }}
                        />
                        <IconButton
                            aria-label="thumbsup"
                            m={0.5}
                            p={1}
                            isRound={true}
                            icon={ThumbsUp}
                            isDisabled={userReactState === EmotionType.Thumbsup}
                            onClick={() => {
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
                                setUserReactState(EmotionType.Thumbsdown);
                            }}
                        />
                        <IconButton
                            aria-label="vomit"
                            m={0.5}
                            p={1}
                            isRound={true}
                            icon={VomitFace}
                            isDisabled={userReactState === EmotionType.Vomit}
                            onClick={() => {
                                setUserReactState(EmotionType.Vomit);
                            }}
                        />
                        <IconButton
                            aria-label="smile"
                            m={0.5}
                            p={1}
                            isRound={true}
                            icon={SmileFace}
                            isDisabled={userReactState === EmotionType.Smile}
                            onClick={() => {
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
                                setUserReactState(EmotionType.Sad);
                            }}
                        />
                        <IconButton
                            aria-label="heartEye"
                            m={0.5}
                            p={1}
                            isRound={true}
                            icon={HeartEyeFace}
                            isDisabled={userReactState === EmotionType.HeartEye}
                            onClick={() => {
                                setUserReactState(EmotionType.HeartEye);
                            }}
                        />
                        <IconButton
                            aria-label="heart"
                            m={0.5}
                            p={1}
                            isRound={true}
                            icon={HeartEmoji}
                            isDisabled={userReactState === EmotionType.Heart}
                            onClick={() => {
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
                                setUserReactState(EmotionType.Prey);
                            }}
                        />
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>
    );
};

export default PostEmotion;
