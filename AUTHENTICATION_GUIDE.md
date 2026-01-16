# 🔐 Hệ Thống Đăng Ký & Đăng Nhập - Quản Lý Hàng Hóa

## 📌 Tổng Quan

Hệ thống đã được tích hợp đầy đủ chức năng authentication với các đặc điểm:

✅ **Đăng ký tài khoản mới**
✅ **Đăng nhập với username/password**
✅ **JWT Token authentication**
✅ **Mỗi user chỉ thấy dữ liệu của chính mình**
✅ **Tự động đăng xuất khi token hết hạn**
✅ **Bảo mật API với middleware**

---

## 🏗️ Kiến Trúc Hệ Thống

### Backend (Node.js + Express)
- **Authentication APIs**: `/api/auth/*`
- **Protected APIs**: `/api/hanghoa/*` (yêu cầu token)
- **JWT Token**: Hết hạn sau 24h
- **Middleware**: `authenticateToken()` bảo vệ các API

### Frontend
- **auth.html**: Trang đăng ký/đăng nhập
- **quan_ly_hang_hoa.html**: Trang quản lý (yêu cầu đăng nhập)
- **localStorage**: Lưu token và thông tin user

---

## 🔑 API Authentication

### 1. ĐĂNG KÝ
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "password": "pass123",
  "fullName": "Nguyễn Văn A"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user123",
    "fullName": "Nguyễn Văn A"
  }
}
```

---

### 2. ĐĂNG NHẬP
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "pass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user123",
    "fullName": "Nguyễn Văn A"
  }
}
```

---

### 3. VERIFY TOKEN
```http
GET /api/auth/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "user": {
    "userId": 1,
    "username": "user123"
  }
}
```

---

## 🛡️ API Bảo Mật

### Cách gọi API có yêu cầu authentication:

```javascript
const token = localStorage.getItem("token");

const response = await fetch("http://localhost:3333/api/hanghoa", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
```

### Các API yêu cầu token:
- ✅ `GET /api/hanghoa` - Lấy danh sách hàng hóa (của user)
- ✅ `GET /api/hanghoa/:id` - Xem chi tiết (của user)
- ✅ `POST /api/hanghoa` - Thêm mới (gắn userId)
- ✅ `PUT /api/hanghoa/:id` - Cập nhật (chỉ của user)
- ✅ `DELETE /api/hanghoa/:id` - Xóa (chỉ của user)

---

## 📊 Cấu Trúc Dữ Liệu

### User Object
```javascript
{
  id: 1,
  username: "user123",
  password: "pass123", // ⚠️ Nên hash trong production
  fullName: "Nguyễn Văn A",
  createdAt: "2026-01-16T10:00:00.000Z"
}
```

### Hàng Hóa Object (có thêm userId)
```javascript
{
  id: 1,
  userId: 1, // 👈 Gắn với user sở hữu
  ngayNhap: "2026-01-15",
  tenHang: "Laptop Dell",
  soLuongNhap: 10,
  thoiGianTra: "2026-01-16",
  soLuongTra: 2,
  history: [...],
  createdAt: "2026-01-15T10:30:00.000Z"
}
```

---

## 🔐 JWT Token

### Cấu trúc Token Payload:
```javascript
{
  userId: 1,
  username: "user123",
  iat: 1642334567,  // Issued at
  exp: 1642420967   // Expires at (24h)
}
```

### Secret Key:
```javascript
const JWT_SECRET = "your-secret-key-change-in-production";
```
⚠️ **Quan trọng**: Trong production, đặt secret key trong `.env` file

---

## 🎯 Luồng Hoạt Động

### 1. Người dùng truy cập trang web:
```
1. Kiểm tra localStorage có token không?
   └─ Có → Vào trang quản lý
   └─ Không → Chuyển đến auth.html
```

### 2. Đăng nhập/Đăng ký:
```
1. User nhập thông tin → Gửi request đến API
2. Backend verify → Tạo JWT token
3. Frontend lưu token vào localStorage
4. Chuyển đến trang quản lý
```

### 3. Gọi API:
```
1. Frontend gửi request + Bearer Token
2. Backend verify token
   └─ Hợp lệ → Lọc data theo userId → Trả về
   └─ Không hợp lệ → 401/403 → Frontend đăng xuất
```

### 4. Đăng xuất:
```
1. Xóa token khỏi localStorage
2. Chuyển về trang đăng nhập
```

