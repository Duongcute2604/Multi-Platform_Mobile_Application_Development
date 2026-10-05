import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { FavoritesService } from './favorites.service';

/**
 * Đọc số nguyên từ query; thiếu hoặc sai thì trả `macDinh`.
 *
 * Tự parse thay vì dùng `ParseIntPipe({ optional: true })`: pipe này vẫn ném
 * lỗi khi param không có, làm endpoint không truyền `limit` trả 400.
 */
function soNguoi(query: unknown, macDinh: number): number {
    const giaTri = Number(query);
    return Number.isInteger(giaTri) && giaTri > 0 ? giaTri : macDinh;
}

@ApiTags('Favorites')
@Controller()
export class FavoritesController {
    constructor(private readonly service: FavoritesService) {}

    /** BR-SOC: Danh sách công thức đã yêu thích của chính người đang đăng nhập. */
    @Get('favorites')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Danh sách công thức đã yêu thích' })
    danhSach(
        @Req() req: { user: { id: string } },
        @Query('page') page?: string,
        @Query('size') size?: string,
    ) {
        return this.service.danhSach(req.user.id, soNguoi(page, 0), soNguoi(size, 20));
    }

    /** BR-SOC: Bấm lần đầu = thích, bấy lại = bỏ thích. Trả trạng thái sau cùng. */
    @Post('recipes/:recipeId/favorite')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Yêu thích / bỏ yêu thích công thức' })
    toggle(@Req() req: { user: { id: string } }, @Param('recipeId') recipeId: string) {
        return this.service.toggle(req.user.id, recipeId);
    }

    @Delete('recipes/:recipeId/favorite')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Bỏ yêu thích công thức' })
    xoa(@Req() req: { user: { id: string } }, @Param('recipeId') recipeId: string) {
        return this.service.xoa(req.user.id, recipeId);
    }

    /** BR-REC: Công thức gợi ý tương tự — công khai, không cần token. */
    @Get('recipes/:recipeId/similar')
    @ApiOperation({ summary: 'Công thức tương tự' })
    tuongTu(@Param('recipeId') recipeId: string, @Query('limit') limit?: string) {
        return this.service.tuongTu(recipeId, soNguoi(limit, 10));
    }
}