
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import {JwtModule} from "@nestjs/jwt";
import {UserRepository} from "./repository/user.repository";

@Module({
  imports: [TypeOrmModule.forFeature([User]),  JwtModule.register({
    secret: process.env.JWT_SECRET,
  }),],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
