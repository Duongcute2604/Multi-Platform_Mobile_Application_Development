# BUỔI 07 (3 tiết) — CHƯƠNG 3: VÒNG ĐỜI, CONTROLLED COMPONENT, LỒNG COMPONENT (3.4 – 3.6)

> Tài liệu trọn bộ buổi học: Lý thuyết + Trả lời câu hỏi ôn tập + Giải bài tập thực hành.

---

## PHẦN I. TÓM TẮT LÝ THUYẾT

### 3.4 Trình tự hoạt động của một Component (Component Lifecycle)

Một component React Native trải qua 3 giai đoạn chính:

| Giai đoạn | Ý nghĩa | Class Component | Functional Component (hooks) |
|---|---|---|---|
| **Mounting** | Component được tạo và chèn vào DOM (ảo) | `constructor()` → `render()` → `componentDidMount()` | `useEffect(() => {...}, [])` chạy 1 lần sau render đầu |
| **Updating** | Component render lại do `props`/`state` thay đổi | `shouldComponentUpdate()` → `render()` → `componentDidUpdate()` | `useEffect(() => {...}, [deps])` chạy lại khi deps đổi |
| **Unmounting** | Component bị xóa khỏi DOM | `componentWillUnmount()` | hàm cleanup `return () => {...}` trong `useEffect` |

**Mounting (Gắn kết):**
- `constructor()`: gọi đầu tiên khi tạo component, dùng để khởi tạo `state` và bind các phương thức xử lý sự kiện.
- `render()`: phương thức quan trọng nhất, trả về JSX mô tả giao diện.
- `componentDidMount()`: gọi ngay sau lần render đầu tiên (đã vào DOM), nơi lý tưởng để gọi API, đặt timers, đăng ký subscription.
- `useEffect(() => {...}, [])`: tương đương `componentDidMount`, chỉ chạy 1 lần sau render đầu.

**Updating (Cập nhật):**
- `shouldComponentUpdate(nextProps, nextState)`: gọi trước khi render lại; trả về `false` để chặn render nếu không cần → tối ưu hiệu năng.
- `render()`: gọi lại khi `props`/`state` đổi.
- `componentDidUpdate(prevProps, prevState, snapshot)`: gọi sau khi render lại, dùng để chạy side effect dựa trên thay đổi.
- `useEffect(() => {...}, [deps])`: chạy lại mỗi khi một giá trị trong `deps` thay đổi.

**Unmounting (Tháo gỡ):**
- `componentWillUnmount()`: gọi ngay trước khi component bị xóa; dọn dẹp tài nguyên (hủy subscription, xóa timers).
- Cleanup function trong `useEffect`: hàm `return` được gọi trước khi effect chạy lại lần kế tiếp hoặc khi component unmount.

### 3.5 Controlled Component

**Controlled Component** là component mà dữ liệu của nó (thường là giá trị input như `TextInput`) được **kiểm soát và quản lý bởi state của React**.

Khi người dùng gõ chữ → event handler chạy → cập nhật state → state đổi → component render lại với giá trị mới.

**Đặc điểm:**
- Giá trị input luôn đồng bộ với state của component.
- Mọi thay đổi của input đều do code React điều khiển.
- Dễ thực hiện logic nghiệp vụ dựa trên giá trị input (ví dụ validation).

Công thức cốt lõi: `value={state}` + `onChangeText={hàm cập nhật state}`.

### 3.6 Component lồng Component

React Native cho phép tạo giao diện phức tạp bằng cách **lồng các component nhỏ vào nhau**. Một component có thể chứa một/nhiều component khác trong JSX.

Ví dụ: tạo component `Avatar` (ảnh đại diện) rồi lồng `Avatar` vào trong `UserProfile` (ảnh + tên + mô tả). Dữ liệu cha → con đi qua **props** (`profileImage`, `name`, `bio`).

**Lợi ích:** dễ quản lý, dễ tái sử dụng, dễ mở rộng, dễ bảo trì.

---

## PHẦN II. TRẢ LỜI CÂU HỎI ÔN TẬP LÝ THUYẾT

