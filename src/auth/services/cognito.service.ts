import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ForgotPasswordCommand,
  AdminAddUserToGroupCommand,
  AdminConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class CognitoService {
  private client: CognitoIdentityProviderClient;
  private userPoolId: string;
  private clientId: string;

  constructor(private configService: ConfigService) {
    this.userPoolId =
      this.configService.get<string>('COGNITO_USER_POOL_ID') ??
      (() => {
        throw new Error('COGNITO_USER_POOL_ID not defined .env');
      })();

    this.clientId =
      this.configService.get<string>('COGNITO_CLIENT_ID') ??
      (() => {
        throw new Error('COGNITO_CLIENT_ID not defined .env');
      })();

    this.client = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION') ?? 'us-east-1',
      endpoint: this.configService.get<string>('AWS_COGNITO_ENDPOINT'),
    });
  }

  async signUp(username: string, password: string, email: string) {
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
      ],
    });

    try {
      const response = await this.client.send(command);
      const confirmCommand = new AdminConfirmSignUpCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });
      await this.client.send(confirmCommand);
      const addToGroupCommand = new AdminAddUserToGroupCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        GroupName: 'user',
      });
      await this.client.send(addToGroupCommand);

      return response;
    } catch (error) {
      throw new NotFoundException(`Register Error: ${error.message}`);
    }
  }

  async signIn({ username, password }: SignInDto) {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,

      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    });

    try {
      const response = await this.client.send(command);
      return { accessToken: response.AuthenticationResult?.AccessToken };
    } catch (error) {
      throw new Error(`SingIn Error: ${error.message}`);
    }
  }

  async forgotPassword(username: string) {
    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      Username: username,
    });

    try {
      return await this.client.send(command);
    } catch (error) {
      throw new Error(`Error to Recover Password: ${error.message}`);
    }
  }
}
