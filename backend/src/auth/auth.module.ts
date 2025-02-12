import { Module } from '@nestjs/common';
import { CognitoService } from './cognito.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import {JwtModule} from "@nestjs/jwt";


@Module({
  imports: [ConfigModule,PassportModule, JwtModule.register({
    secret: process.env.JWT_SECRET,
  })],
  providers: [JwtStrategy, JwtAuthGuard,CognitoService],
  controllers: [AuthController],
  exports: [JwtAuthGuard,CognitoService],
})
export class AuthModule {}
