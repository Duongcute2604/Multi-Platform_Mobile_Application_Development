# Multi-Platform_Mobile_Application_Development

ở đây là bài tập lớn và bài tập tuần upload lên 

60.		Xây dựng ứng dụng chia sẻ công thức nấu ăn.

> Các thư mục bài: `recipe-backend-api` (NestJS), `recipe-admin-web` (React + Vite),
> `recipe-app-mobile` (Expo), `Mobile/Cook` (bản Android cũ 09/29 — không đụng).
> Xem spec thêm: `PLAN-fix-batch-2026-10.md`.

---

## Khởi động nhanh

Một lệnh khởi động toàn bộ stack (MySQL Docker → Backend → Web Admin → Mobile):

```bat
start-dev.cmd
```

- **Bước 1 — MySQL (cổng 3306):** script chờ Docker Desktop lên rồi kiểm tra MySQL
  (chờ tối đa ~60s). Nếu Docker chưa chạy, nó tự mở Docker Desktop.
- **Bước 2 — Backend (cổng 3000):** nếu `pm2` process `cook-backend` chưa online thì
  tự start từ `dist/`, rồi chờ API lên. Docs: http://localhost:3000/api/docs
- **Bước 3 — Web Admin (cổng 5173):** nếu cổng trống, mở cửa sổ mới chạy Vite.
- **Bước 4 — Mobile Expo (cổng 8081):** nếu cổng trống, mở cửa sổ mới chạy Expo web.

Tắt Web Admin + Mobile (không động tới MySQL/backend):

```bat
stop-dev.cmd
```

### Mẹo khởi động nhanh hơn

- **Bật Docker Desktop auto-start** khi đăng nhập Windows (Settings → General →
  Start Docker Desktop when you sign in) — bỏ bước chờ Docker thủ công.
- **Lưu backend vào pm2** để nó tự chạy lại sau khi khởi động lại máy: chạy một lần
  `pm2 start "dist\recipe-backend-api\src\main.js" --name cook-backend --cwd <đường dẫn recipe-backend-api>`
  rồi `pm2 save` — pm2 tự khôi phục danh sách process sau khi boot.
- Giữ dev-server chạy liên tục: chỉ tắt cửa sổ Vite/Expo khi không dùng nữa
  (dùng `stop-dev.cmd` thay vì sập cửa sổ, không làm rơi tiến trình con).
- Port/IP mobile: xem `.env` trong `recipe-app-mobile/`
  (`EXPO_PUBLIC_API_URL` — localhost trên web, `10.0.2.2` trên Android emulator,
  IP LAN khi test bằng máy thật).
