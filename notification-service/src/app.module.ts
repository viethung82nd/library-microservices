import { Module } from '@nestjs/common';
import { NotificationController } from './notification/notification.controller';
import { EmailService } from './email/email.service';
import { NotificationService } from './notification/notification.service';

@Module({
  controllers: [NotificationController],
  providers: [EmailService, NotificationService],
})
export class AppModule {}
