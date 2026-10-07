import { ConflictException, NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';

// BR-02 mở rộng: Admin khôi phục bài HIDDEN -> APPROVED (hành động riêng, không
// qua lifecycle của tác giả). Lỗi gửi notification không được chặn việc khôi phục.
describe('AdminService.restoreRecipe', () => {
  const taoService = (overrides: { status?: string; tonTai?: boolean; loiGuiThongBao?: boolean }) => {
    const prisma: any = {
      recipe: {
        findUnique: jest.fn(async () =>
          overrides.tonTai === false ? null : { id: 'r1', authorId: 'u1', title: 'Món X', status: overrides.status ?? 'HIDDEN' },
        ),
        update: jest.fn(async ({ data }: any) => ({
          title: 'Món X',
          status: data.status,
          rejectionReason: data.rejectionReason,
        })),
      },
    };
    const thongBao: any = {
      guiThongBao: jest.fn(async () => {
        if (overrides.loiGuiThongBao) throw new Error('push down');
      }),
    };
    return { service: new AdminService(prisma, thongBao), prisma, thongBao };
  };

  it('HIDDEN -> APPROVED, xóa rejectionReason, gửi notification (không block nếu lỗi)', async () => {
    const { service, prisma, thongBao } = taoService({ status: 'HIDDEN' });
    const ketQua = await service.restoreRecipe('r1');
    expect(ketQua).toEqual({ title: 'Món X', status: 'APPROVED', rejectionReason: null });
    expect(prisma.recipe.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'r1' }, data: { status: 'APPROVED', rejectionReason: null } }),
    );
    expect(thongBao.guiThongBao).toHaveBeenCalledWith(
      'u1',
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ loai: 'recipe_approved', congThucId: 'r1' }),
    );
  });

  it('lỗi gửi notification không chặn khôi phục', async () => {
    const { service } = taoService({ status: 'HIDDEN', loiGuiThongBao: true });
    await expect(service.restoreRecipe('r1')).resolves.toEqual({
      title: 'Món X',
      status: 'APPROVED',
      rejectionReason: null,
    });
  });

  it('công thức không tồn tại -> NotFoundException [REC-06]', async () => {
    const { service } = taoService({ tonTai: false });
    await expect(service.restoreRecipe('r1')).rejects.toThrow(NotFoundException);
    await expect(service.restoreRecipe('r1')).rejects.toThrow('[REC-06]');
  });

  it('công thức không ở trạng thái HIDDEN -> ConflictException [ADM-07]', async () => {
    const { service } = taoService({ status: 'APPROVED' });
    await expect(service.restoreRecipe('r1')).rejects.toThrow(ConflictException);
    await expect(service.restoreRecipe('r1')).rejects.toThrow('[ADM-07]');
  });
});

// Task 4.2 (web): trước đây findAllUsers cố ý bỏ `id` khỏi select nên trang
// quản trị không có key hàng (React warning) và action "Khóa" gửi id undefined.
// Test này khoá: `id` PHẢI có trong select + phải nằm trong content trả về.
describe('AdminService.findAllUsers', () => {
  it('select phải chứa id để web dùng làm row key và gửi PATCH /admin/users/:id/status', async () => {
    const prisma: any = {
      user: {
        findMany: jest.fn(async () => [
          {
            id: 'u-1',
            email: 'demo@cookbook.vn',
            displayName: 'Demo',
            avatarUrl: null,
            role: 'USER',
            status: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date(),
            _count: { recipes: 0, comments: 0, favorites: 0 },
          },
        ]),
        count: jest.fn(async () => 1),
      },
    };
    const service = new AdminService(prisma, { guiThongBao: jest.fn() } as any);

    const ketQua = await service.findAllUsers({ page: 0, size: 10 });

    expect(ketQua.content[0].id).toBe('u-1');
    const select = prisma.user.findMany.mock.calls[0][0].select as Record<string, unknown>;
    expect(select.id).toBe(true);
  });
});