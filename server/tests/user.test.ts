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
    let userId: String = "";
    let createdUserId: String = "";
    let createdRoleId: String = "";

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

        if (response.body.data.getUsers.users.length) {
            userId = response.body.data.getUsers.users[0].id;
        }
    });

    it("Should get a user by Id", async () => {
        if (!userId) {
            expect.fail("An user id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .send({
                    query: `query {
                getUserById(id: "${userId}") {
                    user {
                        id
                        name
                    }
                }
            }`,
                })
                .expect(200);

            expect(response.body.data.getUserById.user).to.be.a("object");
        }
    });

    //it("Should Create a Role");
});
