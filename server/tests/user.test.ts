import Application from "./../src/application"
import { SuperTest, Test } from 'supertest'
import { EntityManager } from "typeorm";
import supertest = require("supertest")
import {} from "mocha"
import { expect } from 'chai';

let request: SuperTest<Test>;
let application: Application;
let em: EntityManager;

describe('User tests', async () => {
    before(async () => {
        application = new Application();
        await application.connect()
        await application.init();
        
        em = application.orm

        request = supertest(application.app)
    })

    after( async () => {
        application.server.close()
    })


})