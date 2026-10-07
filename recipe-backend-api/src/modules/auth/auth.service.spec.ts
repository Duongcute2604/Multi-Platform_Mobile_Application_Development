import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

// Task 2.5: PATCH /auth/me — cập nhật displayName/avatarUrl mà không đụng
// passwordHash (không có update này, mobile sửa hồ sơ không gọi được).
describe('AuthService.capNhatHoSo', () => {
  const taoService = () => {
    const prisma: any = {
      user: {
        findUnique: jest.fn(async () => ({
          id: 'u1', email: 'a@b.c',
        })),
        update: jest.fn(async ({ data }: any) => ({
          email: 'a@b.c',
          displayName: data.displayName ?? 'Ten Cu',
          avatarUrl: data.avatarUrl ?? null,
          role: 'USER',
          status: 'ACTIVE',
        })),
      },
    };
    const jwt: any = { signAsync: jest.fn() };
    const config: any = { get: jest.fn(() => 'x') };
    return { service: new AuthService(prisma, jwt, config), prisma };
  };

  it('cập nhật đầy đủ displayName + avatarUrl trả đúng field, không đụng passwordHash', async () => {
    const { service, prisma } = taoService();
    const dto: UpdateProfileDto = { displayName: 'Ten Moi', avatarUrl: '/uploads/avatar.jpg' };
    const ketQua = await service.capNhatHoSo('u1', dto);
    expect(ketQua).toEqual({
      email: 'a@b.c', displayName: 'Ten Moi', avatarUrl: '/uploads/avatar.jpg', role: 'USER', status: 'ACTIVE',
    });
    const args = prisma.user.update.mock.calls[0][0];
    expect(args.where).toEqual({ id: 'u1' });
    expect(JSON.stringify(args.data)).not.toContain('passwordHash');
    expect(JSON.stringify(args.data)).not.toContain('password');
  });

  it('chỉ displayName -> các field khác giữ nguyên', async () => {
    const { service } = taoService();
    const ketQua = await service.capNhatHoSo('u1', { displayName: 'Ten Moi' });
    expect(ketQua.displayName).toBe('Ten Moi');
    expect(ketQua.avatarUrl).toBeNull();
  });

  it('DTO rỗng (không field nào) -> BadRequestException [AUTH-16]', async () => {
    const { service } = taoService();
    await expect(service.capNhatHoSo('u1', {})).rejects.toThrow(BadRequestException);
    await expect(service.capNhatHoSo('u1', {})).rejects.toThrow('[AUTH-16]');
  });

  it('user không tồn tại -> UnauthorizedException [AUTH-13]', async () => {
    const { service, prisma } = taoService();
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.capNhatHoSo('vong', { displayName: 'X' })).rejects.toThrow(UnauthorizedException);
    await expect(service.capNhatHoSo('vong', { displayName: 'X' })).rejects.toThrow('[AUTH-13]');
  });

  it('DTO chấp nhận từng field hợp lệ, chặn displayName quá ngắn / avatarUrl quá dài', async () => {
    const { validate } = await import('class-validator');
    const { plainToInstance } = await import('class-transformer');
    const ok = await validate(plainToInstance(UpdateProfileDto, { displayName: 'Ten Moi Sau Ky Tu' }));
    expect(ok).toHaveLength(0);
    const loiName = await validate(plainToInstance(UpdateProfileDto, { displayName: 'X' }));
    expect(loiName.length).toBeGreaterThan(0);
    const loiAvatar = await validate(plainToInstance(UpdateProfileDto, { avatarUrl: 'x'.repeat(501) }));
    expect(loiAvatar.length).toBeGreaterThan(0);
  });
});