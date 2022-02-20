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
import { useNewMessageNotificationSubscription } from "generated/graphql";

interface CentralFeedProps {}

const CentralFeed: NextPage<CentralFeedProps> = ({}) => {
    const { colorMode } = useColorMode();
    const user = useUser();
    const dispatch = useDispatch();
    const modalCreatePostDisclousure = useDisclosure();

    const hasSubmittedPost = useSelector(
        (state: RootState) => state.globalReducer.hasSubmittedPost
    );

    const userNewMessages = useSelector(
        (state: RootState) => state.globalReducer.countUserNewMessages
    );

    const newMessagesSubscription = useNewMessageNotificationSubscription();

    const { setCountUserInvitations, setCountNewMessages } = bindActionCreators(
        actionCreators,
        dispatch
    );

    const onSetCountUserInvitations = (count: number) => {
        setCountUserInvitations(count);
    };

    const onSetCountUserNewMessages = (count: number) => {
        setCountNewMessages(count);
    };

    const [getCountPendingInvitations, resultgetCountPendingInvitations] =
        useGetUserPendingInvitationsCountLazyQuery({
            fetchPolicy: "cache-and-network",
        });

    /**
     * If a new Message is created and is addressed to the current
     * logged user and this user hasn't saw the message, then it will
     * increment the notSeen messages by this user on the redux store
     * this quantity will be displayed on LeftPanel component
     */
    const handleNewMessagesSubscriptions = () => {
        if (newMessagesSubscription.data?.newMessageNotification?.newMessage) {
            const { newMessage } =
                newMessagesSubscription.data.newMessageNotification;

            console.log("New ", newMessage);

            if (user?.id && newMessage.chat.participants.includes(user)) {
                if (!newMessage.userSeen.includes(user?.id)) {
                    onSetCountUserNewMessages(userNewMessages + 1);
                }
            }
        }
    };

    const handleGetUserConnections = useCallback(async () => {
        if (user?.id) {
            const countPending = await getCountPendingInvitations({
                variables: {
                    id: user.id,
                },
            });

            if (countPending.data?.getUserPendingInvitationsCount?.count) {
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
        handleNewMessagesSubscriptions();
    }, [newMessagesSubscription.loading]);

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
