import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import type { NextPage } from "next";
import Image from "next/image";
import { getEmotionListCount } from "utils/posts/postsUtils";
import { getPostsType } from "utils/types/post/post.types";
import PostEmotion from "components/Form/postEmotion.form";
import { useUser } from "utils/hooks/useUser";

interface CentralFeedPostProps {
    post: getPostsType;
}

const CentralFeedPost: NextPage<CentralFeedPostProps> = ({ post }) => {
    const { colorMode } = useColorMode();
    const user = useUser();

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
                <PostEmotion
                    postEmotions={post.emotions ? post.emotions : []}
                    user={user}
                />
            </Flex>
        </Flex>
    );
};

export default CentralFeedPost;
