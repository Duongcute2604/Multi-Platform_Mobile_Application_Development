import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Prisma, RecipeStatus, Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeQueryDto } from './dto/recipe-query.dto';

// BR-02: Lifecycle Recipe: DRAFT → PENDING → APPROVED/REJECTED → HIDDEN
const ALLOWED_STATUSES: Map<string, string[]> = new Map([
  ['DRAFT', ['PENDING', 'HIDDEN']],
  ['PENDING', []],
  ['APPROVED', ['HIDDEN']],
  ['REJECTED', ['PENDING']],
  ['HIDDEN', ['DRAFT']],
]);

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  // Không trả id (UUID) trong list/public endpoints -> FE tự tính STT = index + 1 + page * size
  // Riêng ADMIN: trả thêm id để thao tác duyệt/cấm (admin là endpoint nội bộ, không public)
  private listSelect(viewerRole?: string) {
    const select: Prisma.RecipeSelect = {
      title: true,
      description: true,
      thumbnailUrl: true,
      cookTimeMinutes: true,
      prepTimeMinutes: true,
      servings: true,
      status: true,
      source: true,
      rejectionReason: true,
      createdAt: true,
      updatedAt: true,
      // Card công thức trên Home có hiện Kcal (icon Flame). Không select phần này
      // thì `ct.nutrition` luôn undefined và mọi thẻ hiện "— Kcal" dù seed đã đủ
      // dinh dưỡng. Chọn đúng 4 field zod `dinhDuongSchema` yêu cầu.
      nutrition: { select: { calories: true, protein: true, carbs: true, fat: true } },
    };
    // Spec recipes/README.md "GET /recipes (List - KHÔNG CÓ ID)": danh sách công khai
    // cố tình KHÔNG trả id để chống dò/enum UUID sang endpoint chi tiết.
    // Chỉ ADMIN (đã đăng nhập) mới thấy id + author để quản trị.
    if (viewerRole === Role.ADMIN) {
      select.id = true;
      select.author = { select: { displayName: true, email: true } };
    }
    return select;
  }

  private buildOrderBy(sortBy: string, sortDirection: 'asc' | 'desc'): Prisma.RecipeOrderByWithRelationInput | Prisma.RecipeOrderByWithRelationInput[] {
    if (sortBy === 'rating') {
      // NOTE: Prisma relation orderBy chỉ hỗ trợ `_count` — không có `_avg`.
      // sortBy=rating được xử lý riêng trong findAllTopRatings (xem dưới).
      return { createdAt: sortDirection };
    }
    if (sortBy === 'popular') {
      // Món phổ biến: nhiều lượt yêu thích trước, hòa thì nhiều bình luận trước.
      return [{ favorites: { _count: sortDirection } }, { comments: { _count: sortDirection } }];
    }
    return { [sortBy]: sortDirection };
  }

  async findAll(query: RecipeQueryDto, viewerRole?: string) {
    const page = query.page ?? 0;
    const size = query.size ?? 20;

    const where: Prisma.RecipeWhereInput = { deletedAt: null };

    if ((viewerRole === undefined || viewerRole === 'USER') && !query.status) {
      where.status = 'APPROVED';
    } else if (query.status) {
      where.status = query.status;
    }
    // ViewerRole = ADMIN và không lọc status -> xem tất cả trạng thái (chưa xóa)

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
        { ingredients: { some: { originalText: { contains: query.search } } } },
      ];
    }
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    if (query.tagNames?.length) {
      where.tags = { some: { name: { in: query.tagNames } } };
    }
    // Task 2.3: lọc theo thời gian nấu + khẩu phần (chỉ set field có mặt)
    if (query.minCookTime !== undefined || query.maxCookTime !== undefined) {
      if (query.minCookTime !== undefined && query.maxCookTime !== undefined && query.maxCookTime < query.minCookTime) {
        // DTO đã chặn qua ValidationPipe; chống gọi service trực tiếp
        throw new BadRequestException('[REC-05] maxCookTime phải lớn hơn hoặc bằng minCookTime');
      }
      where.cookTimeMinutes = {
        ...(query.minCookTime !== undefined ? { gte: query.minCookTime } : {}),
        ...(query.maxCookTime !== undefined ? { lte: query.maxCookTime } : {}),
      };
    }
    if (query.servings !== undefined) {
      where.servings = { gte: query.servings };
    }

    const total = await this.prisma.recipe.count({ where });

    const content =
      query.sortBy === 'rating'
        ? await this.findAllTopRatings(where, query.sortDirection, page, size, viewerRole)
        : await this.prisma.recipe.findMany({
            where,
            skip: page * size,
            take: size,
            orderBy: this.buildOrderBy(query.sortBy, query.sortDirection),
            select: this.listSelect(viewerRole),
          });

    return {
      content,
      pageable: { pageNumber: page, pageSize: size },
      totalElements: total,
      totalPages: Math.ceil(total / size),
    };
  }

  /**
   * Món nổi bật theo điểm trung bình (sortBy=rating).
   * Prisma không sort theo `_avg` của relation nên fetch id + score rồi tính
   * thứ hạng ở tầng ứng dụng. Món chưa có lượt đánh giá luôn xếp cuối.
   * Phân trang áp trên danh sách ĐÃ SORT nên không lệch trang.
   */
  private async findAllTopRatings(
    where: Prisma.RecipeWhereInput,
    sortDirection: 'asc' | 'desc',
    page: number,
    size: number,
    viewerRole: string | undefined,
  ) {
    const candidates = await this.prisma.recipe.findMany({
      where,
      select: {
        id: true,
        createdAt: true,
        ratings: { select: { score: true } },
      },
    });

    const ranked = candidates
      .map((r) => ({
        id: r.id,
        avg: r.ratings.length ? r.ratings.reduce((s, x) => s + x.score, 0) / r.ratings.length : -1,
        createdAt: r.createdAt.getTime(),
      }))
      .sort((a, b) => {
        if (sortDirection === 'asc') return a.avg - b.avg || a.createdAt - b.createdAt;
        return b.avg - a.avg || b.createdAt - a.createdAt;
      });

    const pageIds = ranked.slice(page * size, page * size + size).map((r) => r.id);
    if (pageIds.length === 0) return [];

    // Lấy đủ field hiển thị + id tạm để sắp lại đúng thứ tự đã xếp hạng.
    const rows = await this.prisma.recipe.findMany({
      where: { id: { in: pageIds } },
      select: { ...this.listSelect(viewerRole), id: true },
    });
    const theoId = new Map(rows.map((r) => [r.id, r]));
    // Quá nhiều dòng xếp hạng hơn trang không xảy ra; dòng thừa chỉ là bảo vệ:
    const trang = pageIds
      .map((id) => theoId.get(id))
      .filter((r): r is NonNullable<typeof r> => Boolean(r)) as Array<(typeof rows)[number]>;

    // Không trả id cho viewer không phải ADMIN (khớp listSelect)
    if (viewerRole !== Role.ADMIN) {
      return trang.map(({ id: _id, ...rest }) => rest);
    }
    return trang;
  }

  async findOne(id: string, viewer?: { id?: string; role?: string }) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        author: { select: { displayName: true, email: true } },
        category: { select: { name: true, slug: true } },
        tags: { select: { name: true } },
        ingredients: { include: { internalIngredient: { select: { canonicalName: true } } } },
        steps: true,
        nutrition: true,
      },
    });
    if (!recipe || recipe.deletedAt) {
      throw new NotFoundException('[REC-06] Công thức không tồn tại');
    }
    // BR-02: chỉ APPROVED mới công khai. ADMIN xem được mọi trạng thái để kiểm duyệt,
    // tác giả xem được mọi trạng thái của chính mình (để sửa / xem lý do bị reject).
    const isAdmin = viewer?.role === Role.ADMIN;
    const isAuthor = !!viewer?.id && recipe.authorId === viewer.id;
    if (!isAdmin && !isAuthor && recipe.status !== 'APPROVED') {
      throw new NotFoundException('[REC-06] Công thức không tồn tại');
    }
    return recipe;
  }

  /**
   * BR-UREC: Tìm công thức theo nguyên liệu có sẵn.
   *
   * `originalText` lưu dạng tự do ("500g thịt bò băm") nên phải lọc ở tầng
   * ứng dụng thay vì đẩy xuống SQL — có thứ tự tiếng Việt lẫn tiếng Anh.
   * Chỉ trả công thức APPROVED: không lộ bài nháp qua ô tìm kiếm.
   */
  async timTheoNguyenLieu(ingredients?: string, soLuong = 10) {
    const danhSach = (ingredients ?? '')
      .split(/[,;]/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (danhSach.length === 0) {
      return { content: [], pageable: { pageNumber: 0, pageSize: soLuong }, totalElements: 0, totalPages: 0 };
    }

    const candidates = await this.prisma.recipe.findMany({
      where: {
        deletedAt: null,
        status: RecipeStatus.APPROVED,
        ingredients: { some: { originalText: { contains: '' } } },
      },
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
        ingredients: { select: { originalText: true } },
      },
      take: 200,
    });

    const content = candidates
      .map((recipe) => {
        const texts = recipe.ingredients.map((i) => i.originalText.toLowerCase());
        // Công thức càng chứa nhiều nguyên liệu người dùng nhập càng khớp
        const soKhop = danhSach.filter((nguyenLieu) => texts.some((t) => t.includes(nguyenLieu))).length;
        return { ...recipe, soKhop };
      })
      .filter((r) => r.soKhop > 0)
      .sort((a, b) => b.soKhop - a.soKhop)
      .slice(0, soLuong)
      .map(({ ingredients: _bo, soKhop, ...rest }) => rest);

    return {
      content,
      pageable: { pageNumber: 0, pageSize: soLuong },
      totalElements: content.length,
      totalPages: 1,
    };
  }

  async create(dto: CreateRecipeDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          title: dto.title,
          description: dto.description,
          thumbnailUrl: dto.thumbnailUrl,
          cookTimeMinutes: dto.cookTimeMinutes,
          prepTimeMinutes: dto.prepTimeMinutes,
          servings: dto.servings,
          status: 'DRAFT',
          authorId: userId,
          categoryId: dto.categoryId,
          tags: dto.tagNames?.length
            ? {
                connectOrCreate: dto.tagNames.map((name) => ({
                  where: { name },
                  create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
                })),
              }
            : undefined,
          ingredients: {
            create: dto.ingredients.map((item, index) => ({
              originalText: item.originalText,
              quantity: item.quantity,
              unit: item.unit,
              sortOrder: index + 1,
              internalIngredientId: item.internalIngredientId,
            })),
          },
          steps: {
            create: dto.steps.map((step, index) => ({
              stepOrder: index + 1,
              content: step.content,
              imageUrl: step.imageUrl,
            })),
          },
          nutrition: dto.nutrition ? { create: dto.nutrition } : undefined,
        },
        include: {
          ingredients: true,
          steps: true,
          nutrition: true,
          tags: true,
        },
      });

      // Chuẩn hóa nguyên liệu: map theo tên chuẩn hóa (NFD) nếu chưa chỉ định internalIngredientId
      await this.autoMapIngredients(tx, recipe.id);
      return recipe;
    });
  }

  async update(id: string, dto: Partial<CreateRecipeDto>, userId: string, role: string) {
    const existing = await this.findOneOwned(id, userId, role);

    const data: Prisma.RecipeUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.thumbnailUrl !== undefined) data.thumbnailUrl = dto.thumbnailUrl;
    if (dto.cookTimeMinutes !== undefined) data.cookTimeMinutes = dto.cookTimeMinutes;
    if (dto.prepTimeMinutes !== undefined) data.prepTimeMinutes = dto.prepTimeMinutes;
    if (dto.servings !== undefined) data.servings = dto.servings;
    if (dto.categoryId !== undefined) data.category = { connect: { id: dto.categoryId } };
    if (dto.tagNames) {
      data.tags = {
        connectOrCreate: dto.tagNames.map((name) => ({
          where: { name },
          create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
        })),
      };
    }
    // Nội dung đổi mới -> trả về DRAFT duyệt lại (BR-02)
    if (dto.ingredients || dto.steps) {
      data.status = 'DRAFT';
      data.ingredients = dto.ingredients
        ? {
            deleteMany: {},
            create: dto.ingredients.map((item, index) => ({
              originalText: item.originalText,
              quantity: item.quantity,
              unit: item.unit,
              sortOrder: index + 1,
              internalIngredientId: item.internalIngredientId,
            })),
          }
        : undefined;
      data.steps = dto.steps
        ? {
            deleteMany: {},
            create: dto.steps.map((step, index) => ({
              stepOrder: index + 1,
              content: step.content,
              imageUrl: step.imageUrl,
            })),
          }
        : undefined;
    }
    if (dto.nutrition !== undefined) {
      data.nutrition = { upsert: { create: dto.nutrition, update: dto.nutrition } };
    }

    return this.prisma.recipe.update({ where: { id }, data });
  }

  async remove(id: string, userId: string, role: string) {
    await this.findOneOwned(id, userId, role);
    // Soft delete (quy tắc DB: dùng deletedAt thay vì hard delete)
    await this.prisma.recipe.update({ where: { id }, data: { deletedAt: new Date() } });
    return { success: true };
  }

  async submitForReview(id: string, userId: string, role: string) {
    const existing = await this.findOneOwned(id, userId, role);
    const validNext = ALLOWED_STATUSES.get(existing.status) || [];
    if (!validNext.includes('PENDING')) {
      throw new BadRequestException(
        `[REC-07] Không thể gửi duyệt từ trạng thái ${existing.status} (chỉ DRAFT/REJECTED)`,
      );
    }
    return this.prisma.recipe.update({
      where: { id },
      data: { status: 'PENDING' as RecipeStatus },
    });
  }

  async autoMapIngredients(tx: Prisma.TransactionClient, recipeId: string) {
    const items = await tx.recipeIngredient.findMany({
      where: { recipeId, internalIngredientId: null },
    });

    for (const item of items) {
      const normalized = this.normalizeText(item.originalText);
      const candidate = await tx.internalIngredient.findFirst({
        where: { normalizedName: { contains: normalized } },
      });
      if (candidate) {
        await tx.recipeIngredient.update({
          where: { id: item.id },
          data: { internalIngredientId: candidate.id },
        });
      }
    }
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }

  private async findOneOwned(id: string, userId: string, role: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe || recipe.deletedAt) {
      throw new NotFoundException('[REC-06] Công thức không tồn tại');
    }
    if (recipe.authorId !== userId && role !== Role.ADMIN) {
      throw new ForbiddenException('[REC-08] Không có quyền thao tác công thức này');
    }
    return recipe;
  }
}