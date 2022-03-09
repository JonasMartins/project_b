import Application from "./../src/application";
import { SuperTest, Test } from "supertest";
import { EntityManager } from "typeorm";
import supertest = require("supertest");
import {} from "mocha";
import { expect } from "chai";
import { User } from "../src/database/entity/user.entity";

let request: SuperTest<Test>;
let application: Application;
let em: EntityManager;

describe("User tests", async () => {
    let userId: String = "";
    let createdUserId: String = "";
    let createdRoleId: String = "";
    let createdUser: User = null;
    let Cookies: string = "";

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

    it("Should login the admin user", async () => {
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

    it("Should get the users", async () => {
        if (!Cookies) {
            expect.fail("A Cookie must be set here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
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
        }
    });

    it("Should get a user by Id", async () => {
        if (!userId || !Cookies) {
            expect.fail("An user id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
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
        if (!Cookies) {
            expect.fail("A Cookie must be set here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
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
        }
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

    /*
    it("Should update user settings", async () => {
        if (!createdUserId.length) {
            expect.fail("An user created id must be filled here");
        } else {
            const response = await request.post("/graphql").send({
                query: `
                `,
            });
        }
    }); */

    it("Should delete a User", async () => {
        if (!createdUserId.length || !Cookies) {
            expect.fail("An user created id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
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
        if (!createdRoleId.length || !Cookies) {
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
