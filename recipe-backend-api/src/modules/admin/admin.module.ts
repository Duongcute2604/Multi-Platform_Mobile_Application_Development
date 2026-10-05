import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AnalyticsService } from './analytics.service';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [AuthModule, AuditModule, NotificationsModule],
  controllers: [AdminController],
  providers: [AdminService, AnalyticsService],
})
export class AdminModule {}