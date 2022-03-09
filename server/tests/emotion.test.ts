import Application from "./../src/application";
import { SuperTest, Test } from "supertest";
import { EntityManager } from "typeorm";
import supertest = require("supertest");
import {} from "mocha";
import { expect } from "chai";
import { EmotionType } from "../src/database/enum/emotionType.enum";

let request: SuperTest<Test>;
let application: Application;
let em: EntityManager;

describe("Emotion Tests", async () => {
    let Cookies: string = "";
    let userId: String = "";
    let postCreatedId: String = "";
    let emotionCreatedId: String = "";

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

    it("Should get a user to create a emotion", async () => {
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

    it("Should create a Emotion ", async () => {
        if (!userId.length || !Cookies) {
            expect.fail("A Cookie must be set here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
                .send({
                    query: `mutation {
                        createEmotion(userId: "${userId}", postId: "${postCreatedId}", type: ${EmotionType.ANGRY}) {
                        errors {
                            message
                            method
                            field
                        }
                        emotion {
                            id
                        }
                    }
                }`,
                })
                .expect(200);
            if (response.body.data.createEmotion.emotion) {
                emotionCreatedId = response.body.data.createEmotion.emotion.id;
            }
            expect(response.body.data.createEmotion.emotion).to.be.a("object");
        }
    });

    it("Should get a user Emotions ", async () => {
        if (!userId.length || !Cookies) {
            expect.fail("A Cookie must be set here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
                .send({
                    query: `query {
                    getEmotionsFromUser(userId: "${userId}") {
                        errors {
                            message
                            method
                            field
                        }
                        emotions {
                            id
                        }
                    }
                }`,
                })
                .expect(200);

            expect(response.body.data.getEmotionsFromUser.emotions).to.be.an(
                "array"
            );
        }
    });

    it("Should update a Emotion ", async () => {
        if (!emotionCreatedId.length || !Cookies) {
            expect.fail("A Cookie must be set here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
                .send({
                    query: `mutation {
                        updateEmotion(emotionId: "${emotionCreatedId}", newType: ${EmotionType.FIRE}) {
                        errors {
                            message
                            method
                            field
                        }
                        emotion {
                            id
                        }
                    }
                }`,
                })
                .expect(200);
            expect(response.body.data.updateEmotion.emotion).to.be.an("object");
        }
    });

    it("Should delete a Emotion", async () => {
        if (!emotionCreatedId.length || !Cookies) {
            expect.fail("An user created id must be filled here");
        } else {
            const response = await request
                .post("/graphql")
                .set("Cookie", [Cookies])
                .send({
                    query: `
                        mutation {
                            deleteEmotion(emotionId: "${emotionCreatedId}") {
                                errors {
                                    message
                                }
                                deleted
                            }
                        }
                    `,
                })
                .expect(200);

            expect(response.body.data.deleteEmotion.deleted).to.be.true;
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
