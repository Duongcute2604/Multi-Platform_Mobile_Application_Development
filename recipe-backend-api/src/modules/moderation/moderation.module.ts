import { Module } from '@nestjs/common';
import { ModerationService } from './moderation.service';

// Auto-kiểm độc tố khi gửi duyệt công thức (REC-09)
@Module({
  providers: [ModerationService],
  exports: [ModerationService],
})
export class ModerationModule {}
