import {Controller, Post, Body} from '@nestjs/common';

import {AuthService} from "./auth.service";
import {SignUpDto} from "./dto/sign-up.dto";
import {SignInDto} from "./dto/sign-in.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createSignUpDto: SignUpDto) {
        return this.authService.register(createSignUpDto);
    }

    @Post('login')
    async login(@Body() createSignInDto :SignInDto) {
        return this.authService.signIn( createSignInDto);
    }

}
