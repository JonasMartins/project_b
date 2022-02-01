import { Box, Flex, Text, useColorMode } from "@chakra-ui/react";
import type { NextPage } from "next";
import Image from "next/image";
import PostEmotionsRecord from "components/PostEmotionsRecord";
import { getPostsType } from "utils/types/post/post.types";
import { useUser } from "utils/hooks/useUser";
import { useEffect, useState } from "react";
import SkeletonLines from "components/Layout/SkeletonLines";

import { useSelector } from "react-redux";
import { RootState } from "Redux/Global/GlobalReducer";
import { emotion as emotionElement } from "utils/types/post/post.types";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "Redux/actions";

interface CentralFeedPostProps {
    post: getPostsType;
}

const CentralFeedPost: NextPage<CentralFeedPostProps> = ({ post }) => {
    const user = useUser();
    const dispatch = useDispatch();
    const { colorMode } = useColorMode();
    const [loadEffect, setLoadEffect] = useState(true);

    const createdEmotion = useSelector(
        (state: RootState) => state.globalReducer.createdEmotion
    );

    const hasCreatedEmotion = useSelector(
        (state: RootState) => state.globalReducer.hasCreatedEmotion
    );

    const { setHasCreatedEmotion } = bindActionCreators(
        actionCreators,
        dispatch
    );

    const onSetHasCreatedEmotion = (hasCreated: boolean) => {
        setHasCreatedEmotion(hasCreated);
    };

    useEffect(() => {
        if (createdEmotion) {
            if (createdEmotion.post.id === post.id) {
                console.log("Created Emotion: ", createdEmotion);
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
                console.log("emotions ", post.emotions);
            }
        }
    }, [hasCreatedEmotion]);

    useEffect(() => {
        setTimeout(() => {
            setLoadEffect(false);
        }, 500);
    }, [post.creator.picture, user]);

    return (
        <Flex
            boxShadow="md"
            p={3}
            bgColor={colorMode === "dark" ? "grey.800" : "white"}
            borderRadius=".5em"
            mt={3}
            flexDir="column"
        >
            {loadEffect ? <SkeletonLines /> : <Text>{post.body}</Text>}

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
            {user && <PostEmotionsRecord post={post} user={user} />}
        </Flex>
    );
};

export default CentralFeedPost;
