import * as Yup from "yup";
import type { NextPage } from "next";
import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    Stack,
    Textarea,
    useColorMode,
    Text,
} from "@chakra-ui/react";
import React, {
    ComponentProps,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Field, Form, Formik, FormikProps } from "formik";
import { css } from "@emotion/react";
import { customPostFeedInput } from "utils/custom/customStyles";
import { useDropzone } from "react-dropzone";
import {
    baseStyle,
    acceptStyle,
    activeStyle,
    rejectStyle,
    thumbsContainer,
    thumb,
    thumbInner,
    img,
} from "utils/dropzone/dropzoneStyles";
import { truncateString } from "utils/generalAuxFunctions";
import { CreatePostDocument, CreatePostMutation } from "generated/graphql";
import { useMutation } from "@apollo/client";
import { useUser } from "utils/hooks/useUser";
import Spinner from "components/Layout/Spinner";
import { bindActionCreators } from "redux";
import { actionCreators } from "Redux/actions";
import { useDispatch } from "react-redux";

const PostFeedSchema = Yup.object().shape({
    body: Yup.string().required("Required"),
});

interface FormValues {
    body: string;
    files: File[] | undefined;
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
        />
    );
};

const PostFeed: NextPage = () => {
    const initialValues: FormValues = {
        body: "",
        files: undefined,
    };
    const { colorMode } = useColorMode();

    const user = useUser();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();

    const { setHasSubmittedPost } = bindActionCreators(
        actionCreators,
        dispatch
    );

    const onSetHasSubmittedPost = (hasSubmitted: boolean) => {
        setHasSubmittedPost(hasSubmitted);
    };

    const [createPost, { error }] =
        useMutation<CreatePostMutation>(CreatePostDocument);

    const handleOnDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        //console.log("files ", acceptedFiles);
    }, []);

    const handleCreatePostMutation = async (
        body: string,
        files?: File[] | undefined
    ): Promise<CreatePostMutation> => {
        const result = await createPost({
            variables: {
                options: {
                    body,
                    creator_id: user?.id,
                },
                files,
                onError: () => {
                    console.error(error);
                },
            },
        });

        if (!result.data) {
            throw new Error(error?.message);
        }
        onSetHasSubmittedPost(true);
        return result.data;
    };

    useEffect(() => {
        if (!user) return;
        //
    }, [user]);

    useEffect(() => {
        return () => {
            onSetHasSubmittedPost(false);
        };
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        fileRejections,
        isDragReject,
        acceptedFiles,
    } = useDropzone({
        onDrop: handleOnDrop,
        accept: "image/*",
        maxFiles: 10,
        maxSize: 250000,
    });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragActive, isDragReject, isDragAccept]
    );

    const content = (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
                setIsSubmitting(true);
                handleCreatePostMutation(values.body, acceptedFiles);
            }}
            validationSchema={PostFeedSchema}
        >
            {(props: FormikProps<FormValues>) => (
                <Form>
                    <Stack spacing={3}>
                        <FormControl
                            isInvalid={
                                props.touched.body && !!props.errors.body
                            }
                        >
                            <Field
                                id="_body"
                                name="body"
                                as={ChakraTextArea}
                                placeholder="Share some post with your community."
                                css={css(customPostFeedInput)}
                                onBlur={() => {
                                    if (!props.values.body.length) {
                                        props.setErrors({ body: "" });
                                    }
                                }}
                            />
                            <FormErrorMessage>
                                {props.errors.body}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <div {...getRootProps({ style: style })}>
                                <input
                                    type="file"
                                    id="_files"
                                    name="files"
                                    {...getInputProps()}
                                />
                                <p>
                                    {` Drag 'n' drop some files here, or click to
                                    select files `}
                                </p>
                            </div>
                            <Flex style={thumbsContainer}>
                                {acceptedFiles.map((file) => (
                                    <Flex
                                        key={file.name}
                                        mr={2}
                                        p={2}
                                        flexDir="column"
                                        style={thumb}
                                    >
                                        <div style={thumbInner}>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                style={img}
                                            />
                                        </div>
                                        <Text fontSize="xs">
                                            {truncateString(file.name, 5)} -{" "}
                                            {Math.round(file.size / 1024)} Kb
                                        </Text>
                                    </Flex>
                                ))}
                            </Flex>
                            <Flex flexDir="column">
                                {fileRejections.map(({ file, errors }) => (
                                    <Flex flexDir="column" key={file.name}>
                                        <Text
                                            fontSize="md"
                                            fontStyle="bold"
                                            textColor={
                                                colorMode === "dark"
                                                    ? "red.200"
                                                    : "red.500"
                                            }
                                        >{`"${file.name}"`}</Text>
                                        {errors.map((error, index) => (
                                            <Text
                                                fontSize="md"
                                                textColor={
                                                    colorMode === "dark"
                                                        ? "red.200"
                                                        : "red.500"
                                                }
                                                fontStyle="bold"
                                                key={index}
                                            >
                                                {error.message}
                                            </Text>
                                        ))}
                                    </Flex>
                                ))}
                            </Flex>
                        </FormControl>

                        <Flex justifyContent="flex-end">
                            <Button
                                type="submit"
                                disabled={
                                    props.isSubmitting || !!props.errors.body
                                }
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
    );

    return isSubmitting ? <Spinner /> : content;
};

export default PostFeed;
