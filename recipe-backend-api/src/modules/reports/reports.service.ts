import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { TaoBaoCaoDto, XuLyBaoCaoDto } from './dto/report.dto';

@Injectable()
export class ReportsService {
    constructor(private readonly prisma: PrismaService) {}

    // ===== USER ENDPOINTS =====
    async taoBaoCao(userId: string, dto: TaoBaoCaoDto) {
        // Kiểm tra ít nhất một trong ba ID được cung cấp
        if (!dto.recipeId && !dto.recipeReferenceId && !dto.commentId) {
            throw new ForbiddenException({
                code: 'RPT-02',
                message: '[RPT-02] Phải cung cấp ít nhất một ID: recipeId, recipeReferenceId hoặc commentId',
            });
        }

        // Kiểm tra tồn tại
        if (dto.recipeId) {
            const recipe = await this.prisma.recipe.findFirst({
                where: { id: dto.recipeId, deletedAt: null },
                select: { id: true },
            });
            if (!recipe) {
                throw new NotFoundException({ code: 'REC-04', message: '[REC-04] Không tìm thấy công thức' });
            }
        }
        if (dto.recipeReferenceId) {
            const ref = await this.prisma.recipeReference.findFirst({
                where: { id: dto.recipeReferenceId },
                select: { id: true },
            });
            if (!ref) {
                throw new NotFoundException({ code: 'REF-01', message: '[REF-01] Không tìm thấy công thức tham chiếu' });
            }
        }
        if (dto.commentId) {
            const cmt = await this.prisma.comment.findFirst({
                where: { id: dto.commentId, deletedAt: null },
                select: { id: true },
            });
            if (!cmt) {
                throw new NotFoundException({ code: 'CMT-04', message: '[CMT-04] Không tìm thấy bình luận' });
            }
        }

        const report = await this.prisma.report.create({
            data: {
                userId,
                recipeId: dto.recipeId,
                recipeReferenceId: dto.recipeReferenceId,
                commentId: dto.commentId,
                reason: dto.lyDo,
                status: 'PENDING',
            },
            include: { user: true },
        });

        return this.toBaoCao(report);
    }

    // ===== ADMIN ENDPOINTS =====
    async layDanhSachChoAdmin(trang: number, kichThuoc: number, status?: string) {
        const where: any = {};
        if (status) {
            where.status = status;
        }

        const [items, tongSoPhanTu] = await Promise.all([
            this.prisma.report.findMany({
                where,
                skip: trang * kichThuoc,
                take: kichThuoc,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, email: true, displayName: true, avatarUrl: true, role: true, status: true } },
                    recipe: { select: { id: true, title: true } },
                    recipeReference: { select: { id: true, title: true } },
                    comment: { select: { id: true, content: true } },
                },
            }),
            this.prisma.report.count({ where }),
        ]);

        const tongSoTrang = Math.ceil(tongSoPhanTu / kichThuoc);

        return {
            noiDung: items.map((r) => this.toBaoCao(r)),
            tongSoPhanTu,
            tongSoTrang,
        };
    }

    async xuLyBaoCao(adminId: string, id: string, dto: XuLyBaoCaoDto) {
        const report = await this.prisma.report.findFirst({
            where: { id },
            select: { id: true, status: true },
        });
        if (!report) {
            throw new NotFoundException({ code: 'RPT-03', message: '[RPT-03] Không tìm thấy báo cáo' });
        }

        const updated = await this.prisma.report.update({
            where: { id },
            data: {
                status: dto.trangThai,
                adminNote: dto.ghiChuAdmin,
                resolvedAt: dto.trangThai === 'RESOLVED' ? new Date() : null,
            },
            include: { user: true, recipe: true, recipeReference: true, comment: true },
        });

        return this.toBaoCao(updated);
    }

    private toBaoCao(r: any) {
        return {
            id: r.id,
            lyDo: r.reason,
            trangThai: r.status,
            ghiChuAdmin: r.adminNote,
            thoiGianTao: r.createdAt.toISOString(),
            thoiGianXuLy: r.resolvedAt?.toISOString() || null,
            nguoiBaoCao: r.user ? {
                id: r.user.id,
                email: r.user.email,
                tenHienThi: r.user.displayName,
                anhDaiDien: r.user.avatarUrl,
            } : null,
            congThuc: r.recipe ? { id: r.recipe.id, ten: r.recipe.title } : null,
            thamChieu: r.recipeReference ? { id: r.recipeReference.id, ten: r.recipeReference.title } : null,
            binhLuan: r.comment ? { id: r.comment.id, noiDung: r.comment.content } : null,
        };
    }
}