import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatVn } from '@shared/number';
import { format } from 'date-fns';
import {
  layDanhSachDanhSachDiCho,
  taoDanhSachDiCho,
  xoaDanhSachDiCho,
} from '../../api/admin';

export default function ShoppingList() {
  const [trang, setTrang] = useState(0);
  const [tuKhoa, setTuKhoa] = useState('');
  const [moModalThem, setMoModalThem] = useState(false);

  const [formTen, setFormTen] = useState('');
  const [formLoaiNguon, setFormLoaiNguon] = useState<'RECIPE' | 'MEAL_PLAN' | 'MANUAL'>('MANUAL');
  const [formNguonId, setFormNguonId] = useState('');

  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'shopping-lists', trang],
    queryFn: () => layDanhSachDanhSachDiCho(trang, 20),
  });

  const them = useMutation({
    mutationFn: (dto: { ten: string; loaiNguon: 'RECIPE' | 'MEAL_PLAN' | 'MANUAL'; nguonId?: string }) =>
      taoDanhSachDiCho({ ten: dto.ten, loaiNguon: dto.loaiNguon, nguonId: dto.nguonId }),
    onSuccess: () => {
      setMoModalThem(false);
      setFormTen('');
      setFormNguonId('');
      queryClient.invalidateQueries({ queryKey: ['admin', 'shopping-lists'] });
    },
  });

  const xoaMua = useMutation({
    mutationFn: (id: string) => xoaDanhSachDiCho(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shopping-lists'] });
    },
  });

  const submitThem = (e: React.FormEvent) => {
    e.preventDefault();
    them.mutate({ ten: formTen.trim(), loaiNguon: formLoaiNguon, nguonId: formNguonId || undefined });
  };

  if (isLoading) return <p className="p-4">Đang tải...</p>;
  if (isError || !data)
    return (
      <div className="p-4">
        <p className="text-left text-red-600">Không tải được danh sách</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 rounded bg-ink px-4 py-2 text-white"
        >
          Thử lại
        </button>
      </div>
    );

  return (
    <div>
      <h1 className="text-left text-2xl font-bold">
        Danh sách đi chợ ({formatVn(data.tongSoPhanTu)})
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => { setFormTen(''); setFormNguonId(''); setFormLoaiNguon('MANUAL'); setMoModalThem(true); }}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          + Thêm danh sách
        </button>
        <input
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') refetch();
          }}
          placeholder="Tìm tên..."
          className="w-64 rounded-xl border px-3 py-2 text-sm"
        />
      </div>

      <table className="mt-4 w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">STT</th>
            <th className="border p-2 text-left">Tên</th>
            <th className="border p-2 text-left">Loại nguồn</th>
            <th className="border p-2 text-left">Trạng thái</th>
            <th className="border p-2 text-left">Ngày tạo</th>
            <th className="border p-2 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map((ds: any, i: number) => (
            <tr key={ds.id} className="border-t">
              <td className="number-vn border p-2">{trang * 20 + i + 1}</td>
              <td className="border p-2 text-left font-medium">{ds.ten}</td>
              <td className="border p-2 text-left">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  ds.loaiNguon === 'RECIPE' ? 'bg-blue-100 text-blue-800' :
                  ds.loaiNguon === 'MEAL_PLAN' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ds.loaiNguon === 'RECIPE' ? 'Công thức' : ds.loaiNguon === 'MEAL_PLAN' ? 'Kế hoạch' : 'Thủ công'}
                </span>
              </td>
              <td className="border p-2 text-left">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  ds.trangThai === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  ds.trangThai === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {ds.trangThai === 'ACTIVE' ? 'Đang hoạt động' : ds.trangThai === 'COMPLETED' ? 'Hoàn thành' : ds.trangThai}
                </span>
              </td>
              <td className="border p-2 text-left">{format(new Date(ds.ngayTao), 'dd/MM/yyyy')}</td>
              <td className="border p-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Xóa danh sách này? Không thể hoàn tác!')) {
                      xoaMua.mutate(ds.id);
                    }
                  }}
                  className="rounded border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={trang === 0}
          onClick={() => setTrang((t) => Math.max(0, t - 1))}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Trước
        </button>
        <span className="self-center text-sm text-neutral-600">
          Trang {trang + 1} / {data.tongSoTrang} (Tổng {formatVn(data.tongSoPhanTu)})
        </span>
        <button
          type="button"
          disabled={trang + 1 >= data.tongSoTrang}
          onClick={() => setTrang((t) => t + 1)}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {moModalThem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Thêm danh sách đi chợ</h2>
            <form onSubmit={submitThem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên *</label>
                <input
                  type="text"
                  value={formTen}
                  onChange={(e) => setFormTen(e.target.value)}
                  required
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Loại nguồn</label>
                <select
                  value={formLoaiNguon}
                  onChange={(e) => setFormLoaiNguon(e.target.value as 'RECIPE' | 'MEAL_PLAN' | 'MANUAL')}
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                >
                  <option value="MANUAL">Thủ công</option>
                  <option value="RECIPE">Công thức</option>
                  <option value="MEAL_PLAN">Kế hoạch ăn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nguồn (ID) - tùy chọn</label>
                <input
                  type="text"
                  value={formNguonId}
                  onChange={(e) => setFormNguonId(e.target.value)}
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                  placeholder="ID công thức/kế hoạch"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setMoModalThem(false)}
                  className="flex-1 rounded border px-4 py-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!formTen.trim()}
                  className="flex-1 rounded bg-ink px-4 py-2 text-white"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMoModalThem(false)} />
        </div>
      )}
    </div>
  );
}
