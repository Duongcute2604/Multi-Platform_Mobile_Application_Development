import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatVn } from '@shared/number';
import { layDanhSachNhan, taoNhan, xoaNhan, type Nhan } from '../../api/admin';

export default function Nhan() {
  const [trang, setTrang] = useState(0);
  const [tuKhoa, setTuKhoa] = useState('');
  const [moModalThem, setMoModalThem] = useState(false);
  
  const [formTen, setFormTen] = useState('');
  const [formSlug, setFormSlug] = useState('');
  
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'nhan', trang],
    queryFn: () => layDanhSachNhan(trang, 20),
  });
  
  const lamMoi = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'nhan'] });
  };
  
  const them = useMutation({
    mutationFn: (dto: { ten: string; slug?: string }) => 
      taoNhan({ ten: dto.ten, slug: dto.slug }),
    onSuccess: () => {
      setMoModalThem(false);
      setFormTen('');
      setFormSlug('');
      lamMoi();
    },
  });
  
  const xoaMua = useMutation({
    mutationFn: xoaNhan,
    onSuccess: lamMoi,
  });
  
  const submitThem = (e: React.FormEvent) => {
    e.preventDefault();
    them.mutate({ ten: formTen.trim(), slug: formSlug.trim() || undefined });
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
        Nhãn (Tag) ({formatVn(data.tongSoPhanTu)})
      </h1>
      
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => { setFormTen(''); setFormSlug(''); setMoModalThem(true); }}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          + Thêm nhãn
        </button>
        <input
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') refetch();
          }}
          placeholder="Tìm tên, slug..."
          className="w-64 rounded-xl border px-3 py-2 text-sm"
        />
      </div>
      
      <table className="mt-4 w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">STT</th>
            <th className="border p-2 text-left">Tên</th>
            <th className="border p-2 text-left">Slug</th>
            <th className="border p-2 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map((n, i) => (
            <tr key={n.id} className="border-t">
              <td className="number-vn border p-2">{trang * 20 + i + 1}</td>
              <td className="border p-2 text-left font-medium">{n.ten}</td>
              <td className="border p-2 text-left text-neutral-600">{n.slug}</td>
              <td className="border p-2">
                <button
                  type="button"
                  onClick={() => { /* edit not implemented yet */ }}
                  className="rounded bg-ink px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Xóa nhãn này? Không thể hoàn tác!')) {
                      xoaMua.mutate(n.id);
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
        <button
          type="button"
          disabled={trang + 1 >= data.tongSoTrang}
          onClick={() => setTrang((t) => t + 1)}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          Sau
        </button>
      </div>
      
      {/* Modal Thêm */}
      {moModalThem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Thêm nhãn</h2>
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
                <label className="block text-sm font-medium mb-1">Slug (tùy chọn)</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
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