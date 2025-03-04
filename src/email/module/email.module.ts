import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailProcessor } from '../processor/email.processor';
import { EmailService } from '../service/email.service';
import * as nodemailer from 'nodemailer';

async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  return {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  };
}

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emailQueue',
    }),
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: await createTestAccount(),
      }),
    }),
  ],
  providers: [EmailProcessor, EmailService],
  exports: [EmailService],
})
export class EmailModule {}
