import * as Yup from "yup";
import { withFormik, FormikProps, Form, Field } from "formik";
import {
    Button,
    Text,
    Stack,
    FormControl,
    FormErrorMessage,
    Input,
    FormLabel,
} from "@chakra-ui/react";
import { ComponentProps } from "react";

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

type InputProps = ComponentProps<typeof Input>;

interface FormValues {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

interface OtherProps {
    message: string;
}

const ChakraInput = (props: InputProps) => {
    return <Input {...props} borderRadius="1em" size={"sm"} variant="filled" />;
};

const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
    const { touched, errors, isSubmitting, message } = props;
    return (
        <Form>
            <Stack spacing={3}>
                <Text fontSize={"md"}>{message}</Text>

                <FormControl isInvalid={touched.name && !!errors.name}>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Field
                        id="nameReg"
                        type="name"
                        name="name"
                        as={ChakraInput}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={touched.email && !!errors.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Field
                        id="emailReg"
                        type="email"
                        name="email"
                        as={ChakraInput}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={touched.password && !!errors.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Field
                        id="passwordReg"
                        type="password"
                        name="password"
                        as={ChakraInput}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <FormControl
                    isInvalid={
                        touched.passwordConfirmation &&
                        !!errors.passwordConfirmation
                    }
                >
                    <FormLabel htmlFor="passwordConfirmation">
                        Password Confirmation
                    </FormLabel>
                    <Field
                        id="passwordConfirmationReg"
                        type="password"
                        name="passwordConfirmation"
                        as={ChakraInput}
                    />
                    <FormErrorMessage>
                        {errors.passwordConfirmation}
                    </FormErrorMessage>
                </FormControl>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="phlox-gradient"
                    color="white"
                >
                    Submit
                </Button>
            </Stack>
        </Form>
    );
};

interface MyFormProps {
    initialEmail?: string;
    message: string;
}

const MyForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: (props) => {
        return {
            name: "",
            email: props.initialEmail || "",
            password: "",
            passwordConfirmation: "",
        };
    },

    validationSchema: RegisterSchema,

    handleSubmit: (values) => {
        console.log("values ", values);
    },
})(InnerForm);

const RegisterForm = () => (
    <div>
        <MyForm message="" />
    </div>
);

export default RegisterForm;
