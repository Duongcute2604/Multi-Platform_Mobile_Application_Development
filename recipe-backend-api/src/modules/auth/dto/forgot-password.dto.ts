import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/** BR-AUTH: Quên mật khẩu. Chỉ cần email — không trả lỗi "không tồn tại" để chống dò email. */
export class ForgotPasswordDto {
    @ApiProperty({ example: 'demo@cookbook.vn' })
    @IsEmail({}, { message: '[AUTH-04] Email không hợp lệ' })
    email: string;
}