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
} from "@chakra-ui/react";
import React, { ComponentProps } from "react";
import { Field, Form, Formik, FormikProps } from "formik";
import { css } from "@emotion/react";
import { customPostFeedInput } from "utils/custom/customStyles";

const PostFeedSchema = Yup.object().shape({
    body: Yup.string().required("Required"),
});

interface FormValues {
    body: string;
}

type InputProps = ComponentProps<typeof Textarea>;

const ChakraTextArea = (props: InputProps) => {
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
