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
import {
    useNewMessageNotificationSubscription,
    useUpdateUnSeenChatMutation,
} from "generated/graphql";
import update from "immutability-helper";
import type { NextPage } from "next";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "Redux/actions";
import { RootState } from "Redux/Global/GlobalReducer";
import { getServerPathImage } from "utils/generalAuxFunctions";
import { useUser } from "utils/hooks/useUser";
import {
    chat as ChatType,
    messageSubscription,
} from "utils/types/chat/chat.types";

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

    const {
        setCountChatUnsawMessages,
        setCountNewMessages,
        AddNewMessageToStore,
    } = bindActionCreators(actionCreators, dispatch);

    const userNewMessages = useSelector(
        (state: RootState) => state.globalReducer.countUserNewMessages
    );

    const messagesSended = useSelector(
        (state: RootState) => state.globalReducer.messagesSended
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
            if (!messagesSended.includes(newMessage.id)) {
                addNewMessage(newMessage);
                AddNewMessageToStore(newMessage.id);

                if (user?.id && newMessage.creator.id !== user?.id) {
                    if (
                        chat?.id === newMessage.chat.id &&
                        newMessage.chat.id !== currentChatId
                    ) {
                        setChatUnsawMessages(chatUnsawMessages + 1);
                        setCountNewMessages(userNewMessages + 1);
                    }
                }
            } else {
                console.log("tentativa de adicionar mensage repetida");
            }
        }
    };

    const handleUpdateSeenMessages = async () => {
        let chatToRemoveIndex = -1;
        chatsCountUnsawMessages?.forEach((x, index) => {
            if (currentChatId) {
                if (x.chatId === chat?.id && x.chatId === currentChatId) {
                    setChatUnsawMessages(0);
                    if (userNewMessages >= x.countMessages) {
                        chatToRemoveIndex = index;
                        setCountNewMessages(
                            userNewMessages - Math.max(1, x.countMessages)
                        );
                    }
                }
            }
        });

        if (chatToRemoveIndex > -1) {
            let newChatsCountUnsawMessages = update(chatsCountUnsawMessages, {
                $splice: [
                    [
                        chatToRemoveIndex,
                        1,
                        { chatId: currentChatId, countMessages: 0 },
                    ],
                ],
            });

            updateUnSeenOnApi();

            // Updating on Redux
            newChatsCountUnsawMessages &&
                setCountChatUnsawMessages(newChatsCountUnsawMessages);
        }
    };

    const updateUnSeenOnApi = async () => {
        // Updating on api
        if (user?.id) {
            console.log("update on api ?");
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
                    console.error(resultSetAllChatMessagesHaveBeenSeen.error);
                },
            });
        }
    };

    useEffect(() => {
        handleNewMessagesSubscriptions();

        return () => {};
    }, [
        user?.id,
        newMessagesSubscription.loading,
        newMessagesSubscription.data?.newMessageNotification?.newMessage?.id,
    ]);

    useEffect(() => {
        let delaySetUnsawMessages = setTimeout(() => {
            handleUpdateSeenMessages();
        }, 200);
        return () => {
            clearTimeout(delaySetUnsawMessages);
        };
    }, [currentChatId, chat?.id, user?.id]);

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

    return content;
};

export default memo(Chat);
