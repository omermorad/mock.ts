import supertest, { Response } from 'supertest';
import { Application } from 'express';
import { Database } from 'sqlite3';
import { MockFactory } from 'mockingbird-ts';
import { Connection } from 'typeorm';
import { applicationFactory } from '../src/app';
import { User } from '../src/interface/user.interface';
import { UserEntity } from '../src/entity/user.entity';
import { connectionFactory } from '../src/common/connection-factory';

describe('Users App e2e Test', () => {
  let app: Application;
  let seededData: User[];

  beforeAll(async () => {
    new Database(':memory:');

    const connection = (await connectionFactory().catch((error) => {
      console.error('Error connection to database', error);
    })) as Connection;

    app = await applicationFactory(connection);
    seededData = MockFactory<User>(UserEntity).plain().many(3);

    await connection.getRepository(UserEntity).insert(seededData);
  });

  describe('given a user controller', () => {
    describe('when firing a request to GET /api/users', () => {
      let response: Response;

      beforeAll(async () => {
        response = await supertest(app).get('/api/users');
      });

      test('then return the exact seeded data', async () => {
        response.body.forEach((item) => (item.birthday = new Date(item.birthday)));

        expect(response.body).toEqual(seededData);
      });
    });
  });
});
