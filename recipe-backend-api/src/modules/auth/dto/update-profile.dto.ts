import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

// Task 2.5: PATCH /auth/me — sửa hồ sơ. Ít nhất 1 field bắt buộc.
export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: '[AUTH-16] displayName phải là chuỗi' })
  @Length(2, 50, { message: '[AUTH-16] displayName phải từ 2 đến 50 ký tự' })
  displayName?: string;

  @IsOptional()
  @IsString({ message: '[AUTH-16] avatarUrl phải là chuỗi' })
  @MaxLength(500, { message: '[AUTH-16] avatarUrl tối đa 500 ký tự' })
  avatarUrl?: string;
}