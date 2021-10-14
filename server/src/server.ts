import express, { Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

//express initialization
const app = express();

//PORT
const PORT = 4000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});
/*
const apolloServer = new ApolloServer({
    schema : await buildSchema({})
}); */

//localhost setup
app.listen(4000, () => {
  console.log("Graphql server now up at port 4000");
});
