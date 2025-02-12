import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @UseGuards(JwtAuthGuard, RolesGuard)


    @Post('register')
    async registerUser(
        @Body() body: { username: string; password: string; role?: string }
    ): Promise<User> {
        const { username, password, role } = body;
        return this.usersService.createUser(username, password, role);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user', 'admin')
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin-route')
    adminRoute(@Request() req) {
        return { message: 'Bienvenido, admin!', user: req.user };
    }
}

