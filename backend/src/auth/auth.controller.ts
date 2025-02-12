import {Controller, Post, Body, UseGuards, Get, Request} from '@nestjs/common';
import { CognitoService } from './cognito.service';
import {JwtAuthGuard} from "./jwt-auth.guard";
import {RolesGuard} from "./roles.guard";
import {Roles} from "./roles.decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly cognitoService: CognitoService) {}

    @Post('register')
    async register(@Body() body: { username: string; password: string; email: string, role: string }) {
        return this.cognitoService.signUp(body.username, body.password, body.email, body.role);
    }

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        return this.cognitoService.signIn(body.username, body.password);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() body: { username: string }) {
        return this.cognitoService.forgotPassword(body.username);
    }


}
