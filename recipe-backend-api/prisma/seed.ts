/**
 * Seed 15 công thức món Việt cho bài nộp.
 *
 * Chạy: `npm run db:seed`
 * Idempotent: đối chiếu theo `title` — chạy lại làm mới nội dung, không nhân đôi.
 *
 * Ảnh đã tải sẵn trong `uploads/recipes/` (nguồn Wikimedia Commons).
 * URL để TƯƠNG ĐỐI `/uploads/recipes/...` — `layUrlAnh` của mobile tự nối origin,
 * để absolute sẽ hỏng ngay khi đổi host/port.
 *
 * Lưu ý contract (2 kiểu tên là CỐ Ý, không "đều hoá"):
 * - `Recipe` / `RecipeIngredient` / `RecipeStep` -> tiếng Anh (xem schema.prisma)
 * - `Rating.binhLuan`, `MealPlan`, `ShoppingList` -> tiếng Việt
 */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { hash } from 'bcrypt';
import { PrismaClient, RecipeSource, RecipeStatus } from '@prisma/client';
import { MON_SEED } from './seed-data';

/**
 * Nạp .env.
 *
 * `prisma` CLI tự đọc .env, nhưng script này chạy bằng ts-node nên PrismaClient
 * sẽ báo "Environment variable not found: DATABASE_URL" nếu không tự nạp.
 */
function napEnv(): void {
  if (process.env.DATABASE_URL) return;
  let thuMuc = __dirname;
  for (let i = 0; i < 5; i += 1) {
    const file = join(thuMuc, '.env');
    if (existsSync(file)) {
      for (const dong of readFileSync(file, 'utf8').split(/\r?\n/)) {
        const khop = /^([A-Z0-9_]+)=(.*)$/.exec(dong.trim());
        if (khop) process.env[khop[1]] = khop[2].replace(/^["']|["']$/g, '');
      }
      return;
    }
    const cha = thuMuc.replace(/[/\\][^/\\]+$/, '');
    if (cha === thuMuc) break;
    thuMuc = cha;
  }
}
napEnv();

const prisma = new PrismaClient();

const EMAIL_ADMIN = 'admin2@cookbook.vn';

/** Slug hoá tên danh mục tiếng Việt: "Bún & Phở" -> "bun-va-pho" */
function taoSlug(ten: string): string {
  return ten
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/&/g, 'va')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Lấy (hoặc tạo) tài khoản chủ sở hữu công thức seed. */
async function layTacGia() {
  const coSan = await prisma.user.findUnique({ where: { email: EMAIL_ADMIN } });
  if (coSan) return coSan.id;

  console.warn(`  [seed] Chưa có ${EMAIL_ADMIN} -> tạo tài khoản ADMIN mới.`);
  return (
    await prisma.user.create({
      data: {
        email: EMAIL_ADMIN,
        passwordHash: await hash('AdminPass123', 10),
        displayName: 'Quan Tri Vien',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    })
  ).id;
}

/** Đảm bảo danh mục tồn tại, trả về id. */
async function layDanhMuc(ten: string): Promise<string> {
  const slug = taoSlug(ten);
  const cu = await prisma.category.findUnique({ where: { slug } });
  if (cu) return cu.id;
  return (await prisma.category.create({ data: { name: ten, slug } })).id;
}

/** Đảm bảo danh sách tag tồn tại, trả về các record. */
async function layThe(tenTags: string[]) {
  const ketQua = [];
  for (const ten of tenTags) {
    const slug = taoSlug(ten);
    const tim = await prisma.tag.findUnique({ where: { slug } });
    ketQua.push(tim ?? (await prisma.tag.create({ data: { name: ten, slug } })));
  }
  return ketQua;
}

async function main() {
  console.log('[seed] Bat dau...');
  const authorId = await layTacGia();
  const theDaDung = new Map<string, string>();
  const danhMucDaDung = new Map<string, string>();

  let taoMoi = 0;
  let capNhat = 0;

  for (const mon of MON_SEED) {
    // Danh mục + tag (cache trong Map để không query lặp)
    if (!danhMucDaDung.has(mon.danhMuc)) {
      danhMucDaDung.set(mon.danhMuc, await layDanhMuc(mon.danhMuc));
    }
    const categoryId = danhMucDaDung.get(mon.danhMuc)!;

    for (const tenTag of mon.the) {
      if (!theDaDung.has(tenTag)) {
        const [tag] = await layThe([tenTag]);
        theDaDung.set(tenTag, tag.id);
      }
    }
    const tagIds = mon.the.map((t) => theDaDung.get(t)!);

    const duLieuCon = {
      title: mon.ten,
      description: mon.moTa,
      thumbnailUrl: mon.anh,
      cookTimeMinutes: mon.thoiGianNau,
      prepTimeMinutes: mon.thoiGianChuanBi,
      servings: mon.khauPhan,
      status: RecipeStatus.APPROVED, // APPROVED de hien ngay tren mobile (DRAFT se bi loc)
      source: RecipeSource.LOCAL,
      categoryId,
      deletedAt: null,
    };

    const cu = await prisma.recipe.findFirst({ where: { title: mon.ten } });

    // Giai đoạn 1: tao/moi truong co ban + xoa phu lieu cu (tranh vi hanh dong
    // `@@unique([recipeId, sortOrder]` khi tao trung STT).
    const recipe = cu
      ? await prisma.recipe.update({
          where: { id: cu.id },
          data: {
            ...duLieuCon,
            ingredients: { deleteMany: {} },
            steps: { deleteMany: {} },
            tags: { set: [] },
          },
        })
      : await prisma.recipe.create({ data: { ...duLieuCon, authorId } });

    // Giai đoạn 2: them nguyen lieu, buoc, dinh duong va tag
    await prisma.recipe.update({
      where: { id: recipe.id },
      data: {
        tags: { connect: tagIds.map((id) => ({ id })) },
        ingredients: {
          create: mon.nguyenLieu.map((nl, i) => ({
            originalText: nl.ten, // chi ghi TEN; so luong hien rieng va tu scale theo khau phan
            quantity: nl.soLuong,
            unit: nl.donVi,
            sortOrder: i + 1,
          })),
        },
        steps: {
          create: mon.buoc.map((b, i) => ({
            stepOrder: i + 1,
            content: b.noiDung,
            imageUrl: b.anh ?? null,
          })),
        },
        nutrition: {
          upsert: {
            update: { ...mon.dinhDuong },
            // KHÔNG đặt recipeId ở đây: nested create đã suy ra từ bản ghi cha
            create: { ...mon.dinhDuong },
          },
        },
      },
    });

    if (cu) capNhat += 1;
    else taoMoi += 1;
    console.log(`  [seed] ${cu ? 'cap nhat' : 'tao    '}  ${mon.ten}`);
  }

  const tong = await prisma.recipe.count({ where: { deletedAt: null } });
  console.log(`[seed] Xong. taoMoi=${taoMoi}, capNhat=${capNhat}, tongCongThuc=${tong}`);
}

main()
  .catch((e) => {
    console.error('[seed] LOI:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
