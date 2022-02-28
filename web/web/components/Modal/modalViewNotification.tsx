import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Flex,
    Circle,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Image,
    useToast,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import type { NextPage } from "next";
import { BsFillBellFill } from "react-icons/bs";
import { getServerPathImage } from "utils/generalAuxFunctions";
import { UserType } from "utils/hooks/useUser";
import { notificationType } from "utils/types/user/user.types";
import NexLink from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "Redux/actions";
import { RootState } from "Redux/Global/GlobalReducer";
import { useEffect } from "react";
import { useAddSeenNotificationMutation } from "generated/graphql";

interface ModalViewNotificationProps {
    onClose: () => void;
    isOpen: boolean;
    updateUserSawNotification: (notificationId: string) => void;
    notification?: notificationType | null;
    user?: UserType;
}

const ModalViewNotification: NextPage<ModalViewNotificationProps> = ({
    isOpen,
    onClose,
    user,
    updateUserSawNotification,
    notification,
}) => {
    const dispatch = useDispatch();
    const toast = useToast();
    const countUnsawNotifications = useSelector(
        (state: RootState) => state.globalReducer.countUnsawNotifications
    );

    const { setCountUnsawNotifications } = bindActionCreators(
        actionCreators,
        dispatch
    );

    const [addSeenNotification, resultAddSeenNotification] =
        useAddSeenNotificationMutation({});

    const handleNotificationSeen = async () => {
        if (user?.id && notification) {
            await addSeenNotification({
                variables: {
                    userId: user.id,
                    notificationId: notification?.id,
                },
                onError: () => {
                    toast({
                        title: "Error",
                        description: "Something went wrong",
                        status: "error",
                        duration: 8000,
                        isClosable: true,
                        position: "top",
                    });
                    console.error(resultAddSeenNotification.error);
                },
            });
        }
    };

    useEffect(() => {
        if (isOpen && countUnsawNotifications && user?.id && notification?.id) {
            if (!notification?.userSeen.includes(user.id)) {
                handleNotificationSeen();
                setCountUnsawNotifications(countUnsawNotifications - 1);
                updateUserSawNotification(notification.id);
            }
        }
    }, [isOpen, notification?.id]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            scrollBehavior={"inside"}
            size={"2xl"}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex>
                        <Flex justifyContent="flex-end">
                            <Circle size="32px" bg="grey" color="white">
                                <BsFillBellFill />
                            </Circle>
                        </Flex>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {notification && (
                        <Flex p={1} flexDir="column">
                            <Text>{notification.description}</Text>
                            <Flex justifyContent="space-between">
                                <Text
                                    fontWeight="thin"
                                    fontSize="sm"
                                    textAlign="end"
                                    mt={2}
                                >
                                    Created At:{" "}
                                    {formatRelative(
                                        new Date(notification.createdAt),
                                        new Date()
                                    )}
                                </Text>
                                <Popover placement="top-end" trigger="hover">
                                    <PopoverTrigger>
                                        <Image
                                            mr={4}
                                            borderRadius="full"
                                            boxSize="32px"
                                            src={getServerPathImage(
                                                notification.creator.picture
                                            )}
                                        />
                                    </PopoverTrigger>

                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverBody>
                                            <NexLink
                                                href={`/user/${notification.creator.id}`}
                                            >
                                                <Flex
                                                    justifyContent="flex-start"
                                                    p={2}
                                                    alignItems="center"
                                                >
                                                    <Flex alignItems="center">
                                                        <Image
                                                            cursor="pointer"
                                                            mr={2}
                                                            borderRadius="full"
                                                            boxSize="32px"
                                                            src={getServerPathImage(
                                                                notification
                                                                    .creator
                                                                    .picture
                                                            )}
                                                        />
                                                        {
                                                            notification.creator
                                                                .name
                                                        }
                                                    </Flex>
                                                </Flex>
                                            </NexLink>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </Flex>
                        </Flex>
                    )}
                </ModalBody>
                <ModalFooter>
                    <ModalBody></ModalBody>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalViewNotification;
