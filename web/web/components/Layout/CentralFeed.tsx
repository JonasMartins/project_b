import React, { useEffect, useCallback, memo, useState } from "react";
import type { NextPage } from "next";
import {
    Box,
    Flex,
    IconButton,
    Tooltip,
    useColorMode,
    useDisclosure,
} from "@chakra-ui/react";
import { IoAddOutline } from "react-icons/io5";
import ModalCreatePost from "components/Modal/modalCreatePost";
import { GetPostsDocument, GetPostsQuery } from "generated/graphql";
import { useQuery } from "@apollo/client";
import Spinner from "components/Layout/Spinner";
import CentralFeedPost from "components/CentralFeedPost";
import { useSelector } from "react-redux";
import { globalState } from "Redux/Global/GlobalReducer";
import { FiRefreshCcw } from "react-icons/fi";

interface CentralFeedProps {}

const CentralFeed: NextPage<CentralFeedProps> = ({}) => {
    const { colorMode } = useColorMode();
    const modalCreatePostDisclousure = useDisclosure();

    const hasSubmittedPost = useSelector<
        globalState,
        globalState["hasSubmittedPost"]
    >((state) => state.hasSubmittedPost);

    const [count, setCount] = useState(0);

    const { data, loading, refetch } = useQuery<GetPostsQuery>(
        GetPostsDocument,
        {
            variables: {
                limit: 10,
                offset: 0,
            },
            fetchPolicy: "cache-and-network",
        }
    );

    const handleRefetchPosts = useCallback(() => {
        if (hasSubmittedPost) {
            modalCreatePostDisclousure.onClose();
            refetch();
        }
    }, [hasSubmittedPost]);

    useEffect(() => {}, [loading, data]);

    useEffect(() => {
        setCount(count + 1);
        handleRefetchPosts();
    }, [hasSubmittedPost]);

    return (
        <Flex flexGrow={1} flexDir="column" m={5}>
            <Flex justifyContent="space-between">
                <Tooltip
                    hasArrow
                    aria-label="refresh posts"
                    label="Refresh"
                    colorScheme="white"
                >
                    <IconButton
                        isRound={true}
                        aria-label="Refresh"
                        size="lg"
                        icon={<FiRefreshCcw />}
                        color={colorMode === "dark" ? "#b1becd" : "#E10DFF"}
                        onClick={() => {
                            refetch();
                        }}
                    />
                </Tooltip>
                <Tooltip
                    hasArrow
                    aria-label="item's responsible"
                    label="Add a Post"
                    colorScheme="withe"
                >
                    <IconButton
                        isRound={true}
                        aria-label="Show Side Bar"
                        size="lg"
                        icon={<IoAddOutline color="white" />}
                        variant={`phlox-gradient-${colorMode}`}
                        onClick={modalCreatePostDisclousure.onOpen}
                    />
                </Tooltip>
            </Flex>
            <Box mt={5}>
                {loading && !data?.getPosts?.posts ? (
                    <Spinner />
                ) : (
                    data?.getPosts?.posts?.map((post) => (
                        <CentralFeedPost key={post.id} post={post} />
                    ))
                )}
            </Box>

            <ModalCreatePost
                isOpen={modalCreatePostDisclousure.isOpen}
                onClose={modalCreatePostDisclousure.onClose}
            />
        </Flex>
    );
};
export default memo(CentralFeed);
