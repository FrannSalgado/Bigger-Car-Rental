import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('emailQueue')
export class EmailProcessor {
    constructor(private readonly mailerService: MailerService) {}

    @Process('sendEmail')
    async handleSendEmail(job: Job) {
        const { email, resetToken } = job.data;

        console.log(`📧 Enviando email a ${email} con token: ${resetToken}`);

        await this.mailerService.sendMail({
            to: email,
            subject: 'Recuperación de contraseña',
            text: `Usa este código para resetear tu contraseña: ${resetToken}`,
        });

        console.log(`✅ Email enviado a ${email}`);
    }
}
