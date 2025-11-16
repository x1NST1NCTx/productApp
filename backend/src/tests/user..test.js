const request = require('supertest');
const app = require('../src/app');

const pool = require('../src/config/db');

afterAll(async () => {
  await pool.end();
});


describe('User CRUD API', () => {
  let userId;

  it('should create a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'testuser@example.com', password_hash: 'hashedpassword' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  it('should get all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get user by id', async () => {
    const res = await request(app).get(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', Number(userId));
  });

  it('should update user', async () => {
    const res = await request(app)
      .patch(`/users/${userId}`)
      .send({ email: 'updateduser@example.com', password_hash: 'newhash' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should delete user', async () => {
    const res = await request(app).delete(`/users/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});