import { ConfigService } from '@nestjs/config';

export const jwtConstants = {
    secret: new ConfigService().get<string>('JWT_SECRET'),
    expiresIn: new ConfigService().get<string>('JWT_EXPIRATION'),
};
