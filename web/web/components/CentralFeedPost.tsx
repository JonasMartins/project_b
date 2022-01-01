import type { NextPage } from "next";
import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import { getPostsType } from "utils/types/post/post.types";
import Image from "next/image";
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
            <Flex>
                {post.files?.length ? (
                    post.files.map((file) => (
                        <Box p={1} m={2}>
                            <Image src={file} width="52px" height="52px" />
                        </Box>
                    ))
                ) : (
                    <></>
                )}
            </Flex>
        </Flex>
    );
};

export default CentralFeedPost;
