import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { TaoBaoCaoDto, XuLyBaoCaoDto } from './dto/report.dto';
import { JwtAuthGuard, OptionalJwtGuard } from '../../common/jwt-auth.guard';
import { AdminGuard } from '../../common/admin.guard';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    // ===== USER ENDPOINTS =====
    @UseGuards(JwtAuthGuard)
    @Post()
    taoBaoCao(
        @Body() dto: TaoBaoCaoDto,
        @Req() req: { user: { id: string } },
    ) {
        return this.reportsService.taoBaoCao(req.user.id, dto);
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
        return this.reportsService.layDanhSachChoAdmin(page, size, status);
    }

    @Patch('admin/:id/resolve')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async xuLyBaoCao(
        @Req() req: { user: { id: string } },
        @Param('id') id: string,
        @Body() dto: XuLyBaoCaoDto,
    ) {
        return this.reportsService.xuLyBaoCao(req.user.id, id, dto);
    }
}