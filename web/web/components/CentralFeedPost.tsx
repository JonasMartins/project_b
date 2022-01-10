import {
    Box,
    Flex,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Image from "next/image";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import {
    AngryFace,
    FireEmoji,
    getEmotionListCount,
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

interface CentralFeedPostProps {
    post: getPostsType;
}

const CentralFeedPost: NextPage<CentralFeedPostProps> = ({ post }) => {
    const { colorMode } = useColorMode();

    return (
        <Flex
            boxShadow="md"
            p={3}
            bgColor={colorMode === "dark" ? "grey.800" : "white"}
            borderRadius=".5em"
            mt={3}
            flexDir="column"
        >
            <Text>{post.body}</Text>

            <Flex mt={2}>
                {post.files?.length ? (
                    post.files.map((file) => (
                        <Box p={1} m={0}>
                            <Image src={file} width="52px" height="52px" />
                        </Box>
                    ))
                ) : (
                    <></>
                )}
            </Flex>
            <Flex justifyContent="space-between">
                <Box mt={3}>{getEmotionListCount(post.emotions)}</Box>
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
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={SunGlasses}
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={SurpriseFace}
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={ThumbsUp}
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={ThumbsDown}
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={VomitFace}
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={SmileFace}
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={SadFace}
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={HeartEyeFace}
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={HeartEmoji}
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={FireEmoji}
                            />
                            <IconButton
                                aria-label="angry-face"
                                m={0.5}
                                p={1}
                                isRound={true}
                                icon={PreyingHands}
                            />
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </Flex>
        </Flex>
    );
};

export default CentralFeedPost;
