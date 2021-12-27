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
import React, { ComponentProps, useCallback, useMemo } from "react";
import { Field, Form, Formik, FormikProps } from "formik";
import { css } from "@emotion/react";
import { customPostFeedInput } from "utils/custom/customStyles";
import { useDropzone, FileRejection } from "react-dropzone";
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

const PostFeedSchema = Yup.object().shape({
    body: Yup.string().required("Required"),
});

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
        />
    );
};

const PostFeed: NextPage = () => {
    const initialValues: FormValues = {
        body: "",
    };
    const { colorMode } = useColorMode();

    const handleOnDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            // Do something with the files
            console.log("files ", acceptedFiles);

            console.log("rejections ", fileRejections);
        },
        []
    );

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
                            <Flex flexDir="column">
                                {fileRejections.map(({ file, errors }) => (
                                    <Flex flexDir="column">
                                        <Text
                                            fontSize="sm"
                                            textColor="red.500"
                                        >{`"${file.name}"`}</Text>
                                        {errors.map((error, index) => (
                                            <Text
                                                fontSize="sm"
                                                textColor="red.500"
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
};

export default PostFeed;
