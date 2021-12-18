import { ErrorFieldHandler } from "./errorFieldHandler";

export const genericError = (
    field: string,
    method: string,
    path: string,
    message: string
): ErrorFieldHandler[] => {
    let arrError: ErrorFieldHandler[] = [];
    let err: ErrorFieldHandler = {
        field: "",
        message: "",
        method: "",
        detailedMessage: "",
    };

    if (!field || !method) {
        err = {
            field: "-",
            message: "Must pass field, method and path, as arguments",
            detailedMessage: "Must pass field, method and path, as arguments",
            method: "-",
        };
    } else {
        err = {
            field,
            message,
            detailedMessage: message + ` Field: ( ${field} ) at, ${path}`,
            method,
        };
    }

    arrError.push(err);

    return arrError;
};

export const validateEmail = (email: string): boolean => {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
