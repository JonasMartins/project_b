import { ApolloServer } from "apollo-server-express";
import express from "express";
import "express-async-errors";
import { Server } from "http";
import { buildSchema } from "type-graphql";
import { getManager, EntityManager } from "typeorm";
import initializeDB from "./database/index.database";
import { Container } from "typedi";
import { UserResolver } from "./resolvers/user.resolver";
import { Context } from "./context";
import cors from "cors";

export default class Application {
    public orm: EntityManager;
    public app: express.Application;
    public server: Server;

    public connect = async (): Promise<void> => {
        this.orm = getManager();
        await initializeDB();
    };

    public init = async (): Promise<void> => {
        this.app = express();

        this.app.use(
            cors({
                origin: process.env.DEV_FRONT_URL,
                credentials: true,
            })
        );

        const schema = await buildSchema({
            resolvers: [UserResolver],
            container: Container,
            emitSchemaFile: true,
        });

        const apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }): Context => ({
                em: this.orm,
                req,
                res,
            }),
            introspection: true,
        });

        apolloServer.applyMiddleware({
            app: this.app,
            cors: false,
        });

        this.server = this.app.listen(4001, () => {
            console.log("The application is listening on port 4001!");
        });
    };
}
