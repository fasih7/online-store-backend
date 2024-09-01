import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { EmailService } from './services/email.service';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private emailService: EmailService,
  ) {}

  // @Get('send-email')
  // async sendEmail() {
  //   try {
  //     await this.emailService.sendMail(
  //       'kahloon17@gmail.com',
  //       'Test Email',
  //       'test',
  //       { message: 'Hello, this is a test email!' },
  //     );
  //     // await this.emailService.sendMail();

  //     return { success: true, message: 'Email sent successfully' };
  //   } catch (error) {
  //     return { success: false, message: 'Failed to send email', error };
  //   }
  // }
}
