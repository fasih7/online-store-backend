import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './notifications.controller';
import { EmailService } from './services/email.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService],
  exports: [EmailService],
})
export class NotificationsModule {}
