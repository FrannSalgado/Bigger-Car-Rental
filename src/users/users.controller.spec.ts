import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ExecutionContext,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';

class DummyUserJwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { username: 'testuser', roles: ['user'] };
    return true;
  }
}

class DummyAdminJwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { username: 'adminuser', roles: ['admin'] };
    return true;
  }
}
class DummyNonAdminJwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    req.user = { username: 'normalUser', roles: ['user'] };
    return true;
  }
}

class DummyRolesGuard {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  describe('GET /users/profile', () => {
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideGuard(JwtAuthGuard)
        .useClass(DummyUserJwtAuthGuard)
        .overrideGuard(RolesGuard)
        .useClass(DummyRolesGuard)
        .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({ transform: true, whitelist: true }),
      );
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('should return user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/profile')
        .expect(200);

      expect(response.body).toEqual({ username: 'testuser', roles: ['user'] });
    });
  });

  describe('GET /users/admin-route', () => {
    let appAdmin: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideGuard(JwtAuthGuard)
        .useClass(DummyAdminJwtAuthGuard)
        .overrideGuard(RolesGuard)
        .useClass(DummyRolesGuard)
        .compile();

      appAdmin = moduleFixture.createNestApplication();
      appAdmin.useGlobalPipes(
        new ValidationPipe({ transform: true, whitelist: true }),
      );
      await appAdmin.init();
    });

    afterAll(async () => {
      await appAdmin.close();
    });

    it('should return admin message when user is admin', async () => {
      const response = await request(appAdmin.getHttpServer())
        .get('/users/admin-route')
        .expect(200);

      expect(response.body).toEqual({
        message: 'Bienvenido, admin!',
        user: { username: 'adminuser', roles: ['admin'] },
      });
    });
  });

  describe('UsersController Admin Access (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      })
        .overrideGuard(JwtAuthGuard)
        .useClass(DummyNonAdminJwtAuthGuard)
        .compile();

      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({ transform: true, whitelist: true }),
      );
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('should forbid non-admin user from accessing admin-route', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/admin-route')
        .expect(403);

      expect(response.body.message).toContain(
        'You don`t have Permission to access this route',
      );
    });
  });
});
