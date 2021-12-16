import { ApolloServer } from "apollo-server-express";
import express from "express";
import "express-async-errors";
import { Server } from "http";
import { buildSchema } from "type-graphql";
import { getManager, EntityManager } from "typeorm";
import { intializeDB } from "./database/index.database";
import { UserResolver } from "./resolvers/user.resolver";
import { Context } from "./context";
import cors from "cors";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { RoleResolver } from "./resolvers/role.resolver";
import session from "express-session";
import { env } from "process";

export default class Application {
    public orm: EntityManager;
    public app: express.Application;
    public server: Server;
    public cookieLife: number = 1000 * 60 * 60 * 24 * 4; // four days

    public connect = async (): Promise<void> => {
        await intializeDB();
        this.orm = getManager();
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
            resolvers: [UserResolver, RoleResolver],
            validate: false,
        });

        this.app.use(
            session({
                name: process.env.COOKIE_NAME,
                secret: process.env.SESSION_SECRET!,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    httpOnly: false,
                    secure: true,
                    maxAge: this.cookieLife,
                },
            })
        );

        const apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }): Context => ({
                em: this.orm,
                req,
                res,
            }),
            introspection: true,
            plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
        });

        await apolloServer.start();

        /*
        this.app.get("/graphql", (req, res) => {
            res.cookie("name", "TechBlog", { maxAge: this.cookieLife }).send(
                "Cookie-Parser"
            );

            console.log("> ", req.cookies);
        });*/

        apolloServer.applyMiddleware({
            app: this.app,
            cors: false,
        });

        this.server = this.app.listen(4001, () => {
            console.log(
                `The application is listening on port 4001! at ${process.env.ENV} mode`
            );
        });
    };
}
