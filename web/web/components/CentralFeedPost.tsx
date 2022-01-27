import {
    Box,
    Flex,
    Text,
    useColorMode,
    Image as ChakraImage,
    Tooltip,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Image from "next/image";
import PostEmotionsRecord from "components/PostEmotionsRecord";
import { getPostsType } from "utils/types/post/post.types";
import PostEmotion from "components/Form/postEmotion.form";
import { useUser } from "utils/hooks/useUser";
import { defaultImage } from "utils/consts";
import { useEffect } from "react";

interface CentralFeedPostProps {
    post: getPostsType;
}

const CentralFeedPost: NextPage<CentralFeedPostProps> = ({ post }) => {
    const { colorMode } = useColorMode();
    const user = useUser();

    useEffect(() => {}, [post.creator.picture]);

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
                <Box mt={3}>
                    <PostEmotionsRecord emotions={post.emotions} />
                </Box>
                <Flex alignItems="center">
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
                            src={
                                post.creator.picture
                                    ? post.creator.picture
                                    : defaultImage
                            }
                        />
                    </Tooltip>

                    <PostEmotion
                        postEmotions={post.emotions ? post.emotions : []}
                        user={user}
                        postId={post.id}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CentralFeedPost;