### Câu 1. Các giai đoạn chính trong vòng đời component React Native

Component React Native trải qua **3 giai đoạn** trong vòng đời:

**1) Mounting (Gắn kết)** — component được tạo và chèn vào DOM ảo:
- `constructor()` (Class): chạy đầu tiên, khởi tạo `state`, bind phương thức xử lý sự kiện.
- `render()`: trả về JSX mô tả giao diện.
- `componentDidMount()` (Class): chạy ngay sau render đầu tiên và sau khi đã thêm vào DOM — nơi gọi API, đặt timers, đăng ký subscription.
- Ở Functional Component, dùng `useEffect(() => {...}, [])` mô phỏng `componentDidMount`.

**2) Updating (Cập nhật)** — render lại do `props` hoặc `state` thay đổi:
- `shouldComponentUpdate(nextProps, nextState)`: chạy trước khi render lại; trả về `false` để chặn render không cần thiết, tối ưu hiệu năng.
- `render()`: chạy lại khi `props`/`state` đổi.
- `componentDidUpdate(prevProps, prevState, snapshot)`: chạy sau khi render lại, thực hiện side effect theo thay đổi.
- Ở Functional Component, dùng `useEffect` với dependency array để chạy lại khi deps đổi.

**3) Unmounting (Tháo gỡ)** — component bị xóa khỏi DOM:
- `componentWillUnmount()`: chạy ngay trước khi bị xóa — nơi dọn dẹp tài nguyên (hủy subscription, xóa timers).
- Ở Functional Component, dùng cleanup function `return () => {...}` trong `useEffect`.

**Vai trò các phương thức (Class Component):**
- `render()`: bắt buộc, trả về JSX — không được gây side effect.
- `componentDidMount()`: chạy 1 lần sau render đầu — chạy side effect/khởi tạo dữ liệu.
- `componentDidUpdate()`: chạy sau mỗi lần render lại (khi có cập nhật) — phản ứng theo thay đổi props/state.
- `componentWillUnmount()`: chạy trước khi tháo gỡ — dọn dẹp, tránh rò rỉ bộ nhớ.

### Câu 2. Dùng `useEffect` để mô phỏng vòng đời trong Functional Component

`useEffect(callback, depsArray)` cho phép chạy side effect tương ứng với các pha vòng đời. Có 3 trường hợp nhờ vào **dependency array (mảng phụ thuộc)**:

**a) Chạy một lần sau lần render đầu tiên** — tương đương `componentDidMount`:
```jsx
useEffect(() => {
  console.log('Chạy 1 lần sau render đầu tiên');
  // gọi API, thiết lập timer...
}, []);   // mảng rỗng
```

**b) Chạy lại khi state hoặc props thay đổi** — tương đương `componentDidUpdate`:
```jsx
useEffect(() => {
  console.log('Chạy lại mỗi khi count đổi');
}, [count]);   // liệt kê các giá trị cần theo dõi
```
Nếu **không** truyền dependency array, effect chạy sau **mọi** lần render.

**c) Cleanup khi component bị tháo gỡ (unmount) hoặc trước khi effect chạy lại** — tương đương `componentWillUnmount`:
```jsx
useEffect(() => {
  const timer = setInterval(() => {...}, 1000);
  return () => {
    clearInterval(timer); // cleanup: dọn dẹp
  };
}, []);
```
Hàm `return` (cleanup) sẽ được React gọi **trước khi effect chạy lại** và **khi component unmount**, giúp hủy timer/subscription, tránh rò rỉ bộ nhớ.

**Tóm tắt nhanh:**
| Trường hợp | Cú pháp `useEffect` | Tương đương Class |
|---|---|---|
| Sau render đầu | `useEffect(fn, [])` | `componentDidMount` |
| Khi deps đổi | `useEffect(fn, [deps])` | `componentDidUpdate` |
| Mọi lần render | `useEffect(fn)` | `componentDidMount` + `componentDidUpdate` |
| Dọn dẹp | `return () => {...}` | `componentWillUnmount` |

### Câu 3. Khái niệm Controlled Component

