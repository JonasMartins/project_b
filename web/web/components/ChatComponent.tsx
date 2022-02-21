import {
    Avatar,
    AvatarBadge,
    AvatarGroup,
    Circle,
    Flex,
    Stack,
    useColorMode,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { getServerPathImage } from "utils/generalAuxFunctions";
import { useUser } from "utils/hooks/useUser";
import {
    chat as ChatType,
    messageSubscription,
} from "utils/types/chat/chat.types";
import { useNewMessageNotificationSubscription } from "generated/graphql";
import { useCallback, useEffect, useState } from "react";

interface chatsUnseeMessages {
    chatId: string;
    countMessages: number;
}

interface ChatProps {
    chat: ChatType;
    changeChat: (chat: ChatType) => void;
    addNewMessage: (message: messageSubscription) => void;
    currentChatId: string;
    countUnseenMessages: chatsUnseeMessages[];
}

const Chat: NextPage<ChatProps> = ({
    chat,
    changeChat,
    currentChatId,
    addNewMessage,
    countUnseenMessages,
}) => {
    const user = useUser();
    const participants = chat?.participants.filter((x) => x.id !== user?.id);
    const { colorMode } = useColorMode();

    const newMessagesSubscription = useNewMessageNotificationSubscription();
    const [chatUnsawMessages, setChatUnsawMessages] = useState(0);

    const handleBadgeColor = (active: boolean): string => {
        let color = "";
        if (active) {
            color = colorMode === "dark" ? "#064a73" : "grey.200";
        } else {
            color = colorMode === "dark" ? "grey.700" : "grey.100";
        }
        return color;
    };

    const handleNewMessagesSubscriptions = () => {
        if (newMessagesSubscription.data?.newMessageNotification?.newMessage) {
            const { newMessage } =
                newMessagesSubscription.data.newMessageNotification;
            addNewMessage(newMessage);
        }
    };

    const returnCountUnseenMessagesByChat = (id: string) => {
        let count = 0;
        if (countUnseenMessages) {
            countUnseenMessages.forEach((x) => {
                if (x.chatId === id) {
                    count = x.countMessages;
                }
            });
        }
        setChatUnsawMessages(count);
    };

    useEffect(() => {
        if (chat?.id) {
            returnCountUnseenMessagesByChat(chat.id);
        }
        handleNewMessagesSubscriptions();
    }, [
        chat?.id,
        countUnseenMessages.length,
        newMessagesSubscription.loading,
        newMessagesSubscription.data?.newMessageNotification?.newMessage?.id,
    ]);

    useEffect(() => {}, [chatUnsawMessages]);

    const content = (
        <Flex
            p={2}
            justifyContent="center"
            m={2}
            onClick={() => {
                changeChat(chat);
            }}
            bg={handleBadgeColor(currentChatId === chat?.id)}
            boxShadow="base"
            borderWidth="1px"
            borderRadius="lg"
            cursor="pointer"
        >
            <Stack direction="row" spacing={4}>
                <AvatarGroup size="sm" max={2}>
                    {participants?.map((x) => (
                        <Avatar
                            key={x.id}
                            name={x.name}
                            src={getServerPathImage(x.picture)}
                        >
                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                        </Avatar>
                    ))}
                </AvatarGroup>
                {chatUnsawMessages ? (
                    <Circle size="25px" bg="red.400" color="white">
                        {chatUnsawMessages}
                    </Circle>
                ) : (
                    <></>
                )}
            </Stack>
        </Flex>
    );

    return content;
};

export default Chat;
