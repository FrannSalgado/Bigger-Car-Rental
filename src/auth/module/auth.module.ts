import { Module } from '@nestjs/common';
import { CognitoService } from '../services/cognito.service';
import { AuthController } from '../controller/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';
import { UsersModule } from '../../users/module/users.module';
import { SignUpDto } from '../dto/sign-up.dto';
import { EmailModule } from '../../email/module/email.module';
import { BullModule } from '@nestjs/bull';
import { JwtTokenService } from '../services/jwt-token.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UsersModule,
    EmailModule,
    BullModule.registerQueue({ name: 'emailQueue' }),
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    CognitoService,
    AuthService,
    SignUpDto,
    JwtTokenService,
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, CognitoService],
})
export class AuthModule {}
