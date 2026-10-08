import { ModerationService } from './moderation.service';

// Auto-kiểm độc tố khi GỬI DUYỆT công thức (DRAFT/REJECTED -> PENDING).
// - Phát hiện từ cấm trong tiêu đề/mô tả/bước (chuẩn hoá không dấu, ranh giới từ).
// - Chặn thì ghi 1 ca vào ModerationCase; user sau nộp trùng -> đếm từ lịch sử.
// - Lỗi DB khi kiểm -> fail-open (không chặn luồng gửi duyệt).
describe('ModerationService.kiemTraVaGhiNhan', () => {
  const taoService = (
    tuKhoas: string[],
    caTruoc: Array<{ id: string; matchedKeywords: string }> = [],
  ) => {
    const prisma: any = {
      toxicKeyword: {
        findMany: jest.fn(async () =>
          tuKhoas.map((word, i) => ({ id: `k${i}`, word, createdAt: new Date('2026-01-01') })),
        ),
      },
      moderationCase: {
        // Prisma mock ở đúng ranh giới DB: lọc theo where.matchedKeywords.contains
        findMany: jest.fn(async (args: any) => {
          const tim = args?.where?.matchedKeywords?.contains;
          if (!tim) return [];
          return caTruoc
            .filter((c) => c.matchedKeywords.includes(tim))
            .map((c) => ({
              id: c.id,
              userId: 'u-khac',
              recipeId: 'r-khac',
              matchedKeywords: c.matchedKeywords,
              excerpt: 'ca cu',
              createdAt: new Date('2026-01-02'),
            }));
        }),
        create: jest.fn(async ({ data }: any) => ({ id: 'mc-moi', ...data })),
      },
    };
    return { service: new ModerationService(prisma), prisma };
  };

  it('nội dung sạch -> hopLe=true, không từ nào trúng, không ghi ca', async () => {
    const { service, prisma } = taoService(['độc hại', 'spam lừa đảo']);
    const kq = await service.kiemTraVaGhiNhan({
      userId: 'u1',
      recipeId: 'r1',
      tieuDe: 'Phở bò tái',
      moTa: 'Nước dùng ninh 6 tiếng, thơm phức',
      cacBuoc: ['Chần bánh phở 30 giây'],
    });
    expect(kq.hopLe).toBe(true);
    expect(kq.tuKhoaTrung).toEqual([]);
    expect(prisma.moderationCase.create).not.toHaveBeenCalled();
  });

  it('từ cấm khớp cả khi user gõ không dấu -> hopLe=false, trả về từ GỐC để hiển thị', async () => {
    const { service, prisma } = taoService(['độc hại']);
    const kq = await service.kiemTraVaGhiNhan({
      userId: 'u1',
      recipeId: 'r1',
      tieuDe: 'Món lạ',
      moTa: 'mon nay doc hai lam, an vao chet',
      cacBuoc: [],
    });
    expect(kq.hopLe).toBe(false);
    expect(kq.tuKhoaTrung).toEqual(['độc hại']);
    expect(prisma.moderationCase.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'u1',
          recipeId: 'r1',
          matchedKeywords: 'doc hai',
        }),
      }),
    );
  });

  it('không bắt nhầm từ chen giữa từ khác (ranh giới từ): "hại" không khớp "hoanghai"', async () => {
    const { service } = taoService(['hại']);
    const kq = await service.kiemTraVaGhiNhan({
      userId: 'u1',
      recipeId: 'r1',
      tieuDe: 'Cá hoanghai',
      moTa: '',
      cacBuoc: [],
    });
    expect(kq.hopLe).toBe(true);
    expect(kq.tuKhoaTrung).toEqual([]);
  });

  it('trùng từ với ca từng bị chặn trước đó -> đếm số lần từ lịch sử', async () => {
    const { service } = taoService(
      ['độc hại'],
      [
        { id: 'c1', matchedKeywords: 'doc hai' },
        { id: 'c2', matchedKeywords: 'doc hai, spam' },
        { id: 'c3', matchedKeywords: 'chu khac' }, // không trùng từ -> không tính
      ],
    );
    const kq = await service.kiemTraVaGhiNhan({
      userId: 'u2',
      recipeId: 'r2',
      tieuDe: 'Món mới',
      moTa: 'cach lam nay doc hai qua',
      cacBuoc: [],
    });
    expect(kq.hopLe).toBe(false);
    expect(kq.soLanTrungLichSu).toBe(2);
  });

  it('nội dung sạch -> không đối chiếu/lưu gì, soLanTrungLichSu=0', async () => {
    const { service } = taoService(['độc hại'], [{ id: 'c1', matchedKeywords: 'doc hai' }]);
    const kq = await service.kiemTraVaGhiNhan({
      userId: 'u1',
      recipeId: 'r1',
      tieuDe: 'Canh chua cá lóc',
      moTa: 'Chua ngọt vừa ăn',
      cacBuoc: ['Luộc cá'],
    });
    expect(kq.soLanTrungLichSu).toBe(0);
  });

  it('DB lỗi khi lấy danh sách từ -> fail-open: hopLe=true, không ném lỗi, không ghi ca', async () => {
    const prisma: any = {
      toxicKeyword: { findMany: jest.fn(async () => { throw new Error('db down'); }) },
      moderationCase: { findMany: jest.fn(), create: jest.fn() },
    };
    const service = new ModerationService(prisma);
    const kq = await service.kiemTraVaGhiNhan({
      userId: 'u1',
      recipeId: 'r1',
      tieuDe: 'Món x',
      moTa: 'y',
      cacBuoc: [],
    });
    expect(kq.hopLe).toBe(true);
    expect(prisma.moderationCase.create).not.toHaveBeenCalled();
  });
});
