import Application from "./../src/application";
import { SuperTest, Test } from "supertest";
import { EntityManager } from "typeorm";
import supertest = require("supertest");
import {} from "mocha";
import { expect } from "chai";

let request: SuperTest<Test>;
let application: Application;
let em: EntityManager;

describe("User tests", async () => {
    before(async () => {
        application = new Application();
        await application.connect();
        await application.init();

        em = application.orm;

        request = supertest(application.app);
    });

    after(async () => {
        application.server.close();
    });

    it("Should get the users", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `query {
                getUsers(limit: ${10}, offset: ${0}) {
                    errors {
                        message
                        method
                        field
                    }
                    users {
                        id
                        name
                    }
                }
            }`,
            })
            .expect(200);

        expect(response.body.data.getUsers.users).to.be.a("array");
    });
});
