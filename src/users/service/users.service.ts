import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { UserRepository } from '../repository/user.repository';
import { FindByQueryDto } from '../dto/find-by-query.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async searchByUsername(username: string) {
    return this.usersRepository.findByUsername(username);
  }
  async searchByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }
  async existingUser(findByQueryDto: FindByQueryDto) {
    if (await this.usersRepository.findByQuery(findByQueryDto)) {
      throw new ConflictException('The username or email already exists');
    }
    return true;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.saveUser(createUserDto as User);
  }
}
