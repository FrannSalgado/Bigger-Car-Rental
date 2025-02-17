import {Controller, Post, Body} from '@nestjs/common';

import {AuthService} from "./auth.service";
import {SignUpDto} from "./dto/sign-up.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() createSignUpDto: SignUpDto) {
        return this.authService.register(createSignUpDto);
    }


}
