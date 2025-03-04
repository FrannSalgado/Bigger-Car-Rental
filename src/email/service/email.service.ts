import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('emailQueue') private readonly emailQueue: Queue) {}

  async sendForgotPasswordEmail(email: string, resetToken: string) {
    await this.emailQueue.add('sendEmail', { email, resetToken });
  }
}
