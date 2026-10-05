import { IsString, IsIn, MaxLength, IsOptional, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaoBaoCaoDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @ApiProperty({ description: 'ID công thức (nếu báo cáo công thức)' })
    recipeId?: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @ApiProperty({ description: 'ID công thức tham chiếu (nếu báo cáo công thức Spoonacular)' })
    recipeReferenceId?: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @ApiProperty({ description: 'ID bình luận (nếu báo cáo bình luận)' })
    commentId?: string;

    @ApiProperty({ example: 'Nội dung vi phạm bản quyền' })
    @IsString()
    @MinLength(1, { message: 'RPT-00 Lý do báo cáo không được trống' })
    @MaxLength(500)
    lyDo!: string;
}

export class XuLyBaoCaoDto {
    @ApiProperty({ enum: ['PENDING', 'RESOLVED', 'REJECTED'], example: 'RESOLVED' })
    @IsIn(['PENDING', 'RESOLVED', 'REJECTED'], { message: 'RPT-01 Trạng thái không hợp lệ' })
    trangThai!: 'PENDING' | 'RESOLVED' | 'REJECTED';

    @ApiProperty({ example: 'Nội dung vi phạm chính sách cộng đồng', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    ghiChuAdmin?: string;
}