# ⚡ QUICK START - Deploy trong 30 phút

## 🎯 Mục Tiêu
Deploy website lên internet, chạy 24/7, MIỄN PHÍ!

---

## ✅ Chuẩn Bị

- [ ] Tài khoản GitHub
- [ ] Tài khoản Google (để đăng ký các dịch vụ)
- [ ] Code đã sẵn sàng (✅ Done!)

---

## 🚀 6 BƯỚC CHÍNH

### 📌 BƯỚC 1: MongoDB Atlas (5 phút)
```
1. Vào: https://mongodb.com/cloud/atlas/register
2. Đăng ký → Chọn FREE tier
3. Tạo Database User (username/password)
4. Allow Access từ anywhere (0.0.0.0/0)
5. Copy Connection String
```

**Lưu lại**: Connection String

---

### 📌 BƯỚC 2: GitHub (5 phút)
```powershell
# Mở PowerShell tại D:\Code web

git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/quanly-hanghoa.git
git push -u origin main
```

**Tạo repo trước**: https://github.com/new

---

### 📌 BƯỚC 3: Render - Backend (10 phút)
```
1. Vào: https://render.com → Đăng nhập bằng GitHub
2. New + → Web Service
3. Connect repository: quanly-hanghoa
4. Settings:
   - Name: quanly-hanghoa-backend
   - Region: Singapore
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: npm start
   - Plan: FREE

5. Environment Variables:
   MONGODB_URI = <your-connection-string>
   JWT_SECRET = <random-string>
   NODE_ENV = production

6. Create Web Service
```

**Lưu lại**: Backend URL

---

### 📌 BƯỚC 4: Vercel - Frontend (5 phút)
```
1. Vào: https://vercel.com → Đăng nhập bằng GitHub
2. New Project → Import quanly-hanghoa
3. Settings:
   - Root Directory: frontend
   - Build/Install: Để trống
4. Deploy
```

**Lưu lại**: Frontend URL

---

### 📌 BƯỚC 5: Cập Nhật URLs (3 phút)

**File: frontend/config.js**
```javascript
production: {
  API_URL: "https://your-backend.onrender.com/api", // Thay URL Render
  BASE_URL: "https://your-backend.onrender.com"
}
```

**Push lên GitHub:**
```powershell
git add .
git commit -m "Update production URL"
git push
```

**Cập nhật Render:**
- Vào Render → Environment
- Sửa `FRONTEND_URL` = `https://your-frontend.vercel.app`

---

### 📌 BƯỚC 6: TEST! (2 phút)
```
1. Mở frontend URL của bạn
2. Đăng ký tài khoản
3. Thêm dữ liệu
4. Đóng trình duyệt
5. Mở lại → Dữ liệu vẫn còn!
```

**🎉 XONG! Website đang online 24/7!**

---

## 📋 Checklist Hoàn Thành

- [ ] MongoDB Atlas setup ✓
- [ ] Code push lên GitHub ✓
- [ ] Backend deploy trên Render ✓
- [ ] Frontend deploy trên Vercel ✓
- [ ] URLs đã cập nhật ✓
- [ ] Test thành công ✓

---

## 🔗 URLs Quan Trọng

| Service | URL |
|---------|-----|
| MongoDB Atlas | https://cloud.mongodb.com |
| GitHub Repo | https://github.com/YOUR_USERNAME/quanly-hanghoa |
| Render Dashboard | https://dashboard.render.com |
| Vercel Dashboard | https://vercel.com/dashboard |
| **Frontend (Website)** | `https://your-app.vercel.app` |
| **Backend API** | `https://your-backend.onrender.com` |

---

## 🆘 Nếu Gặp Lỗi

### ❌ MongoDB connection failed
→ Kiểm tra Connection String, username/password

### ❌ Render build failed
→ Check logs, đảm bảo có file `package.json`

### ❌ Frontend không gọi được API
→ Kiểm tra URL trong `config.js`

### ❌ CORS error
→ Update `FRONTEND_URL` trên Render

---

## 📖 Chi Tiết Hơn?

Xem file: **DEPLOY_GUIDE.md** (hướng dẫn đầy đủ từng bước)

---

## 💰 Chi Phí

| Dịch vụ | Giá | Giới hạn |
|---------|-----|----------|
| MongoDB Atlas | **$0** | 512MB storage |
| Render | **$0** | 750 hours/month, có sleep |
| Vercel | **$0** | 100GB bandwidth |
| **TỔNG** | **$0/tháng** | ✨ |

---

## ⏱️ Thời Gian Ước Tính

- Có kinh nghiệm: **20 phút**
- Lần đầu: **30-40 phút**
- Gặp lỗi: **+10-15 phút**

---

## 🎓 Sau Khi Deploy

### Update code:
```bash
git add .
git commit -m "New features"
git push
# Render và Vercel tự động deploy!
```

### Xem logs:
- Render: Dashboard → Service → Logs
- Vercel: Dashboard → Deployment → Logs

### Monitor:
- MongoDB: Atlas → Metrics
- Render: Dashboard → Metrics
- Vercel: Dashboard → Analytics

---

**🚀 Chúc bạn deploy thành công!**

Nếu cần trợ giúp, xem **DEPLOY_GUIDE.md** hoặc **README.md**
