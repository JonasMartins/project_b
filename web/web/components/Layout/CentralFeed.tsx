import React, { useEffect } from "react";
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

interface CentralFeedProps {}

const CentralFeed: NextPage<CentralFeedProps> = ({}) => {
    const { colorMode } = useColorMode();
    const modalCreatePostDisclousure = useDisclosure();

    const { data, loading } = useQuery<GetPostsQuery>(GetPostsDocument, {
        variables: {
            limit: 10,
            offset: 0,
        },
    });

    useEffect(() => {
        if (loading) return;
        console.log("data ", data?.getPosts.posts);
    }, [loading]);

    return (
        <Flex flexGrow={1} flexDir="column" m={5}>
            <Flex justifyContent="flex-end">
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
export default CentralFeed;
