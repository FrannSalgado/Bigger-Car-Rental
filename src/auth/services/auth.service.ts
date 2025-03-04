import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { CognitoService } from './cognito.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private cognitoService: CognitoService,
    private jwtTokenService: JwtTokenService,
    @InjectQueue('emailQueue') private readonly emailQueue: Queue,
  ) {}

  async register({ username, email, password }: SignUpDto) {
    await this.usersService.existingUser({ username, email });
    const { UserSub } = await this.cognitoService.signUp(
      username,
      email,
      password,
    );
    const createUserDto = new CreateUserDto();
    createUserDto.username = username;
    createUserDto.email = email;
    createUserDto.userSub = UserSub!;
    await this.usersService.createUser(createUserDto);
    return;
  }

  async signIn({ username, password }: SignInDto) {
    return await this.cognitoService.signIn({ username, password });
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.searchByEmail(email);
    if (!user) {
      return {
        message:
          'If the email is valid, you will receive an email with instructions.',
      };
    }
    const resetToken = this.jwtTokenService.generateResetToken(user.email);
    await this.emailQueue.add('sendEmail', { email, resetToken });
    return {
      message:
        'If the email is valid, you will receive an email with instructions.',
    };
  }
}
