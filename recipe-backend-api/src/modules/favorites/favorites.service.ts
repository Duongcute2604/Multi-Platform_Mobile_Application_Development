import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipeStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * BR-SOC: Yêu thích công thức.
 *
 * Bảng `Favorite` đã có sẵn trong schema (unique [userId, recipeId]) nên chỉ
 * cần lớp đọc/ghi. Danh sách trả kèm id + author (khác `GET /recipes` công
 * khai vốn cố tình giấu id) vì đây là endpoint riêng của từng người dùng.
 */
@Injectable()
export class FavoritesService {
    constructor(private readonly prisma: PrismaService) {}

    private async timCongThuc(id: string) {
        const congThuc = await this.prisma.recipe.findUnique({ where: { id } });
        if (!congThuc || congThuc.deletedAt) {
            throw new NotFoundException('[REC-06] Công thức không tồn tại');
        }
        return congThuc;
    }

    /** BR-SOC: Bấm yêu thích lần 2 = bỏ yêu thích (toggle) — trả trạng thái sau cùng. */
    async toggle(userId: string, recipeId: string) {
        const congThuc = await this.timCongThuc(recipeId);
        const daCo = await this.prisma.favorite.findUnique({
            where: { userId_recipeId: { userId, recipeId } },
        });

        if (daCo) {
            await this.prisma.favorite.delete({ where: { id: daCo.id } });
            return { yeuThich: false, congThucId: recipeId, ten: congThuc.title };
        }

        await this.prisma.favorite.create({ data: { userId, recipeId } });
        return { yeuThich: true, congThucId: recipeId, ten: congThuc.title };
    }

    /** BR-SOC: Bỏ yêu thích (nút tách riêng trong màn chi tiết). Gọi lúc chưa thích thì vẫn OK. */
    async xoa(userId: string, recipeId: string) {
        await this.prisma.favorite.deleteMany({ where: { userId, recipeId } });
        return { yeuThich: false, congThucId: recipeId };
    }

    /** Danh sách công thức đã yêu thích, mới nhất trước. */
    async danhSach(userId: string, page = 0, size = 20) {
        const [items, tong] = await Promise.all([
            this.prisma.favorite.findMany({
                where: { userId, recipe: { deletedAt: null } },
                orderBy: { createdAt: 'desc' },
                skip: page * size,
                take: size,
                select: {
                    createdAt: true,
                    recipe: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnailUrl: true,
                            cookTimeMinutes: true,
                            prepTimeMinutes: true,
                            servings: true,
                            status: true,
                            source: true,
                            createdAt: true,
                            updatedAt: true,
                            author: { select: { displayName: true, email: true } },
                        },
                    },
                },
            }),
            this.prisma.favorite.count({ where: { userId, recipe: { deletedAt: null } } }),
        ]);

        return {
            noiDung: items.map((item) => item.recipe),
            tongSoPhanTu: tong,
            tongSoTrang: Math.ceil(tong / size),
        };
    }

    /** Trang chi tiết cần biết đã yêu thích chưa để tô đúng nút. */
    async daYeuThich(userId: string, recipeId: string): Promise<boolean> {
        const item = await this.prisma.favorite.findUnique({
            where: { userId_recipeId: { userId, recipeId } },
            select: { id: true },
        });
        return !!item;
    }

    /**
     * BR-REC: Công thức tương tự — cùng danh mục trước, rồi theo nguyên liệu
     * chung. Chỉ trả công thức APPROVED (đã duyệt) để không lộ bài nháp.
     */
    async tuongTu(recipeId: string, limit = 10) {
        const goc = await this.timCongThuc(recipeId);

        const cungDanhMuc = await this.prisma.recipe.findMany({
            where: {
                id: { not: recipeId },
                deletedAt: null,
                status: RecipeStatus.APPROVED,
                categoryId: goc.categoryId ?? undefined,
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, thumbnailUrl: true, cookTimeMinutes: true, servings: true, status: true },
        });

        // Cùng danh mục đủ dùng thì khỏi tính thêm độ giống nguyên liệu
        if (cungDanhMuc.length >= limit) return cungDanhMuc;

        const daCo = new Set(cungDanhMuc.map((r) => r.id));
        const theoNguyenLieu = await this.prisma.recipe.findMany({
            where: {
                id: { notIn: [recipeId, ...daCo] },
                deletedAt: null,
                status: RecipeStatus.APPROVED,
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                cookTimeMinutes: true,
                servings: true,
                status: true,
                ingredients: { select: { originalText: true } },
            },
        });

        // Công thức cùng danh mục không select `ingredients`, phần thiếu coi như rỗng
        const chuoi = (r: unknown) =>
            (((r as { ingredients?: { originalText: string }[] })?.ingredients) ?? []).map((i) =>
                i.originalText.toLowerCase(),
            );
        const gocText = chuoi(goc);

        return [...cungDanhMuc, ...theoNguyenLieu]
            .map((r) => {
                const rText = chuoi(r);
                const chung = rText.filter((t) => gocText.includes(t)).length;
                return { ...r, soNguyenLieuChung: chung };
            })
            .sort((a, b) => b.soNguyenLieuChung - a.soNguyenLieuChung)
            .slice(0, limit);
    }
}