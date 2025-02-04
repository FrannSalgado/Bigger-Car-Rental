import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async findByUsername(username: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { username } });
    }

    async createUser(username: string, password: string, role = 'user'): Promise<User> {
        // Encriptar la clave
        const hashedPassword = await bcrypt.hash(password, 10);


        const user = this.usersRepository.create({ username, password: hashedPassword, role });
        return this.usersRepository.save(user);
    }
}
