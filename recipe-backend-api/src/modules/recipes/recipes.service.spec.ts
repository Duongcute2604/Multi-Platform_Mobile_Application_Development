import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
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
    return { service: new RecipesService(prisma), prisma };
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