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
import { chat as ChatType } from "utils/types/chat/chat.types";

interface ChatProps {
    chat: ChatType;
    changeChat: (chat: ChatType) => void;
    currentChatId: string;
}

const Chat: NextPage<ChatProps> = ({ chat, changeChat, currentChatId }) => {
    const user = useUser();
    const participants = chat?.participants.filter((x) => x.id !== user?.id);
    const { colorMode } = useColorMode();

    const handleBadgeColor = (active: boolean): string => {
        let color = "";
        if (active) {
            color = colorMode === "dark" ? "#064a73" : "grey.200";
        } else {
            color = colorMode === "dark" ? "grey.700" : "grey.100";
        }
        return color;
    };

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
