import {
    Button,
    CloseButton,
    Collapse,
    Flex,
    FormControl,
    FormErrorMessage,
    IconButton,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Stack,
    Text,
    Textarea,
    Tooltip,
    useColorMode,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import update from "immutability-helper";
import BeatLoaderCustom from "components/Layout/BeatLoaderCustom";
import { formatRelative } from "date-fns";
import { Field, Form, Formik, FormikProps } from "formik";
import {
    useCreateCommentMutation,
    useCreateNotificationMutation,
} from "generated/graphql";
import { NextPage } from "next";
import NexLink from "next/link";
import React, { ComponentProps, useEffect, useRef, useState } from "react";
import { BsChatDots } from "react-icons/bs";
import { CgMailReply } from "react-icons/cg";
import { getServerPathImage } from "utils/generalAuxFunctions";
import { useUser } from "utils/hooks/useUser";
import {
    getPostsCommentsType,
    getPostsType,
    singlePostComment,
} from "utils/types/post/post.types";
import * as Yup from "yup";

const CommentSchema = Yup.object().shape({
    body: Yup.string().required("Required"),
});

interface RepliesToggle {
    [key: string]: boolean;
}

interface CommentProps {
    comments: getPostsCommentsType;
    post: getPostsType;
}

interface FormValues {
    body: string;
}

type TextAreaProps = ComponentProps<typeof Textarea>;

const Comment: NextPage<CommentProps> = ({ comments, post }) => {
    const user = useUser();
    const toast = useToast();
    const showCommentsDisclosure = useDisclosure();
    const initialValues: FormValues = {
        body: "",
    };
    const { colorMode } = useColorMode();
    const [loadEffect, setLoadEffect] = useState(false);
    const [stateComments, setStateComments] = useState<
        Array<singlePostComment>
    >([]);
    const [parentComment, setParentComment] =
        useState<singlePostComment | null>(null);
    const inputCommentRef = useRef<HTMLTextAreaElement>(null);
    const [createComment, resultCreateComment] = useCreateCommentMutation({});
    const [createNotification, resultCreateNotification] =
        useCreateNotificationMutation({});
    const [mapRepliesOpen, setMapRepliesOpen] = useState<RepliesToggle>({});

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
    /**
     *
     * @param commentId The comment in which we want to expand the replies
     * Given a comment id (with replies), it will togle the value for open
     * in the mapReplies state object
     */
    const handleOpenCorrentReplies = (commentId: string) => {
        //showRepliesDisclosure
        setMapRepliesOpen((prevMaps) => ({
            ...prevMaps,
            [commentId]: !prevMaps[commentId],
        }));
    };

    /**
     *
     * @param body The comment body comming from formik values
     * Insert a new comment into database, return that comment
     * and handle all the ui update, insert the reply or comment
     * in the correct order
     */
    const handleAddNewComment = async (body: string) => {
        if (user) {
            const result = await createComment({
                variables: {
                    options: {
                        body,
                        authorId: user.id,
                        postId: post.id,
                    },
                    parentId: parentComment?.id,
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

            if (parentComment?.id) {
                /**
                 * User replying to his own comment, does not create
                 * a notification
                 */
                if (user.id !== parentComment.author.id) {
                    await createNotification({
                        variables: {
                            creatorId: user.id,
                            description: `${user.name} just replied to your comment: "${parentComment.body}" in the post: "${post.body}" `,
                            usersRelatedIds: [parentComment.author.id],
                        },
                        onError: () => {
                            console.error(resultCreateNotification.error);
                        },
                    });
                }
            } else {
                /**
                 * Only creates a notification if the comment is not from
                 * the same user that created the post.
                 */
                if (user.id !== post.creator.id) {
                    await createNotification({
                        variables: {
                            creatorId: user.id,
                            description: `${user.name} just commented on your post: "${post.body}" `,
                            usersRelatedIds: [post.creator.id],
                        },
                        onError: () => {
                            console.error(resultCreateNotification.error);
                        },
                    });
                }
            }

            if (result.data?.createComment?.comment) {
                const { comment } = result.data.createComment;
                let newComment: singlePostComment = {
                    id: comment.id,
                    body: comment.body,
                    createdAt: comment.createdAt,
                    author: comment.author,
                    replies: [],
                    order: parentComment ? 2 : 1,
                };
                setTimeout(() => {
                    if (!parentComment) {
                        // adding on top
                        setStateComments((prevComments) => [
                            newComment,
                            ...prevComments,
                        ]);
                    } else {
                        let indexComment = -1;
                        indexComment = stateComments.findIndex(
                            (x) => x.id === parentComment.id
                        );

                        if (indexComment > -1) {
                            /**
                             *  Updating the current parent comment,
                             *  inserting the new comments into replies
                             *  and getting a new comment object with the
                             *  new reply
                             */
                            const newCommentReply = update(parentComment, {
                                replies: { $push: [newComment] },
                            });

                            /**
                             *  After insert the reply into parent component
                             *  and getting the new one in "newCommentReply",
                             *  inserting this new comment into the state,
                             *  returning the new state and below, updating
                             *  all the state
                             */
                            let newComments = update(stateComments, {
                                $splice: [[indexComment, 1, newCommentReply]],
                            });

                            setStateComments(newComments);
                        }
                    }

                    setLoadEffect(false);
                }, 500);
            }
        }
    };
    /**
     *
     * @param replyId The reply id from a comment that i don't know the id
     * @returns The parent id from that reply
     * It search in the comments, if a comment has in his replies the comming
     * id passed as argument.
     */
    const getParentCommentId = (replyId: string): string => {
        let parentId: string | undefined = "";
        comments?.comments?.forEach((y) => {
            if (y.replies.length) {
                if (y.replies.find((yy) => yy.id === replyId)) {
                    parentId = y.id;
                }
            }
        });
        return parentId;
    };

    useEffect(() => {
        comments?.comments?.map((x) => {
            if (x.order === 1) {
                setStateComments((prevComments) => [...prevComments, x]);
            } else {
                /**
                 *  There a state like this:
                 *  {
                 *      [commentId] : open? boolean
                 *  }
                 *
                 *  This for sets every open as false,
                 *  when the component mounts, all the ids of comments
                 *  have its flag as false, indicating that all the replies
                 *  will be hidden, not expanded
                 */
                let parentId: string | undefined = getParentCommentId(x.id);
                if (parentId !== undefined) {
                    setMapRepliesOpen((prevMapReplies) => ({
                        ...prevMapReplies,
                        [parentId!]: false,
                    }));
                }
            }
        });
    }, []);

    useEffect(() => {
        return () => {
            setStateComments([]);
        };
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
                                key={x.id}
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
                                                            setParentComment(x);
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
                                                onClick={() => {
                                                    handleOpenCorrentReplies(
                                                        x.id
                                                    );
                                                }}
                                            >{`Replies ${x.replies.length}`}</Button>
                                        </Flex>
                                        <Collapse
                                            in={mapRepliesOpen[x.id]}
                                            animateOpacity
                                        >
                                            {x.replies.map((y) => (
                                                <Flex
                                                    boxShadow="md"
                                                    borderRadius="1rem"
                                                    flexDir="column"
                                                    p={2}
                                                    ml={2}
                                                    key={y.id}
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
                    {/* Reply body */}
                    {parentComment ? (
                        <Flex p={2} flexDir="column" mt={3}>
                            <Flex justifyContent="space-between">
                                <Text fontWeight="semibold" as="i">
                                    In Reply to:
                                </Text>
                                <CloseButton
                                    onClick={() => {
                                        setParentComment(null);
                                    }}
                                />
                            </Flex>

                            <Text as="i">{parentComment.body}</Text>
                            <Text
                                as="i"
                                fontWeight="thin"
                                fontSize="sm"
                                textAlign="end"
                                mt={2}
                            >
                                Posted At:{" "}
                                {formatRelative(
                                    new Date(parentComment.createdAt),
                                    new Date()
                                )}
                            </Text>
                        </Flex>
                    ) : (
                        <></>
                    )}
                    <Formik
                        initialValues={initialValues}
                        onSubmit={async (values) => {
                            setLoadEffect(true);
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
