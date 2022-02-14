import { useQuery } from "@apollo/client";
import {
    Box,
    Flex,
    IconButton,
    Tooltip,
    useColorMode,
    useDisclosure,
} from "@chakra-ui/react";
import CentralFeedPost from "components/CentralFeedPost";
import SkeletonLines from "components/Layout/SkeletonLines";
import ModalCreatePost from "components/Modal/modalCreatePost";
import {
    GetPostsDocument,
    GetPostsQuery,
    useGetUserPendingInvitationsCountLazyQuery,
} from "generated/graphql";
import type { NextPage } from "next";
import React, { useCallback, useEffect } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { IoAddOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "Redux/actions";
import { RootState } from "Redux/Global/GlobalReducer";
import { useUser } from "utils/hooks/useUser";

interface CentralFeedProps {}

const CentralFeed: NextPage<CentralFeedProps> = ({}) => {
    const { colorMode } = useColorMode();
    const user = useUser();
    const dispatch = useDispatch();
    const modalCreatePostDisclousure = useDisclosure();

    const hasSubmittedPost = useSelector(
        (state: RootState) => state.globalReducer.hasSubmittedPost
    );

    const { setCountUserInvitations } = bindActionCreators(
        actionCreators,
        dispatch
    );

    const onSetCountUserInvitations = (count: number) => {
        setCountUserInvitations(count);
    };

    const [getCountPendingInvitations, resultgetCountPendingInvitations] =
        useGetUserPendingInvitationsCountLazyQuery({
            fetchPolicy: "cache-and-network",
        });

    const handleGetUserConnections = useCallback(async () => {
        if (user?.id) {
            const countPending = await getCountPendingInvitations({
                variables: {
                    id: user.id,
                },
            });

            if (countPending.data?.getUserPendingInvitationsCount?.count) {
                console.log(
                    countPending.data.getUserPendingInvitationsCount.count
                );
                onSetCountUserInvitations(
                    countPending.data.getUserPendingInvitationsCount.count
                );
            } else {
                onSetCountUserInvitations(0);
            }
        }
    }, [user?.id]);

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

    useEffect(() => {
        handleGetUserConnections();
    }, [loading, data]);

    useEffect(() => {
        handleRefetchPosts();
    }, [
        hasSubmittedPost,
        resultgetCountPendingInvitations.loading,
        onSetCountUserInvitations,
    ]);

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

            {/* <Box mt={5}>
                {loading && !data?.getPosts?.posts ? (
                    <SkeletonLines />
                ) : (
                    data?.getPosts?.posts?.map((post) => (
                        <CentralFeedPost key={post.id} post={post} />
                    ))
                )}
            </Box> */}
            <Box mt={5}>
                {data?.getPosts?.posts?.map((post) => (
                    <CentralFeedPost key={post.id} post={post} />
                ))}
            </Box>

            <ModalCreatePost
                isOpen={modalCreatePostDisclousure.isOpen}
                onClose={modalCreatePostDisclousure.onClose}
            />
        </Flex>
    );
};
export default CentralFeed;
