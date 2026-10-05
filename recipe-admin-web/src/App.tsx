import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layout/AdminLayout';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/analytics/DashboardPage';
import AllRecipesPage from './pages/recipes/AllRecipesPage';
import PendingRecipesPage from './pages/recipes/PendingRecipesPage';
import ReferencesPage from './pages/references/ReferencesPage';
import UsersPage from './pages/users/UsersPage';
import IngredientsPage from './pages/IngredientsPage';
import DanhMuc from './pages/admin/DanhMuc';
import Nhan from './pages/admin/Nhan';
import MealPlan from './pages/admin/MealPlan';
import ShoppingList from './pages/admin/ShoppingList';

/**
 * Bảng định nghĩa route của trang quản trị.
 *
 * Mọi trang con nằm dưới `<Route element={<AdminLayout/>}>` nên được bảo vệ và
 * hiển thị trong khung chung một lần — không lặp `<RequireAdmin>` ở từng route.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/recipes" element={<AllRecipesPage />} />
        <Route path="/recipes/pending" element={<PendingRecipesPage />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/references" element={<ReferencesPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/categories" element={<DanhMuc />} />
        <Route path="/tags" element={<Nhan />} />
        <Route path="/meal-plans" element={<MealPlan />} />
        <Route path="/shopping-lists" element={<ShoppingList />} />
        {/* Mọi đường dẫn lạ về trang chủ thay vì trang trắng */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}