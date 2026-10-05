import { existsSync, mkdirSync } from 'fs';
import { dirname, isAbsolute, join, resolve } from 'path';

/**
 * BR-UPLOAD: Nơi lưu ảnh upload + ảnh seed.
 *
 * README mô tả `UPLOAD_DIR="./uploads"` (relative) — resolve theo **package root**
 * chứ không theo `process.cwd()`. pm2 đang set exec cwd đúng, nhưng nếu ai đó
 * chạy `node dist/...` từ repo root thì cwd khác và sẽ ghi nhầm chỗ.
 */
export function timGocPackage(startDir: string): string {
  let dir = startDir;
  for (let i = 0; i < 10; i += 1) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    const cha = dirname(dir);
    if (cha === dir) break;
    dir = cha;
  }
  return startDir;
}

function gocUpload(): string {
  const tuyChon = process.env.UPLOAD_DIR;
  if (!tuyChon) return join(timGocPackage(__dirname), 'uploads');
  return isAbsolute(tuyChon) ? tuyChon : resolve(timGocPackage(__dirname), tuyChon);
}

/** Trả về `<goc>/uploads/recipes` và tạo sẵn thư mục nếu chưa có. */
export function layThuMucAnh(): string {
  const thuMuc = join(gocUpload(), 'recipes');
  if (!existsSync(thuMuc)) mkdirSync(thuMuc, { recursive: true });
  return thuMuc;
}

/** Thư mục gốc đăng ký static asset (mount ở prefix `/uploads`). */
export function layGocUpload(): string {
  const goc = gocUpload();
  if (!existsSync(goc)) mkdirSync(goc, { recursive: true });
  return goc;
}
