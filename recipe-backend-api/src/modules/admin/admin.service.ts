import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RecipeStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ModeratorActionDto, UserStatusDto } from './dto/admin-action.dto';
import { AdminUserQueryDto } from './dto/admin-query.dto';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private thongBao: NotificationsService,
  ) {}

  async stats() {
    const [users, recipes, references, ingredients, pending] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.recipe.count({ where: { deletedAt: null } }),
      this.prisma.recipeReference.count(),
      this.prisma.internalIngredient.count(),
      this.prisma.recipe.count({ where: { status: 'PENDING', deletedAt: null } }),
    ]);

    // Phân bổ theo trạng thái công thức (BR-02)
    const byStatusRaw = await this.prisma.recipe.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { _all: true },
    });

    const byStatus = {
      DRAFT: 0,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      HIDDEN: 0,
    };
    for (const row of byStatusRaw) {
      byStatus[row.status] = row._count._all;
    }

    const byRoleRaw = await this.prisma.user.groupBy({
      by: ['role'],
      _count: { _all: true },
    });

    return {
      totalUsers: users,
      totalRecipes: recipes,
      totalRecipeReferences: references,
      totalIngredients: ingredients,
      pendingRecipes: pending,
      recipeStatusDistribution: byStatus,
      userRoleDistribution: { ADMIN: byRoleRaw.find((r) => r.role === 'ADMIN')?._count._all ?? 0, USER: byRoleRaw.find((r) => r.role === 'USER')?._count._all ?? 0 },
    };
  }

  async findAllUsers(query: AdminUserQueryDto) {
    const page = query.page ?? 0;
    const size = query.size ?? 20;

    const where: Prisma.UserWhereInput = {};
    if (query.search) {
      where.OR = [{ email: { contains: query.search } }, { displayName: { contains: query.search } }];
    }

    const [content, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: page * size,
        take: size,
        orderBy: { createdAt: 'desc' },
        // Bắt buộc trả id: web dùng làm `rowKey` của bảng và gửi PATCH
        // /admin/users/:id/status khi khóa/mở khóa. (Từng bỏ id vì tưởng FE
        // chỉ cần STT — ngược lại làm hỏng cả hai thứ đó.)
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { recipes: true, comments: true, favorites: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      content,
      pageable: { pageNumber: page, pageSize: size },
      totalElements: total,
      totalPages: Math.ceil(total / size),
    };
  }

  async changeUserStatus(id: string, dto: UserStatusDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('[ADM-03] Người dùng không tồn tại');
    if (user.role === 'ADMIN') {
      throw new ConflictException('[ADM-04] Không thể khóa tài khoản ADMIN');
    }
    return this.prisma.user.update({
      where: { id },
      data: { status: dto.status },
      select: { email: true, displayName: true, role: true, status: true },
    });
  }

  // BR-02: Admin approve -> APPROVED
  async approveRecipe(id: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('[REC-06] Công thức không tồn tại');
    if (recipe.status !== 'PENDING') {
      throw new ConflictException('[ADM-05] Chỉ duyệt được công thức ở trạng thái PENDING');
    }
    const updated = await this.prisma.recipe.update({
      where: { id },
      data: { status: 'APPROVED' as RecipeStatus, rejectionReason: null },
      select: { title: true, status: true },
    });
    // BR-NOTI: Báo cho tác giả khi bài được duyệt (lỗi gửi không chặn duyệt)
    await this.thongBao
      .guiThongBao(recipe.authorId, 'Công thức đã được duyệt', `Món "${recipe.title}" của bạn đã được đăng.`, {
        loai: 'recipe_approved',
        congThucId: id,
      })
      .catch(() => undefined);
    return updated;
  }

  // BR-02: Admin reject -> REJECTED + lý do
  async rejectRecipe(id: string, dto: ModeratorActionDto) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('[REC-06] Công thức không tồn tại');
    if (recipe.status !== 'PENDING') {
      throw new ConflictException('[ADM-05] Chỉ từ chối được công thức ở trạng thái PENDING');
    }
    const updated = await this.prisma.recipe.update({
      where: { id },
      data: { status: 'REJECTED' as RecipeStatus, rejectionReason: dto.reason || null },
      select: { title: true, status: true, rejectionReason: true },
    });
    // BR-NOTI: Báo cho tác giả khi bài bị từ chối (lỗi gửi không chặn từ chối)
    await this.thongBao
      .guiThongBao(recipe.authorId, 'Công thức cần chỉnh sửa', `Món "${recipe.title}" chưa được duyệt.${dto.reason ? ` Lý do: ${dto.reason}` : ''}`, {
        loai: 'recipe_rejected',
        congThucId: id,
      })
      .catch(() => undefined);
    return updated;
  }

  // BR-02: Admin hide -> HIDDEN (ẩn bài vi phạm đã duyệt)
  async hideRecipe(id: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('[REC-06] Công thức không tồn tại');
    if (!['APPROVED', 'REJECTED'].includes(recipe.status)) {
      throw new ConflictException('[ADM-06] Chỉ ẩn công thức APPROVED hoặc REJECTED');
    }
    const updated = await this.prisma.recipe.update({
      where: { id },
      data: { status: 'HIDDEN' as RecipeStatus },
      select: { title: true, status: true },
    });
    // BR-NOTI: Báo cho tác giả khi bài bị ẩn (lỗi gửi không chặn ẩn)
    await this.thongBao
      .guiThongBao(recipe.authorId, 'Công thức đã bị ẩn', `Món "${recipe.title}" đã bị ẩn khỏi cộng đồng.`, {
        loai: 'recipe_hidden',
        congThucId: id,
      })
      .catch(() => undefined);
    return updated;
  }

  // Admin khôi phục bài HIDDEN -> APPROVED. Hành động ADMIN riêng, không qua
  // ALLOWED_STATUSES của tác giả (tác giả không tự mở lại bài bị ẩn).
  async restoreRecipe(id: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundException('[REC-06] Công thức không tồn tại');
    if (recipe.status !== 'HIDDEN') {
      throw new ConflictException('[ADM-07] Chỉ khôi phục được công thức ở trạng thái HIDDEN');
    }
    const updated = await this.prisma.recipe.update({
      where: { id },
      data: { status: 'APPROVED' as RecipeStatus, rejectionReason: null },
      select: { title: true, status: true },
    });
    // BR-NOTI: Báo cho tác giả khi bài được khôi phục (lỗi gửi không chặn khôi phục)
    await this.thongBao
      .guiThongBao(recipe.authorId, 'Công thức đã được khôi phục', `Món "${recipe.title}" đã được đăng trở lại.`, {
        loai: 'recipe_approved',
        congThucId: id,
      })
      .catch(() => undefined);
    return updated;
  }
}