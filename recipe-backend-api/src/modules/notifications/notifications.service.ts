import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DangKyTokenDto, XoaTokenDto } from './dto/notification.dto';

// BR-NOTI: Push qua Expo Push API, fire-and-forget — lỗi gửi không bao giờ
// chặn luồng nghiệp vụ chính (duyệt bài, tạo món...).
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) {}

    async dangKyToken(userId: string, dto: DangKyTokenDto) {
        // Một token chỉ thuộc về một tài khoản mới nhất (đăng nhập máy khác)
        await this.prisma.deviceToken.deleteMany({ where: { token: dto.token } });
        const saved = await this.prisma.deviceToken.create({
            data: { userId, token: dto.token, platform: dto.platform ?? 'unknown' },
            select: { id: true, platform: true, createdAt: true },
        });
        return { thanhCong: true, ...saved };
    }

    async xoaToken(userId: string, dto: XoaTokenDto) {
        await this.prisma.deviceToken.deleteMany({ where: { userId, token: dto.token } });
        return { thanhCong: true };
    }

    async layDanhSach(userId: string) {
        const items = await this.prisma.deviceToken.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: { id: true, platform: true, createdAt: true },
        });
        return { noiDung: items, tongSoPhanTu: items.length };
    }

    async guiThongBao(userId: string, tieuDe: string, noiDung: string, duLieu?: Record<string, string>): Promise<void> {
        try {
            const tokens = await this.prisma.deviceToken.findMany({
                where: { userId },
                select: { token: true },
            });
            if (tokens.length === 0) return;
            const messages = tokens.map((t) => ({
                to: t.token,
                sound: 'default',
                title: tieuDe,
                body: noiDung,
                data: duLieu ?? {},
            }));
            await fetch(EXPO_PUSH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messages),
            });
        } catch {
            // Bỏ qua lỗi gửi push — không chặn nghiệp vụ chính
        }
    }
}
