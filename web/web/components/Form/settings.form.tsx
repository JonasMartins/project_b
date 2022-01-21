import type { NextPage } from "next";
import React, { ComponentProps, useMemo } from "react";
import * as Yup from "yup";
import { css } from "@emotion/react";
import { Formik, FormikProps, Form, Field } from "formik";
import { UserType } from "utils/hooks/useUser";
import {
    Stack,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Button,
    Flex,
    Text,
    useColorMode,
} from "@chakra-ui/react";
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

const SeetingsSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
        .min(6, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
});

interface SettingsProps {
    user: UserType;
}

interface inputValues {
    email: string;
    password: string;
    name: string;
    file: File[] | undefined;
}

type InputProps = ComponentProps<typeof Input>;

const ChakraInput = (props: InputProps) => {
    return <Input {...props} borderRadius="1em" size={"sm"} variant="filled" />;
};

const Settings: NextPage<SettingsProps> = ({ user }) => {
    const { colorMode } = useColorMode();

    const initialValues: inputValues = {
        email: user!.email,
        name: user!.name,
        password: truncateString(user!.password, 10),
        file: undefined,
    };

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        fileRejections,
        isDragReject,
        acceptedFiles,
    } = useDropzone({
        accept: "image/*",
        multiple: false,
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
            validationSchema={SeetingsSchema}
        >
            {(props: FormikProps<inputValues>) => (
                <Form>
                    <Stack spacing={3}>
                        <FormControl
                            isInvalid={
                                props.touched.name && !!props.errors.name
                            }
                        >
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Field
                                id="name"
                                type="name"
                                name="name"
                                as={ChakraInput}
                                css={css(customPostFeedInput)}
                            />
                            <FormErrorMessage>
                                {props.errors.name}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl
                            isInvalid={
                                props.touched.email && !!props.errors.email
                            }
                        >
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Field
                                id="email"
                                type="email"
                                name="email"
                                as={ChakraInput}
                                css={css(customPostFeedInput)}
                            />
                            <FormErrorMessage>
                                {props.errors.email}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl
                            isInvalid={
                                props.touched.password &&
                                !!props.errors.password
                            }
                        >
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Field
                                id="password"
                                type="password"
                                name="password"
                                as={ChakraInput}
                            />
                            <FormErrorMessage>
                                {props.errors.password}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="file">Picture</FormLabel>
                            <div {...getRootProps({ style: style })}>
                                <input
                                    type="file"
                                    id="_file"
                                    name="file"
                                    {...getInputProps()}
                                />
                                <p>
                                    Drag 'n' drop some file here, or click to
                                    select a file.
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
                        <Button
                            type="submit"
                            disabled={
                                props.isSubmitting ||
                                !!props.errors.email ||
                                !!props.errors.password
                            }
                            variant={`phlox-gradient-${colorMode}`}
                            color="white"
                        >
                            Submit
                        </Button>
                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default Settings;
