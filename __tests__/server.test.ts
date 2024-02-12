import supertest from 'supertest';
import { server } from '../src';

const user = {
  username: 'Andrei',
  age: 28,
  hobbies: ['Music', 'Travel'],
};

const updatedUser = {
  username: 'Andrei Bike',
  age: 30,
  hobbies: ['Bike Ride'],
};

const request = supertest.agent(server);

describe('Scenario 1: testing CRUD operations on user data', () => {
  afterAll(() => {
    server.close();
  });

  test('should get empty array', async () => {
    const res = await request.get('/api/users');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  test('should create new user', async () => {
    const res = await request.post('/api/users').send(user);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ...user, id: res.body.id });
  });

  test('should get user by id', async () => {
    const postRes = await request.post('/api/users').send(user);
    const getRes = await request.get(`/api/users/${postRes.body.id}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual({ ...user, id: postRes.body.id });
  });

  test('should update user', async () => {
    const postRes = await request.post('/api/users').send(user);
    const putRes = await request
      .put(`/api/users/${postRes.body.id}`)
      .send(updatedUser);

    expect(putRes.status).toBe(200);
    expect(putRes.body).toEqual({ ...updatedUser, id: postRes.body.id });
  });

  test('should delete user by id', async () => {
    const postRes = await request.post('/api/users').send(user);
    const { id } = postRes.body;

    const deleteRes = await request.delete(`/api/users/${id}`);

    expect(deleteRes.status).toBe(204);
  });

  test('should get deleted user', async () => {
    const postRes = await request.post('/api/users').send(user);
    const { id } = postRes.body;

    await request.delete(`/api/users/${id}`);
    const getRes = await request.get(`/api/users/${id}`);

    expect(getRes.status).toBe(404);
    expect(getRes.body).toEqual({ message: 'User not found' });
  });
});

describe('Scenario 2: error handling with status code 400', () => {
  test('should return error when creating user with missing fields', async () => {
    const incompleteUser = { age: 30, hobbies: ['Coding'] };

    const res = await request.post('/api/users').send(incompleteUser);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Missing required fields' });
  });

  test('should return error when updating user with invalid ID', async () => {
    const invalidUserId = 'id';
    const res = await request
      .put(`/api/users/${invalidUserId}`)
      .send({ username: 'John' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Incorrect user id' });
  });

  test('should return error when retrieving user with invalid ID', async () => {
    const invalidUserId = 'id';
    const res = await request.get(`/api/users/${invalidUserId}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Incorrect user id' });
  });

  test('should return error when removing user with invalid ID', async () => {
    const invalidUserId = 'id';
    const res = await request.delete(`/api/users/${invalidUserId}`);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Incorrect user id' });
  });
});

describe('Scenario 3: error handling with status code 404', () => {
  const nonExistentUserId = '88e0b391-3efe-42de-8539-43d4fb75a8b4';

  test('should return error when retrieving non-existent user', async () => {
    const res = await request.get(`/api/users/${nonExistentUserId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  test('should return error when updating non-existent user', async () => {
    const res = await request
      .put(`/api/users/${nonExistentUserId}`)
      .send({ username: 'John' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  test('should return error when deleting non-existent user', async () => {
    const res = await request.delete(`/api/users/${nonExistentUserId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  test('should return 404 for non-existing endpoint', async () => {
    const nonExistingEndpoint = '/api/non-existing-endpoint';
    const res = await request.get(nonExistingEndpoint);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: `API not found at ${nonExistingEndpoint}` });
  });
});
