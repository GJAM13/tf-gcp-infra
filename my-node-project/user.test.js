const request = require('supertest');
const app = require('./app');
const db = require('./db');

describe('/v1/user endpoint', () => {
  let userId;

  it('should create a new user', async () => {
    const userData = { name: 'John Doe', email: 'john.doe@example.com' };
    const response = await request(app).post('/v1/user').send(userData);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User created successfully');
    userId = response.body.userId;
  });

  it('should validate the created user exists', async () => {
    const response = await request(app).get(`/v1/user/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(expect.objectContaining({ name: 'John Doe', email: 'john.doe@example.com' }));
  });

  it('should update an existing user', async () => {
    const updatedUserData = { name: 'Jane Doe', email: 'jane.doe@example.com' };
    const response = await request(app).put(`/v1/user/${userId}`).send(updatedUserData);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
  });

  it('should validate the updated user', async () => {
    const response = await request(app).get(`/v1/user/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.user).toEqual(expect.objectContaining({ name: 'Jane Doe', email: 'jane.doe@example.com' }));
  });

  afterAll(() => {
    db.query('DELETE FROM users WHERE id = ?', [userId], () => {
      db.end();
    });
  });
});
