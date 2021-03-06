import Application from "./../src/application";
import { SuperTest, Test } from "supertest";
import { EntityManager } from "typeorm";
import supertest = require("supertest");
import {} from "mocha";
import { expect } from "chai";

let request: SuperTest<Test>;
let application: Application;
let em: EntityManager;

describe("Post Tests", async () => {
    let Cookies: string = "";
    let userId: String = "";
    let postCreatedId: String = "";

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

    it("Should get some posts", async () => {
        if (!Cookies) {
            expect.fail("A Cookie must be set here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
                .send({
                    query: `query {
                        getPosts(limit: ${5}, offset: ${0}) {
                            errors {
                                message
                                method
                                field
                            }
                            posts {
                                id
                            }
                        }
                    }`,
                })
                .expect(200);
            expect(response.body.data.getPosts.posts).to.be.a("array");
        }
    });

    it("Should get a user for create a post", async () => {
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

    it("Should create a post", async () => {
        if (!userId.length || !Cookies) {
            expect.fail("A Cookie must be set here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
                .send({
                    query: `mutation {
                        createPost(
                            options: {
                                creator_id: "${userId}",
                                body: "new post test body"
                            }
                        ) {
                            errors {
                                message
                                method
                                field
                            }
                            post {
                                id
                            }
                        }
                    }`,
                })
                .expect(200);
            expect(response.body.data.createPost.post).to.be.a("object");

            if (response.body.data.createPost.post) {
                postCreatedId = response.body.data.createPost.post.id;
            }
        }
    });

    it("Should get a user by Id", async () => {
        if (!postCreatedId || !Cookies) {
            expect.fail("An user id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
                .send({
                    query: `query {
                        getPostById(id: "${postCreatedId}") {
                                post {
                                    id
                                }
                            }
                        }`,
                })
                .expect(200);

            expect(response.body.data.getPostById.post).to.be.a("object");
        }
    });

    it("Should delete a Post", async () => {
        if (!postCreatedId.length || !Cookies) {
            expect.fail("An user created id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
                .send({
                    query: `
                        mutation {
                            deletePost(id: "${postCreatedId}")
                        }
                    `,
                })
                .expect(200);

            expect(response.body.data.deletePost).to.be.true;
        }
    });
});
