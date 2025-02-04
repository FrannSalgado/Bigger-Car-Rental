import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async registerUser(
        @Body() body: { username: string; password: string; role?: string }
    ): Promise<User> {
        const { username, password, role } = body;
        return this.usersService.createUser(username, password, role);
    }
}
