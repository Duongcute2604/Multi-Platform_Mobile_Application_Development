import { CommentsService } from './comments.service';

// Task 2.4: soLuongPhanHoi chỉ đếm reply CHƯA xóa (deletedAt: null) — bình luận
// bị xóa mềm (BR-SOC) không được tính là phản hồi còn sống.
describe('CommentsService.soLuongPhanHoi (đếm reply chưa xóa)', () => {
  const taoService = (replies: Array<{ id: string }>) => {
    const prisma: any = {
      recipe: {
        findFirst: jest.fn(async () => ({ id: 'r1', authorId: 'u1', status: 'APPROVED' })),
      },
      comment: {
        findMany: jest.fn(async ({ include }: any) =>
          // Prisma đã lọc replies theo where của include; mock trả đúng kết quả đã lọc
          include?.replies?.where?.deletedAt === null
            ? [{ id: 'c1', content: 'goc', createdAt: new Date(), user: { id: 'u1', email: 'a@b.c', displayName: 'A', avatarUrl: null, role: 'USER', status: 'ACTIVE' }, replies }]
            : [],
        ),
        count: jest.fn(async () => 1),
        create: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
      },
    };
    return { service: new CommentsService(prisma), prisma };
  };

  it('root có 2 reply (1 đã xóa) -> soLuongPhanHoi = 1', async () => {
    const { service } = taoService([{ id: 'rep1' }, { id: 'rep2' }]);
    const ketQua = await service.layDanhSach('r1', 0, 10);
    expect(ketQua.noiDung[0].soLuongPhanHoi).toBe(2);
  });

  it('findMany nhận include replies lọc deletedAt: null (đảm bảo Prisma lọc thật)', async () => {
    const { service, prisma } = taoService([]);
    await service.layDanhSach('r1', 0, 10);
    expect(prisma.comment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          replies: expect.objectContaining({ where: { deletedAt: null } }),
        }),
      }),
    );
  });

  it('xóa mềm root giữ nguyên mạch hội thoại (không sửa hành vi xóa)', async () => {
    const { service, prisma } = taoService([]);
    prisma.comment.findFirst.mockResolvedValueOnce({ id: 'c1', userId: 'u1' });
    prisma.comment.update.mockResolvedValueOnce({ thanhCong: true });
    const ketQua = await service.xoa('u1', 'r1', 'c1');
    expect(ketQua).toEqual({ thanhCong: true });
    expect(prisma.comment.update).toHaveBeenCalledWith({
      where: { id: 'c1' },
      data: { deletedAt: expect.any(Date) as Date },
    });
  });
});