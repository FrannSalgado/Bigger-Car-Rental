import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as jwksRsa from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import * as process from 'node:process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      _audience: configService.get<string>('COGNITO_CLIENT_ID'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `${configService.get<string>('AWS_COGNITO_ENDPOINT')}/${configService.get<string>('COGNITO_USER_POOL_ID')}/.well-known/jwks.json`,
      }),
      algorithms: ['RS256'],
      issuer: `${configService.get<string>('AWS_COGNITO_ENDPOINT')}/${configService.get<string>('COGNITO_USER_POOL_ID')}`,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      username: payload['cognito:username'],
      role: payload['cognito:groups'][0],
    };
  }
}
