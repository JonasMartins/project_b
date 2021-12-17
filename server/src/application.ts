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
import cookieParser from "cookie-parser";
import connectRedis from "connect-redis";
import Redis from "ioredis";

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

        const RedisStore = connectRedis(session);
        const redis = new Redis(process.env.REDIS_URL);
        this.app.set("trust proxy", 1);
        var corsOptions = {
            origin: process.env.DEV_FRONT_URL,
            credentials: true, // <-- REQUIRED backend setting
        };

        /*
        this.app.use(
            cors({
                origin: process.env.DEV_FRONT_URL,
                credentials: true,
            })
        ); */

        //this.app.use(cookieParser());
        this.app.use(
            session({
                name: process.env.COOKIE_NAME,
                store: new RedisStore({
                    client: redis,
                    disableTouch: true,
                }),
                secret: process.env.SESSION_SECRET!,
                resave: false,
                saveUninitialized: false,
            })
        );

        const schema = await buildSchema({
            resolvers: [UserResolver, RoleResolver],
            validate: false,
        });

        const apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }): Context => ({
                em: this.orm,
                req,
                res,
            }),
            introspection: true,
            plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        });

        await apolloServer.start();

        apolloServer.applyMiddleware({
            app: this.app,
            cors: corsOptions,
        });

        this.server = this.app.listen(4001, () => {
            console.log(
                `The application is listening on port 4001! at ${process.env.ENV} mode`
            );
        });
    };
}
