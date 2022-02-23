import {
    Avatar,
    AvatarBadge,
    Box,
    Flex,
    FormControl,
    FormErrorMessage,
    Grid,
    GridItem,
    IconButton,
    Input,
    Stack,
    Text,
    Textarea,
    Tooltip,
    useColorMode,
    useToast,
} from "@chakra-ui/react";
import ChatComponent from "components/ChatComponent";
import Container from "components/Container";
import BeatLoaderCustom from "components/Layout/BeatLoaderCustom";
import Footer from "components/Layout/Footer";
import LeftPanel from "components/Layout/LeftPanel";
import NavBar from "components/Layout/NavBar";
import { formatRelative } from "date-fns";
import { Field, Form, Formik, FormikProps } from "formik";
import {
    CreateMessageMutation,
    useCreateMessageMutation,
    useGetChatsLazyQuery,
    useGetUserConnectionsLazyQuery,
} from "generated/graphql";
import update from "immutability-helper";
import type { NextPage } from "next";
import React, {
    ChangeEvent,
    ComponentProps,
    useEffect,
    useRef,
    useState,
} from "react";
import { BiDownArrowAlt } from "react-icons/bi";
import { BsChatSquareDots } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "Redux/actions";
import {
    getServerPathImage,
    truncateString,
    uuidv4Like,
} from "utils/generalAuxFunctions";
import { useUser } from "utils/hooks/useUser";
import {
    chat as ChatType,
    message as ChatMessage,
    messageSubscription,
    participant as participantType,
} from "utils/types/chat/chat.types";
import { userConnectionType } from "utils/types/user/user.types";
import * as Yup from "yup";

interface ChatProps {}

const MessageSchema = Yup.object().shape({
    body: Yup.string().required("Required"),
});

type TextAreaProps = ComponentProps<typeof Textarea>;

interface FormValues {
    body: string;
}

