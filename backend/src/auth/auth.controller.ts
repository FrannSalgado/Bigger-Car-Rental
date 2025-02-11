import { Controller, Post, Body } from '@nestjs/common';
import { CognitoService } from './cognito.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly cognitoService: CognitoService) {}

    @Post('register')
    async register(@Body() body: { username: string; password: string; email: string }) {
        return this.cognitoService.signUp(body.username, body.password, body.email);
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
