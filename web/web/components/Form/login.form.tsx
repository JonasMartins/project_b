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
import { LoginDocument } from "generated/graphql";
import { useMutation } from "@apollo/client";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
        .min(6, "Too Short!")
        .max(50, "Too Long!")
        .required("Required"),
});

type InputProps = ComponentProps<typeof Input>;

// Shape of form values
interface FormValues {
    email: string;
    password: string;
}

interface OtherProps {
    message: string;
}

const ChakraInput = (props: InputProps) => {
    return <Input {...props} borderRadius="1em" size={"sm"} variant="filled" />;
};

// Aside: You may see InjectedFormikProps<OtherProps, FormValues> instead of what comes below in older code.. InjectedFormikProps was artifact of when Formik only exported a HoC. It is also less flexible as it MUST wrap all props (it passes them through).
const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
    const { touched, errors, isSubmitting, message } = props;
    return (
        <Form>
            <Stack spacing={3}>
                <Text fontSize={"md"}>{message}</Text>

                <FormControl isInvalid={touched.email && !!errors.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Field
                        id="email"
                        type="email"
                        name="email"
                        as={ChakraInput}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={touched.password && !!errors.password}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Field
                        id="password"
                        type="password"
                        name="password"
                        as={ChakraInput}
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                    type="submit"
                    disabled={
                        isSubmitting || !!errors.email || !!errors.password
                    }
                    variant="phlox-gradient"
                    color="white"
                >
                    Submit
                </Button>
            </Stack>
        </Form>
    );
};

type submit = (email: string, password: string) => void;

// The type of props MyForm receives
interface MyFormProps {
    initialEmail?: string;
    message: string; // if this passed all the way through you might do this or make a union type
    action: submit;
}

// Wrap our form with the withFormik HoC
const MyForm = withFormik<MyFormProps, FormValues>({
    // Transform outer props into form values
    mapPropsToValues: (props) => {
        return {
            email: props.initialEmail || "",
            password: "",
        };
    },

    validationSchema: LoginSchema,

    handleSubmit: (values, formikBag) => {
        console.log("values ", values);
        formikBag.props.action(values.email, values.password);
    },
})(InnerForm);

const LoginForm = () => {
    const [login, { data, loading, error }] = useMutation(LoginDocument);

    const LoginMutation = async (email: string, password: string) => {
        const result = await login({
            variables: {
                email,
                password,
            },
        });

        console.log("res ", result);
    };

    return (
        <div>
            <MyForm message="" action={LoginMutation} />
        </div>
    );
};

export default LoginForm;
