import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatVn } from '@shared/number';
import { 
  layDanhSachDanhMuc, 
  taoDanhMuc, 
  capNhatDanhMuc, 
  xoaDanhMuc,
  type DanhMuc,
} from '../../api/admin';

export default function DanhMuc() {
  const [trang, setTrang] = useState(0);
  const [tuKhoa, setTuKhoa] = useState('');
  const [moModalThem, setMoModalThem] = useState(false);
  const [moModalSua, setMoModalSua] = useState<{ id: string; ten: string; slug: string; moTa: string | null } | null>(null);
  
  const [formTen, setFormTen] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formMoTa, setFormMoTa] = useState('');
  
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'danh-muc', trang],
    queryFn: () => layDanhSachDanhMuc(trang, 20),
  });
  
  const lamMoi = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'danh-muc'] });
  };
  
  const them = useMutation({
    mutationFn: (dto: { ten: string; slug?: string; moTa?: string }) => 
      taoDanhMuc({ ten: dto.ten, slug: dto.slug, moTa: dto.moTa }),
    onSuccess: () => {
      setMoModalThem(false);
      setFormTen('');
      setFormSlug('');
      setFormMoTa('');
      lamMoi();
    },
  });
  
  const sua = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: { ten?: string; slug?: string; moTa?: string } }) => 
      capNhatDanhMuc(id, dto),
    onSuccess: () => {
      setMoModalSua(null);
      setFormTen('');
      setFormSlug('');
      setFormMoTa('');
      lamMoi();
    },
  });
  
  const xoaMua = useMutation({
    mutationFn: xoaDanhMuc,
    onSuccess: lamMoi,
  });
  
  const moThem = () => {
    setFormTen('');
    setFormSlug('');
    setFormMoTa('');
    setMoModalThem(true);
  };
  
  const moSua = (item: { id: string; ten: string; slug: string; moTa: string | null }) => {
    setFormTen(item.ten);
    setFormSlug(item.slug);
    setFormMoTa(item.moTa || '');
    setMoModalSua({ id: item.id, ten: item.ten, slug: item.slug, moTa: item.moTa });
  };
  
  const submitThem = (e: React.FormEvent) => {
    e.preventDefault();
    them.mutate({ ten: formTen.trim(), slug: formSlug.trim() || undefined, moTa: formMoTa.trim() || undefined });
  };
  
  const submitSua = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moModalSua) return;
    sua.mutate({ 
      id: moModalSua.id, 
      dto: { 
        ten: formTen.trim() || undefined, 
        slug: formSlug.trim() || undefined, 
        moTa: formMoTa.trim() || undefined 
      } 
    });
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
        Danh mục ({formatVn(data.tongSoPhanTu)})
      </h1>
      
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={moThem}
          className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          + Thêm danh mục
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
            <th className="border p-2 text-left">Mô tả</th>
            <th className="border p-2 text-left">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.content.map((dm, i) => (
            <tr key={dm.id} className="border-t">
              <td className="number-vn border p-2">{i + 1}</td>
              <td className="border p-2 text-left font-medium">{dm.ten}</td>
              <td className="border p-2 text-left text-neutral-600">{dm.slug}</td>
              <td className="border p-2 text-left text-neutral-600 max-w-xs truncate">{dm.moTa || '—'}</td>
              <td className="border p-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moSua(dm)}
                    className="rounded bg-ink px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => xoaMua.mutate(dm.id)}
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
      
      {/* Modal Thêm */}
      {moModalThem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Thêm danh mục</h2>
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
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả (tùy chọn)</label>
                <textarea
                  value={formMoTa}
                  onChange={(e) => setFormMoTa(e.target.value)}
                  rows={3}
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
      
      {/* Modal Sửa */}
      {moModalSua && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Sửa danh mục</h2>
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
                <label className="block text-sm font-medium mb-1">Slug (tùy chọn)</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full mt-1 rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả (tùy chọn)</label>
                <textarea
                  value={formMoTa}
                  onChange={(e) => setFormMoTa(e.target.value)}
                  rows={3}
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
                  disabled={!formTen.trim()}
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