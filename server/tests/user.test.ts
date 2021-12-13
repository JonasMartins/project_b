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

    it("Should Create a Role", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `mutation {
                        createRole(
                            options: {
                                name: "TestRole"
                                   description: "TestDescription"
                                code: "00001"
                            }) {
                                role {
                                    id
                                }
                        }
                    }`,
            })
            .expect(200);

        if (response.body.data.createRole.role.id) {
            createdRoleId = response.body.data.createRole.role.id;
        }
        expect(response.body.data.createRole.role).to.be.a("object");
    });

    it("Should create a User", async () => {
        if (!createdRoleId.length) {
            expect.fail("An role id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .send({
                    query: `mutation {
                            createUser(options: {
                                name: "TestUser"
                                email: "test_user@email.com"
                                password: "password"
                                roleId: "${createdRoleId}"
                            }) {
                                user {
                                    id
                                }
                            }
                        }`,
                })
                .expect(200);

            if (response.body.data.createUser.user.id) {
                createdUserId = response.body.data.createUser.user.id;
            }
            expect(response.body.data.createUser.user).to.be.a("object");
        }
    });

    it("Should delete a User", async () => {
        if (!createdUserId.length) {
            expect.fail("An user created id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .send({
                    query: `
                        mutation {
                            deleteUser(id: "${createdUserId}")
                        }
                    `,
                })
                .expect(200);

            expect(response.body.data.deleteUser).to.be.true;
        }
    });

    it("Should delete a Role", async () => {
        if (!createdRoleId.length) {
            expect.fail("A role created id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .send({
                    query: `
                        mutation {
                            deleteRole(id: "${createdRoleId}")
                        }
                    `,
                })
                .expect(200);

            expect(response.body.data.deleteRole).to.be.true;
        }
    });
});