**Controlled Component** là component mà giá trị của input (ví dụ `TextInput`) **do state của React nắm giữ và kiểm soát**, chứ không phải do DOM/ô nhập tự quản lý.

**Vì sao nói giá trị input luôn được kiểm soát bởi state?**
- Thuộc tính `value` của `TextInput` được gán bằng một biến state (ví dụ `text`).
- Khi người dùng gõ, sự kiện `onChangeText` được gọi → hàm handler gọi hàm cập nhật state (`setText`) → state đổi → component render lại → `TextInput` hiển thị giá trị mới từ state.
- Nghĩa là nội dung hiển thị trong ô nhập **luôn là ảnh chiếu của state**; nếu không cập nhật state thì ô nhập không đổi. Đó là lý do ta nói "giá trị input bị state kiểm soát".

**Ví dụ:**
```jsx
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const ControlledInput = () => {
  const [text, setText] = useState(''); // 1. state lưu giá trị input

  const handleChangeText = (newText) => {
    setText(newText); // 4. cập nhật state bằng giá trị mới
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}                    // 2. value gắn với state
        onChangeText={handleChangeText} // 3. mỗi lần gõ -> gọi handler
        placeholder="Nhập gì đó..."
      />
      <Text style={styles.text}>Bạn đã nhập: {text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
  text: { fontSize: 16 },
});

export default ControlledInput;
```
Giải thích: `useState('')` tạo state `text` + hàm `setText`. `value={text}` buộc `TextInput` hiển thị đúng giá trị state. `onChangeText={handleChangeText}` gọi mỗi khi văn bản đổi, cập nhật `text`. State đổi → render lại → ô nhập hiển thị giá trị mới.

### Câu 4. Lợi ích của Controlled Component khi xử lý dữ liệu nhập

1. **Đồng bộ dữ liệu:** giá trị hiển thị trên input và state luôn khớp nhau (single source of truth), tránh lệch pha giữa giao diện và dữ liệu.
2. **Dễ kiểm tra dữ liệu nhập:** vì dữ liệu nằm trong state, ta đọc/so sánh/biến đổi bất cứ lúc nào ngay trong code React.
3. **Dễ validation:** có thể validate ngay trong `onChangeText` hoặc lúc submit, hiển thị thông báo lỗi theo điều kiện; chuẩn hóa input (ví dụ `toLowerCase`, `trim`) trước khi lưu.
4. **Dễ cập nhật giao diện theo state:** mọi thay đổi state tự động kích hoạt render lại → UI (thông báo lỗi, nút bật/tắt, xem trước nội dung...) cập nhật đồng bộ với dữ liệu.
5. **Kiểm soát tốt hơn:** có thể ép định dạng, chặn ký tự, giới hạn độ dài, bật/tắt nút Submit theo tính hợp lệ của dữ liệu.

### Câu 5. Khái niệm component lồng component và lợi ích

**Lồng component (composition)** là việc đặt một component bên trong JSX của component khác. Component cha có thể truyền dữ liệu xuống con qua **props**; component con render phần giao diện riêng của mình.

Ví dụ: tách `Avatar` (chỉ hiển thị ảnh đại diện) rồi lồng vào `UserProfile` (ảnh + tên + mô tả).

**Vì sao giúp chương trình dễ quản lý, dễ tái sử dụng, dễ mở rộng:**
- **Dễ quản lý:** mỗi component đảm nhận một nhiệm vụ nhỏ, code ngắn, rõ ràng, dễ đọc và dễ gỡ lỗi.
- **Dễ tái sử dụng:** `Avatar` có thể dùng lại ở nhiều màn hình (hồ sơ, danh sách bạn bè, bình luận...), không cần viết lại.
- **Dễ mở rộng:** muốn thêm/bớt/sửa giao diện chỉ cần sửa đúng component liên quan, không ảnh hưởng phần còn lại.
- **Dễ bảo trì & phối hợp nhóm:** các thành viên có thể làm việc độc lập trên từng component.
- **Tách biệt mối quan tâm:** giao diện nhỏ, độc lập, dễ kiểm thử.

---

## PHẦN III. GIẢI BÀI TẬP THỰC HÀNH

