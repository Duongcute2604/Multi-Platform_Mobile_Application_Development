import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { TaoBinhLuanDto } from './dto/comment.dto';
import { JwtAuthGuard, OptionalJwtGuard } from '../../common/jwt-auth.guard';
import { AdminGuard } from '../../common/admin.guard';

@Controller('recipes/:recipeId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    // ===== USER ENDPOINTS =====
    @Get()
    @UseGuards(OptionalJwtGuard)
    layDanhSach(
        @Param('recipeId') recipeId: string,
        @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
        @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
        @Req() req: { user?: { id: string } },
    ) {
        const finalTrang = Math.max(page, 0);
        const safeSize = Math.min(Math.max(size, 1), 50);
        return this.commentsService.layDanhSach(recipeId, finalTrang, safeSize, req.user?.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    taoMoi(
        @Param('recipeId') recipeId: string,
        @Body() dto: TaoBinhLuanDto,
        @Req() req: { user: { id: string } },
    ) {
        return this.commentsService.taoMoi(req.user.id, recipeId, dto);
    }

    @Get(':id/replies')
    @UseGuards(OptionalJwtGuard)
    layPhanHoi(
        @Param('recipeId') recipeId: string,
        @Param('id') id: string,
        @Req() req: { user?: { id: string } },
    ) {
        return this.commentsService.layPhanHoi(recipeId, id, req.user?.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    capNhat(
        @Param('recipeId') recipeId: string,
        @Param('id') id: string,
        @Body() dto: TaoBinhLuanDto,
        @Req() req: { user: { id: string } },
    ) {
        return this.commentsService.capNhat(req.user.id, recipeId, id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    xoa(
        @Param('recipeId') recipeId: string,
        @Param('id') id: string,
        @Req() req: { user: { id: string } },
    ) {
        return this.commentsService.xoa(req.user.id, recipeId, id);
    }

    // ===== ADMIN ENDPOINTS =====
    @Get('admin/all')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async layTatCaChoAdmin(
        @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
        @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
        @Query('status') status?: string,
    ) {
        const finalTrang = Math.max(page, 0);
        const safeSize = Math.min(Math.max(size, 1), 50);
        return this.commentsService.layTatCaChoAdmin(finalTrang, safeSize, status);
    }

    @Delete('admin/:id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async xoaChoAdmin(@Param('id') id: string) {
        return this.commentsService.xoaChoAdmin(id);
    }
}
