const app = require('../src/routes/message')
const supertest = require('supertest');

describe('Message', () => {
    it('/message/all responds with 200', () => {
        let username = 'dog';
        let userId = 2;
        supertest(app)
            .post('/message/all')
            .send({"username":username, "userId":userId})
            .expect(200);
    });
});