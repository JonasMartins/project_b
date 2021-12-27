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
    Input,
    Text,
    FormLabel,
    Box,
} from "@chakra-ui/react";
import React, { ComponentProps, useCallback, useMemo } from "react";
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
//import { AiOutlineFileImage } from "react-icons/ai";
import { truncateString } from "utils/generalAuxFunctions";

const PostFeedSchema = Yup.object().shape({
    body: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
});

interface FormValues {
    body: string;
    title: string;
}

type TextAreaProps = ComponentProps<typeof Textarea>;
type InputProps = ComponentProps<typeof Input>;

const ChakraInput = (props: InputProps) => {
    return <Input {...props} borderRadius="1em" size={"sm"} variant="filled" />;
};

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
        title: "",
    };
    const { colorMode } = useColorMode();

    const handleOnDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        console.log("files ", acceptedFiles);
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles,
    } = useDropzone({
        onDrop: handleOnDrop,
        accept: "image/*",
        maxFiles: 10,
        maxSize: 25000,
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

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
                console.log(values);
            }}
            validationSchema={PostFeedSchema}
        >
            {(props: FormikProps<FormValues>) => (
                <Form>
                    <Stack spacing={3}>
                        <FormControl
                            isInvalid={
                                props.touched.title && !!props.errors.title
                            }
                        >
                            <FormLabel htmlFor="title">Title</FormLabel>
                            <Field id="_title" name="title" as={ChakraInput} />
                            <FormErrorMessage>
                                {props.errors.title}
                            </FormErrorMessage>
                        </FormControl>
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
                                <input {...getInputProps()} />
                                <p>
                                    Drag 'n' drop some files here, or click to
                                    select files
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
};

export default PostFeed;