### Bài tập 1 (Mức dễ) — Màn hình nhập họ tên (Controlled Component)

**Yêu cầu:** `TextInput` để nhập họ tên + dòng `Text` hiển thị "Bạn đã nhập: ...". Dùng Functional Component, `useState`, `value`, `onChangeText`.

**File `App.js`:**
```jsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function App() {
  const [name, setName] = useState(''); // state quản lý giá trị input

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập họ tên của bạn:</Text>

      <TextInput
        style={styles.input}
        placeholder="Ví dụ: Nguyễn Văn A"
        value={name}                 // Controlled: value lấy từ state
        onChangeText={setName}       // mỗi lần gõ -> cập nhật state
      />

      <Text style={styles.result}>Bạn đã nhập: {name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  result: { fontSize: 18, fontWeight: '600', color: '#2c3e50' },
});
```

**Giải thích — vì sao dữ liệu input do state quản lý:**
- `useState('')` tạo biến state `name` và hàm cập nhật `setName`.
- `value={name}`: giá trị hiển thị trong ô input lấy trực tiếp từ state.
- `onChangeText={setName}`: mỗi khi người dùng gõ, React gọi `setName(newText)` để lưu giá trị mới vào state.
- State đổi → component render lại → dòng `Text` "Bạn đã nhập: ..." và ô input cùng cập nhật.
- Nếu state không đổi thì ô input cũng không đổi → chứng tỏ state là "nguồn dữ liệu duy nhất" điều khiển input.

**Ảnh minh chứng cần chụp:** (1) lúc ô input trống, (2) sau khi gõ tên và dòng Text hiển thị đúng.

---

### Bài tập 2 (Mức trung bình) — Danh sách hồ sơ lồng component (`Avatar` + `UserProfile`)

**Yêu cầu:** Tạo `Avatar` (ảnh đại diện) → tạo `UserProfile` (ảnh + tên + mô tả) có import & dùng `Avatar`, truyền props `name`, `bio`, `profileImage`. Trong `App.js` hiển thị ≥ 2 hồ sơ.

Cấu trúc thư mục:
```
src/
 ├─ components/
 │   ├─ Avatar.js
 │   └─ UserProfile.js
 └─ data/ (tuỳ chọn)
App.js
```

**File `components/Avatar.js`:**
```jsx
import React from 'react';
import { Image, StyleSheet } from 'react-native';

export default function Avatar({ imageUrl }) {
  return <Image style={styles.avatar} source={{ uri: imageUrl }} />;
}

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40, // bo tròn
    backgroundColor: '#ddd',
  },
});
```

**File `components/UserProfile.js`:**
```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar'; // lồng component Avatar vào UserProfile

export default function UserProfile({ name, bio, profileImage }) {
  return (
    <View style={styles.container}>
      <Avatar imageUrl={profileImage} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.bio}>{bio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    // bóng đổ (iOS + Android)
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  bio: { textAlign: 'center', marginTop: 5, color: '#555' },
});
```

**File `App.js`:**
```jsx
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import UserProfile from './components/UserProfile';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Danh sách hồ sơ người dùng</Text>

      <UserProfile
        name="Nguyễn Văn A"
        bio="Lập trình viên React Native"
        profileImage="https://i.pravatar.cc/150?img=1"
      />
      <UserProfile
        name="Trần Thị B"
        bio="Nhà thiết kế UI/UX"
        profileImage="https://i.pravatar.cc/150?img=5"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f2f2f2' },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
});
```

**Giải thích:**
- **Dữ liệu truyền từ cha → con qua props:** `App` truyền `name`, `bio`, `profileImage` cho `UserProfile`; `UserProfile` lại truyền `profileImage` xuống `Avatar` dưới tên prop `imageUrl`. Con nhận props và render theo dữ liệu nhận được. Luồng dữ liệu **một chiều (one-way)**: cha → con.
- **Lợi ích tách giao diện thành nhiều component nhỏ:**
  - `Avatar` chỉ lo hiển thị ảnh → có thể tái sử dụng ở bất kỳ đâu (bình luận, danh bạ...).
  - `UserProfile` chỉ lo bố cục một hồ sơ → dễ sửa, dễ đọc.
  - `App` chỉ lo dữ liệu/danh sách → ngắn gọn, dễ thêm hồ sơ mới (chỉ thêm một thẻ `<UserProfile .../>`).
  - Dễ bảo trì, dễ mở rộng, dễ kiểm thử và phối hợp nhóm.

