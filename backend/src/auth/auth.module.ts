import { Module } from '@nestjs/common';
import { CognitoService } from './cognito.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CognitoService],
  controllers: [AuthController],
  exports: [CognitoService],
})
export class AuthModule {}
