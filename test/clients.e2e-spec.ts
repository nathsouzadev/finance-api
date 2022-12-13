import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ClientsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/clients;Çid (GET)', () => {
    return request(app.getHttpServer())
      .get('/clients/4e423bda-7c4b-4564-8e86-4b0e4812e7c0')
      .expect(200)
      .then(response => {
        expect(response.body).toMatchObject({
          balance: 100,
          date: expect.any(String)
        })
      })
  });
});
