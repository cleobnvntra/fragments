// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('404 Middleware', () => {
  //if the requested route does not exist, http response status code should be 404 and must have a message
  test('request for a non-existing route', async () => {
    const response = await request(app).get('/some-route');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  })
});
