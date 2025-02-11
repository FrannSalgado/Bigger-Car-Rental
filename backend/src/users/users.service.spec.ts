import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const userDto = { username: 'testuser', password: 'password123', role: 'user' };
    mockUserRepository.create.mockReturnValue(userDto);
    mockUserRepository.save.mockResolvedValue(userDto);

    const result = await service.createUser(userDto.username, userDto.password, userDto.role);
    expect(result.username).toEqual(userDto.username);
    expect(result.role).toEqual(userDto.role);
    expect(mockUserRepository.create).toHaveBeenCalledWith({ username: userDto.username, password: expect.any(String), role: userDto.role });
    expect(mockUserRepository.save).toHaveBeenCalled();
  });

  it ('should find username', async()=>{
    const mockUser = { id: 1, username: 'testSearchUser', password: 'hashedpassword', role: 'user' };
    mockUserRepository.findOne.mockResolvedValue(mockUser);
    const result = await service.findByUsername('testSearchUser');
    expect(result).toEqual(mockUser);
  } )
});