---

## 💻 Frontend Code Examples

### Kiểm tra đăng nhập:
```javascript
if (!localStorage.getItem("token")) {
  window.location.href = "auth.html";
}
```

### Gọi API với token:
```javascript
async function apiCall(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    window.location.href = "auth.html";
    return null;
  }

  return await response.json();
}
```

### Đăng xuất:
```javascript
function dangXuat() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "auth.html";
}
```

---

## 🛠️ Cài Đặt & Chạy

### 1. Cài đặt dependencies:
```bash
cd backend
npm install express cors jsonwebtoken
```

### 2. Chạy server:
```bash
cd backend
node index.js
```

### 3. Mở frontend:
```
Mở file: frontend/auth.html
```

---

## 🧪 Test Scenario

### Scenario 1: Đăng ký user mới
1. Mở `auth.html`
2. Chọn tab "Đăng ký"
3. Nhập: username, password, họ tên
4. Bấm "Đăng ký"
5. → Tự động đăng nhập và chuyển đến trang quản lý

### Scenario 2: Đăng nhập
1. Mở `auth.html`
2. Nhập username/password
3. Bấm "Đăng nhập"
4. → Chuyển đến trang quản lý

### Scenario 3: Quản lý dữ liệu
1. Đăng nhập với user A
2. Thêm dữ liệu hàng hóa
3. Đăng xuất
4. Đăng nhập với user B
5. → Chỉ thấy dữ liệu của user B (không thấy của user A)

---

## ⚠️ Lưu Ý Bảo Mật

### 🔴 Trong code mẫu này:
- ❌ Password lưu dạng plain text
- ❌ Secret key hard-coded
- ❌ Dữ liệu lưu trong memory (mất khi restart)

### ✅ Trong Production nên:
- ✅ Hash password với `bcrypt`
- ✅ Lưu secret key trong `.env`
- ✅ Sử dụng database (MongoDB, PostgreSQL)
- ✅ HTTPS cho tất cả requests
- ✅ Rate limiting cho API
- ✅ Refresh token mechanism

---

## 📁 Cấu Trúc Files

```
Code web/
├── backend/
│   ├── index.js           # Backend API với authentication
│   ├── package.json
│   └── node_modules/
│
└── frontend/
    ├── auth.html          # Trang đăng nhập/đăng ký
    └── quan_ly_hang_hoa.html  # Trang quản lý (protected)
```

---

## 🎓 Kiến Thức Áp Dụng

- ✅ JWT (JSON Web Token)
- ✅ Bearer Token Authentication
- ✅ Express Middleware
- ✅ LocalStorage API
- ✅ Protected Routes
- ✅ User Session Management
- ✅ RESTful API Design

---

## 📞 API Endpoints Summary

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/auth/register` | ❌ | Đăng ký |
| POST | `/api/auth/login` | ❌ | Đăng nhập |
| GET | `/api/auth/verify` | ✅ | Verify token |
| GET | `/api/hanghoa` | ✅ | Lấy danh sách (user's data) |
| GET | `/api/hanghoa/:id` | ✅ | Chi tiết (user's data) |
| POST | `/api/hanghoa` | ✅ | Thêm mới (gắn userId) |
| PUT | `/api/hanghoa/:id` | ✅ | Cập nhật (user's data) |
| DELETE | `/api/hanghoa/:id` | ✅ | Xóa (user's data) |

---

## ✨ Features Hoàn Thành

✅ Đăng ký tài khoản
✅ Đăng nhập
✅ JWT Token authentication
✅ Middleware bảo vệ API
✅ Mỗi user có dữ liệu riêng
✅ Auto redirect khi chưa login
✅ Auto logout khi token expired
✅ Hiển thị tên user
✅ Nút đăng xuất
✅ Lọc dữ liệu theo userId

---

## 🚀 Next Steps (Nâng Cao)

1. **Database Integration**: MongoDB hoặc PostgreSQL
2. **Password Hashing**: Sử dụng bcrypt
3. **Refresh Token**: Tự động gia hạn token
4. **Role-based Access**: Admin/User permissions
5. **Email Verification**: Xác thực email khi đăng ký
6. **Password Reset**: Quên mật khẩu
7. **Profile Management**: Cập nhật thông tin cá nhân

---

**🎉 Hệ thống authentication đã hoàn chỉnh và sẵn sàng sử dụng!**
