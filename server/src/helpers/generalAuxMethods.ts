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
    };

    if (!field || !method) {
        err = {
            field: "-",
            message: "Must pass field, method and path, as arguments",
            method: "-",
        };
    } else {
        err = {
            field,
            message: message + ` Field: ( ${field} ) at, ${path}`,
            method,
        };
    }

    arrError.push(err);

    return arrError;
};
