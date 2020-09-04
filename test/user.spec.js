const app = require('../src/routes/user')
const supertest = require('supertest');

describe('User', () => {
    it('/user responds with 200', () => {
        let username = 'dog';
        let userId = 2;
        supertest(app)
            .post('/user')
            .send({"username":username, "userId":userId})
            .expect(200);
    });
});