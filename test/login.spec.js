const app = require('../src/routes/login')
const supertest = require('supertest');

describe('Login', () => {
    it('/login responds with 200', () => {
        let username = 'dog';
        let password = 'd';
        supertest(app)
            .post('/friend/all')
            .send({"username":username, "password":password})
            .expect(200);
    });
});