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
    let roleId: String = "";

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

    it("Should get roles", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `query {
                    getRoles( limit: ${10}) {
                        roles {
                            id
                        }
                    }
                }`,
            })
            .expect(200);
        expect(response.body.data.getRoles.roles).to.be.an("array");

        if (response.body.data.getRoles.roles.length) {
            roleId = response.body.data.getRoles.roles[0].id;
        }
    });

    it("Should get a role by id", async () => {
        if (!roleId.length) {
            expect.fail("An role id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .send({
                    query: `query {
                        getRoleById(id: "${roleId}") {
                            role {
                                id
                            }
                        }
                    }`,
                })
                .expect(200);
            expect(response.body.data.getRoleById.role).to.be.an("object");
        }
    });
});
