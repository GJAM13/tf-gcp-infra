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

  it('should update an existing user', async () => {
    const updatedUserData = { name: 'Jane Doe', email: 'jane.doe@example.com' };
    const response = await request(app).put(`/v1/user/${userId}`).send(updatedUserData);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
  });

  afterAll(() => {
    db.query('DELETE FROM users WHERE id = ?', [userId], () => {
      db.end();
    });
  });
});
