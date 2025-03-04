import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateResetToken(email: string): string {
    return this.jwtService.sign(
      { email },
      { secret: process.env.JWT_SECRET, expiresIn: '15m' },
    );
  }
}
