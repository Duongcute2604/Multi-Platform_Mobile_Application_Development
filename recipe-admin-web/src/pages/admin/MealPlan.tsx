import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatVn } from '@shared/number';
import { format } from 'date-fns';
import {
  layDanhSachKeHoachAn,
  taoKeHoachAn,
  capNhatKeHoachAn,
  xoaKeHoachAn,
  themMonVaoKeHoach,
  capNhatMonTrongKeHoach,
  xoaMonKhoiKeHoach,
} from '../../api/admin';

export default function MealPlan() {
  const [trang, setTrang] = useState(0);
  const [moModalThem, setMoModalThem] = useState(false);
  const [moModalSua, setMoModalSua] = useState<{ id: string; ten: string; ngayBatDau: string; ngayKetThuc: string } | null>(null);
  const [xemMon, setXemMon] = useState<{ id: string; ten: string } | null>(null);
  const [moModalMon, setMoModalMon] = useState<{ keHoachId: string; item?: { id: string; ngay: string; loaiBuoiAn: string; khauPhan: number } } | null>(null);

  const [formTen, setFormTen] = useState('');
  const [formNgayBatDau, setFormNgayBatDau] = useState('');
  const [formNgayKetThuc, setFormNgayKetThuc] = useState('');
  const [formNgay, setFormNgay] = useState('');
  const [formBuoiAn, setFormBuoiAn] = useState('LUNCH');
  const [formKhauPhan, setFormKhauPhan] = useState(2);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'meal-plans', trang],
    queryFn: () => layDanhSachKeHoachAn(trang, 20),
  });

  const them = useMutation({
    mutationFn: (dto: { ten: string; ngayBatDau: string; ngayKetThuc: string }) =>
      taoKeHoachAn(dto),
    onSuccess: () => {
      setMoModalThem(false);
      setFormTen('');
      setFormNgayBatDau('');
      setFormNgayKetThuc('');
      queryClient.invalidateQueries({ queryKey: ['admin', 'meal-plans'] });
    },
  });

  const sua = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { ten?: string; ngayBatDau?: string; ngayKetThuc?: string } }) =>
      capNhatKeHoachAn(id, dto),
    onSuccess: () => {
      setMoModalSua(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'meal-plans'] });
    },
  });

  const xoaMua = useMutation({
    mutationFn: (id: string) => xoaKeHoachAn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'meal-plans'] });
    },
  });

  const themMon = useMutation({
    mutationFn: ({ keHoachId, dto }: { keHoachId: string; dto: { ngay: string; buoiAn: string; khauPhan: number } }) =>
      themMonVaoKeHoach(keHoachId, dto),
    onSuccess: () => {
      setMoModalMon(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'meal-plans'] });
    },
  });

  const suaMon = useMutation({
    mutationFn: ({ keHoachId, monId, dto }: { keHoachId: string; monId: string; dto: { khauPhan?: number; ngay?: string; buoiAn?: string } }) =>
      capNhatMonTrongKeHoach(keHoachId, monId, dto),
    onSuccess: () => {
      setMoModalMon(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'meal-plans'] });
    },
  });

  const xoaMonMua = useMutation({
    mutationFn: ({ keHoachId, monId }: { keHoachId: string; monId: string }) =>
      xoaMonKhoiKeHoach(keHoachId, monId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'meal-plans'] });
    },
  });

  const tenBuoi = (m: string) =>
    m === 'BREAKFAST' ? 'Sáng' : m === 'LUNCH' ? 'Trưa' : m === 'DINNER' ? 'Tối' : 'Phụ';

  const moSua = (item: { id: string; ten: string; ngayBatDau: string; ngayKetThuc: string }) => {
    setFormTen(item.ten);
    setFormNgayBatDau(item.ngayBatDau.split('T')[0]);
    setFormNgayKetThuc(item.ngayKetThuc.split('T')[0]);
    setMoModalSua({ id: item.id, ten: item.ten, ngayBatDau: item.ngayBatDau, ngayKetThuc: item.ngayKetThuc });
  };

  const submitThem = (e: React.FormEvent) => {
    e.preventDefault();
    them.mutate({ ten: formTen.trim(), ngayBatDau: formNgayBatDau, ngayKetThuc: formNgayKetThuc });
  };

  const submitSua = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moModalSua) return;
    sua.mutate({
      id: moModalSua.id,
      dto: {
        ten: formTen.trim() || undefined,
        ngayBatDau: formNgayBatDau || undefined,
        ngayKetThuc: formNgayKetThuc || undefined,
      },
    });
  };

  const moThemMon = (keHoachId: string, item?: { id: string; ngay: string; loaiBuoiAn: string; khauPhan: number }) => {
    setFormNgay(item ? item.ngay.split('T')[0] : '');
    setFormBuoiAn(item ? item.loaiBuoiAn : 'LUNCH');
    setFormKhauPhan(item ? item.khauPhan : 2);
    setMoModalMon({ keHoachId, item });
  };

  const submitThemMon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moModalMon) return;
    themMon.mutate({
      keHoachId: moModalMon.keHoachId,
      dto: { ngay: formNgay, buoiAn: formBuoiAn, khauPhan: formKhauPhan },
    });
  };

  const submitSuaMon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moModalMon?.item) return;
    suaMon.mutate({
      keHoachId: moModalMon.keHoachId,
      monId: moModalMon.item.id,
      dto: { khauPhan: formKhauPhan, ngay: formNgay || undefined, buoiAn: formBuoiAn },
    });
  };

  const handleXoaMon = (keHoachId: string, monId: string) => {
    if (window.confirm('Xóa món này khỏi kế hoạch?')) {
      xoaMonMua.mutate({ keHoachId, monId });
    }
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
        Kế hoạch ăn ({formatVn(data.tongSoPhanTu)})
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => { setFormTen(''); setFormNgayBatDau(''); setFormNgayKetThuc(''); setMoModalThem(true); }}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          + Thêm kế hoạch
        </button>
      </div>

      <table className="mt-4 w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">STT</th>
            <th className="border p-2 text-left">Tên</th>
            <th className="border p-2 text-left">Từ ngày</th>
            <th className="border p-2 text-left">Đến ngày</th>
            <th className="border p-2 text-left">Trạng thái</th>
            <th className="border p-2 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map((kh: any, i: number) => (
            <tr key={kh.id} className="border-t">
              <td className="number-vn border p-2">{i + 1}</td>
              <td className="border p-2 text-left font-medium">{kh.ten}</td>
              <td className="border p-2 text-left">{format(new Date(kh.ngayBatDau), 'dd/MM/yyyy')}</td>
              <td className="border p-2 text-left">{format(new Date(kh.ngayKetThuc), 'dd/MM/yyyy')}</td>
              <td className="border p-2 text-left">
                {kh.kichHoat ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Hoạt động
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    Tạm ngưng
                  </span>
                )}
              </td>
              <td className="border p-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moSua(kh)}
                    className="rounded bg-ink px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => setXemMon(xemMon?.id === kh.id ? null : { id: kh.id, ten: kh.ten })}
                    className="rounded bg-green-600 px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    Món
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Xóa kế hoạch này? Không thể hoàn tác!')) {
                        xoaMua.mutate(kh.id);
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

      {xemMon && (() => {
        const kh = data.content.find((p: any) => p.id === xemMon.id);
        const cacMon: any[] = kh?.cacMon ?? [];
        return (
          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Món trong kế hoạch: {xemMon.ten}</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moThemMon(xemMon.id)}
                  className="rounded bg-green-600 px-3 py-1.5 text-sm font-semibold text-white"
                >
                  + Thêm món
                </button>
                <button
                  type="button"
                  onClick={() => setXemMon(null)}
                  className="rounded border px-3 py-1.5 text-sm"
                >
                  Đóng
                </button>
              </div>
            </div>
            {cacMon.length === 0 ? (
              <p className="mt-3 text-sm text-neutral-500">Chưa có món nào trong kế hoạch này.</p>
            ) : (
              <table className="mt-3 w-full border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">STT</th>
                    <th className="border p-2 text-left">Món</th>
                    <th className="border p-2 text-left">Ngày</th>
                    <th className="border p-2 text-left">Buổi</th>
                    <th className="border p-2 text-left">Khẩu phần</th>
                    <th className="border p-2 text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {cacMon.map((mon: any, i: number) => (
                    <tr key={mon.id} className="border-t">
                      <td className="number-vn border p-2">{i + 1}</td>
                      <td className="border p-2 text-left font-medium">{mon.congThuc?.ten ?? 'Món đã xóa'}</td>
                      <td className="border p-2 text-left">{format(new Date(mon.ngay), 'dd/MM/yyyy')}</td>
                      <td className="border p-2 text-left">{tenBuoi(mon.loaiBuoiAn)}</td>
                      <td className="border p-2 text-left">{formatVn(mon.khauPhan)} người</td>
                      <td className="border p-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moThemMon(xemMon.id, { id: mon.id, ngay: mon.ngay, loaiBuoiAn: mon.loaiBuoiAn, khauPhan: mon.khauPhan })}
                            className="rounded bg-ink px-3 py-1.5 text-sm font-semibold text-white"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleXoaMon(xemMon.id, mon.id)}
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
          </div>
        );
      })()}

      {moModalMon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">{moModalMon.item ? 'Sửa món' : 'Thêm món vào kế hoạch'}</h2>
            <form onSubmit={moModalMon.item ? submitSuaMon : submitThemMon} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ngày *</label>
                <input
                  type="date"
                  value={formNgay}
                  onChange={(e) => setFormNgay(e.target.value)}
                  required
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Buổi ăn *</label>
                <select
                  value={formBuoiAn}
                  onChange={(e) => setFormBuoiAn(e.target.value)}
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                >
                  <option value="BREAKFAST">Sáng</option>
                  <option value="LUNCH">Trưa</option>
                  <option value="DINNER">Tối</option>
                  <option value="SNACK">Phụ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Khẩu phần *</label>
                <input
                  type="number"
                  min="1"
                  value={formKhauPhan}
                  onChange={(e) => setFormKhauPhan(Number(e.target.value))}
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
                  disabled={!formNgay.trim()}
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

      {moModalThem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Thêm kế hoạch ăn</h2>
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
                <label className="block text-sm font-medium mb-1">Ngày bắt đầu *</label>
                <input
                  type="date"
                  value={formNgayBatDau}
                  onChange={(e) => setFormNgayBatDau(e.target.value)}
                  required
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngày kết thúc *</label>
                <input
                  type="date"
                  value={formNgayKetThuc}
                  onChange={(e) => setFormNgayKetThuc(e.target.value)}
                  required
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
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
                  disabled={!formTen.trim() || !formNgayBatDau || !formNgayKetThuc}
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

      {moModalSua && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Sửa kế hoạch ăn</h2>
            <form onSubmit={submitSua} className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Ngày bắt đầu *</label>
                <input
                  type="date"
                  value={formNgayBatDau}
                  onChange={(e) => setFormNgayBatDau(e.target.value)}
                  required
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngày kết thúc *</label>
                <input
                  type="date"
                  value={formNgayKetThuc}
                  onChange={(e) => setFormNgayKetThuc(e.target.value)}
                  required
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setMoModalSua(null)}
                  className="flex-1 rounded border px-4 py-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!formTen.trim() || !formNgayBatDau || !formNgayKetThuc}
                  className="flex-1 rounded bg-ink px-4 py-2 text-white"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMoModalSua(null)} />
        </div>
      )}
    </div>
  );
}
