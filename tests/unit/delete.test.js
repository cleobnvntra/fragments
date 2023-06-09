const { Fragment } = require('../../src/model/fragment');
const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', async () => {
    const fragment = new Fragment({ ownerId: 'abcd', type: 'text/plain', size: 6 });
    await request(app).delete(`/v1/fragments/${fragment.id}`).expect(401);
  });

  test('incorrect credentials are denied', async () => {
    const fragment = new Fragment({ ownerId: 'abcd', type: 'text/plain', size: 6 });
    await request(app)
      .delete(`/v1/fragments/${fragment.id}`)
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  test('successful authenticated request to delete fragment', async () => {
    const data = 'someData';
    const createRes = await request(app)
      .post(`/v1/fragments/`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);

    const fragmentId = createRes.body.fragment.id;
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');
    expect(deleteRes.statusCode).toBe(200);

    const receiveRes = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');
    expect(receiveRes.statusCode).toBe(404);
  });

  test('authenticated user request to delete non-existent fragment id', async () => {
    const fragmentId = '1234ghjk';
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'password1');
    expect(deleteRes.statusCode).toBe(404);
  });
});
