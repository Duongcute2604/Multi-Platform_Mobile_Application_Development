import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DangKyTokenDto {
    @ApiProperty({ example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' })
    @IsString()
    @MinLength(1, { message: 'NOTI-00 Token thiết bị không được trống' })
    @MaxLength(255)
    token!: string;

    @ApiProperty({ example: 'android', enum: ['android', 'ios', 'web', 'unknown'], required: false })
    @IsOptional()
    @IsIn(['android', 'ios', 'web', 'unknown'], { message: 'NOTI-00 Nền tảng không hợp lệ' })
    platform?: string;
}

export class XoaTokenDto {
    @ApiProperty({ example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' })
    @IsString()
    @MinLength(1, { message: 'NOTI-00 Token thiết bị không được trống' })
    @MaxLength(255)
    token!: string;
}
