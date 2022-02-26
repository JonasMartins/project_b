import {
    Button,
    Collapse,
    Flex,
    useDisclosure,
    Text,
    Popover,
    Image,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    Textarea,
    FormControl,
    Stack,
    FormErrorMessage,
    useColorMode,
    IconButton,
    Tooltip,
    useToast,
    Box,
} from "@chakra-ui/react";
import React, { ComponentProps, useEffect, useState, useRef } from "react";
import { formatRelative } from "date-fns";
import { NextPage } from "next";
import { BsChatDots } from "react-icons/bs";
import { getServerPathImage } from "utils/generalAuxFunctions";
import {
    getPostsCommentsType,
    singlePostComment,
} from "utils/types/post/post.types";
import NexLink from "next/link";
import * as Yup from "yup";
import { Field, Form, Formik, FormikProps } from "formik";
import { useUser } from "utils/hooks/useUser";
import BeatLoaderCustom from "components/Layout/BeatLoaderCustom";
import { CgMailReply } from "react-icons/cg";
import { useCreateCommentMutation } from "generated/graphql";

const CommentSchema = Yup.object().shape({
    body: Yup.string().required("Required"),
});

interface CommentProps {
    comments: getPostsCommentsType;
    postId: string;
}

interface FormValues {
    body: string;
}

type TextAreaProps = ComponentProps<typeof Textarea>;

