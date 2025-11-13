const request = require('supertest');
const app = require('../src/app');

const pool = require('../src/config/db');

afterAll(async () => {
  await pool.end();
});


describe('Category CRUD API', () => {
  let categoryId;

  it('should create a category', async () => {
    const res = await request(app)
      .post('/categories')
      .send({ name: 'Test Category' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    categoryId = res.body.id;
  });

  it('should get all categories', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get category by id', async () => {
    const res = await request(app).get(`/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', Number(categoryId));
  });

  it('should update category', async () => {
    const res = await request(app)
      .patch(`/categories/${categoryId}`)
      .send({ name: 'Updated Category' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should delete category', async () => {
    const res = await request(app).delete(`/categories/${categoryId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});