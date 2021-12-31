import { ErrorFieldHandler } from "./errorFieldHandler";
import { FileUpload } from "graphql-upload";
import { ObjectType, Field } from "type-graphql";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline,
} from "@azure/storage-blob";

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

const getBlobName = (originalName: string) => {
    // Use a random number to generate a unique file name,
    // removing "0." from the start of the string.
    const identifier = Math.random().toString().replace(/0\./, "");
    return `${identifier}-${originalName}`;
};

const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

export const manageUploadFile = async (
    files: FileUpload[],
    field: string,
    method: string,
    callerFile: string
): Promise<FileResponse> => {
    let paths: string[] = [];
    let path: string = "";

    try {
        const sharedKeyCredential = new StorageSharedKeyCredential(
            process.env.AZURE_STORAGE_ACCOUNT_NAME!,
            process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY!
        );
        const pipeline = newPipeline(sharedKeyCredential);

        const blobServiceClient = new BlobServiceClient(
            `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
            pipeline
        );

        path = process.cwd() + `/images/${new Date().getTime()}`;

        if (!existsSync(path)) {
            mkdirSync(path);
        }

        await Promise.all(
            files.map(async (file) => {
                const { createReadStream, filename } = await file;

                return new Promise(async (resolve, reject) => {
                    createReadStream()
                        .pipe(createWriteStream(path + "/" + filename))
                        .on("finish", () => {
                            resolve(true);
                            paths.push(path + "/" + filename);
                        })
                        .on("error", () => reject(false));
                });
            })
        );
    } catch (err) {
        return {
            errors: genericError(field, method, callerFile, err.message),
        };
    }

    return { paths };
};
