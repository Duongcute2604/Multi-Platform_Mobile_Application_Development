import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ValidationArguments } from 'class-validator';
import { RecipeStatus } from '@prisma/client';

// Task 2.3: chặn maxCookTime < minCookTime (chỉ kiểm khi cả hai có mặt)
@ValidatorConstraint({ name: 'maxGteMin', async: false })
export class MaxGteMinConstraint implements ValidatorConstraintInterface {
  validate(value: number, validationArguments?: ValidationArguments) {
    const min = (validationArguments?.object as RecipeQueryDto | undefined)?.minCookTime;
    if (min === undefined) return true;
    return value >= min;
  }
  defaultMessage() {
    return '[REC-05] maxCookTime phải lớn hơn hoặc bằng minCookTime';
  }
}

export class RecipeQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  size: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(RecipeStatus, { message: '[REC-05] Trạng thái không hợp lệ' })
  status?: RecipeStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  tagNames?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'title', 'updatedAt', 'rating', 'popular'], { message: '[REC-05] Trường sort không hợp lệ' })
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], { message: '[REC-05] Hướng sort chỉ asc/desc' })
  sortDirection: 'asc' | 'desc' = 'desc';

  // Task 2.3: lọc theo thời gian nấu (phút) và khẩu phần (server-side)
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '[REC-05] minCookTime phải là số nguyên' })
  @Min(0, { message: '[REC-05] minCookTime không được âm' })
  minCookTime?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '[REC-05] maxCookTime phải là số nguyên' })
  @Min(0, { message: '[REC-05] maxCookTime không được âm' })
  @Validate(MaxGteMinConstraint)
  maxCookTime?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '[REC-05] servings phải là số nguyên' })
  @Min(1, { message: '[REC-05] servings phải từ 1 trở lên' })
  servings?: number;
}