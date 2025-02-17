import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import {CognitoService} from "./cognito.service";
import {SignUpDto} from "./dto/sign-up.dto";
import {CreateUserDto} from "../users/dto/create-user.dto";


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private cognitoService : CognitoService,

    ) {}


    async register({username , email, password}: SignUpDto){
        await this.usersService.existingUser({username,email});
        const {UserSub} = await this.cognitoService.signUp(username, email, password);
        const createUserDto = new CreateUserDto();
        createUserDto.username = username;
        createUserDto.email = email;
        createUserDto.userSub = UserSub!;
        await this.usersService.createUser(createUserDto);
        return ;
    }



}
