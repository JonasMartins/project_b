import type { NextPage } from "next";
import { Flex, Text, useColorMode } from "@chakra-ui/react";
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
        >
            <Text>{post.body}</Text>
        </Flex>
    );
};

export default CentralFeedPost;
