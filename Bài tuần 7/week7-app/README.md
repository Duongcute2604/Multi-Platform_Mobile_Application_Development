# Week7App — Bài thực hành buổi 7 (React Native / Expo)

Project gồm 3 bài thực hành của buổi 7, chọn bài bằng thanh tab trên cùng.

| Bài | Nội dung | Nơi xem code |
|-----|----------|--------------|
| Bài 1 | Controlled Component — nhập họ tên | `src/screens/Bai1Screen.js` |
| Bài 2 | Lồng component — `Avatar` + `UserProfile` | `src/screens/Bai2Screen.js`, `src/components/` |
| Bài 3 | Form đăng ký + validate | `src/screens/Bai3Screen.js`, `src/components/Field.js` |

## Cấu trúc
```
week7-app/
├─ App.js                     # thanh tab chuyển 3 bài
├─ app.json
├─ babel.config.js
├─ package.json
└─ src/
   ├─ components/
   │  ├─ Avatar.js            # Bài 2
   │  ├─ UserProfile.js       # Bài 2
   │  └─ Field.js             # Bài 3 (ô nhập tái sử dụng)
   └─ screens/
      ├─ Bai1Screen.js
      ├─ Bai2Screen.js
      └─ Bai3Screen.js
```

## Cách chạy
Yêu cầu: đã cài **Node.js** và app **Expo Go** trên điện thoại (hoặc máy ảo Android/iOS).

```bash
cd week7-app
npm install
npx expo start
```
Sau đó:
- Quét mã QR bằng **Expo Go** (điện thoại), hoặc
- Bấm `a` để mở trên máy ảo Android, `i` cho iOS (nếu có máy Mac), `w` cho web.

## Ghi chú
- Nếu `npm install` báo lệch phiên bản, chạy `npx expo install --fix` để Expo tự chỉnh đúng phiên bản.
- Bài 2 dùng ảnh mẫu từ `i.pravatar.cc` (cần mạng). Có thể thay bằng URL ảnh khác.
- Để chụp ảnh minh chứng nộp bài: mở từng tab, chụp màn hình Bài 1, Bài 2, và 2 ảnh của Bài 3 (ảnh lỗi + ảnh đúng).