**Ảnh minh chứng:** chụp màn hình hiển thị 2 hồ sơ.

---

### Bài tập 3 — Form đăng ký (Validate)

**Yêu cầu:** Form gồm **Họ tên, Email, Mật khẩu, Confirm mật khẩu**.
- Validate: bỏ trống, email đúng format, mật khẩu ≥ 6 ký tự, confirm phải khớp.
- Bấm Submit: nếu hợp lệ hiển thị **"Đăng ký thành công"**.

**File `App.js`:**
```jsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';

export default function App() {
  // state lưu giá trị các ô nhập (Controlled Component)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // state lưu thông báo lỗi cho từng ô
  const [errors, setErrors] = useState({});
  // state lưu thông báo thành công
  const [success, setSuccess] = useState('');

  // Regex kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Hàm validate toàn bộ form -> trả về object lỗi
  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!emailRegex.test(email.trim())) newErrors.email = 'Email không đúng định dạng';

    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

    if (!confirm) newErrors.confirm = 'Vui lòng nhập lại mật khẩu';
    else if (confirm !== password) newErrors.confirm = 'Mật khẩu xác nhận không khớp';

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccess('Đăng ký thành công'); // hợp lệ
    } else {
      setSuccess(''); // có lỗi -> không hiện thành công
    }
  };

  // Component nhỏ hiển thị 1 ô nhập + thông báo lỗi (tái sử dụng)
  const Field = ({ label, value, onChangeText, error, ...rest }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#aaa"
        {...rest}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Form đăng ký</Text>

        <Field
          label="Họ tên"
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
        />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Field
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
        />
        <Field
          label="Confirm mật khẩu"
          value={confirm}
          onChangeText={setConfirm}
          error={errors.confirm}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>

        {!!success && <Text style={styles.successText}>{success}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  field: { marginBottom: 14 },
  label: { fontSize: 15, marginBottom: 6, fontWeight: '500' },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 13, marginTop: 4 },
  button: {
    backgroundColor: '#2e86de',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  successText: {
    marginTop: 18,
    textAlign: 'center',
    color: '#27ae60',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

**Giải thích logic:**
- Cả 4 ô đều là **Controlled Component**: `value` gắn với state tương ứng, `onChangeText` cập nhật state.
- `validate()` kiểm tra lần lượt: rỗng → email format (regex) → mật khẩu ≥ 6 ký tự → confirm khớp với mật khẩu.
- `handleSubmit()` gọi `validate()`; nếu không còn lỗi (`Object.keys(newErrors).length === 0`) thì hiển thị **"Đăng ký thành công"**, ngược lại hiển thị lỗi dưới từng ô.
- `Field` là component nhỏ tái sử dụng để tránh lặp code, giúp form gọn và dễ mở rộng.

**Ảnh minh chứng cần nộp (2 ảnh):**
1. **Ảnh lỗi:** nhập email sai định dạng / mật khẩu quá ngắn / confirm không khớp → hiện thông báo lỗi.
2. **Ảnh đúng:** nhập hợp lệ → hiện "Đăng ký thành công".

**Nộp bài:** repo (mã nguồn) + 2 ảnh (ảnh lỗi + ảnh đúng).

---

## PHỤ LỤC — CHECKLIST NỘP BÀI BUỔI 7

- [ ] Trả lời 5 câu hỏi ôn tập lý thuyết (Phần II).
- [ ] Bài tập 1: màn hình nhập họ tên + ảnh minh chứng.
- [ ] Bài tập 2: `Avatar` + `UserProfile` + ≥ 2 hồ sơ + ảnh minh chứng.
- [ ] Bài tập 3: Form đăng ký + validate + 2 ảnh (lỗi + đúng).
- [ ] Đẩy mã nguồn lên repo.
