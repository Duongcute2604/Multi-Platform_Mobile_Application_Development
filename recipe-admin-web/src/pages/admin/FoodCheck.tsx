import { useState } from 'react';
import { formatVn } from '@shared/number';
import { apiClient } from '../../api/client';

/**
 * Trang quan tri cua muc "Duyet mon" trong sidebar.
 *
 * Truoc day nav item nay tro toi `/food-check` nhung App.tsx khong co route
 * nen `path="*"` day nguoi dung ve trang chu (link chet). Backend co san
 * `POST /food-compatibility/check` (mobile dang dung) nen tao trang tai day
 * de muc dieu huong co dich that.
 */

type CapDo = 'CONFLICT' | 'HARMONIOUS' | 'NEUTRAL';

interface CapTayTuongTac {
  a: string;
  b: string;
  level: CapDo;
  note: string | null;
  source: string | null;
}

interface KetQuaTuongTac {
  items: string[];
  pairs: CapTayTuongTac[];
  summary: { conflicts: number; harmonious: number; neutrals: number };
}

// BR-FOOD: chi phep moi dong 1 mon, hoac tach bang dau phay / dau cham phay.
export function tachMonTuChuoi(chuoi: string): string[] {
  return chuoi
    .split(/[\n,;]+/)
    .map((mon) => mon.trim())
    .filter((mon) => mon.length > 0);
}

const MAU_THEO_CAP: Record<CapDo, { nhan: string; chu: string }> = {
  CONFLICT: { nhan: 'Kỵ / Độc', chu: 'bg-red-100 text-red-700' },
  HARMONIOUS: { nhan: 'Hợp', chu: 'bg-green-100 text-green-700' },
  NEUTRAL: { nhan: 'Trung tính', chu: 'bg-neutral-100 text-neutral-600' },
};

// FO-04: CONFLICT dung dau vi do an toan.
const THU_TU: Record<CapDo, number> = { CONFLICT: 0, HARMONIOUS: 1, NEUTRAL: 2 };

export default function FoodCheck() {
  const [nhap, setNhap] = useState('');
  const [dangGui, setDangGui] = useState(false);
  const [ketQua, setKetQua] = useState<KetQuaTuongTac | null>(null);
  const [loi, setLoi] = useState<string | null>(null);

  const kiemTra = async () => {
    const items = tachMonTuChuoi(nhap);
    if (items.length === 0) {
      setLoi('Nhập ít nhất một món để kiểm tra');
      setKetQua(null);
      return;
    }
    setDangGui(true);
    setLoi(null);
    try {
      const res = await apiClient.post('/food-compatibility/check', { items });
      setKetQua(res.data as KetQuaTuongTac);
    } catch (e: any) {
      setKetQua(null);
      setLoi(e?.response?.data?.message || 'Không kiểm tra được, thử lại sau');
    } finally {
      setDangGui(false);
    }
  };

  const cacCap = ketQua
    ? [...ketQua.pairs].sort((x, y) => THU_TU[x.level] - THU_TU[y.level])
    : [];

  return (
    <div>
      <h1 className="text-left text-2xl font-bold">Tương tác món</h1>
      <p className="mt-1 text-left text-sm text-neutral-500">
        Nhập các món cần so cùng nhau, mỗi món một dòng (hoặc cách nhau bằng dấu phẩy).
      </p>

      <textarea
        value={nhap}
        onChange={(e) => setNhap(e.target.value)}
        rows={6}
        placeholder={'Thịt chó\nMật ong\nBia'}
        className="mt-4 w-full max-w-2xl rounded-xl border px-3 py-2 text-sm"
      />

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={kiemTra}
          disabled={dangGui}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {dangGui ? 'Đang kiểm tra...' : 'Kiểm tra'}
        </button>
        {ketQua && (
          <span className="text-sm text-neutral-500">
            {formatVn(ketQua.items.length)} món · {formatVn(ketQua.pairs.length)} cặp
          </span>
        )}
      </div>

      {loi && <p className="mt-3 text-left text-sm text-red-600">{loi}</p>}

      {ketQua && (
        <>
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-xl border bg-white px-4 py-3">
              <div className="text-left text-xs text-neutral-500">Kỵ / Độc</div>
              <div className="number-vn text-left text-2xl font-bold text-red-600">
                {formatVn(ketQua.summary.conflicts)}
              </div>
            </div>
            <div className="rounded-xl border bg-white px-4 py-3">
              <div className="text-left text-xs text-neutral-500">Hợp</div>
              <div className="number-vn text-left text-2xl font-bold text-green-600">
                {formatVn(ketQua.summary.harmonious)}
              </div>
            </div>
            <div className="rounded-xl border bg-white px-4 py-3">
              <div className="text-left text-xs text-neutral-500">Trung tính</div>
              <div className="number-vn text-left text-2xl font-bold text-neutral-600">
                {formatVn(ketQua.summary.neutrals)}
              </div>
            </div>
          </div>

          {cacCap.length === 0 ? (
            <p className="mt-4 text-left text-sm text-neutral-500">
              Cần ít nhất hai món để tạo thành cặp so sánh.
            </p>
          ) : (
            <table className="mt-4 w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">STT</th>
                  <th className="border p-2 text-left">Món A</th>
                  <th className="border p-2 text-left">Món B</th>
                  <th className="border p-2 text-left">Mức</th>
                  <th className="border p-2 text-left">Ghi chú</th>
                  <th className="border p-2 text-left">Nguồn</th>
                </tr>
              </thead>
              <tbody>
                {cacCap.map((cap, i) => (
                  <tr key={`${cap.a}-${cap.b}`} className="border-t">
                    <td className="number-vn border p-2">{i + 1}</td>
                    <td className="border p-2 text-left font-medium">{cap.a}</td>
                    <td className="border p-2 text-left font-medium">{cap.b}</td>
                    <td className="border p-2 text-left">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${MAU_THEO_CAP[cap.level].chu}`}>
                        {MAU_THEO_CAP[cap.level].nhan}
                      </span>
                    </td>
                    <td className="border p-2 text-left text-neutral-600">{cap.note || '—'}</td>
                    <td className="border p-2 text-left text-neutral-500">{cap.source || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
