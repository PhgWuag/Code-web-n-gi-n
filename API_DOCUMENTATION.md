# 📋 API Documentation - Quản lý Hàng Hóa

## 🌐 Base URL
```
http://localhost:3333
```

---

## 📌 Endpoints

### 1. **Lấy danh sách tất cả hàng hóa**
```http
GET /api/hanghoa
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ngayNhap": "2026-01-15",
      "tenHang": "Laptop Dell",
      "soLuongNhap": 10,
      "thoiGianTra": "2026-01-16",
      "soLuongTra": 2,
      "history": [],
      "createdAt": "2026-01-15T10:30:00.000Z"
    }
  ],
  "summary": {
    "tongNhap": 10,
    "tongTra": 2,
    "tonKho": 8
  }
}
```

---

### 2. **Lấy chi tiết một hàng hóa**
```http
GET /api/hanghoa/:id
```

**Parameters:**
- `id` (number) - ID của hàng hóa

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "ngayNhap": "2026-01-15",
    "tenHang": "Laptop Dell",
    "soLuongNhap": 10,
    "thoiGianTra": "2026-01-16",
    "soLuongTra": 2,
    "history": []
  }
}
```

---

### 3. **Thêm hàng hóa mới**
```http
POST /api/hanghoa
```

**Request Body:**
```json
{
  "ngayNhap": "2026-01-15",
  "tenHang": "Laptop Dell",
  "soLuongNhap": 10,
  "thoiGianTra": "2026-01-16",
  "soLuongTra": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thêm hàng hóa thành công",
  "data": {
    "id": 1,
    "ngayNhap": "2026-01-15",
    "tenHang": "Laptop Dell",
    "soLuongNhap": 10,
    "thoiGianTra": "2026-01-16",
    "soLuongTra": 2,
    "history": [],
    "createdAt": "2026-01-15T10:30:00.000Z"
  }
}
```

---

### 4. **Cập nhật hàng hóa**
```http
PUT /api/hanghoa/:id
```

**Parameters:**
- `id` (number) - ID của hàng hóa

**Request Body:**
```json
{
  "ngayNhap": "2026-01-15",
  "tenHang": "Laptop Dell XPS",
  "soLuongNhap": 12,
  "thoiGianTra": "2026-01-16",
  "soLuongTra": 3,
  "note": "Khách trả thêm 1 máy"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cập nhật thành công",
  "data": {
    "id": 1,
    "ngayNhap": "2026-01-15",
    "tenHang": "Laptop Dell XPS",
    "soLuongNhap": 12,
    "thoiGianTra": "2026-01-16",
    "soLuongTra": 3,
    "history": [
      {
        "time": "15/1/2026, 10:45:00",
        "changes": [
          "SL nhập: 10 → 12",
          "SL trả: 2 → 3"
        ],
        "note": "Khách trả thêm 1 máy"
      }
    ],
    "updatedAt": "2026-01-15T10:45:00.000Z"
  }
}
```

---

### 5. **Xóa hàng hóa**
```http
DELETE /api/hanghoa/:id
```

**Parameters:**
- `id` (number) - ID của hàng hóa

**Response:**
```json
{
  "success": true,
  "message": "Xóa thành công",
  "data": {
    "id": 1,
    "ngayNhap": "2026-01-15",
    "tenHang": "Laptop Dell",
    "soLuongNhap": 10,
    "thoiGianTra": "2026-01-16",
    "soLuongTra": 2
  }
}
```

---

## 🔧 Frontend Integration

### Ví dụ sử dụng Fetch API:

#### 1. Lấy danh sách
```javascript
async function layDanhSach() {
  const response = await fetch('http://localhost:3333/api/hanghoa');
  const result = await response.json();
  console.log(result.data); // Mảng hàng hóa
  console.log(result.summary); // Tổng kết
}
```

#### 2. Thêm mới
```javascript
async function themHangHoa() {
  const response = await fetch('http://localhost:3333/api/hanghoa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ngayNhap: '2026-01-15',
      tenHang: 'Laptop Dell',
      soLuongNhap: 10,
      thoiGianTra: '2026-01-16',
      soLuongTra: 2
    })
  });
  const result = await response.json();
  console.log(result.message);
}
```

#### 3. Cập nhật
```javascript
async function capNhatHangHoa(id) {
  const response = await fetch(`http://localhost:3333/api/hanghoa/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ngayNhap: '2026-01-15',
      tenHang: 'Laptop Dell XPS',
      soLuongNhap: 12,
      thoiGianTra: '2026-01-16',
      soLuongTra: 3,
      note: 'Cập nhật số lượng'
    })
  });
  const result = await response.json();
  console.log(result.message);
}
```

#### 4. Xóa
```javascript
async function xoaHangHoa(id) {
  const response = await fetch(`http://localhost:3333/api/hanghoa/${id}`, {
    method: 'DELETE'
  });
  const result = await response.json();
  console.log(result.message);
}
```

---

## 📊 Logic Tính Toán

### Tổng nhập
```javascript
tongNhap = danhSach.reduce((sum, item) => sum + item.soLuongNhap, 0)
```

### Tổng trả
```javascript
tongTra = danhSach.reduce((sum, item) => sum + item.soLuongTra, 0)
```

### Tồn kho
```javascript
tonKho = tongNhap - tongTra
```

---

## ✅ Features

- ✨ CRUD hoàn chỉnh (Create, Read, Update, Delete)
- 📝 Lưu lịch sử chỉnh sửa với ghi chú
- 📊 Tự động tính tổng nhập, tổng trả, tồn kho
- 🔒 Validation dữ liệu đầu vào
- 🌐 CORS enabled cho frontend
- ⚡ Response có cấu trúc thống nhất

---

## 🚀 Hướng dẫn chạy

### Backend:
```bash
cd backend
npm install
node index.js
```

### Frontend:
Mở file `frontend/quan_ly_hang_hoa.html` trong trình duyệt.

---

## 📝 Notes

- API sử dụng in-memory storage (dữ liệu mất khi restart server)
- Để lưu trữ lâu dài, cần tích hợp database (MongoDB, PostgreSQL, etc.)
- Port mặc định: 3333
- Frontend tự động gọi API và cập nhật realtime
