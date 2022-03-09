import Application from "./../src/application";
import { SuperTest, Test } from "supertest";
import { EntityManager } from "typeorm";
import supertest = require("supertest");
import {} from "mocha";
import { expect } from "chai";

let request: SuperTest<Test>;
let application: Application;
let em: EntityManager;
let Cookies: string = "";

describe("Role tests", async () => {
    let roleId: String = "";

    before(async () => {
        application = new Application();
        await application.connect();
        await application.init();
        em = application.orm;
        request = supertest(application.app);
    });

    after(async () => {
        await request
            .post("/graphql")
            .send({
                query: `mutation {
                            logout
                        }`,
            })
            .expect(200);
        application.server.close();
    });

    it("Should login the admin user to test Roles", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `mutation {
                    login(email: "admin@email.com", password: "${process.env.ADMIN_PASS}") {
                        errors {
                            message
                            method
                            field
                        }
                        token
                    }
                }`,
            })
            .expect(200);

        Cookies = response.headers["set-cookie"].pop().split(";")[0];

        expect(response.body.data.login.token).to.be.a("string");
    });

    it("Should get roles", async () => {
        if (!Cookies) {
            expect.fail("A Cookie must be set here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
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
        }
    });

    it("Should get a role by id", async () => {
        if (!roleId.length || !Cookies) {
            expect.fail("An role id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
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
