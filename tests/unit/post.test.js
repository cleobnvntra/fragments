const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments/', () => {
  test('unauthenticated requests are denied', async () => {
    await request(app).post('/v1/fragments').expect(401);
  });

  test('incorrect credentials are denied', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  test('should throw error when requesting to create a fragment with an invalid content-type', async () => {
    const data = 'someData';
    const res = await request(app)
      .post(`/v1/fragments`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'invalid/type')
      .send(data);
    console.log(res.error);
    expect(res.statusCode).toBe(415);
  });
});
