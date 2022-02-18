import type { NextPage } from "next";
import { useUser } from "utils/hooks/useUser";
import { useGetChatsLazyQuery } from "generated/graphql";
import React, {
    ChangeEvent,
    ComponentProps,
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    chat as ChatType,
    message as ChatMessage,
    participant as participantType,
} from "utils/types/chat/chat.types";
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
import Container from "components/Container";
import NavBar from "components/Layout/NavBar";
import LeftPanel from "components/Layout/LeftPanel";
import Footer from "components/Layout/Footer";
import BeatLoaderCustom from "components/Layout/BeatLoaderCustom";
import ChatComponent from "components/ChatComponent";
import * as Yup from "yup";
import { Field, Form, Formik, FormikProps } from "formik";
import { useRef } from "react";
import { BiDownArrowAlt } from "react-icons/bi";
import {
    useCreateMessageMutation,
    CreateMessageMutation,
    useGetUserConnectionsLazyQuery,
} from "generated/graphql";
import { userConnectionType } from "utils/types/user/user.types";
import {
    getServerPathImage,
    truncateString,
    uuidv4Like,
} from "utils/generalAuxFunctions";
import { BsChatSquareDots } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { formatRelative } from "date-fns";

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
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.700" };
    const [getChats, resultGetChats] = useGetChatsLazyQuery({});
    const [chats, setChats] = useState<Array<ChatType>>([]);
    const [chatMessages, setChatMessages] = useState<
        Array<ChatMessage> | null | undefined
    >([]);
    const [currentChat, setCurrentChat] = useState<ChatType>(null);
    const [createMessage, resultCreateMessage] = useCreateMessageMutation({});
    const inputMessageRef = useRef<HTMLTextAreaElement>(null);
    const [searchInput, setSearchInput] = useState("");

    const [getUserConnections, resultGetUserConnectionsLazy] =
        useGetUserConnectionsLazyQuery({});

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

    const handlAddMessageToState = (body: string) => {
        let newMessage: ChatMessage = {
            id: "",
            body: body,
            createdAt: new Date(),
            creator: {
                id: user?.id || "",
                name: user?.name || "",
                picture: user?.picture,
            },
        };

        if (chatMessages?.length) {
            setChatMessages((prevMessages) => [...prevMessages!, newMessage]);
        } else {
            setChatMessages([newMessage]);
        }

        if (inputMessageRef.current) {
            inputMessageRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "end",
            });
            inputMessageRef.current.focus();
        }
    };

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

        const result = await createMessage({
            variables: {
                body,
                participants: ids,
                creatorId: user.id,
                chatId: currentChat.id,
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
        if (!result.data?.createMessage?.done) {
            return null;
        }
        return result.data;
    };

    const changeCurrentChatCallback = (chat: ChatType): void => {
        setCurrentChat(chat);
        setChatMessages(chat?.messages);
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

    const handleGetChatsAndConnections = useCallback(async () => {
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

            if (
                conn?.data?.getUserConnections?.user &&
                chats.data?.getChats?.chats
            ) {
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
    }, [user?.id]);

    useEffect(() => {
        handleGetChatsAndConnections();
    }, [user?.id, resultGetChats.loading]);

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
                        <GridItem bg={bgColor[colorMode]} boxShadow="lg">
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
                                        if (inputMessageRef.current) {
                                            inputMessageRef.current.scrollIntoView(
                                                {
                                                    behavior: "smooth",
                                                    block: "nearest",
                                                    inline: "end",
                                                }
                                            );
                                            inputMessageRef.current.focus();
                                        }
                                    }}
                                    icon={<BiDownArrowAlt />}
                                />
                            </Tooltip>
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
                                <Box p={5} mt={4} mb={2}>
                                    <Formik
                                        initialValues={initialValues}
                                        onSubmit={(values) => {
                                            handlAddMessageToState(values.body);
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
                            </Flex>
                        </GridItem>
                        <GridItem bg={bgColor[colorMode]} boxShadow="lg">
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
                                                chat={x}
                                                changeChat={
                                                    changeCurrentChatCallback
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
                                                <Box>
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
                        <GridItem />
                    </Grid>
                </Box>
                <Box>
                    <Footer />
                </Box>
            </Flex>
        </Container>
    );

    return resultGetChats.loading || resultGetUserConnectionsLazy.loading ? (
        <BeatLoaderCustom />
    ) : (
        content
    );
};

export default Chat;
