import type { ApiResponse, KetQuaTuongTac } from '../../types/api';
import { apiClient, goiApi } from './client';
import { ketQuaTuongTacSchema } from './schemas';

/**
 * BR-FOOD: Tách chuỗi người dùng gõ thành danh sách món.
 * Cho phép người dùng gõ mỗi dòng 1 món, hoặc phân tách bằng dấu phẩy /
 * dấu chấm phẩy cho tiện khi copy từ nơi khác.
 */
export function tachMonTuChuoi(chuoi: string): string[] {
  return chuoi
    .split(/[\n,;]+/)
    .map((mon) => mon.trim())
    .filter((mon) => mon.length > 0);
}

/**
 * BR-FOOD: Gọi bảng tương tác thực phẩm trên backend (rule-based, kèm nguồn).
 * Endpoint public nên không cần token; `apiClient` tự gắn token nếu có.
 */
export async function kiemTraTuongTac(items: string[]): Promise<KetQuaTuongTac> {
  const duLieu = await goiApi(
    apiClient
      .post('food-compatibility/check', { json: { items } })
      .json<ApiResponse<KetQuaTuongTac>>(),
  );
  return ketQuaTuongTacSchema.parse(duLieu);
}