import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { DangKyTokenDto, XoaTokenDto } from './dto/notification.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly service: NotificationsService) {}

    @Post('tokens')
    dangKy(@Req() req: { user: { id: string } }, @Body() dto: DangKyTokenDto) {
        return this.service.dangKyToken(req.user.id, dto);
    }

    @Get('tokens')
    layDanhSach(@Req() req: { user: { id: string } }) {
        return this.service.layDanhSach(req.user.id);
    }

    @Delete('tokens')
    xoa(@Req() req: { user: { id: string } }, @Body() dto: XoaTokenDto) {
        return this.service.xoaToken(req.user.id, dto);
    }
}
