import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipeQueryDto } from './dto/recipe-query.dto';

// Task 2.2: findAll hỗ trợ sortBy=rating (điểm trung bình, tính ở tầng ứng dụng vì
// Prisma relation orderBy chỉ có `_count`) và sortBy=popular (favorites + comments).
describe('RecipesService.findAll sort', () => {
  const taoService = (candidates: Array<{ id: string; createdAt: string; scores: number[] }>, rows?: unknown[]) => {
    const prisma: any = {
      recipe: {
        findMany: jest.fn((args: any) => {
          // Nếu query có `ratings` trong select -> giai đoạn 1 (candidates)
          if (args?.select?.ratings) {
            return Promise.resolve(
              candidates.map((c) => ({
                id: c.id,
                createdAt: new Date(c.createdAt),
                ratings: c.scores.map((score) => ({ score })),
              })),
            );
          }
          // Giai đoạn 2: trả rows (mô phỏng listSelect + id tạm)
          if (rows) return Promise.resolve(rows);
          return Promise.resolve([]);
        }),
        count: jest.fn().mockResolvedValue(candidates.length),
      },
    };
    return { service: new RecipesService(prisma, { kiemTraVaGhiNhan: jest.fn() } as any), prisma };
  };

  it('sortBy=rating xếp theo điểm trung bình giảm dần, món chưa có lượt đánh giá ở cuối', async () => {
    const { service } = taoService(
      [
        { id: 'r1', createdAt: '2026-01-01T00:00:00Z', scores: [5, 5] }, // avg 5.0
        { id: 'r2', createdAt: '2026-01-02T00:00:00Z', scores: [3] }, // avg 3.0
        { id: 'r3', createdAt: '2026-01-03T00:00:00Z', scores: [4, 5] }, // avg 4.5
        { id: 'r4', createdAt: '2026-01-04T00:00:00Z', scores: [] }, // chưa đánh giá
      ],
      [
        { id: 'r1', title: 'm1' },
        { id: 'r2', title: 'm2' },
        { id: 'r3', title: 'm3' },
        { id: 'r4', title: 'm4' },
      ],
    );
    const query = plainToInstance(RecipeQueryDto, { page: 0, size: 20, sortBy: 'rating', sortDirection: 'desc' });
    const ketQua = await service.findAll(query);
    // note: viewer không phải ADMIN nên id bị strip — so sánh theo title trật tự
    const titles = ketQua.content.map((x: any) => x.title);
    expect(titles).toEqual(['m1', 'm3', 'm2', 'm4']);
  });

  it('sortBy=rating asc đảo ngược thứ hạng trung bình', async () => {
    const { service } = taoService(
      [
        { id: 'r1', createdAt: '2026-01-01T00:00:00Z', scores: [5, 5] },
        { id: 'r2', createdAt: '2026-01-02T00:00:00Z', scores: [3] },
      ],
      [
        { id: 'r1', title: 'm1' },
        { id: 'r2', title: 'm2' },
      ],
    );
    const query = plainToInstance(RecipeQueryDto, { page: 0, size: 20, sortBy: 'rating', sortDirection: 'asc' });
    const ketQua = await service.findAll(query);
    expect(ketQua.content.map((x: any) => x.title)).toEqual(['m2', 'm1']);
  });

  it('sortBy=rating áp dụng phân trang trên danh sách đã xếp lại (không lệch trang)', async () => {
    const { service } = taoService(
      [
        { id: 'r1', createdAt: '2026-01-01T00:00:00Z', scores: [5] },
        { id: 'r2', createdAt: '2026-01-02T00:00:00Z', scores: [4] },
        { id: 'r3', createdAt: '2026-01-03T00:00:00Z', scores: [1] },
      ],
      [
        { id: 'r2', title: 'm2' },
        { id: 'r3', title: 'm3' },
      ],
    );
    const query = plainToInstance(RecipeQueryDto, { page: 1, size: 2, sortBy: 'rating', sortDirection: 'desc' });
    const ketQua = await service.findAll(query);
    // Trang 1 (offset 2) của thứ hạng [r1, r2, r3] = [r3]
    const titles = ketQua.content.map((x: any) => x.title);
    expect(titles).toEqual(['m3']);
  });

  it('sortBy=popular -> orderBy favorites._count rồi comments._count (native Prisma)', async () => {
    const { service, prisma } = taoService([]);
    const query = plainToInstance(RecipeQueryDto, { page: 0, size: 20, sortBy: 'popular', sortDirection: 'asc' });
    await service.findAll(query);
    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ favorites: { _count: 'asc' } }, { comments: { _count: 'asc' } }],
      }),
    );
  });

  it('sortBy=createdAt giữ nguyên hành vi cũ (field đơn)', async () => {
    const { service, prisma } = taoService([]);
    const query = plainToInstance(RecipeQueryDto, { page: 0, size: 20, sortBy: 'createdAt', sortDirection: 'desc' });
    await service.findAll(query);
    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
    );
  });

  it('DTO chấp nhận rating/popular và chặn sortBy lạ ([REC-05])', async () => {
    const khi = (duLieu: unknown) => validate(plainToInstance(RecipeQueryDto, duLieu));
    await expect(khi({ sortBy: 'rating' })).resolves.toHaveLength(0);
    await expect(khi({ sortBy: 'popular' })).resolves.toHaveLength(0);
    const loai = await khi({ sortBy: 'khuVuon' });
    expect(loai.length).toBeGreaterThan(0);
    expect(loai[0].constraints?.isIn).toContain('[REC-05]');
  });
});

