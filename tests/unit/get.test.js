// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('GET routes', () => {
  describe('GET /v1/fragments', () => {
    // If the request is missing the Authorization header, it should be forbidden
    test('unauthenticated requests are denied', async () =>
      await request(app).get('/v1/fragments').expect(401));

    // If the wrong username/password pair are used (no such user), it should be forbidden
    test('incorrect credentials are denied', async () =>
      await request(app)
        .get('/v1/fragments')
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401));

    // Using a valid username/password pair should give a success result with a .fragments array
    test('authenticated users get a fragments array', async () => {
      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.fragments)).toBe(true);
    });
  });

  describe('GET /v1/fragments/:id', () => {
    test('unauthenticated requests are denied', async () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 6 });
      await request(app).get(`/v1/fragments/${fragment.id}`).expect(401);
    });

    test('incorrect credentials are denied', async () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 6 });
      await request(app)
        .get(`/v1/fragments/${fragment.id}`)
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401);
    });

    test('authenticated users get one fragment', async () => {
      const data = 'someData';
      const createRes = await request(app)
        .post(`/v1/fragments`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);

      const fragmentId = createRes.body.fragment.id;
      const receiveRes = await request(app)
        .get(`/v1/fragments/${fragmentId}`)
        .auth(`user1@email.com`, `password1`);
      expect(receiveRes.statusCode).toBe(200);
      expect(receiveRes.get('Content-Type')).toBe('text/plain');
      expect(parseInt(receiveRes.get('Content-Length'))).toBe(Buffer.byteLength(data));
      expect(receiveRes.text).toBe(data);
    });

    test('non-existent fragment id requested', async () => {
      const fragmentId = '1234abcd';
      const res = await request(app)
        .get(`/v1/fragments/${fragmentId}`)
        .auth(`user1@email.com`, `password1`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('GET /v1/fragments/:id/info', () => {
    test('unauthenticated requests are denied', async () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 6 });
      await request(app).get(`/v1/fragments/${fragment.id}/info`).expect(401);
    });

    test('incorrect credentials are denied', async () => {
      const fragment = new Fragment({ ownerId: '1234', type: 'text/plain', size: 6 });
      await request(app)
        .get(`/v1/fragments/${fragment.id}/info`)
        .auth('invalid@email.com', 'incorrect_password')
        .expect(401);
    });

    test('retrieve one fragment metadata by id', async () => {
      const data = 'someData';
      const createRes = await request(app)
        .post(`/v1/fragments/`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/plain')
        .send(data);

      const fragmentId = createRes.body.fragment.id;
      const receiveRes = await request(app)
        .get(`/v1/fragments/${fragmentId}/info`)
        .auth('user1@email.com', 'password1');

      const fragment = receiveRes.body.fragments;
      expect(receiveRes.statusCode).toBe(200);
      expect(receiveRes.body.status).toBe('ok');
      expect(receiveRes.body.fragments).toBeDefined();
      expect(fragment.id).toBe(fragmentId);
      expect(fragment.type).toBe(createRes.body.fragment.type);
      expect(fragment.size).toBe(createRes.body.fragment.size);
    });

    test('non-existent fragment id requested', async () => {
      const fragmentId = '1234zxcv';
      const res = await request(app)
        .get(`/v1/fragments/${fragmentId}/info`)
        .auth('user1@email.com', 'password1');

      expect(res.statusCode).toBe(404);
    });
  });
});
