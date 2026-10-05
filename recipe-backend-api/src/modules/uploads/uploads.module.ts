import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';

/**
 * Module upload ảnh.
 *
 * Chỉ có controller — không cần service vì multer tự ghi file xuống đĩa và
 * controller chỉ trả về đường dẫn tương đối.
 */
@Module({
    controllers: [UploadsController],
})
export class UploadsModule {}
