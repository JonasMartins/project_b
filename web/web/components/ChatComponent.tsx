import {
    Avatar,
    AvatarBadge,
    AvatarGroup,
    Circle,
    Flex,
    Stack,
    useColorMode,
    useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { getServerPathImage } from "utils/generalAuxFunctions";
import { useUser } from "utils/hooks/useUser";
import {
    chat as ChatType,
    messageSubscription,
} from "utils/types/chat/chat.types";
import update from "immutability-helper";
import {
    useNewMessageNotificationSubscription,
    useUpdateUnSeenChatMutation,
} from "generated/graphql";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "Redux/Global/GlobalReducer";
import { bindActionCreators } from "redux";
import { actionCreators } from "Redux/actions";
import MiniBeatLoaderCustom from "components/Layout/MiniBeatLoaderCustom";

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
    const toast = useToast();
    const dispatch = useDispatch();
    const participants = chat?.participants.filter((x) => x.id !== user?.id);
    const { colorMode } = useColorMode();

    const { setCountChatUnsawMessages, setCountNewMessages } =
        bindActionCreators(actionCreators, dispatch);

    const userNewMessages = useSelector(
        (state: RootState) => state.globalReducer.countUserNewMessages
    );

    const [
        setAllChatMessagesHaveBeenSeen,
        resultSetAllChatMessagesHaveBeenSeen,
    ] = useUpdateUnSeenChatMutation({});

    const newMessagesSubscription = useNewMessageNotificationSubscription();
    const [chatUnsawMessages, setChatUnsawMessages] = useState(0);

    const chatsCountUnsawMessages = useSelector(
        (state: RootState) => state.globalReducer.chatsCountUnsawMessages
    );

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
            if (currentChatId && newMessage.chat.id !== currentChatId) {
                setChatUnsawMessages(chatUnsawMessages + 1);
                setCountNewMessages(userNewMessages + 1);
            }
        }
    };

    const handleFirstChatUpdate = useCallback(() => {
        chatsCountUnsawMessages?.forEach((x) => {
            if (x.chatId === chat?.id && x.chatId !== currentChatId) {
                setChatUnsawMessages(x.countMessages);
            }
        });
    }, [user?.id, chatsCountUnsawMessages?.length, currentChatId]);

    const handleUpdateSeenMessages = async () => {
        let chatToRemoveIndex = -1;
        chatsCountUnsawMessages?.forEach((x, index) => {
            if (currentChatId) {
                if (x.chatId === chat?.id && x.chatId === currentChatId) {
                    setChatUnsawMessages(0);
                    if (userNewMessages >= x.countMessages) {
                        chatToRemoveIndex = index;
                        setCountNewMessages(userNewMessages - x.countMessages);
                    }
                }
            }
        });

        if (chatToRemoveIndex > -1) {
            let newChatsCountUnsawMessages = update(chatsCountUnsawMessages, {
                $splice: [[chatToRemoveIndex, 1]],
            });

            // Updating on api

            /*
            if (user?.id) {
                await setAllChatMessagesHaveBeenSeen({
                    variables: {
                        chatId: currentChatId,
                        userId: user.id,
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
                        console.error(
                            resultSetAllChatMessagesHaveBeenSeen.error
                        );
                    },
                });
            } */

            // Updating on Redux
            newChatsCountUnsawMessages &&
                setCountChatUnsawMessages(newChatsCountUnsawMessages);
        }
    };

    useEffect(() => {
        handleNewMessagesSubscriptions();

        let delayFirstUnsawMessages = setTimeout(() => {
            handleFirstChatUpdate();
        }, 300);

        let delaySetUnsawMessages = setTimeout(() => {
            if (user?.id) {
                handleUpdateSeenMessages();
            }
        }, 1000);

        return () => {
            clearTimeout(delayFirstUnsawMessages);
            clearTimeout(delaySetUnsawMessages);
        };
    }, [
        user?.id,
        chat?.id,
        currentChatId,
        newMessagesSubscription.loading,
        newMessagesSubscription.data?.newMessageNotification?.newMessage?.id,
    ]);

    const content = (
        <Flex
            p={2}
            justifyContent="space-between"
            m={2}
            onClick={() => {
                changeChat(chat);
                setChatUnsawMessages(0);
            }}
            bg={handleBadgeColor(currentChatId === chat?.id)}
            boxShadow="base"
            borderWidth="1px"
            borderRadius="lg"
            cursor="pointer"
            alignItems="center"
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
            {chatUnsawMessages ? (
                <Circle size="25px" bg="red.400" color="white">
                    {chatUnsawMessages}
                </Circle>
            ) : (
                <></>
            )}
        </Flex>
    );

    return resultSetAllChatMessagesHaveBeenSeen.loading ? (
        <MiniBeatLoaderCustom />
    ) : (
        content
    );
};

export default Chat;
