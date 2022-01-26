import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import {
    GetUserConnectionsQuery,
    useUpdateRequestMutation,
    UpdateRequestMutation,
    useGetUserConnectionsLazyQuery,
    useCreateConnectionMutation,
} from "generated/graphql";
import {
    Flex,
    IconButton,
    Image,
    Text,
    Tooltip,
    useToast,
} from "@chakra-ui/react";
import { defaultImage } from "utils/consts";
import Spinner from "components/Layout/Spinner";
import { useDispatch } from "react-redux";
import { setGetUserConnections } from "Redux/actions";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { useUser } from "utils/hooks/useUser";

interface InvitationsProps {
    user: GetUserConnectionsQuery | null;
}

const Invitations: NextPage<InvitationsProps> = ({ user }) => {
    const toast = useToast();
    const _user = useUser();
    const [requestedId, setRequestedId] = useState("");
    const [updateRequest, updateRequestResult] = useUpdateRequestMutation({});
    const [createConnection, resultCreateConnection] =
        useCreateConnectionMutation({});
    const [userInvitations, setUserInvitatios] = useState(0);
    const dispatch = useDispatch();
    const [getUserConnections, resultGerUserConnections] =
        useGetUserConnectionsLazyQuery({});

    const onSetUserConnections = (user: GetUserConnectionsQuery | null) => {
        if (user) {
            dispatch(setGetUserConnections(user));
        }
    };

    const checkUserConnections = useCallback(async () => {
        if (_user) {
            await getUserConnections({
                variables: {
                    id: _user?.id,
                },
            });
        }
    }, [userInvitations, _user]);

    const HandleCreateConnection = async (
        userRequestedId: string,
        userRequestorId: string
    ): Promise<void> => {
        const result = await createConnection({
            variables: {
                userRequestedId,
                userRequestorId,
            },
            onError: () => {
                console.error(resultCreateConnection.error);
            },
        });

        if (result.data?.createConnection?.done) {
            toast({
                title: "Connection Added",
                description: "Connection added",
                status: "success",
                duration: 8000,
                isClosable: true,
                position: "top",
            });
            if (_user) {
                await getUserConnections({
                    variables: {
                        id: _user?.id,
                    },
                });
            }
            if (resultGerUserConnections.data) {
                onSetUserConnections(resultGerUserConnections.data);
            }
        }
    };

    const HandleUpdateRequest = async (
        requestId: string,
        accepted: boolean
    ): Promise<UpdateRequestMutation | null> => {
        const result = await updateRequest({
            variables: {
                requestId,
                accepted,
            },
            onError: () => {
                console.error(updateRequestResult.error);
            },
        });

        if (!result.data?.updateRequest?.done || !accepted) {
            return null;
        } else {
            if (_user) {
                await getUserConnections({
                    variables: {
                        id: _user?.id,
                    },
                });
            }
            if (resultGerUserConnections.data) {
                onSetUserConnections(resultGerUserConnections.data);
            }
        }

        return result.data;
    };

    useEffect(() => {
        if (user?.getUserConnections?.user) {
            setRequestedId(user.getUserConnections.user.id);
        }
        checkUserConnections();
    }, [user, _user]);

    useEffect(() => {
        if (
            resultGerUserConnections.data?.getUserConnections?.user?.invitations
        ) {
            let _invitations = 0;

            resultGerUserConnections.data?.getUserConnections?.user?.invitations.forEach(
                (item) => {
                    if (item.accepted === null || item.accepted === undefined) {
                        _invitations++;
                    }
                }
            );

            setUserInvitatios(_invitations);
        }
    }, [updateRequestResult.loading, resultGerUserConnections.loading]);

    useEffect(() => {}, [userInvitations]);

    const noInvitations = (
        <Flex justifyContent="center" p={2} m={2}>
            <Text fontWeight="semibold" fontSize="2xl">
                No invitations Or Connections
            </Text>
        </Flex>
    );

    const content =
        updateRequestResult.loading ||
        resultGerUserConnections.loading ||
        resultCreateConnection.loading ? (
            <Spinner />
        ) : (
            <Flex flexDir="column">
                <Flex justifyContent="center" p={2} m={2}>
                    <Text fontWeight="semibold" fontSize="2xl">
                        {userInvitations ? "Pending Invitations" : ""}
                    </Text>
                </Flex>
                {user?.getUserConnections?.user?.invitations?.map(
                    (invitation) =>
                        invitation.accepted === null ? (
                            <Flex
                                justifyContent="space-between"
                                boxShadow="md"
                                p={3}
                                m={3}
                                alignItems="center"
                                key={invitation.id}
                            >
                                <Flex alignItems="center">
                                    <Image
                                        mr={2}
                                        borderRadius="full"
                                        boxSize="50px"
                                        src={
                                            invitation?.requestor?.picture
                                                ? invitation.requestor.picture
                                                : defaultImage
                                        }
                                    />
                                    <Text fontWeight="thin">
                                        {invitation?.requestor?.name}
                                    </Text>
                                </Flex>
                                <Flex p={2}>
                                    <Tooltip
                                        hasArrow
                                        aria-label="accept"
                                        label="Accept"
                                        colorScheme="white"
                                    >
                                        <IconButton
                                            isRound={true}
                                            aria-label="accept request"
                                            icon={
                                                <AiFillCheckCircle color="teal" />
                                            }
                                            m={1}
                                            onClick={() => {
                                                HandleUpdateRequest(
                                                    invitation.id,
                                                    true
                                                );
                                                HandleCreateConnection(
                                                    requestedId,
                                                    invitation.requestor.id
                                                );
                                            }}
                                        />
                                    </Tooltip>
                                    <Tooltip
                                        hasArrow
                                        aria-label="decline"
                                        label="Decline"
                                        colorScheme="white"
                                    >
                                        <IconButton
                                            isRound={true}
                                            aria-label="decline request"
                                            icon={<GiCancel color="red" />}
                                            m={1}
                                            onClick={() => {
                                                HandleUpdateRequest(
                                                    invitation.id,
                                                    false
                                                );
                                            }}
                                        />
                                    </Tooltip>
                                </Flex>
                            </Flex>
                        ) : (
                            <React.Fragment
                                key={invitation.id}
                            ></React.Fragment>
                        )
                )}
                <Flex justifyContent="center" p={2} m={2}>
                    <Text fontWeight="semibold" fontSize="2xl">
                        Connections
                    </Text>
                </Flex>
                {user?.getUserConnections?.user?.connections?.map(
                    (connection) => (
                        <Flex
                            justifyContent="space-between"
                            boxShadow="md"
                            p={3}
                            m={3}
                            alignItems="center"
                            key={connection.id}
                        >
                            <Flex alignItems="center">
                                <Image
                                    mr={2}
                                    borderRadius="full"
                                    boxSize="50px"
                                    src={
                                        connection.picture
                                            ? connection.picture
                                            : defaultImage
                                    }
                                />
                                <Text fontWeight="thin">{connection.name}</Text>
                            </Flex>
                            <Flex p={2}>
                                <Tooltip
                                    hasArrow
                                    aria-label="Remove Connection"
                                    label="Remove Connection"
                                    colorScheme="white"
                                >
                                    <IconButton
                                        aria-label="Remove connection"
                                        icon={<BsFillTrashFill color="red" />}
                                        isRound={true}
                                    />
                                </Tooltip>
                            </Flex>
                        </Flex>
                    )
                )}
            </Flex>
        );

    return user?.getUserConnections?.user?.invitations?.length ||
        user?.getUserConnections?.user?.connections?.length
        ? content
        : noInvitations;
};

export default Invitations;
