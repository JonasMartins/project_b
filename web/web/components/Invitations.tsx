import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import {
    useUpdateRequestMutation,
    UpdateRequestMutation,
    useCreateConnectionMutation,
} from "generated/graphql";
import {
    Flex,
    IconButton,
    Image,
    Text,
    Tooltip,
    useToast,
    useColorMode,
    Skeleton,
} from "@chakra-ui/react";
import { defaultImage } from "utils/consts";
import { useSelector } from "react-redux";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { RootState } from "Redux/Global/GlobalReducer";
import { bindActionCreators } from "redux";
import { actionCreators } from "Redux/actions";
import { useDispatch } from "react-redux";

interface InvitationsProps {}

interface userInvitationsType {
    __typename?: "Request" | undefined;
    id: string;
    accepted?: boolean | null | undefined;
    requestor: {
        __typename?: "User" | undefined;
        id: string;
        name: string;
        picture?: string | null | undefined;
    };
}

interface userConnectionType {
    __typename?: "User" | undefined;
    id: string;
    name: string;
    picture?: string | null | undefined;
}

const Invitations: NextPage<InvitationsProps> = ({}) => {
    const toast = useToast();
    const bgColor = { light: "white", dark: "gray.800" };
    const { colorMode } = useColorMode();
    const [requestedId, setRequestedId] = useState("");
    const [updateRequest, updateRequestResult] = useUpdateRequestMutation({});
    const [createConnection, resultCreateConnection] =
        useCreateConnectionMutation({});

    const dispatch = useDispatch();
    const { setCountUserInvitations } = bindActionCreators(
        actionCreators,
        dispatch
    );
    const [loadEffect, setLoadEffect] = useState(false);

    const onSetCountUserInvitations = (count: number) => {
        setCountUserInvitations(count);
    };

    const user = useSelector(
        (state: RootState) => state.globalReducer.userConnections
    );

    const countUserInvitations = useSelector(
        (state: RootState) => state.globalReducer.countUserInvitations
    );

    const [connections, setConnections] = useState<Array<userConnectionType>>(
        []
    );
    const [invitations, setInvitations] = useState<Array<userInvitationsType>>(
        []
    );

    const HandleAddInvitationToConnections = (
        invitation: userInvitationsType
    ) => {
        let newConnection: userConnectionType;

        newConnection = {
            id: invitation.id,
            name: invitation.requestor.name,
            picture: invitation.requestor.picture,
        };

        setConnections((prevConn) => [...prevConn, newConnection]);
    };

    const HandleRemoveInvitation = (
        invitation: userInvitationsType,
        declined: boolean
    ) => {
        onSetCountUserInvitations(countUserInvitations - 1);
        setTimeout(() => {
            if (invitations.length) {
                setInvitations(
                    invitations.filter((x) => x.id !== invitation.id)
                );
            }
            setLoadEffect(false);
        }, 500);
        if (!declined) {
            HandleAddInvitationToConnections(invitation);
        }
    };

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
        }

        return result.data;
    };

    const HandleRemoveConnection = (sugg: userConnectionType) => {
        setTimeout(() => {
            if (connections.length) {
                setConnections(connections.filter((x) => x.id !== sugg.id));
            }
            toast({
                title: "Connection Removed",
                description: "Connection Successfully Removed",
                status: "success",
                duration: 8000,
                isClosable: true,
                position: "top",
            });
            setLoadEffect(false);
        }, 500);
    };

    useEffect(() => {
        if (user?.getUserConnections?.user) {
            setRequestedId(user.getUserConnections.user.id);
            setConnections([]);
            user.getUserConnections.user.connections?.forEach((x) => {
                setConnections((prevConn) => [...prevConn, x]);
            });
            if (user.getUserConnections.user.invitations) {
                setInvitations([]);
                user.getUserConnections.user.invitations.forEach((x) => {
                    if (x.accepted === null || x.accepted === undefined) {
                        setInvitations((prevInvi) => [...prevInvi, x]);
                    }
                });
            }
        }
    }, [user]);

    const noInvitations = (
        <Flex justifyContent="center" p={2} m={2}>
            <Text fontWeight="thin" fontSize="2xl">
                Start creating your network
            </Text>
        </Flex>
    );

    const content = (
        <Flex flexDir="column">
            <Flex justifyContent="center" p={2} m={2}>
                <Text fontWeight="thin" fontSize="2xl">
                    {invitations.length ? "Pending Invitations" : ""}
                </Text>
            </Flex>
            {invitations.map((invitation) =>
                invitation.accepted === null ? (
                    <Flex
                        justifyContent="space-between"
                        bg={bgColor[colorMode]}
                        boxShadow="md"
                        p={3}
                        m={3}
                        alignItems="center"
                        key={invitation.id}
                    >
                        <Skeleton isLoaded={!loadEffect}>
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
                        </Skeleton>
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
                                    icon={<AiFillCheckCircle color="teal" />}
                                    isDisabled={loadEffect}
                                    m={1}
                                    onClick={() => {
                                        setLoadEffect(true);

                                        HandleUpdateRequest(
                                            invitation.id,
                                            true
                                        );
                                        HandleCreateConnection(
                                            requestedId,
                                            invitation.requestor.id
                                        );
                                        HandleRemoveInvitation(
                                            invitation,
                                            false
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
                                        setLoadEffect(true);

                                        HandleUpdateRequest(
                                            invitation.id,
                                            false
                                        );
                                        HandleRemoveInvitation(
                                            invitation,
                                            true
                                        );
                                    }}
                                />
                            </Tooltip>
                        </Flex>
                    </Flex>
                ) : (
                    <React.Fragment key={invitation.id}></React.Fragment>
                )
            )}
            <Flex justifyContent="center" p={2} m={2}>
                <Text fontWeight="thin" fontSize="2xl">
                    Connections
                </Text>
            </Flex>
            {connections.map((connection) => (
                <Flex
                    justifyContent="space-between"
                    boxShadow="md"
                    p={3}
                    m={3}
                    alignItems="center"
                    key={connection.id}
                    bg={bgColor[colorMode]}
                >
                    <Skeleton isLoaded={!loadEffect}>
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
                    </Skeleton>
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
                                isDisabled={loadEffect}
                                onClick={() => {
                                    setLoadEffect(true);
                                    HandleRemoveConnection(connection);
                                }}
                            />
                        </Tooltip>
                    </Flex>
                </Flex>
            ))}
        </Flex>
    );

    return invitations.length || connections.length ? content : noInvitations;
};

export default Invitations;
