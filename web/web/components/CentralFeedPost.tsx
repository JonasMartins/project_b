import { Box, Flex, Text, useColorMode, Image } from "@chakra-ui/react";
import type { NextPage } from "next";
import PostEmotionsRecord from "components/PostEmotionsRecord";
import { getPostsType } from "utils/types/post/post.types";
import { useUser } from "utils/hooks/useUser";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "Redux/Global/GlobalReducer";
import { emotion as emotionElement } from "utils/types/post/post.types";
import { getServerPathImage } from "utils/generalAuxFunctions";
import { formatRelative } from "date-fns";
import Comment from "components/Comment";

interface CentralFeedPostProps {
    post: getPostsType;
}

const CentralFeedPost: NextPage<CentralFeedPostProps> = ({ post }) => {
    const user = useUser();
    const { colorMode } = useColorMode();

    const createdEmotion = useSelector(
        (state: RootState) => state.globalReducer.createdEmotion
    );

    const hasCreatedEmotion = useSelector(
        (state: RootState) => state.globalReducer.hasCreatedEmotion
    );

    useEffect(() => {
        if (createdEmotion) {
            if (createdEmotion.post.id === post.id) {
                let emotionObj: emotionElement = {
                    id: createdEmotion.id,
                    type: createdEmotion.type,
                    creator: {
                        id: createdEmotion.creator.name,
                        name: createdEmotion.creator.name,
                    },
                };
                if (!post.emotions) {
                    let emotionsArray: emotionElement[] = [];
                    post.emotions = emotionsArray;
                    post.emotions.push(emotionObj);
                } else {
                    post.emotions.push(emotionObj);
                }
            }
        }
    }, [hasCreatedEmotion]);

    useEffect(() => {}, [post.creator.picture, user]);

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
            <Text fontWeight="thin" fontSize="sm" textAlign="start">
                Posted At:{" "}
                {formatRelative(new Date(post.createdAt), new Date())}
            </Text>
            <Flex mt={2}>
                {post.files?.length ? (
                    post.files.map((file) => (
                        <Box p={1} m={0} key={file}>
                            <Image
                                src={getServerPathImage(file)}
                                boxSize="52px"
                            />
                        </Box>
                    ))
                ) : (
                    <></>
                )}
            </Flex>
            {user && <PostEmotionsRecord post={post} user={user} />}
            <Comment comments={{ comments: post.comments }} />
        </Flex>
    );
};

export default CentralFeedPost;
