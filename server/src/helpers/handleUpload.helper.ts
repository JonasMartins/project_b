import { FileUpload } from "graphql-upload";
import { ErrorFieldHandler } from "./errorFieldHandler";
import { ObjectType, Field } from "type-graphql";
import {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline,
} from "@azure/storage-blob";
import { genericError } from "./generalAuxMethods";
// const multer = require("multer");
// import intoStream from "into-stream";

@ObjectType()
class FileResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => String, { nullable: true })
    paths?: string[];
}

const containerName = "images";
const ONE_MEGABYTE = 1024 * 1024;
// const inMemoryStorage = multer.memoryStorage();
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
// const uploadStrategy = multer({ storage: inMemoryStorage }).single("image");

export class HandleUpload {
    public files: FileUpload[];
    public field: string;
    public method: string;
    public callerFile: string;

    constructor(
        files: FileUpload[],
        field: string,
        method: string,
        callerFile: string
    ) {
        this.files = files;
        this.field = field;
        this.method = method;
        this.callerFile = callerFile;
    }

    public getBlobName = (originalName: string): string => {
        // Use a random number to generate a unique file name,
        // removing "0." from the start of the string.
        const identifier = Math.random().toString().replace(/0\./, "");
        return `${identifier}-${originalName}`;
    };

    public upload = async (): Promise<FileResponse> => {
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

            path = "";
            await Promise.all(
                this.files.map(async (file) => {
                    const { createReadStream, filename } = await file;
                    const blobName = this.getBlobName(filename);
                    const containerClient =
                        blobServiceClient.getContainerClient(containerName);
                    const blockBlobClient =
                        containerClient.getBlockBlobClient(blobName);

                    try {
                        return new Promise(async (resolve, reject) => {
                            const result = await blockBlobClient.uploadStream(
                                createReadStream(),
                                uploadOptions.bufferSize,
                                uploadOptions.maxBuffers,
                                {
                                    blobHTTPHeaders: {
                                        blobContentType: "image/jpeg",
                                    },
                                }
                            );

                            if (!result.errorCode) {
                                resolve(true);
                                paths.push(blockBlobClient.url);
                            } else {
                                reject(false);
                            }
                        });
                    } catch (e) {
                        return {
                            errors: genericError(
                                this.field,
                                this.method,
                                this.callerFile,
                                e.message
                            ),
                        };
                    }
                })
            );
        } catch (err) {
            return {
                errors: genericError(
                    this.field,
                    this.method,
                    this.callerFile,
                    err.message
                ),
            };
        }

        return { paths };
    };
}
