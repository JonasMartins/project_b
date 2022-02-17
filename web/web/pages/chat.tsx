import type { NextPage } from "next";
import { useUser } from "utils/hooks/useUser";
import { useGetChatsLazyQuery } from "generated/graphql";
import { ComponentProps, useCallback, useEffect, useState } from "react";
import {
    chats as ChatsType,
    chat as ChatType,
    message as ChatMessage,
} from "utils/types/chat/chat.types";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    Grid,
    GridItem,
    IconButton,
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
} from "generated/graphql";

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
    const { colorMode } = useColorMode();
    const bgColor = { light: "gray.200", dark: "gray.700" };
    const [getChats, resultGetChats] = useGetChatsLazyQuery({});
    const [chats, setChats] = useState<ChatsType>([]);
    const [chatMessages, setChatMessages] = useState<
        Array<ChatMessage> | null | undefined
    >([]);
    const [currentChat, setCurrentChat] = useState<ChatType>(null);
    const [createMessage, resultCreateMessage] = useCreateMessageMutation({});
    const inputMessageRef = useRef<HTMLTextAreaElement>(null);
    const toast = useToast();

    const ChakraTextArea = (props: TextAreaProps) => {
        return (
            <Textarea
                {...props}
                ref={inputMessageRef}
                resize="vertical"
                borderRadius="1em"
                size={"sm"}
                variant="filled"
            />
        );
    };

    const handlAddMessageToState = (body: string) => {
        let newMessage: ChatMessage = {
            id: "",
            body: body,
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

    const handleGetChats = useCallback(async () => {
        if (user?.id) {
            const chats = await getChats({
                variables: {
                    participant: user.id,
                },
            });

            if (chats.data?.getChats?.chats) {
                setChats(chats.data.getChats.chats);
                setCurrentChat(chats.data.getChats.chats[0]);
                setChatMessages(chats.data.getChats.chats[0].messages);
            }
        }
    }, [user?.id]);

    useEffect(() => {
        handleGetChats();
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
                            height="600px"
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
                                    onClick={() => {
                                        if (inputMessageRef.current) {
                                            inputMessageRef.current.scrollIntoView(
                                                {
                                                    behavior: "smooth",
                                                }
                                            );
                                            inputMessageRef.current.focus();
                                        }
                                    }}
                                    icon={<BiDownArrowAlt />}
                                />
                            </Tooltip>
                            {chatMessages &&
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
                                            m={4}
                                            boxShadow="lg"
                                            borderRadius="1.5em"
                                            width="max-content"
                                            bg={handleBalloonColor(
                                                x.creator.id === user?.id
                                            )}
                                        >
                                            <Text fontWeight="semibold">
                                                {x.body}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                ))}
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
                                                        props.touched.body &&
                                                        !!props.errors.body
                                                    }
                                                >
                                                    <Field
                                                        id="body"
                                                        name="body"
                                                        as={ChakraTextArea}
                                                        placeholder="Send Message"
                                                        onBlur={() => {
                                                            if (
                                                                !props.values
                                                                    .body.length
                                                            ) {
                                                                props.setErrors(
                                                                    {
                                                                        body: "",
                                                                    }
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <FormErrorMessage>
                                                        {props.errors.body}
                                                    </FormErrorMessage>
                                                </FormControl>
                                                <Flex justifyContent="flex-end">
                                                    <Button
                                                        mt={3}
                                                        mb={3}
                                                        type="submit"
                                                        // disabled={
                                                        //     props.isSubmitting ||
                                                        //     !!props.errors.body
                                                        // }
                                                        variant={`phlox-gradient-${colorMode}`}
                                                        color="white"
                                                    >
                                                        Send
                                                    </Button>
                                                </Flex>
                                            </Stack>
                                        </Form>
                                    )}
                                </Formik>
                            </Box>
                        </GridItem>
                        <GridItem bg={bgColor[colorMode]} boxShadow="lg">
                            {chats?.map((x) => (
                                <ChatComponent
                                    chat={x}
                                    changeChat={changeCurrentChatCallback}
                                    currentChatId={currentChat?.id ?? ""}
                                />
                            ))}
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

    return resultGetChats.loading ? <BeatLoaderCustom /> : content;
};

export default Chat;