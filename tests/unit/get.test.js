// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');
const sharp = require('sharp');

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

    describe('GET /v1/fragments?expand=1', () => {
      test('request with expanded query gets the expanded metadata information', async () => {
        const data = 'someData';
        await request(app)
          .post(`/v1/fragments/`)
          .auth('user1@email.com', 'password1')
          .set('Content-Type', 'text/plain')
          .send(data);

        const receiveRes = await request(app)
          .get(`/v1/fragments?expand=1`)
          .auth(`user1@email.com`, `password1`);
        expect(receiveRes.statusCode).toBe(200);
        expect(receiveRes.body).toMatchObject({
          fragments: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              ownerId: expect.any(String),
              created: expect.any(String),
              updated: expect.any(String),
              type: expect.any(String),
              size: expect.any(Number),
            }),
          ]),
        });
        receiveRes.body.fragments.forEach((fragment) => {
          expect(Date.parse(fragment.created)).not.toBeNaN();
          expect(Date.parse(fragment.updated)).not.toBeNaN();
        });
      });
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

      const fragmentId = JSON.parse(createRes.text).fragment.id;
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

    test('create and retrieve an image/png fragment', async () => {
      //create a text image using sharp
      const img = await sharp({
        text: {
          text: 'Hello, world!',
          width: 400, // max width
          height: 300, // max height
        },
      })
        .png()
        .toBuffer();

      const createRes = await request(app)
        .post(`/v1/fragments`)
        .auth(`user1@email.com`, `password1`)
        .set(`Content-Type`, `image/png`)
        .send(img);

      const fragment = JSON.parse(createRes.body).fragment;
      const res = await request(app)
        .get(`/v1/fragments/${fragment.id}`)
        .auth(`user1@email.com`, `password1`);
      expect(res.statusCode).toBe(200);
      expect(res.type).toBe('image/png');
    });

    test('create and retrieve an image/gif fragment', async () => {
      //create a text image using sharp
      const img = await sharp({
        text: {
          text: 'Hello, world!',
          width: 400, // max width
          height: 300, // max height
        },
      })
        .gif()
        .toBuffer();

      const createRes = await request(app)
        .post(`/v1/fragments`)
        .auth(`user1@email.com`, `password1`)
        .set(`Content-Type`, `image/gif`)
        .send(img);

      const fragment = JSON.parse(createRes.body).fragment;
      const res = await request(app)
        .get(`/v1/fragments/${fragment.id}`)
        .auth(`user1@email.com`, `password1`);
      expect(res.statusCode).toBe(200);
      expect(res.type).toBe('image/gif');
    });
  });

  describe('GET /v1/fragments/:id.ext', () => {
    test('must return raw data converted from md to html', async () => {
      const mdData = '# This is a fragment';
      const htmlData = '<h1>This is a fragment</h1>\n';
      const createRes = await request(app)
        .post(`/v1/fragments/`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(mdData);

      const fragmentId = JSON.parse(createRes.text).fragment.id;
      const receiveRes = await request(app)
        .get(`/v1/fragments/${fragmentId}.html`)
        .auth('user1@email.com', 'password1');
      expect(receiveRes.get('Content-Type')).toBe('text/html; charset=utf-8');
      expect(receiveRes.status).toBe(200);
      expect(receiveRes.text).toBe(htmlData);
    });

    test('must return raw data converted from md to txt', async () => {
      const mdData = '# This is a fragment';
      const createRes = await request(app)
        .post(`/v1/fragments/`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/markdown')
        .send(mdData);

      const fragmentId = JSON.parse(createRes.text).fragment.id;
      const receiveRes = await request(app)
        .get(`/v1/fragments/${fragmentId}.txt`)
        .auth('user1@email.com', 'password1');
      expect(receiveRes.get('Content-Type')).toBe('text/plain; charset=utf-8');
      expect(receiveRes.status).toBe(200);
      expect(receiveRes.text).toBe(String('# This is a fragment'));
    });

    test('must return raw data converted from html to txt', async () => {
      const mdData = '<h3> This is a fragment </h3>';
      const createRes = await request(app)
        .post(`/v1/fragments/`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'text/html')
        .send(mdData);

      const fragmentId = JSON.parse(createRes.text).fragment.id;
      const receiveRes = await request(app)
        .get(`/v1/fragments/${fragmentId}.txt`)
        .auth('user1@email.com', 'password1');
      expect(receiveRes.get('Content-Type')).toBe('text/plain; charset=utf-8');
      expect(receiveRes.status).toBe(200);
      expect(receiveRes.text).toBe(String('<h3> This is a fragment </h3>'));
    });

    test('must return raw data converted from json to txt', async () => {
      const jsonObj = { name: 'Cleo', email: 'cjbuenaventura@myseneca.ca' };
      const createRes = await request(app)
        .post(`/v1/fragments/`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/json')
        .send(jsonObj);

      const fragmentId = createRes.body.fragment.id;
      const receiveRes = await request(app)
        .get(`/v1/fragments/${fragmentId}.txt`)
        .auth('user1@email.com', 'password1');
      expect(receiveRes.get('Content-Type')).toBe('text/plain; charset=utf-8');
      expect(receiveRes.status).toBe(200);
      expect(receiveRes.text).toBe(JSON.stringify(jsonObj));
    });

    test('must return raw data without converting if current type is the same as ext', async () => {
      const jsonObj = { name: 'Cleo', email: 'cjbuenaventura@myseneca.ca' };
      const createRes = await request(app)
        .post(`/v1/fragments/`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/json')
        .send(jsonObj);

      const fragmentId = createRes.body.fragment.id;
      const receiveRes = await request(app)
        .get(`/v1/fragments/${fragmentId}.json`)
        .auth('user1@email.com', 'password1');
      expect(receiveRes.get('Content-Type')).toBe('application/json; charset=utf-8');
      expect(receiveRes.status).toBe(200);
    });

    test('throw error if extension is invalid or not a supported conversion', async () => {
      const jsonObj = { name: 'Cleo', email: 'cjbuenaventura@myseneca.ca' };
      const createRes = await request(app)
        .post(`/v1/fragments/`)
        .auth('user1@email.com', 'password1')
        .set('Content-Type', 'application/json')
        .send(jsonObj);

      const fragmentId = createRes.body.fragment.id;
      const receiveRes1 = await request(app)
        .get(`/v1/fragments/${fragmentId}.html`)
        .auth('user1@email.com', 'password1');
      expect(receiveRes1.status).toBe(415);

      const receiveRes2 = await request(app)
        .get(`/v1/fragments/${fragmentId}.invalid-extension`)
        .auth('user1@email.com', 'password1');
      expect(receiveRes2.status).toBe(415);
    });

    test('successful conversion of a png image to jpeg', async () => {
      const img = await sharp({
        text: {
          text: 'Hello, world!',
          width: 400, // max width
          height: 300, // max height
        },
      })
        .png()
        .toBuffer();

      const createRes = await request(app)
        .post(`/v1/fragments`)
        .auth(`user1@email.com`, `password1`)
        .set(`Content-Type`, `image/png`)
        .send(img);

      const fragment = JSON.parse(createRes.body).fragment;
      const convertRes = await request(app)
        .get(`/v1/fragments/${fragment.id}.jpeg`)
        .auth(`user1@email.com`, `password1`)
        .set(`Content-Type`, `image/png`);
      expect(convertRes.status).toBe(200);
      expect(convertRes.type).toBe('image/jpeg');
    });

    test('successful conversion of a jpeg image to gif', async () => {
      const img = await sharp({
        text: {
          text: 'Hello, world!',
          width: 400, // max width
          height: 300, // max height
        },
      })
        .jpeg()
        .toBuffer();

      const createRes = await request(app)
        .post(`/v1/fragments`)
        .auth(`user1@email.com`, `password1`)
        .set(`Content-Type`, `image/jpeg`)
        .send(img);

      const fragment = JSON.parse(createRes.body).fragment;
      const convertRes = await request(app)
        .get(`/v1/fragments/${fragment.id}.gif`)
        .auth(`user1@email.com`, `password1`)
        .set(`Content-Type`, `image/jpeg`);
      expect(convertRes.status).toBe(200);
      expect(convertRes.type).toBe('image/gif');
    });

    test('Invalid conversion of image', async () => {
      const img = await sharp({
        text: {
          text: 'Hello, world!',
          width: 400, // max width
          height: 300, // max height
        },
      })
        .jpeg()
        .toBuffer();

      const createRes = await request(app)
        .post(`/v1/fragments`)
        .auth(`user1@email.com`, `password1`)
        .set(`Content-Type`, `image/jpeg`)
        .send(img);

      const fragment = JSON.parse(createRes.body).fragment;
      const convertRes = await request(app)
        .get(`/v1/fragments/${fragment.id}.invalidext`)
        .auth(`user1@email.com`, `password1`)
        .set('Content-Type', 'image/jpeg');
      expect(convertRes.status).toBe(415);
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

      const fragmentId = JSON.parse(createRes.text).fragment.id;
      const receiveRes = await request(app)
        .get(`/v1/fragments/${fragmentId}/info`)
        .auth('user1@email.com', 'password1');

      const res = JSON.parse(receiveRes.text);
      const fragment = res.fragments;

      expect(res.code).toBe(200);
      expect(res.status).toBe('ok');
      expect(res.fragments).toBeDefined();
      expect(fragment.id).toBe(fragmentId);
      expect(fragment.type).toBe('text/plain');
      expect(fragment.size).toBe(8);
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
