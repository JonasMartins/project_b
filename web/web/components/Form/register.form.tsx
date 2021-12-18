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
import { CreateUserDocument, CreateUserMutation } from "generated/graphql";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/dist/client/router";

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

    const router = useRouter();

    const [createUser, { error }] =
        useMutation<CreateUserMutation>(CreateUserDocument);

    const RegisterMutation = async (
        email: string,
        password: string
    ): Promise<CreateUserMutation> => {
        const result = await createUser({
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
                const result = await RegisterMutation(
                    values.email,
                    values.password
                );
                if (result.createUser.errors) {
                    switch (result.createUser.errors[0].field) {
                        case "email":
                            actions.setErrors({
                                email: result.createUser.errors[0].message,
                            });
                            break;
                        case "password":
                            actions.setErrors({
                                password: result.createUser.errors[0].message,
                            });
                            break;
                        default:
                            actions.setErrors({});
                    }
                } else {
                    router.push("/");
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
