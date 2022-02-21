import {
    Avatar,
    AvatarBadge,
    AvatarGroup,
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
import { useEffect } from "react";

interface ChatProps {
    chat: ChatType;
    changeChat: (chat: ChatType) => void;
    addNewMessage: (message: messageSubscription) => void;
    currentChatId: string;
}

const Chat: NextPage<ChatProps> = ({
    chat,
    changeChat,
    currentChatId,
    addNewMessage,
}) => {
    const user = useUser();
    const participants = chat?.participants.filter((x) => x.id !== user?.id);
    const { colorMode } = useColorMode();

    const newMessagesSubscription = useNewMessageNotificationSubscription();

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

    useEffect(() => {
        handleNewMessagesSubscriptions();
    }, [
        newMessagesSubscription.loading,
        newMessagesSubscription.data?.newMessageNotification?.newMessage?.id,
    ]);

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
            </Stack>
        </Flex>
    );

    return content;
};

export default Chat;
