const { gql } = require("apollo-server-express");
import { FileUpload } from "graphql-upload";
import * as path from "path";
import * as fs from "fs";
import { GraphQLUpload } from "graphql-upload";
export const typeDefs = gql`
    scalar Upload
    type File {
      url
    }
    type Query {
      otherFields: Boolean!
    }
    type Mutation {
      fileUpload(file: [Upload]!): [File]!
    }
 `;
const fileRenamer = (filename: string): string => {
    const queHoraEs = Date.now();
    const regex = /[\s_-]/gi;
    const fileTemp = filename.replace(regex, ".");
    let arrTemp = [fileTemp.split(".")];
    return `${arrTemp[0]
        .slice(0, arrTemp[0].length - 1)
        .join("_")}${queHoraEs}.${arrTemp[0].pop()}`;
};
export const resolvers = {
    Upload: GraphQLUpload,
    Mutation: {
        fileUpload: async (files: FileUpload[]) => {
            let url = [];
            for (let i = 0; i < files.length; i++) {
                const { createReadStream, filename, mimetype } = await files[i];
                const stream = createReadStream();
                const assetUniqName = fileRenamer(filename);
                const pathName = path.join(
                    __dirname,
                    `./upload/${assetUniqName}`
                );
                await stream.pipe(fs.createWriteStream(pathName));
                const urlForArray = `${process.env.SERVER_URL}/${assetUniqName}`;
                url.push({ url: urlForArray });
            }
            return url;
        },
    },
};