const Comment: NextPage<CommentProps> = ({ comments, postId }) => {
    const toast = useToast();
    const showCommentsDisclosure = useDisclosure();
    const showRepliesDisclosure = useDisclosure();
    const initialValues: FormValues = {
        body: "",
    };
    const { colorMode } = useColorMode();
    const [loadEffect, setLoadEffect] = useState(false);
    const [stateComments, setStateComments] = useState<
        Array<singlePostComment>
    >([]);
    const [commentParentId, setCommentParentId] = useState("");
    const inputCommentRef = useRef<HTMLTextAreaElement>(null);
    const [createComment, resultCreateComment] = useCreateCommentMutation({});

    const user = useUser();

    const ChakraTextArea = (props: TextAreaProps) => {
        return (
            <Textarea
                {...props}
                ref={inputCommentRef}
                resize="vertical"
                borderRadius="1em"
                size={"sm"}
                variant="filled"
                p={2}
                mt={3}
            />
        );
    };

    const focusOnCommentInput = () => {
        if (inputCommentRef.current) {
            inputCommentRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "end",
            });
            inputCommentRef.current.focus();
        }
    };

    const handleAddNewComment = async (body: string) => {
        if (user) {
            const result = await createComment({
                variables: {
                    options: {
                        body,
                        authorId: user.id,
                        postId,
                    },
                    parentId: commentParentId,
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
                    console.error(resultCreateComment.error);
                },
            });

            if (result.data?.createComment?.comment) {
                const { comment } = result.data.createComment;
                let newComment: singlePostComment = {
                    id: comment.id,
                    body: comment.body,
                    createdAt: comment.createdAt,
                    author: comment.author,
                    replies: [],
                    order: commentParentId ? 2 : 1,
                };
                setTimeout(() => {
                    // adding on top
                    setStateComments((prevComments) => [
                        newComment,
                        ...prevComments,
                    ]);
                    setLoadEffect(false);
                }, 500);
            }
        }
    };

    useEffect(() => {
        comments?.comments?.map((x) => {
            if (x.order === 1) {
                setStateComments((prevComments) => [...prevComments, x]);
            }
        });
    }, []);

    return (
        <Flex mt={2}>
            <Flex flexDir="column" width="100%">
                <Button
                    aria-label="comments"
                    leftIcon={<BsChatDots />}
                    onClick={showCommentsDisclosure.onToggle}
                    mb={3}
                >
                    {stateComments.length ?? 0}
                </Button>
                <Collapse in={showCommentsDisclosure.isOpen} animateOpacity>
                    {loadEffect || resultCreateComment.loading ? (
                        <BeatLoaderCustom />
                    ) : (
                        stateComments.map((x) => (
                            <Flex
                                p={3}
                                mt={1}
                                boxShadow="md"
                                borderRadius="1rem"
                                flexDir="column"
                            >
                                <Text>{x.body}</Text>
                                <Flex>
                                    <Popover
                                        placement="top-end"
                                        trigger="hover"
                                    >
                                        <Flex
                                            justifyContent="space-between"
                                            width="100%"
                                        >
                                            <Flex alignItems="center">
                                                <Tooltip
                                                    aria-label="reply to comment"
                                                    label="Reply to this comment"
                                                >
                                                    <IconButton
                                                        aria-label="reply"
                                                        icon={<CgMailReply />}
                                                        onClick={() => {
                                                            focusOnCommentInput();
                                                            setCommentParentId(
                                                                x.id
                                                            );
                                                        }}
                                                    />
                                                </Tooltip>
                                                <Text
                                                    fontWeight="thin"
                                                    fontSize="sm"
                                                    textAlign="end"
                                                    ml={3}
                                                >
                                                    Posted At:{" "}
                                                    {formatRelative(
                                                        new Date(x.createdAt),
                                                        new Date()
                                                    )}
                                                </Text>
                                            </Flex>
                                            <PopoverTrigger>
                                                <Image
                                                    mr={4}
                                                    borderRadius="full"
                                                    boxSize="32px"
                                                    src={getServerPathImage(
                                                        x.author.picture
                                                    )}
                                                />
                                            </PopoverTrigger>
                                        </Flex>

                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverBody>
                                                <NexLink
                                                    href={`/user/${x.author.id}`}
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
                                                                    x.author
                                                                        .picture
                                                                )}
                                                            />
                                                            {x.author.name}
                                                        </Flex>
                                                    </Flex>
                                                </NexLink>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Popover>
                                </Flex>
                                {x.replies.length ? (
                                    <Flex flexDir="column">
                                        <Flex alignSelf="flex-end">
                                            <Button
                                                onClick={
                                                    showRepliesDisclosure.onToggle
                                                }
                                            >{`Replies ${x.replies.length}`}</Button>
                                        </Flex>
                                        <Collapse
                                            in={showRepliesDisclosure.isOpen}
                                            animateOpacity
                                        >
                                            {x.replies.map((y) => (
                                                <Flex
                                                    boxShadow="md"
                                                    borderRadius="1rem"
                                                    flexDir="column"
                                                    p={2}
                                                    ml={2}
                                                >
                                                    <Text>{y.body}</Text>
                                                    <Flex justifyContent="space-between">
                                                        <Text
                                                            fontWeight="thin"
                                                            fontSize="sm"
                                                            textAlign="end"
                                                            mt={2}
                                                        >
                                                            Posted At:{" "}
                                                            {formatRelative(
                                                                new Date(
                                                                    y.createdAt
                                                                ),
                                                                new Date()
                                                            )}
                                                        </Text>
                                                        <Image
                                                            mr={4}
                                                            borderRadius="full"
                                                            boxSize="32px"
                                                            src={getServerPathImage(
                                                                y.author.picture
                                                            )}
                                                        />
                                                    </Flex>
                                                </Flex>
                                            ))}
                                        </Collapse>
                                    </Flex>
                                ) : (
                                    <></>
                                )}
                            </Flex>
                        ))
                    )}
                    <Formik
                        initialValues={initialValues}
                        onSubmit={async (values) => {
                            setLoadEffect(true);
                            console.log(values);
                            handleAddNewComment(values.body);
                        }}
                        validationSchema={CommentSchema}
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
                                            placeholder="Share a comment to this post"
                                            onBlur={() => {
                                                if (!props.values.body.length) {
                                                    props.setErrors({
                                                        body: "",
                                                    });
                                                }
                                            }}
                                        />
                                        <FormErrorMessage>
                                            {props.errors.body}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <Flex justifyContent="flex-end">
                                        <Button
                                            type="submit"
                                            // disabled={
                                            //     props.isSubmitting ||
                                            //     !!props.errors.body
                                            // }
                                            variant={`phlox-gradient-${colorMode}`}
                                            color="white"
                                        >
                                            Share
                                        </Button>
                                    </Flex>
                                </Stack>
                            </Form>
                        )}
                    </Formik>
                </Collapse>
            </Flex>
        </Flex>
    );
};

export default Comment;
