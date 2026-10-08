/**
 * Seed từ cấm cho auto-kiểm độc tố khi GỬI DUYỆT công thức (lỗi [REC-09]).
 *
 * Chạy: `npm run db:seed:moderation`
 * Idempotent: upsert theo `word` — chạy lại không nhân đôi, không sửa từ cũ.
 *
 * So khớp runtime (ModerationService): chuẩn hoá cả hai phía
 * (thường hoá + bỏ dấu tiếng Việt + đ -> d) + ranh giới từ,
 * nên từ list dưới đây để dạng "đẹp mắt" (có dấu) là được —
 * user gõ không dấu vẫn bị bắt, và "1 lon sữa" không bị vướng "lon".
 *
 * Contract (tiếng Anh cho model/table trong schema.prisma):
 * - `ToxicKeyword.word` là từ GỐC (hiển thị trong cảnh cáo REC-09).
 */
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

/** Nạp .env như prisma/seed.ts (ts-node không tự nạp env). */
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

const TU_KHIEM_DOC_TO: string[] = [
  // Thô tục / chửi thề (viết tắt + đủ chuẩn — chuẩn hoá runtime gộp các biến thể)
  'dm',
  'dcm',
  'vl',
  'vkl',
  'dkm',
  'đéo',
  'địt',
  'chó đẻ',
  'đồ ngu',
  'thằng ngu',
  // Lừa đảo / quảng cáo trá hình / cờ bạc
  'spam',
  'lừa đảo',
  'cờ bạc',
  'cá độ',
  'quảng cáo',
  'viagra',
  // Ma túy / chất cấm
  'ma túy',
  'hàng trắng',
  // Tiếng Anh
  'fuck',
  'bitch',
  'shit',
  'asshole',
];

async function main(): Promise<void> {
  let taoMoi = 0;
  for (const word of TU_KHIEM_DOC_TO) {
    const cu = await prisma.toxicKeyword.findUnique({ where: { word } });
    if (cu) continue;
    await prisma.toxicKeyword.create({ data: { word } });
    taoMoi += 1;
  }
  const tong = await prisma.toxicKeyword.count();
  console.log(`[seed-moderation] taoMoi=${taoMoi}, tongTuKiem=${tong}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('[seed-moderation] LOI:', e);
  process.exitCode = 1;
});
