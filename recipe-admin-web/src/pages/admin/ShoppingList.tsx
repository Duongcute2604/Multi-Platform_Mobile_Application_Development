import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatVn } from '@shared/number';
import { format } from 'date-fns';
import {
  layDanhSachDanhSachDiCho,
  taoDanhSachDiCho,
  xoaDanhSachDiCho,
  layChiTietDanhSachDiCho,
  themMonVaoDanhSach,
  suaMonTrongDanhSach,
  xoaMonKhoiDanhSach,
  type DanhSachDiCho,
} from '../../api/admin';

type MonDiCho = DanhSachDiCho['cacMon'][number];

export default function ShoppingList() {
  const [trang, setTrang] = useState(0);
  const [tuKhoa, setTuKhoa] = useState('');
  const [moModalThem, setMoModalThem] = useState(false);
  const [moChiTiet, setMoChiTiet] = useState<DanhSachDiCho | null>(null);
  const [moModalMon, setMoModalMon] = useState<{ dsId: string; item?: MonDiCho } | null>(null);

  const [formTen, setFormTen] = useState('');
  const [formLoaiNguon, setFormLoaiNguon] = useState<'RECIPE' | 'MEAL_PLAN' | 'MANUAL'>('MANUAL');
  const [formNguonId, setFormNguonId] = useState('');

  const [formMonTen, setFormMonTen] = useState('');
  const [formMonDinhLuong, setFormMonDinhLuong] = useState('');
  const [formMonDonVi, setFormMonDonVi] = useState('g');

  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'shopping-lists', trang],
    queryFn: () => layDanhSachDanhSachDiCho(trang, 20),
  });

  const taiLaiChiTiet = (dsId: string) => {
    layChiTietDanhSachDiCho(dsId).then((ds) => {
      setMoChiTiet(ds as DanhSachDiCho);
    });
  };

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

  const themMon = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { tenGoc: string; dinhLuong: number; donVi: string } }) =>
      themMonVaoDanhSach(id, dto),
    onSuccess: (_d, vars) => {
      setMoModalMon(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'shopping-lists'] });
      taiLaiChiTiet(vars.id);
    },
  });

  const suaMon = useMutation({
    mutationFn: ({ id, itemId, dto }: { id: string; itemId: string; dto: { tenGoc?: string; dinhLuong?: number; donVi?: string; daChon?: boolean } }) =>
      suaMonTrongDanhSach(id, itemId, dto),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shopping-lists'] });
      taiLaiChiTiet(vars.id);
    },
  });

  const xoaMonMua = useMutation({
    mutationFn: ({ id, itemId }: { id: string; itemId: string }) => xoaMonKhoiDanhSach(id, itemId),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shopping-lists'] });
      taiLaiChiTiet(vars.id);
    },
  });

  const submitThem = (e: React.FormEvent) => {
    e.preventDefault();
    them.mutate({ ten: formTen.trim(), loaiNguon: formLoaiNguon, nguonId: formNguonId || undefined });
  };

  const moThemMon = (dsId: string, item?: MonDiCho) => {
    setFormMonTen(item ? item.tenGoc : '');
    setFormMonDinhLuong(item ? item.dinhLuong : '');
    setFormMonDonVi(item ? item.donVi : 'g');
    setMoModalMon({ dsId, item });
  };

  const submitThemMon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moModalMon) return;
    const dinhLuong = Number(formMonDinhLuong);
    if (!formMonTen.trim() || !Number.isFinite(dinhLuong)) return;
    themMon.mutate({
      id: moModalMon.dsId,
      dto: { tenGoc: formMonTen.trim(), dinhLuong, donVi: formMonDonVi.trim() || 'g' },
    });
  };

  const submitSuaMon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moModalMon?.item) return;
    const dinhLuong = Number(formMonDinhLuong);
    if (!formMonTen.trim() || !Number.isFinite(dinhLuong)) return;
    suaMon.mutate({
      id: moModalMon.dsId,
      itemId: moModalMon.item.id,
      dto: { tenGoc: formMonTen.trim(), dinhLuong, donVi: formMonDonVi.trim() || 'g' },
    });
  };

  const toggleDaMua = (dsId: string, item: MonDiCho) => {
    suaMon.mutate({ id: dsId, itemId: item.id, dto: { daChon: !item.daChon } });
  };

  const handleXoaMon = (dsId: string, itemId: string) => {
    if (window.confirm('Xóa món này khỏi danh sách?')) {
      xoaMonMua.mutate({ id: dsId, itemId });
    }
  };

  const xemChiTiet = (id: string) => {
    taiLaiChiTiet(id);
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
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => xemChiTiet(ds.id)}
                    className="rounded bg-ink px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    Chi tiết
                  </button>
                  <button
                    type="button"
                    onClick={() => moThemMon(ds.id)}
                    className="rounded bg-green-600 px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    + Món
                  </button>
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
                </div>
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

      {moChiTiet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-1">Chi tiết: {moChiTiet.ten}</h2>
            <p className="text-sm text-neutral-500 mb-4">
              {moChiTiet.cacMon.length} món • {moChiTiet.trangThai}
            </p>
            {moChiTiet.cacMon.length === 0 ? (
              <p className="text-sm text-neutral-500">Chưa có món nào trong danh sách này.</p>
            ) : (
              <table className="w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">STT</th>
                    <th className="border p-2 text-left">Món</th>
                    <th className="border p-2 text-left">Định lượng</th>
                    <th className="border p-2 text-left">Đơn vị</th>
                    <th className="border p-2 text-left">Đã mua</th>
                    <th className="border p-2 text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {moChiTiet.cacMon.map((mon: MonDiCho, i: number) => (
                    <tr key={mon.id} className="border-t">
                      <td className="number-vn border p-2">{i + 1}</td>
                      <td className="border p-2 text-left font-medium">{mon.tenGoc}</td>
                      <td className="border p-2 text-left">{formatVn(Number(mon.dinhLuong))}</td>
                      <td className="border p-2 text-left">{mon.donVi}</td>
                      <td className="border p-2 text-left">
                        <input
                          type="checkbox"
                          checked={mon.daChon}
                          onChange={() => toggleDaMua(moChiTiet.id, mon)}
                          className="h-4 w-4 rounded border-neutral-300"
                          aria-label={`Đánh dấu đã mua ${mon.tenGoc}`}
                        />
                      </td>
                      <td className="border p-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moThemMon(moChiTiet.id, mon)}
                            className="rounded bg-ink px-3 py-1.5 text-sm font-semibold text-white"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleXoaMon(moChiTiet.id, mon.id)}
                            className="rounded border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="mt-4 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => moThemMon(moChiTiet.id)}
                className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white"
              >
                + Thêm món
              </button>
              <button
                type="button"
                onClick={() => setMoChiTiet(null)}
                className="rounded border px-4 py-2"
              >
                Đóng
              </button>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMoChiTiet(null)} />
        </div>
      )}

      {moModalMon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{moModalMon.item ? 'Sửa món' : 'Thêm món vào danh sách'}</h2>
            <form onSubmit={moModalMon.item ? submitSuaMon : submitThemMon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên món *</label>
                <input
                  type="text"
                  value={formMonTen}
                  onChange={(e) => setFormMonTen(e.target.value)}
                  required
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Định lượng *</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formMonDinhLuong}
                  onChange={(e) => setFormMonDinhLuong(e.target.value)}
                  required
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Đơn vị *</label>
                <input
                  type="text"
                  value={formMonDonVi}
                  onChange={(e) => setFormMonDonVi(e.target.value)}
                  required
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setMoModalMon(null)}
                  className="flex-1 rounded border px-4 py-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!formMonTen.trim()}
                  className="flex-1 rounded bg-ink px-4 py-2 text-white"
                >
                  {moModalMon.item ? 'Lưu' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMoModalMon(null)} />
        </div>
      )}
    </div>
  );
}
