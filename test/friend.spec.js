const app = require('../src/routes/friend')
const supertest = require('supertest');

describe('Friend', () => {
    it('/friend/all responds with 200', () => {
        let username = 'dog';
        supertest(app)
            .post('/friend/all')
            .send({"username":username})
            .expect(200);
    });
});