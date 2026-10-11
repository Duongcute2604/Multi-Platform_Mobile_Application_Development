import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface NoiDungKiemTra {
  userId: string;
  recipeId: string;
  tieuDe: string;
  moTa?: string | null;
  cacBuoc: string[];
}

export interface KetQuaKiemTra {
  hopLe: boolean;
  tuKhoaTrung: string[]; // từ GỐC (có dấu) để hiển thị trong cảnh cáo
  soLanTrungLichSu: number; // số ca từng bị chặn trùng từ trong ModerationCase
}

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(private prisma: PrismaService) {}

  // Chuẩn hoá để so khớp: thường hoá, bỏ dấu tiếng Việt, đ -> d, gộp khoảng trắng
  private chuanHoa(s?: string | null): string {
    return (s ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private thoatKyTuDacBiet(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Kiểm nội dung gửi duyệt; nếu bẩn -> ghi 1 ca vào ModerationCase rồi trả kết quả
  // (lỗi DB -> fail-open: không chặn luồng gửi duyệt, chỉ log WARN [MOD-01])
  async kiemTraVaGhiNhan(noiDung: NoiDungKiemTra): Promise<KetQuaKiemTra> {
    try {
      const tuKhoas = await this.prisma.toxicKeyword.findMany();
      if (tuKhoas.length === 0) {
        return { hopLe: true, tuKhoaTrung: [], soLanTrungLichSu: 0 };
      }

      const noiDungGoc = [noiDung.tieuDe, noiDung.moTa ?? '', ...(noiDung.cacBuoc ?? [])].join(
        ' \u2014 ',
      );
      const noiDungChuanHoa = this.chuanHoa(noiDungGoc);

      const trung: Array<{ goc: string; chuanHoa: string }> = [];
      for (const tk of tuKhoas) {
        const chuanHoa = this.chuanHoa(tk.word);
        if (!chuanHoa) continue;
        // Hai từ khác nhau có thể cùng chuẩn hoá ('đén' vs 'den') — chỉ giữ 1 dạng
        if (trung.some((x) => x.chuanHoa === chuanHoa)) continue;
        // Ranh giới từ: từ cấm phải đứng riêng (đầu/cuối chuỗi hoặc kề khoảng trắng),
        // tránh bắt nhầm "hại" bên trong "hoanghai"
        const bat = new RegExp(`(^|\\s)${this.thoatKyTuDacBiet(chuanHoa)}($|\\s)`);
        if (bat.test(noiDungChuanHoa)) {
          trung.push({ goc: tk.word, chuanHoa });
        }
      }
      if (trung.length === 0) {
        return { hopLe: true, tuKhoaTrung: [], soLanTrungLichSu: 0 };
      }

      // Lịch sử: đếm các ca từng bị chặn TRÙNG TOKEN NGUYÊN trong CSV chuẩn hoá.
      // `contains` chỉ là bước lọc nhanh trong DB — phải xác nhận lại từng token,
      // nếu không từ ngắn ('an') sẽ khớp con trong ca khác ('hang trang') và
      // báo "N lần trước đó" sai cho người dùng.
      const caIds = new Set<string>();
      for (const t of trung) {
        const caCu = await this.prisma.moderationCase.findMany({
          where: { matchedKeywords: { contains: t.chuanHoa } },
          select: { id: true, matchedKeywords: true },
        });
        for (const c of caCu) {
          const cacToken = c.matchedKeywords
            .split(',')
            .map((x) => x.trim())
            .filter(Boolean);
          if (cacToken.includes(t.chuanHoa)) caIds.add(c.id);
        }
      }

      // Ghi ca mới. Lỗi ở đây KHÔNG được làm mất phần chặn: fail-open chỉ dành
      // cho việc ĐỌC dữ liệu kiểm tra — đã xác định bẩn thì vẫn trả hopLe=false
      // (chỉ mất dòng lịch sử, log [MOD-01]).
      try {
        await this.prisma.moderationCase.create({
          data: {
            userId: noiDung.userId,
            recipeId: noiDung.recipeId,
            matchedKeywords: trung.map((t) => t.chuanHoa).join(', '),
            // Trích 200 ký tự đầu (tiêu đề + mô tả + bước) để admin đối chiếu ca
            excerpt: noiDungGoc.slice(0, 200),
          },
        });
      } catch (loiGhiCa) {
        this.logger.warn(
          `[MOD-01] Khong luu duoc ca chan (van chan): ${loiGhiCa instanceof Error ? loiGhiCa.message : String(loiGhiCa)}`,
        );
      }

      return {
        hopLe: false,
        tuKhoaTrung: trung.map((t) => t.goc),
        soLanTrungLichSu: caIds.size,
      };
    } catch (err) {
      this.logger.warn(
        `[MOD-01] Lỗi kiểm độc tố, cho qua (fail-open): ${err instanceof Error ? err.message : String(err)}`,
      );
      return { hopLe: true, tuKhoaTrung: [], soLanTrungLichSu: 0 };
    }
  }
}
