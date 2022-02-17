import {
    Avatar,
    AvatarBadge,
    AvatarGroup,
    Flex,
    Stack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { getServerPathImage } from "utils/generalAuxFunctions";
import { chat as ChatType } from "utils/types/chat/chat.types";

interface ChatProps {
    chat: ChatType;
    currentUserId: string;
    changeChat: (chat: ChatType) => void;
    currentChatId: string;
}

const Chat: NextPage<ChatProps> = ({
    chat,
    currentUserId,
    changeChat,
    currentChatId,
}) => {
    const participants = chat?.participants.filter(
        (x) => x.id !== currentUserId
    );

    console.log(currentUserId);

    const content = (
        <Flex
            p={2}
            justifyContent="center"
            m={2}
            onClick={() => {
                changeChat(chat);
            }}
            bg={currentChatId === chat?.id ? "grey.200" : "grey.100"}
            boxShadow="base"
            borderWidth="1px"
            borderRadius="lg"
            cursor="pointer"
        >
            <Stack direction="row" spacing={4}>
                <AvatarGroup size="md" max={2}>
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
