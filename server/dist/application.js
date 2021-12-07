"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const index_database_1 = __importDefault(require("./database/index.database"));
const typedi_1 = require("typedi");
const user_resolver_1 = require("./resolvers/user.resolver");
const cors_1 = __importDefault(require("cors"));
class Application {
    constructor() {
        this.connect = () => __awaiter(this, void 0, void 0, function* () {
            this.orm = (0, typeorm_1.getManager)();
            yield (0, index_database_1.default)();
        });
        this.init = () => __awaiter(this, void 0, void 0, function* () {
            this.app = (0, express_1.default)();
            this.app.use((0, cors_1.default)({
                origin: process.env.DEV_FRONT_URL,
                credentials: true,
            }));
            const schema = yield (0, type_graphql_1.buildSchema)({
                resolvers: [user_resolver_1.UserResolver],
                container: typedi_1.Container,
                emitSchemaFile: true,
            });
            const apolloServer = new apollo_server_express_1.ApolloServer({
                schema,
                context: ({ req, res }) => ({
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
        });
    }
}
exports.default = Application;
//# sourceMappingURL=application.js.map