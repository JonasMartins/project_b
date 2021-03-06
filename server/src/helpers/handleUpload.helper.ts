import { FileUpload } from "graphql-upload";
import { ErrorFieldHandler } from "./errorFieldHandler";
import { ObjectType, Field } from "type-graphql";
import {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline,
    BlobClient,
} from "@azure/storage-blob";
import { genericError } from "./generalAuxMethods";
import { createWriteStream } from "fs";

@ObjectType()
class FileResponse {
    @Field(() => [ErrorFieldHandler], { nullable: true })
    errors?: ErrorFieldHandler[];

    @Field(() => String, { nullable: true })
    paths?: string[];
}

const containerName = "images";
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

export class HandleUpload {
    public files: FileUpload[] | null | undefined;
    public field: string;
    public method: string;
    public callerFile: string;

    private sharedKeyCredential = new StorageSharedKeyCredential(
        process.env.AZURE_STORAGE_ACCOUNT_NAME!,
        process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY!
    );
    private pipeline = newPipeline(this.sharedKeyCredential);

    private blobServiceClient = new BlobServiceClient(
        `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
        this.pipeline
    );

    constructor(
        files: FileUpload[] | null,
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
        let success: boolean = false;
        let paths: string[] = [];
        let path: string = "";

        if (!this.files) {
            return {
                errors: genericError(
                    this.field,
                    this.method,
                    this.callerFile,
                    "Files required to this method."
                ),
            };
        }

        try {
            await Promise.all(
                this.files.map(async (file) => {
                    const { createReadStream, filename } = await file;
                    const blobName = this.getBlobName(filename);
                    path = process.cwd() + "/images";

                    try {
                        return new Promise(async (resolve, reject) => {
                            createReadStream()
                                .pipe(createWriteStream(path + "/" + blobName))
                                .on("finish", () => {
                                    paths.push(path + "/" + blobName);
                                    resolve(true);
                                })
                                .on("error", () => reject(false));
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

    public getImages = async (urls: string[]): Promise<BlobClient[]> => {
        let blobsArray: BlobClient[] = [];
        const containerClient =
            this.blobServiceClient.getContainerClient(containerName);

        if (urls.length) {
            urls.forEach(async (url) => {
                try {
                    blobsArray.push(await containerClient.getBlobClient(url));
                } catch (err) {
                    console.log("Error ", err);
                }
            });
        }
        return blobsArray;
    };
}
