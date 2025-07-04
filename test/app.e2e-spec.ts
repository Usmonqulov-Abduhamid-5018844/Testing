import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import * as request from 'supertest';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const modelFix: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modelFix.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
  });

  afterEach(async () => {
    await dataSource.query('DELETE FROM "users"');
  });

  afterAll(async () => {
    await app.close();
  });

  // CREATE USER
  it('/users (POST) craetes a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Ali' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Ali');
  });

  // GET ALL USERS
  it('/users (GET) get all users', async () => {
    await request(app.getHttpServer()).post('/users').send({ name: 'Ali' });
    const res = await request(app.getHttpServer()).get('/users').expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Ali');
  });

  // GET USER BY ID
  it('/users/:id (GET) get user by id', async () => {
    const user = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Ali' });

    const id = user.body.id;
    const res = await request(app.getHttpServer())
      .get(`/users/${id}`)
      .expect(200);

    expect(res.body.name).toBe('Ali');
  });

  // UPDATE USER BY ID
  it('/users/:id (PATCH) update user by id', async () => {
    const user = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Ali' });

    const id = user.body.id;
    const updated = await request(app.getHttpServer())
      .patch(`/users/${id}`)
      .send({ name: 'Vali' })
      .expect(200);

    expect(updated.body.name).toBe('Vali');
  });

  // DELETE USER BY ID
  it('/users/:id (DELETE) delete user by id ', async () => {
    const user = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Ali' });

    const id = user.body.id;
    await request(app.getHttpServer()).delete(`/users/${id}`).expect(200);
    await request(app.getHttpServer()).get(`/users/${id}`).expect(404);
  });
});