const Chat: NextPage<ChatProps> = () => {
    const initialValues: FormValues = {
        body: "",
    };
    const user = useUser();
    const toast = useToast();
    const dispatch = useDispatch();
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.700" };
    const [getChats, resultGetChats] = useGetChatsLazyQuery({
        fetchPolicy: "cache-and-network",
    });
    const [chats, setChats] = useState<Array<ChatType>>([]);
    const [chatMessages, setChatMessages] = useState<
        Array<ChatMessage> | null | undefined
    >([]);
    const [currentChat, setCurrentChat] = useState<ChatType>(null);
    const [createMessage, resultCreateMessage] = useCreateMessageMutation({});
    const inputMessageRef = useRef<HTMLTextAreaElement>(null);
    const [searchInput, setSearchInput] = useState("");
    const [isSettingData, setIsSettingData] = useState(true);

    const { ClearMessagesFromStore } = bindActionCreators(
        actionCreators,
        dispatch
    );

    const [getUserConnections, resultGetUserConnectionsLazy] =
        useGetUserConnectionsLazyQuery({
            refetchWritePolicy: "overwrite",
        });

    const [connections, setConnections] = useState<{
        connections: Array<userConnectionType>;
    }>({ connections: [] });

    const ChakraTextArea = (props: TextAreaProps) => {
        return (
            <Textarea
                {...props}
                ref={inputMessageRef}
                resize="vertical"
                borderRadius="1em"
                size={"sm"}
                variant="filled"
                mt={3}
                mb={4}
            />
        );
    };
    /**
     *
     * @param conn A user connection, which is the same as a chat
     * participant, if there is already a conversation with that
     * connection, the list will not be updated, it will simple
     * change the current chat and messages, if there is not a chat
     * previously, it will added an set the focus on this new chat.
     */
    const handleAddChatToUi = (conn: userConnectionType) => {
        let foundChatIndex = -1;

        for (let i = 0; i < chats.length; i++) {
            if (foundChatIndex > -1) {
                break;
            }
            for (let j = 0; j < chats[i]!.participants.length; j++) {
                if (chats[i]?.participants[j].id === conn.id) {
                    foundChatIndex = i;
                }
            }
        }
        if (foundChatIndex > -1) {
            setCurrentChat(chats[foundChatIndex]);
            setChatMessages(chats[foundChatIndex]!.messages);
        } else {
            let participants: participantType[] = [];

            participants.push({
                id: user?.id || "",
                name: user?.name || "",
                picture: user?.picture,
            });

            participants.push(conn);
            let chat: ChatType = {
                id: uuidv4Like(),
                participants,
            };

            setChats((prevChats) => [...prevChats, chat]);
            setCurrentChat(chat);
            setChatMessages([]);
        }
    };

    /**
     *
     * @param body The message body
     * this body will generate a message to be added
     * into the ui and added to the cache, avoiding
     * to refetch the data after the mutation of a message
     * inserted
     */
    const handlAddMessageToState = (body: string, id: string) => {
        let newMessage: ChatMessage = {
            __typename: "Message",
            id,
            body: body,
            createdAt: new Date(),
            creator: {
                id: user?.id || "",
                name: user?.name || "",
                picture: user?.picture,
            },
        };

        // Needed because the ui is not displaying the messages
        // from the chats.chat.messages, there is a new state to do this
        // which is chatMessages, so we need to put here first
        if (chatMessages?.length) {
            setChatMessages((prevMessages) => [...prevMessages!, newMessage]);
        } else {
            setChatMessages([newMessage]);
        }

        if (chats !== undefined) {
            let currentChatIndex = chats.indexOf(currentChat);

            if (currentChatIndex !== -1) {
                let auxChat = chats[currentChatIndex];
                if (auxChat && !auxChat.messages) {
                    auxChat["messages"] = [];
                }

                const newChat = update(auxChat, {
                    messages: { $push: [newMessage] },
                });

                setCurrentChat(newChat);

                const chatsUpdated = update(chats, {
                    $splice: [[currentChatIndex, 1, newChat]],
                });
                setChats(chatsUpdated);
            }
        }

        goToConverSationBottom();
    };

    const handleBalloonColor = (guest: boolean): string => {
        let color = "";
        if (!guest) {
            color = colorMode === "dark" ? "#032a42" : "white";
        } else {
            color = colorMode === "dark" ? "#064a73" : "#b1d1b4";
        }
        return color;
    };

    /**
     *
     * @param body The new message body
     * @returns The result from the mutation with
     * the recent created message
     */
    const handleCreateMessage = async (
        body: string
    ): Promise<CreateMessageMutation | null> => {
        if (!currentChat?.participants || !user) {
            return null;
        }
        let ids: string[] = [];
        currentChat.participants.forEach((x) => {
            ids.push(x.id);
        });

        let chatId: string = currentChat.id;
        const result = await createMessage({
            variables: {
                body,
                participants: ids,
                creatorId: user.id,
                chatId,
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
                console.error(resultCreateMessage.error);
            },
        });

        if (!result.data?.createMessage?.message) {
            return null;
        }
        let updatedCurrentChat = update(currentChat, {
            id: { $set: result.data.createMessage.message.chat.id },
        });

        setCurrentChat(updatedCurrentChat);

        return result.data;
    };

    const goToConverSationBottom = () => {
        if (inputMessageRef.current) {
            inputMessageRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "end",
            });
            inputMessageRef.current.focus();
        }
    };

    /**
     *
     * @param chat A chat when a chat is selected (clicked)
     * resets the current chat and all of its conversations
     */
    const changeCurrentChatCallback = (chat: ChatType): void => {
        setCurrentChat(chat);
        setChatMessages([]);
        setChatMessages(chat?.messages);
        goToConverSationBottom();
    };

    const addNewCommingMessageCallback = (
        message: messageSubscription
    ): void => {
        let indexChat = -1;
        if (message) {
            let chatId = message.chat.id;

            chats.forEach((x, index) => {
                if (x?.id === chatId) {
                    indexChat = index;
                }
            });
        }
        // the chat already exist
        if (indexChat !== -1 && message && message.creator.id !== user?.id) {
            let newMessage: ChatMessage = {
                __typename: "Message",
                id: message.id,
                body: message.body,
                createdAt: message.createdAt,
                creator: {
                    id: message.creator.id,
                    name: message.creator.name,
                    picture: message.creator.picture,
                },
            };

            let auxChat = chats[indexChat];
            if (auxChat && !auxChat.messages) {
                auxChat["messages"] = [];
            }
            const newChat = update(auxChat, {
                messages: { $push: [newMessage] },
            });

            if (newChat?.id === currentChat?.id) {
                setCurrentChat(newChat);
                if (chatMessages?.length) {
                    setChatMessages((prevMessages) => [
                        ...prevMessages!,
                        newMessage,
                    ]);
                } else {
                    setChatMessages([newMessage]);
                }
            }
            const chatsUpdated = update(chats, {
                $splice: [[indexChat, 1, newChat]],
            });
            setChats(chatsUpdated);
        } else if (!chats && message && message.creator.id !== user?.id) {
            let chat: ChatType = message.chat;
            if (chat) {
                let newMessage: ChatMessage = {
                    __typename: "Message",
                    id: message.id,
                    body: message.body,
                    createdAt: message.createdAt,
                    creator: {
                        id: message.creator.id,
                        name: message.creator.name,
                        picture: message.creator.picture,
                    },
                };
                setChats([chat]);
                setCurrentChat(chat);
                setChatMessages([newMessage]);
            }
        }
    };

    /**
     * The Main setter, that will set chats, current chat, and messages
     * when they're fetched
     */
    const handleGetChatsAndConnections = async () => {
        if (user?.id) {
            const chats = await getChats({
                variables: {
                    participant: user.id,
                },
            });

            const conn = await getUserConnections({
                variables: {
                    id: user.id,
                },
            });

            if (chats.data?.getChats?.chats) {
                setChats(chats.data.getChats.chats);
                setCurrentChat(chats.data.getChats.chats[0]);
                setChatMessages(chats.data.getChats.chats[0].messages);
            }

            if (conn?.data?.getUserConnections?.user) {
                setConnections({ connections: [] });
                conn?.data?.getUserConnections.user.connections?.forEach(
                    (x) => {
                        setConnections((prevConn) => ({
                            connections: [...prevConn.connections, x],
                        }));
                    }
                );
            }
        }
    };

    useEffect(() => {
        handleGetChatsAndConnections();
    }, [user?.id]);

    /*
    useEffect(() => {}, [
        resultGetChats.loading,
        resultGetUserConnectionsLazy.loading,
    ]); */

    useEffect(() => {
        if (
            !resultGetUserConnectionsLazy.data?.getUserConnections?.user ||
            !resultGetChats.data?.getChats?.chats?.length
        ) {
            setIsSettingData(false);
        } else {
            if (chats.length || connections.connections.length) {
                setIsSettingData(false);
            }
        }
    }, [chats?.length]);

    useEffect(() => {
        return () => {
            ClearMessagesFromStore();
            setChats([]);
            setCurrentChat(null);
            setChatMessages([]);
        };
    }, []);

    const content = (
        <Container>
            <Flex
                flexDir="column"
                flexGrow={1}
                justifyContent="space-between"
                height="100vh"
            >
                <Box>
                    <NavBar />
                    <Grid
                        mt={10}
                        templateRows="repeat(1, 1fr)"
                        templateColumns="repeat(7, 1fr)"
                        gap={4}
                    >
                        <GridItem />
                        <GridItem
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                            borderRadius="1rem"
                        >
                            <LeftPanel />
                        </GridItem>
                        <GridItem
                            colSpan={3}
                            bg={bgColor[colorMode]}
                            boxShadow="md"
                            display="block"
                            overflow="auto"
                            maxHeight="800px"
                            minHeight="800px"
                            borderRadius="1rem"
                        >
                            <Tooltip
                                hasArrow
                                aria-label="go to bottom"
                                label="Go to Bottom"
                            >
                                <IconButton
                                    p={2}
                                    m={3}
                                    aria-label="conversation bottom"
                                    rounded="full"
                                    onClick={(
                                        e: React.MouseEvent<
                                            HTMLButtonElement,
                                            MouseEvent
                                        >
                                    ) => {
                                        e.preventDefault();
                                        goToConverSationBottom();
                                    }}
                                    icon={<BiDownArrowAlt />}
                                />
                            </Tooltip>

                            {/* $$$$$$$$$$$$$$$$$$$$$$$$$ MESSAGES $$$$$$$$$$$$$$$$$$$$$$$$$  */}
                            <Flex
                                flexDir="column"
                                justifyContent="space-between"
                                height="100%"
                            >
                                {chatMessages?.length ? (
                                    chatMessages?.map((x) => (
                                        <Flex
                                            justifyContent={
                                                x.creator.id === user?.id
                                                    ? "flex-end"
                                                    : "flex-start"
                                            }
                                            key={x.id}
                                        >
                                            <Flex
                                                p={5}
                                                m={2.5}
                                                boxShadow="lg"
                                                borderRadius="1.5em"
                                                width="max-content"
                                                bg={handleBalloonColor(
                                                    x.creator.id === user?.id
                                                )}
                                                flexDir="column"
                                            >
                                                <Text
                                                    fontWeight="semibold"
                                                    fontSize="md"
                                                >
                                                    {x.body}
                                                </Text>
                                                <Text
                                                    fontWeight="thin"
                                                    fontSize="sm"
                                                    textAlign="end"
                                                >
                                                    {formatRelative(
                                                        new Date(x.createdAt),
                                                        new Date()
                                                    )}
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    ))
                                ) : (
                                    <Text>{""}</Text>
                                )}
                                {/* $$$$$$$$$$$$$$$$$$$$$$$$$ END MESSAGES $$$$$$$$$$$$$$$$$$$$$$$$$  */}

                                {/* $$$$$$$$$$$$$$$$$$$$$$$$$ FORM $$$$$$$$$$$$$$$$$$$$$$$$$  */}
                                <Box p={5} mt={4} mb={2}>
                                    <Formik
                                        initialValues={initialValues}
                                        onSubmit={async (values) => {
                                            const result =
                                                await handleCreateMessage(
                                                    values.body
                                                );

                                            if (
                                                result?.createMessage?.message
                                            ) {
                                                let id =
                                                    result?.createMessage
                                                        .message.id;
                                                handlAddMessageToState(
                                                    values.body,
                                                    id
                                                );
                                            }
                                            /*
                                            handlAddMessageToState(
                                                values.body,
                                                uuidv4Like()
                                            ); */
                                        }}
                                        validationSchema={MessageSchema}
                                    >
                                        {(props: FormikProps<FormValues>) => (
                                            <Form>
                                                <Stack spacing={3}>
                                                    <FormControl
                                                        isInvalid={
                                                            props.touched
                                                                .body &&
                                                            !!props.errors.body
                                                        }
                                                    >
                                                        <Flex alignItems="center">
                                                            <Field
                                                                id="body"
                                                                name="body"
                                                                as={
                                                                    ChakraTextArea
                                                                }
                                                                placeholder="Send Message"
                                                                onBlur={() => {
                                                                    if (
                                                                        !props
                                                                            .values
                                                                            .body
                                                                            .length
                                                                    ) {
                                                                        props.setErrors(
                                                                            {
                                                                                body: "",
                                                                            }
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                            <IconButton
                                                                aria-label="Send"
                                                                m={3}
                                                                p={2}
                                                                rounded="full"
                                                                type="submit"
                                                                // disabled={
                                                                //     props.isSubmitting ||
                                                                //     !!props.errors.body
                                                                // }
                                                                variant={`phlox-gradient-${colorMode}`}
                                                                icon={
                                                                    <IoSend color="white" />
                                                                }
                                                                boxSize="3.5rem"
                                                            />
                                                        </Flex>
                                                        <FormErrorMessage>
                                                            {props.errors.body}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                </Stack>
                                            </Form>
                                        )}
                                    </Formik>
                                </Box>
                                {/* $$$$$$$$$$$$$$$$$$$$$$$$$ END FORM $$$$$$$$$$$$$$$$$$$$$$$$$  */}
                            </Flex>
                        </GridItem>
                        {/* $$$$$$$$$$$$$$$$$$$$$$$$$ CONNECTIONS $$$$$$$$$$$$$$$$$$$$$$$$$  */}

                        <GridItem
                            bg={bgColor[colorMode]}
                            boxShadow="lg"
                            borderRadius="1rem"
                        >
                            <Flex
                                flexDirection="column"
                                justifyContent="space-between"
                                height="100%"
                                flexGrow={1}
                            >
                                <Flex flexDir="column" alignItems="center">
                                    <Text fontWeight="thin" p={2} m={2}>
                                        Chats
                                    </Text>
                                    <Box width="100%">
                                        {chats?.map((x) => (
                                            <ChatComponent
                                                key={x!.id}
                                                chat={x}
                                                changeChat={
                                                    changeCurrentChatCallback
                                                }
                                                addNewMessage={
                                                    addNewCommingMessageCallback
                                                }
                                                currentChatId={
                                                    currentChat?.id ?? ""
                                                }
                                            />
                                        ))}
                                    </Box>
                                </Flex>
                                <Flex
                                    flexDirection="column"
                                    p={2}
                                    m={2}
                                    alignItems="center"
                                >
                                    <Text fontWeight="thin" p={2} m={2}>
                                        Firends
                                    </Text>
                                    <Flex
                                        overflow="auto"
                                        maxHeight="200px"
                                        flexDir="column"
                                        width="100%"
                                    >
                                        {connections &&
                                            connections.connections.map((x) => (
                                                <Box key={x.id}>
                                                    <Flex
                                                        boxShadow="base"
                                                        borderWidth="1px"
                                                        borderRadius="lg"
                                                        cursor="pointer"
                                                        p={2}
                                                        m={1}
                                                        justifyContent="space-evenly"
                                                        alignItems="center"
                                                    >
                                                        <Avatar
                                                            key={x.id}
                                                            name={x.name}
                                                            src={getServerPathImage(
                                                                x.picture
                                                            )}
                                                            size="sm"
                                                        >
                                                            <AvatarBadge
                                                                boxSize="1.25em"
                                                                bg="green.500"
                                                            />
                                                        </Avatar>
                                                        <Text fontWeight="thin">
                                                            {truncateString(
                                                                x.name,
                                                                15
                                                            )}
                                                        </Text>

                                                        <Tooltip
                                                            aria-label="Start chat"
                                                            label="Start Chat"
                                                            hasArrow
                                                        >
                                                            <IconButton
                                                                variant="ghost"
                                                                aria-label="Chat"
                                                                size="xs"
                                                                icon={
                                                                    <BsChatSquareDots />
                                                                }
                                                                onClick={() => {
                                                                    handleAddChatToUi(
                                                                        x
                                                                    );
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    </Flex>
                                                </Box>
                                            ))}
                                    </Flex>
                                    {/* $$$$$$$$$$$$$$$$$$$$$$$$$ END CONNECTIONS $$$$$$$$$$$$$$$$$$$$$$$$$  */}

                                    {/* $$$$$$$$$$$$$$$$$$$$$$$$$ SEARCH CONNECTIONS  $$$$$$$$$$$$$$$$$$$$$$$$$  */}

                                    <Input
                                        borderRadius="1em"
                                        size="sm"
                                        name="search"
                                        placeholder="Search Friends"
                                        variant="filled"
                                        value={searchInput}
                                        onChange={(
                                            e: ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setSearchInput(e.target.value);

                                            if (e.target.value.length >= 2) {
                                                let regexTerm =
                                                    "[ˆ,]*" +
                                                    e.target.value.toLowerCase() +
                                                    "[,$]*";
                                                setConnections((prevConn) => ({
                                                    connections:
                                                        prevConn.connections.filter(
                                                            (x) =>
                                                                x.name
                                                                    .toLowerCase()
                                                                    .match(
                                                                        regexTerm
                                                                    )
                                                        ),
                                                }));
                                            } else if (
                                                e.target.value.length === 0
                                            ) {
                                                if (
                                                    resultGetUserConnectionsLazy
                                                        .data
                                                        ?.getUserConnections
                                                        ?.user?.connections
                                                        ?.length
                                                ) {
                                                    setConnections({
                                                        connections:
                                                            resultGetUserConnectionsLazy
                                                                .data
                                                                .getUserConnections
                                                                .user
                                                                .connections,
                                                    });
                                                }
                                            }
                                        }}
                                    />
                                </Flex>
                            </Flex>
                        </GridItem>
                        {/* $$$$$$$$$$$$$$$$$$$$$$$$$ END SEARCH CONNECTIONS  $$$$$$$$$$$$$$$$$$$$$$$$$  */}

                        <GridItem />
                    </Grid>
                </Box>
                <Box>
                    <Footer />
                </Box>
            </Flex>
        </Container>
    );

    return isSettingData ? <BeatLoaderCustom /> : content;
};

export default Chat;
