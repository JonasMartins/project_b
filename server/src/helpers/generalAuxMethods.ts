import { ErrorFieldHandler } from "./errorFieldHandler";
import { FileUpload } from "graphql-upload";
import { ObjectType, Field } from "type-graphql";
import { createWriteStream, existsSync, mkdirSync } from "fs";

@ObjectType()
export class FileResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => String, { nullable: true })
    paths?: string[];
}

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

export const manageUploadFile = async (
    files: FileUpload[],
    field: string,
    method: string,
    callerFile: string
): Promise<FileResponse> => {
    let paths: string[] = [];
    let path: string = "";

    try {
        path = process.cwd() + `/images/${new Date().getTime()}`;

        if (!existsSync(path)) {
            mkdirSync(path);
        }

        await new Promise(async (resolve, reject) =>
            files.forEach((file) => {
                file.createReadStream()
                    .pipe(createWriteStream(path + "/" + file.filename))
                    .on("finish", () => {
                        resolve(true);
                        paths.push(path + "/" + file.filename);
                    })
                    .on("error", () => reject(false));
            })
        );
    } catch (err) {
        return {
            errors: genericError(field, method, callerFile, err.message),
        };
    }

    return { paths };
};
