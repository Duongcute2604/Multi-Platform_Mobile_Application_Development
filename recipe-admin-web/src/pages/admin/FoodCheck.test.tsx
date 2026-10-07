/**
 * Test trang FoodCheck (Task 4.1): tiêu đề phải khớp sidebar nav.
 *
 * Trước đây h1 là "Duyệt món — Kiểm tra tương tác" trong khi navItems.ts
 * (mục /food-check) hiển thị "Tương tác món" — trước khi đổi, test này đỏ.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/helpers';
import FoodCheck from './FoodCheck';
import { NAV_ITEMS } from '../../layout/navItems';

vi.mock('../../api/client', () => ({
  apiClient: { get: vi.fn(), patch: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe('FoodCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('tieu de h1 khop nhan sidebar (navItems /food-check)', () => {
    renderWithProviders(<FoodCheck />);
    const navLabel = NAV_ITEMS.find((n) => n.to === '/food-check')?.label ?? '';
    expect(navLabel).toBe('Tương tác món');
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toBe(navLabel);
  });
});