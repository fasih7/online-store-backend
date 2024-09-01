import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, template: string, context: any) {
    await this.mailerService.sendMail({
      from: 'Software Agency <softagency@gmail.com>',
      to,
      subject,
      template,
      context,
    });
    return true;
  }
}
