# 🏪 Quản Lý Hàng Hóa - Production Ready

Hệ thống quản lý hàng hóa nhập/trả với authentication, đã sẵn sàng deploy lên production.

---

## ✨ Features

- ✅ **Đăng ký/Đăng nhập** với JWT authentication
- ✅ **CRUD hàng hóa** (Thêm, Sửa, Xóa, Xem)
- ✅ **Multi-user**: Mỗi user có dữ liệu riêng
- ✅ **Lịch sử chỉnh sửa** với ghi chú
- ✅ **Tính toán tự động**: Tổng nhập, Tổng trả, Tồn kho
- ✅ **MongoDB** - Database persistent
- ✅ **Password hashing** với bcrypt
- ✅ **Production ready** - Sẵn sàng deploy

---

## 🏗️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt (Password hashing)
- CORS enabled

### Frontend
- HTML5 + CSS3 + Vanilla JavaScript
- Responsive design
- LocalStorage for token
- Fetch API

### Deployment
- **Backend**: Render.com (Free)
- **Frontend**: Vercel (Free)
- **Database**: MongoDB Atlas (Free 512MB)

---

## 📁 Cấu Trúc Project

```
Code web/
├── backend/
│   ├── server.js          # Main server file (MongoDB version)
│   ├── index.js           # Old version (in-memory)
│   ├── package.json
│   ├── .env               # Environment variables (local)
│   ├── .env.example       # Example env file
│   └── .gitignore
│
├── frontend/
│   ├── auth.html          # Login/Register page
│   ├── quan_ly_hang_hoa.html  # Main app (protected)
│   └── config.js          # API configuration
│
├── DEPLOY_GUIDE.md        # 📘 Hướng dẫn deploy chi tiết
├── API_DOCUMENTATION.md   # 📋 API docs
├── AUTHENTICATION_GUIDE.md # 🔐 Auth guide
└── README.md              # This file
```

---

## 🚀 Quick Start (Local Development)

### 1. Cài đặt MongoDB local (tùy chọn)

**Option A: Dùng MongoDB Cloud (khuyên dùng)**
- Xem `DEPLOY_GUIDE.md` → Bước 1 để tạo MongoDB Atlas

**Option B: Cài MongoDB local**
- Download: https://www.mongodb.com/try/download/community
- Cài đặt và chạy MongoDB service

### 2. Setup Backend

```powershell
cd backend

# Cài đặt packages
npm install

# Sửa file .env (nếu dùng MongoDB cloud)
# MONGODB_URI=<your-mongodb-atlas-connection-string>

# Chạy server
npm start
```

Server chạy tại: `http://localhost:3333`

### 3. Mở Frontend

Mở file `frontend/auth.html` trong trình duyệt.

### 4. Test

1. Đăng ký tài khoản
2. Đăng nhập
3. Thêm/Sửa/Xóa dữ liệu hàng hóa

---

## 🌐 Deploy lên Production (FREE)

**📘 Xem hướng dẫn chi tiết trong file: `DEPLOY_GUIDE.md`**

### Tóm tắt các bước:

1. **Setup MongoDB Atlas** (Free 512MB)
2. **Push code lên GitHub**
3. **Deploy Backend lên Render** (Free tier)
4. **Deploy Frontend lên Vercel** (Free tier)
5. **Cấu hình URLs** trong config
6. **Test online!**

**Tổng thời gian: ~30 phút**
**Chi phí: $0/tháng** 🎉

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/verify` - Verify token

### Hàng Hóa (require authentication)
- `GET /api/hanghoa` - Lấy danh sách
- `GET /api/hanghoa/:id` - Chi tiết
- `POST /api/hanghoa` - Thêm mới
- `PUT /api/hanghoa/:id` - Cập nhật
- `DELETE /api/hanghoa/:id` - Xóa

**📖 Chi tiết: `API_DOCUMENTATION.md`**

---

## 🔐 Environment Variables

### Backend (.env)

```env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=24h
PORT=3333
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

### Frontend (config.js)

Tự động detect development/production dựa trên hostname.

---

## 🔧 Scripts

### Backend

```bash
npm start      # Chạy production server
npm run dev    # Chạy với nodemon (auto-reload)
```

---

## 📊 Database Schema

### User Collection
```javascript
{
  username: String (unique),
  password: String (hashed),
  fullName: String,
  createdAt: Date
}
```

### HangHoa Collection
```javascript
{
  userId: ObjectId (ref: User),
  ngayNhap: String,
  tenHang: String,
  soLuongNhap: Number,
  thoiGianTra: String,
  soLuongTra: Number,
  history: [{
    time: String,
    changes: [String],
    note: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛡️ Security Features

- ✅ **JWT Token** authentication
- ✅ **Password hashing** với bcrypt (salt rounds: 10)
- ✅ **CORS** configured
- ✅ **Token expiration** (24h)
- ✅ **User data isolation** (mỗi user chỉ thấy data của mình)
- ✅ **Input validation**
- ✅ **MongoDB injection protection** (Mongoose)

---

## ⚠️ Important Notes

### Production Checklist

- [ ] Đổi `JWT_SECRET` thành chuỗi random mạnh
- [ ] Setup MongoDB Atlas với strong password
- [ ] Cấu hình CORS với domain cụ thể (không dùng `*`)
- [ ] Không commit file `.env` lên GitHub
- [ ] Backup database định kỳ
- [ ] Monitor server logs
- [ ] Setup error tracking (VD: Sentry)

### Render Free Tier Limitations

- ⚠️ Server "sleep" sau 15 phút không dùng
- ⚠️ Request đầu tiên có thể chậm (5-10s)
- ✅ 750 hours/month (đủ chạy 24/7 một server)

**Giải pháp**: Nâng cấp lên Render Paid ($7/month) để no-sleep.

---

## 📚 Documentation

- **Deployment Guide**: `DEPLOY_GUIDE.md` - Hướng dẫn deploy từng bước
- **API Documentation**: `API_DOCUMENTATION.md` - Chi tiết API endpoints
- **Authentication Guide**: `AUTHENTICATION_GUIDE.md` - Cách hoạt động của auth system

---

## 🐛 Troubleshooting

### Backend không kết nối MongoDB

```
❌ Error: MongoServerError: bad auth
```

**Fix**: Kiểm tra username/password trong MONGODB_URI

---

### Frontend không gọi được API

```
❌ CORS policy blocked
```

**Fix**: Kiểm tra FRONTEND_URL trong backend .env

---

### Token expired

```
❌ 403: Token không hợp lệ
```

**Fix**: Đăng xuất và đăng nhập lại

---

## 🔄 Workflow Update Code

```bash
# 1. Sửa code
# 2. Test local

# 3. Commit và push
git add .
git commit -m "Update features"
git push

# 4. Render và Vercel tự động deploy!
```

---

## 📈 Next Steps (Nâng cao)

- [ ] Refresh token mechanism
- [ ] Email verification
- [ ] Password reset
- [ ] Role-based access (Admin/User)
- [ ] Export data (Excel/PDF)
- [ ] Real-time updates (Socket.io)
- [ ] Image upload
- [ ] Advanced analytics

---

## 📞 Support

Nếu gặp vấn đề:

1. Check logs trên Render/Vercel
2. Xem MongoDB Atlas metrics
3. Test health endpoint: `/health`
4. Review documentation files

---

## 📝 License

MIT License - Free to use

---

## 👨‍💻 Author

Built with ❤️ for learning purposes

---

**🎉 Happy Coding! Chúc bạn deploy thành công!**
