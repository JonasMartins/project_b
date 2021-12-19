import type { NextPage } from "next";
import React, { ComponentProps } from "react";
import * as Yup from "yup";
import { Formik, FormikProps, Form, Field } from "formik";
import {
    Stack,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Button,
    useColorMode,
} from "@chakra-ui/react";
import { LoginDocument, LoginMutation } from "generated/graphql";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/dist/client/router";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
        .min(6, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
});

interface inputValues {
    email: string;
    password: string;
}

type InputProps = ComponentProps<typeof Input>;

const ChakraInput = (props: InputProps) => {
    return <Input {...props} borderRadius="1em" size={"sm"} variant="filled" />;
};

const LoginPage: NextPage = () => {
    const router = useRouter();
    const { colorMode } = useColorMode();
    const initialValues: inputValues = { email: "", password: "" };
    const [login, { error }] = useMutation<LoginMutation>(LoginDocument);

    const LoginMutation = async (
        email: string,
        password: string
    ): Promise<LoginMutation> => {
        const result = await login({
            variables: {
                email,
                password,
            },
            onError: () => {
                console.error(error);
            },
        });

        if (!result.data) {
            throw new Error(error?.message);
        }
        return result.data;
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={async (values, actions) => {
                const result = await LoginMutation(
                    values.email,
                    values.password
                );
                if (result.login.errors) {
                    switch (result.login.errors[0].field) {
                        case "email":
                            actions.setErrors({
                                email: "Incorrect Email",
                            });
                            break;
                        case "password":
                            actions.setErrors({
                                password: "Incorrect Password",
                            });
                            break;
                        default:
                            actions.setErrors({});
                    }
                } else {
                    router.push("/");
                }
            }}
            validationSchema={LoginSchema}
        >
            {(props: FormikProps<inputValues>) => (
                <Form>
                    <Stack spacing={3}>
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

export default LoginPage;