// Task 2.3: filter theo thời gian nấu + khẩu phần (server-side)
describe('RecipesService.findAll filter (minCookTime/maxCookTime/servings)', () => {
  const taoService = () => {
    const prisma: any = {
      recipe: {
        findMany: jest.fn((args: any) => {
          // Giai đoạn rating (select.ratings) không dùng ở đây — trả rỗng
          if (args?.select?.ratings) return Promise.resolve([]);
          return Promise.resolve([]);
        }),
        count: jest.fn().mockResolvedValue(0),
      },
    };
    return { service: new RecipesService(prisma, { kiemTraVaGhiNhan: jest.fn() } as any), prisma };
  };

  it('minCookTime/maxCookTime -> where cookTimeMinutes { gte, lte }', async () => {
    const { service, prisma } = taoService();
    const query = plainToInstance(RecipeQueryDto, { minCookTime: 10, maxCookTime: 60 });
    await service.findAll(query);
    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          cookTimeMinutes: { gte: 10, lte: 60 },
        }),
      }),
    );
  });

  it('chỉ minCookTime -> chỉ set gte (không có lte)', async () => {
    const { service, prisma } = taoService();
    const query = plainToInstance(RecipeQueryDto, { minCookTime: 15 });
    await service.findAll(query);
    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          cookTimeMinutes: { gte: 15 },
        }),
      }),
    );
  });

  it('servings -> where servings { gte }', async () => {
    const { service, prisma } = taoService();
    const query = plainToInstance(RecipeQueryDto, { servings: 4 });
    await service.findAll(query);
    expect(prisma.recipe.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ servings: { gte: 4 } }),
      }),
    );
  });

  it('không truyền filter -> không có khoá cookTimeMinutes/servings trong where', async () => {
    const { service, prisma } = taoService();
    const query = plainToInstance(RecipeQueryDto, {});
    await service.findAll(query);
    const called = prisma.recipe.findMany.mock.calls[0][0] as any;
    expect(called.where.cookTimeMinutes).toBeUndefined();
    expect(called.where.servings).toBeUndefined();
  });

  it('server tự chặn min > max bằng BadRequestException ([REC-05])', async () => {
    const { service } = taoService();
    const query = plainToInstance(RecipeQueryDto, { minCookTime: 60, maxCookTime: 10 });
    await expect(service.findAll(query)).rejects.toThrow(BadRequestException);
    await expect(service.findAll(query)).rejects.toThrow('[REC-05]');
  });

  it('DTO từ chối min > max bằng lỗi validation [REC-05]', async () => {
    const loi = await validate(plainToInstance(RecipeQueryDto, { minCookTime: 60, maxCookTime: 10 }));
    expect(loi.length).toBeGreaterThan(0);
    const chuoi = JSON.stringify(loi.map((x) => x.constraints));
    expect(chuoi).toContain('[REC-05]');
  });

  it('DTO chấp nhận filter hợp lệ và loại bỏ giá trị âm / servings < 1', async () => {
    await expect(validate(plainToInstance(RecipeQueryDto, { minCookTime: 0, maxCookTime: 120, servings: 2 }))).resolves.toHaveLength(0);
    const loi = await validate(plainToInstance(RecipeQueryDto, { minCookTime: -5, servings: 0 }));
    expect(loi.length).toBeGreaterThan(0);
  });
});

// Auto-kiểm độc tố khi gửi duyệt: nội dung bẩn -> ném [REC-09], không chuyển PENDING.
// ModerationService đã được unit-test riêng; ở đây mock đúng ranh giới service.
describe('RecipesService.submitForReview kiểm độc tố', () => {
  const taoService = (ketQuaKiem: { hopLe: boolean; tuKhoaTrung: string[]; soLanTrungLichSu: number }) => {
    const prisma: any = {
      recipe: {
        findUnique: jest.fn(async () => ({
          id: 'r1',
          authorId: 'u1',
          status: 'DRAFT',
          deletedAt: null,
          title: 'Món X',
          description: 'Mô tả',
        })),
        update: jest.fn(async ({ data }: any) => ({ id: 'r1', status: data.status })),
      },
      recipeStep: {
        findMany: jest.fn(async () => [{ content: 'Bước 1: sơ chế' }]),
      },
    };
    const moderation: any = { kiemTraVaGhiNhan: jest.fn(async () => ketQuaKiem) };
    return { service: new RecipesService(prisma, moderation), prisma };
  };

  it('nội dung bẩn -> ném [REC-09] kèm từ trúng + số lần lịch sử, không chuyển PENDING', async () => {
    const { service, prisma } = taoService({ hopLe: false, tuKhoaTrung: ['độc hại'], soLanTrungLichSu: 2 });
    await expect(service.submitForReview('r1', 'u1', 'USER')).rejects.toThrow(/\[REC-09\].*độc hại.*2 lần/);
    expect(prisma.recipe.update).not.toHaveBeenCalled();
  });

  it('nội dung sạch -> chuyển PENDING như bình thường (qua trọn kiểm tra)', async () => {
    const { service, prisma } = taoService({ hopLe: true, tuKhoaTrung: [], soLanTrungLichSu: 0 });
    const kq = await service.submitForReview('r1', 'u1', 'USER');
    expect(kq.status).toBe('PENDING');
    expect(prisma.recipe.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: 'PENDING' } }));
  });

  it('gửi bẩn nhưng không có ca trùng lịch sử -> thông báo không nhắc "từng bị chặn"', async () => {
    const { service } = taoService({ hopLe: false, tuKhoaTrung: ['spam'], soLanTrungLichSu: 0 });
    await expect(service.submitForReview('r1', 'u1', 'USER')).rejects.toThrow(/\[REC-09\]/);
    await expect(
      service.submitForReview('r1', 'u1', 'USER'),
    ).rejects.not.toThrow(/từng bị chặn/);
  });
});