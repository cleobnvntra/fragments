const { Fragment } = require('../../src/model/fragment');
const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', async () => {
    const fragment = new Fragment({ ownerId: 'abcd', type: 'text/plain', size: 6 });
    await request(app).put(`/v1/fragments/${fragment.id}`).expect(401);
  });

  test('incorrect credentials are denied', async () => {
    const fragment = new Fragment({ ownerId: 'abcd', type: 'text/plain', size: 6 });
    await request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  test('successfully update a fragment', async () => {
    const data = 'someData';
    const createRes = await request(app)
      .post(`/v1/fragments/`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const fragmentId = JSON.parse(createRes.text).fragment.id;
    const receiveRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');
    expect(receiveRes.statusCode).toBe(200);
    expect(receiveRes.text).toBe(data);

    const newData = 'anotherData';
    const updateRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(newData);
    console.log(updateRes.error);
    expect(updateRes.statusCode).toBe(200);

    const receiveNewRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');
    expect(receiveNewRes.statusCode).toBe(200);
    expect(receiveNewRes.text).toBe(newData);
  });

  test('request to updated non-existent fragment id', async () => {
    const fragmentId = 'abcd1245';
    const data = 'someData';
    const updateRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(updateRes.statusCode).toBe(404);
  });

  test('request to update a fragment with a different content-type', async () => {
    const data = 'someData';
    const createRes = await request(app)
      .post(`/v1/fragments/`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const fragmentId = JSON.parse(createRes.text).fragment.id;
    const newData = 'anotherNewData';
    const updateRes = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(newData);
    expect(updateRes.statusCode).toBe(400);
  });
});
