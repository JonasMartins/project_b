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
    useColorMode,
    Circle,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Image,
} from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import type { NextPage } from "next";
import { BsFillBellFill } from "react-icons/bs";
import { getServerPathImage } from "utils/generalAuxFunctions";
import { UserType } from "utils/hooks/useUser";
import { notificationType } from "utils/types/user/user.types";
import NexLink from "next/link";

interface ModalViewNotificationProps {
    onClose: () => void;
    isOpen: boolean;
    notification?: notificationType | null;
    user?: UserType;
}

const ModalViewNotification: NextPage<ModalViewNotificationProps> = ({
    isOpen,
    onClose,
    user,
    notification,
}) => {
    const { colorMode } = useColorMode();
    //const bgColor = { light: "gray.200", dark: "gray.700" };

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
                        <Flex
                            p={1}
                            flexDir="column"
                            bgColor={
                                colorMode === "dark" ? "grey.800" : "white"
                            }
                        >
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
