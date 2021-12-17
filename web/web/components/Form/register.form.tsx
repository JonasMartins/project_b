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
} from "@chakra-ui/react";
import { LoginDocument, LoginMutation } from "generated/graphql";
import { useMutation } from "@apollo/client";

const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
        .min(6, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
    passwordConfirmation: Yup.string().oneOf(
        [Yup.ref("password"), null],
        "Passwords must mtach"
    ),
});

interface FormValues {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

type InputProps = ComponentProps<typeof Input>;

const ChakraInput = (props: InputProps) => {
    return <Input {...props} borderRadius="1em" size={"sm"} variant="filled" />;
};

const LoginPage: NextPage = () => {
    const initialValues: FormValues = {
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
    };

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
                }
            }}
            validationSchema={RegisterSchema}
        >
            {(props: FormikProps<FormValues>) => (
                <Form>
                    <Stack spacing={3}>
                        <FormControl
                            isInvalid={
                                props.touched.name && !!props.errors.name
                            }
                        >
                            <FormLabel htmlFor="nameReg">Name</FormLabel>
                            <Field
                                id="nameReg"
                                name="nameReg"
                                as={ChakraInput}
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
                            <FormLabel htmlFor="emailReg">Email</FormLabel>
                            <Field
                                id="emailReg"
                                type="email"
                                name="emailReg"
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
                            <FormLabel htmlFor="passwordReg">
                                Password
                            </FormLabel>
                            <Field
                                id="passwordReg"
                                type="password"
                                name="password"
                                as={ChakraInput}
                            />
                            <FormErrorMessage>
                                {props.errors.password}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl
                            isInvalid={
                                props.touched.passwordConfirmation &&
                                !!props.errors.passwordConfirmation
                            }
                        >
                            <FormLabel htmlFor="passwordConformation">
                                Password Confirmation
                            </FormLabel>
                            <Field
                                id="passwordConfirmation"
                                type="password"
                                name="passwordConfirmation"
                                as={ChakraInput}
                            />
                            <FormErrorMessage>
                                {props.errors.passwordConfirmation}
                            </FormErrorMessage>
                        </FormControl>

                        <Button
                            type="submit"
                            disabled={
                                props.isSubmitting ||
                                !!props.errors.email ||
                                !!props.errors.password ||
                                !!props.errors.passwordConfirmation
                            }
                            variant="phlox-gradient"
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
