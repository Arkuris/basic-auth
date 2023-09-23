'use strict';

// don't rely on the signup test to work, in order to pass the sign in test
// beforeAll(); // sync db here
// beforeEach(); // create any records required for tests to pass.
// afterEach(); // drop tables / delete records for records that get created between tests
// afterAll(); //drop the tables in the DB

const { app } = require('./src/server.js'); 
const supertest = require('supertest');
const request = supertest(app);

describe('Testing our auth server', () => {
  let userInfo = {
    username: 'testuser',
    password: 'testpass',
  };

  test('User should be able to create an account', async () => {
    const response = await request.post('/signup').send(userInfo);
    expect(response.status).toBe(201);
    expect(response.body.username).toBe(userInfo.username);
    expect(response.body.password).toBeUndefined();
  });

  test('User should be able to login to an existing account', async () => {
    const response = await request.post('/signin')
      .auth(userInfo.username, userInfo.password);

    expect(response.status).toBe(200); 
    expect(response.body.username).toBe(userInfo.username);
    expect(response.body.password).toBeUndefined();
  });
});

describe('Middleware Authentication', () => {
  test('It should send error for a missing auth header', async () => {
    const response = await request.post('/signin');
    expect(response.status).toBe(403);
  });

  test('It should send error for wrong user credentials', async () => {
    const response = await request.post('/signin')
      .auth('wronguser', 'wrongpass');
    expect(response.status).toBe(403);
  });
});