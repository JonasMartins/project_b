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
import { PostResolver } from "./resolvers/post.resolver";
import { CommentResolver } from "./resolvers/comment.resolver";
import { EmotionResolver } from "./resolvers/emotion.resolver";
import { ChatResolver } from "./resolvers/chat.resolver";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { graphqlUploadExpress } from "graphql-upload";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

declare module "express-session" {
    interface SessionData {
        userId: string;
        userRole: string;
    }
}

export default class Application {
    public orm: EntityManager;
    public app: express.Application;
    public server: Server;
    public httpServer: Server;
    public cookieLife: number = 1000 * 60 * 60 * 24 * 4; // four days

    public connect = async (): Promise<void> => {
        await intializeDB();
        this.orm = getManager();
    };

    public init = async (): Promise<void> => {
        this.app = express();

        const RedisStore = connectRedis(session);
        const redis = new Redis(process.env.REDIS_URL);
        var corsOptions = {
            origin: process.env.DEV_FRONT_URL,
            credentials: true, // <-- REQUIRED backend setting
        };

        this.app.use(cors(corsOptions));
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
                unset: "destroy",
            })
        );

        const schema = await buildSchema({
            resolvers: [
                UserResolver,
                RoleResolver,
                PostResolver,
                CommentResolver,
                EmotionResolver,
                ChatResolver,
            ],
            validate: false,
        });

        this.httpServer = createServer(this.app);

        const subscriptionServer = SubscriptionServer.create(
            {
                schema,
                execute,
                subscribe,
            },
            {
                server: this.httpServer,
                path: "/graphql",
            }
        );

        const apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }): Context => ({
                em: this.orm,
                req,
                res,
            }),
            introspection: true,
            plugins: [
                ApolloServerPluginLandingPageGraphQLPlayground(),

                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                subscriptionServer.close();
                            },
                        };
                    },
                },
            ],
        });

        await apolloServer.start();

        this.app.use(
            graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
        );

        // ONLY TO STORE FILES LOCALLY ON IMAGES FOLDER
        this.app.use("/images", express.static("images"));

        apolloServer.applyMiddleware({
            app: this.app,
            cors: false,
        });

        this.server = this.httpServer.listen(4001, () => {
            console.log(
                `The application is listening on port 4001! at ${process.env.ENV} mode`
            );
        });
    };
}
