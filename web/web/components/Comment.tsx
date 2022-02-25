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
} from "@chakra-ui/react";
import React, { ComponentProps, useEffect, useState } from "react";
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

const CommentSchema = Yup.object().shape({
    body: Yup.string().required("Required"),
});

interface CommentProps {
    comments: getPostsCommentsType;
}

interface FormValues {
    body: string;
}

type TextAreaProps = ComponentProps<typeof Textarea>;

const ChakraTextArea = (props: TextAreaProps) => {
    return (
        <Textarea
            {...props}
            resize="vertical"
            borderRadius="1em"
            size={"sm"}
            variant="filled"
            p={2}
            mt={3}
        />
    );
};

const Comment: NextPage<CommentProps> = ({ comments }) => {
    const { isOpen, onToggle } = useDisclosure();
    const initialValues: FormValues = {
        body: "",
    };
    const { colorMode } = useColorMode();
    const [loadEffect, setLoadEffect] = useState(false);
    const [stateComments, setStateComments] = useState<
        Array<singlePostComment>
    >([]);

    const user = useUser();

    const handleAddNewComment = (body: string) => {
        if (user) {
            let newComment: singlePostComment = {
                id: "123",
                body,
                createdAt: new Date(),
                author: user,
                replies: [],
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
    };

    useEffect(() => {
        comments?.comments?.map((x) => {
            setStateComments((prevComments) => [...prevComments, x]);
        });
    }, []);

    return (
        <Flex mt={2}>
            <Flex flexDir="column" width="100%">
                <Button
                    aria-label="comments"
                    leftIcon={<BsChatDots />}
                    onClick={onToggle}
                    mb={3}
                >
                    {stateComments.length ?? 0}
                </Button>
                <Collapse in={isOpen} animateOpacity>
                    {loadEffect ? (
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
                                            <Text
                                                fontWeight="thin"
                                                fontSize="sm"
                                                textAlign="end"
                                            >
                                                Posted At:{" "}
                                                {formatRelative(
                                                    new Date(x.createdAt),
                                                    new Date()
                                                )}
                                            </Text>
                                            <PopoverTrigger>
                                                <Image
                                                    mr={2}
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
                            </Flex>
                        ))
                    )}
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => {
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
