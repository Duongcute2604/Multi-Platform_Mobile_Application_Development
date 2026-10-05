import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { layThuMucAnh } from './upload-dir';

/** BR-UPLOAD: khớp đúng danh sách mobile khai báo trong `src/lib/api/uploads.ts`. */
const DINH_DANG_HOP_LE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

/**
 * Lỗi dùng chung cho file filter.
 *
 * PHẢI là HttpException chứ không phải Error thường: AllExceptionsFilter chỉ
 * biết gắn mã `UP-xx` cho HttpException có `code`, còn Error thường sẽ bị gói
 * thành `SYS-00` kèm HTTP 500 (lỗi người dùng mà báo 500 là sai).
 */
function loiDinhDang(code: string, message: string): BadRequestException {
  return new BadRequestException({ code, message });
}

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  /**
   * Tải ảnh lên. Mobile đã gọi sẵn endpoint này (`taiAnhLen`) nhưng trước đây
   * backend không có route -> 404, nên màn tạo công thức không bao giờ có ảnh.
   *
   * Trả `{ url: '/uploads/recipes/<ten>.jpg' }` — relative, đúng như
   * `layUrlAnh` của mobile kỳ vọng (hàm đó tự nối origin vào).
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Tải ảnh lên (multipart field `file`)' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // multer gọi destination theo kiểu (req, file, cb) — KHÔNG được truyền
        // thẳng hàm trả string, nếu không nó sẽ chờ cb mãi và treo request.
        destination: (_req, _file, cb) => cb(null, layThuMucAnh()),
        filename: (_req, file, cb) => {
          const duoi = extname(file.originalname).toLowerCase();
          cb(null, `${randomUUID()}${DINH_DANG_HOP_LE.has(duoi) ? duoi : '.jpg'}`);
        },
      }),
      // Giới hạn 5MB — khớp thông báo [UP-03] đã viết sẵn trong AllExceptionsFilter
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const duoi = extname(file.originalname).toLowerCase();
        if (!DINH_DANG_HOP_LE.has(duoi)) {
          cb(loiDinhDang('UP-02', '[UP-02] Chỉ chấp nhận ảnh jpg/jpeg/png/webp/gif'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  taiLen(@UploadedFile() file?: Express.Multer.File) {
    // Trả `{url:''}` (success=true) sẽ làm mobile lưu thumbnail rỗng mà không
    // báo lỗi người dùng — phải từ chối rõ ràng.
    if (!file) throw loiDinhDang('UP-01', '[UP-01] Không nhận được file (field `file`)');
    // `file.filename` chỉ là tên file, phải nối thêm `recipes/` vì file nằm trong
    // <goc>/uploads/recipes/ còn static mount ở <goc>/uploads/.
    return { url: `/uploads/recipes/${file.filename}` };
  }
}
