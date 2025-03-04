import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { CognitoService } from './services/cognito.service';
import { UserRepository } from '../users/repository/user.repository';
import { UsersService } from '../users/service/users.service';
import { JwtTokenService } from './services/jwt-token.service';

describe('AuthController (e2e) - Simulated Endpoints', () => {
  let app: INestApplication;

  const mockCognitoService = {
    signUp: jest.fn().mockResolvedValue({
      UserSub: 'fake-user-sub',
      UserConfirmed: false,
      $metadata: { httpStatusCode: 200 },
    }),
    signIn: jest.fn().mockResolvedValue({
      accessToken: 'fake-access-token',
    }),
    forgotPassword: jest.fn().mockResolvedValue({}),
  };

  const mockUsersRepository = {
    findByQuery: jest.fn().mockResolvedValue(null),
    saveUser: jest.fn().mockImplementation(async (user: any) => ({
      ...user,
      id: 'fake-id',
    })),
    findByUsername: jest.fn().mockResolvedValue(null),
    findByEmail: jest.fn().mockResolvedValue(null),
  };

  const mockUsersService = {
    existingUser: jest.fn().mockResolvedValue(true),
    createUser: jest.fn().mockResolvedValue({
      id: 'fake-id',
      username: 'testuser',
      email: 'testuser@example.com',
      userSub: 'fake-user-sub',
    }),
    searchByEmail: jest.fn().mockResolvedValue(null),
  };

  const mockJwtTokenService = {
    generateResetToken: jest.fn().mockReturnValue('fake-reset-token'),
  };

  const mockEmailQueue = {
    add: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    process: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CognitoService)
      .useValue(mockCognitoService)
      .overrideProvider(UserRepository)
      .useValue(mockUsersRepository)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(JwtTokenService)
      .useValue(mockJwtTokenService)
      .overrideProvider('BullQueue_emailQueue')
      .useValue(mockEmailQueue)
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('/auth/register (POST) should simulate user registration without persisting data', async () => {
    const newUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'Password123!',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(newUser)
      .expect(201);

    expect(response.body).toEqual({});

    expect(mockCognitoService.signUp).toHaveBeenCalledWith(
      newUser.username,
      newUser.email,
      newUser.password,
    );
    expect(mockUsersService.createUser).toHaveBeenCalled();
  });

  it('/auth/login (POST) should simulate user login', async () => {
    const loginData = {
      username: 'testuser',
      password: 'Password123!',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginData)
      .expect(201);

    expect(response.body).toEqual({
      accessToken: 'fake-access-token',
    });
    expect(mockCognitoService.signIn).toHaveBeenCalledWith(loginData);
  });

  it('/auth/forgot-password (POST) should return generic message when email is not found', async () => {
    mockUsersService.searchByEmail.mockResolvedValueOnce(null);

    const response = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'nonexistent@example.com' })
      .expect(201);

    expect(response.body).toEqual({
      message:
        'If the email is valid, you will receive an email with instructions.',
    });
    expect(mockJwtTokenService.generateResetToken).not.toHaveBeenCalled();
    expect(mockEmailQueue.add).not.toHaveBeenCalled();
  });

  it('/auth/forgot-password (POST) should simulate forgot password when user exists', async () => {
    mockUsersService.searchByEmail.mockResolvedValueOnce({
      email: 'existing@example.com',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'existing@example.com' })
      .expect(201);

    expect(response.body).toEqual({
      message:
        'If the email is valid, you will receive an email with instructions.',
    });
    expect(mockJwtTokenService.generateResetToken).toHaveBeenCalledWith(
      'existing@example.com',
    );
    expect(mockEmailQueue.add).toHaveBeenCalledWith('sendEmail', {
      email: 'existing@example.com',
      resetToken: 'fake-reset-token',
    });
  });
});
