import type { FC, ReactNode } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';

interface VanBanProps {
  children: ReactNode;
  className?: string;
  soDongToiDa?: number;
  dam?: boolean;
  canLe?: 'trai' | 'giua';
  /** Màu/kiểu chữ động (NativeWind không đổi được class màu theo biến). */
  style?: StyleProp<TextStyle>;
}

/**
 * Thang chữ tiêu đề — nguồn DUY NHẤT của cỡ chữ tiêu đề.
 *
 * QUAN TRỌNG: KHÔNG đổi cỡ tiêu đề bằng `className="text-2xl"`.
 *
 * `TitleText` vẫn luôn kèm `text-xl` trong chuỗi class. Hai class này cùng
 * specificity, lớp nào nằm sau trong stylesheet thắng — và thực tế đo được
 * `text-xl` thắng. Hệ quả: mọi override qua className đều im lặng mất hiệu lực,
 * toàn bộ tiêu đề ra đúng 20px, còn `<Text>` thô (không có `text-xl`) lại chạy
 * đúng 30px -> chính là hiện tượng "chỗ to chỗ nhỏ" cần chuẩn hoá.
 *
 * Dùng prop `kichThuoc` để trong DOM chỉ có đúng MỘT class cỡ chữ, không còn
 * chỗ cho xung đột.
 */
export const BANG_KICH_THUOC_TIEU_DE = {
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
} as const;

export type KichThuocTieuDe = keyof typeof BANG_KICH_THUOC_TIEU_DE;

// BR-UI: Chữ căn trái mặc định, canLe giua cho tiêu đề editorial
export const BodyText: FC<VanBanProps> = ({ children, className = '', soDongToiDa, dam = false, canLe = 'trai', style }) => (
  <Text
    className={`${canLe === 'giua' ? 'text-center' : 'text-left'} text-base text-neutral-900 ${dam ? 'font-semibold' : ''} ${className}`}
    numberOfLines={soDongToiDa}
    style={style}
  >
    {children}
  </Text>
);

// BR-UI: Tiêu đề serif mực editorial đồng bộ web, chữ thường giữ sans
export const TitleText: FC<VanBanProps & { kichThuoc?: KichThuocTieuDe }> = ({
  children,
  className = '',
  soDongToiDa,
  canLe = 'trai',
  style,
  kichThuoc = 'xl',
}) => (
  <Text
    className={`${canLe === 'giua' ? 'text-center' : 'text-left'} font-serif ${BANG_KICH_THUOC_TIEU_DE[kichThuoc]} font-bold text-primary ${className}`}
    numberOfLines={soDongToiDa}
    style={style}
  >
    {children}
  </Text>
);

export const CaptionText: FC<VanBanProps> = ({ children, className = '', soDongToiDa, canLe = 'trai', style }) => (
  <Text className={`${canLe === 'giua' ? 'text-center' : 'text-left'} text-xs text-neutral-500 ${className}`} numberOfLines={soDongToiDa} style={style}>
    {children}
  </Text>
);
