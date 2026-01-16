# 🚀 HƯỚNG DẪN DEPLOY - Quản Lý Hàng Hóa

## 📋 Tổng Quan

Website sẽ được deploy MIỄN PHÍ với:
- **Backend**: Render.com (Free tier)
- **Frontend**: Vercel (Free tier)  
- **Database**: MongoDB Atlas (Free 512MB)

**Tổng chi phí: $0/tháng** ✨

---

## 🎯 BƯỚC 1: Setup MongoDB Atlas (Database)

### 1.1. Tạo tài khoản MongoDB Atlas

1. Truy cập: https://www.mongodb.com/cloud/atlas/register
2. Đăng ký tài khoản miễn phí (có thể dùng Google)
3. Chọn **FREE tier** (M0 Sandbox - 512MB)

### 1.2. Tạo Database Cluster

1. Sau khi đăng ký, chọn **"Build a Database"**
2. Chọn **FREE** tier (M0)
3. Chọn region gần Việt Nam (Singapore hoặc AWS ap-southeast-1)
4. Đặt tên cluster: `quanlyhanghoa`
5. Click **"Create"**

### 1.3. Tạo Database User

1. Trong mục **Security → Database Access**
2. Click **"Add New Database User"**
3. Chọn **Password Authentication**
4. Nhập:
   - Username: `admin`
   - Password: `<tạo password mạnh>` (lưu lại!)
5. Database User Privileges: chọn **"Read and write to any database"**
6. Click **"Add User"**

### 1.4. Whitelist IP Address

1. Trong mục **Security → Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### 1.5. Lấy Connection String

1. Click **"Connect"** ở cluster của bạn
2. Chọn **"Connect your application"**
3. Chọn **Driver: Node.js**, Version: **5.5 or later**
4. Copy **Connection String**:
   ```
   mongodb+srv://<username>:<password>@quanlyhanghoa.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Thay `<username>` và `<password>` bằng thông tin bạn đã tạo
6. Thêm tên database sau `.net/`: `/quanlyhanghoa`

**Ví dụ Connection String:**
```
mongodb+srv://admin:MyPassword123@quanlyhanghoa.abc12.mongodb.net/quanlyhanghoa?retryWrites=true&w=majority
```

**✅ Lưu lại Connection String này!**

---

## 🎯 BƯỚC 2: Push Code lên GitHub

### 2.1. Cài đặt Git (nếu chưa có)

Download: https://git-scm.com/downloads

### 2.2. Tạo Repository trên GitHub

1. Truy cập: https://github.com
2. Click **"New repository"**
3. Đặt tên: `quanly-hanghoa`
4. Chọn **Public**
5. **KHÔNG** tick "Initialize with README"
6. Click **"Create repository"**

### 2.3. Push code lên GitHub

Mở PowerShell tại thư mục `D:\Code web` và chạy:

```powershell
# Khởi tạo git
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - Quản lý hàng hóa"

# Kết nối với GitHub (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/quanly-hanghoa.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

**Nếu hỏi login**: Nhập username/password GitHub của bạn

**✅ Code đã lên GitHub!**

---

## 🎯 BƯỚC 3: Deploy Backend lên Render

### 3.1. Tạo tài khoản Render

1. Truy cập: https://render.com/
2. Click **"Get Started"**
3. Đăng ký bằng **GitHub account** (dễ nhất)

### 3.2. Deploy Backend

1. Trong Dashboard Render, click **"New +"**
2. Chọn **"Web Service"**
3. Click **"Connect GitHub"** và authorize Render
4. Chọn repository: `quanly-hanghoa`
5. Điền thông tin:

```
Name: quanly-hanghoa-backend
Region: Singapore
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

6. Chọn **Free** plan
7. Click **"Advanced"** để thêm Environment Variables

### 3.3. Thêm Environment Variables

Click **"Add Environment Variable"** và thêm:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `<Connection String từ MongoDB Atlas>` |
| `JWT_SECRET` | `<random string mạnh, VD: a8f7d6e5c4b3a2>` |
| `JWT_EXPIRES_IN` | `24h` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `*` (tạm thời, sẽ update sau) |

8. Click **"Create Web Service"**

### 3.4. Đợi Deploy

- Render sẽ build và deploy backend (3-5 phút)
- Khi thấy **"Live"** màu xanh → Thành công!
- Copy **URL backend** (VD: `https://quanly-hanghoa-backend.onrender.com`)

**✅ Backend đã deploy!**

---

## 🎯 BƯỚC 4: Deploy Frontend lên Vercel

### 4.1. Tạo tài khoản Vercel

1. Truy cập: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel

### 4.2. Deploy Frontend

1. Click **"Add New..."** → **"Project"**
2. Chọn repository: `quanly-hanghoa`
3. Click **"Import"**
4. Configure Project:

```
Framework Preset: Other
Root Directory: frontend
Build Command: (để trống)
Output Directory: (để trống)
Install Command: (để trống)
```

5. Click **"Deploy"**

### 4.3. Đợi Deploy

- Vercel sẽ deploy frontend (1-2 phút)
- Khi thấy confetti 🎉 → Thành công!
- Copy **URL frontend** (VD: `https://quanly-hanghoa.vercel.app`)

**✅ Frontend đã deploy!**

---

## 🎯 BƯỚC 5: Cấu Hình Production URLs

### 5.1. Cập nhật Frontend Config

1. Mở file `frontend/config.js`
2. Sửa dòng production URL:

```javascript
production: {
  API_URL: "https://quanly-hanghoa-backend.onrender.com/api", // URL Render của bạn
  BASE_URL: "https://quanly-hanghoa-backend.onrender.com"
}
```

### 5.2. Push lên GitHub

```powershell
git add .
git commit -m "Update production API URL"
git push
```

Vercel sẽ tự động deploy lại!

### 5.3. Update FRONTEND_URL trên Render

1. Vào Render Dashboard → quanly-hanghoa-backend
2. Tab **"Environment"**
3. Sửa `FRONTEND_URL`:
   ```
   https://quanly-hanghoa.vercel.app
   ```
4. Click **"Save Changes"**
5. Render sẽ tự động restart

**✅ Hoàn tất cấu hình!**

---

## 🎉 BƯỚC 6: Test Website

### 6.1. Truy cập website

Mở URL frontend của bạn: `https://quanly-hanghoa.vercel.app`

### 6.2. Test chức năng

1. **Đăng ký tài khoản mới**
2. **Đăng nhập**
3. **Thêm dữ liệu hàng hóa**
4. **Sửa/Xóa dữ liệu**
5. **Đăng xuất và đăng nhập lại** → Dữ liệu vẫn còn!

**✅ Website đang chạy online 24/7!**

---

## 📊 Thông Tin Hệ Thống

### URLs của bạn:

- **Frontend**: `https://quanly-hanghoa.vercel.app`
- **Backend API**: `https://quanly-hanghoa-backend.onrender.com`
- **Health Check**: `https://quanly-hanghoa-backend.onrender.com/health`

### Giới hạn Free Tier:

**MongoDB Atlas (Free):**
- ✅ 512MB storage
- ✅ Unlimited reads/writes
- ✅ No credit card required

**Render (Free):**
- ✅ 750 hours/month (đủ chạy 24/7)
- ⚠️ Server "sleep" sau 15 phút không dùng
- ⚠️ Request đầu tiên có thể chậm (5-10s wake up)
- ✅ Auto restart khi crash

**Vercel (Free):**
- ✅ Unlimited websites
- ✅ 100GB bandwidth/month
- ✅ Global CDN
- ✅ Auto HTTPS

---

## 🔧 Cập Nhật Code Sau Này

### Khi có thay đổi code:

```powershell
# Commit changes
git add .
git commit -m "Update features"
git push

# Render và Vercel sẽ TỰ ĐỘNG deploy lại!
```

---

## ⚠️ Lưu Ý Quan Trọng

### 🐌 Render Free Tier Sleep

Backend sẽ "ngủ" sau 15 phút không dùng. Request đầu tiên sẽ chậm (5-10s).

**Giải pháp:**
1. **Nâng cấp lên Render Paid** ($7/month - no sleep)
2. **Sử dụng cron job** để ping backend mỗi 10 phút (giữ server thức)

### 🔒 Bảo Mật Production

1. Đổi JWT_SECRET thành chuỗi random mạnh
2. Không commit file `.env` lên GitHub
3. Sử dụng HTTPS (Vercel/Render tự động có)

### 📦 Backup Database

MongoDB Atlas có auto backup, nhưng nên:
1. Export dữ liệu định kỳ
2. Lưu Connection String an toàn

---

## 🆘 Troubleshooting

### ❌ Frontend không kết nối được Backend

1. Kiểm tra URL trong `config.js`
2. Kiểm tra CORS trên Render: `FRONTEND_URL` đúng chưa
3. Xem logs trên Render Dashboard

### ❌ MongoDB connection failed

1. Kiểm tra Connection String đúng format
2. Kiểm tra username/password
3. Kiểm tra Network Access cho phép 0.0.0.0/0

### ❌ Backend Render bị "sleep"

- Request đầu tiên sau 15 phút sẽ chậm
- Đợi 10s rồi thử lại
- Hoặc nâng cấp Render Paid

---

## 🎓 Các Lệnh Hữu Ích

### Xem logs Render:
```
Render Dashboard → Service → Logs tab
```

### Xem logs Vercel:
```
Vercel Dashboard → Deployment → View Function Logs
```

### Force redeploy:
```
Render: Settings → Manual Deploy
Vercel: Deployments → Redeploy
```

---

## 🎉 Chúc Mừng!

Website của bạn đã **ONLINE 24/7** và hoàn toàn **MIỄN PHÍ**! 🚀

Có thể truy cập từ bất kỳ đâu, bất kỳ thiết bị nào có internet!

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs trên Render/Vercel
2. Xem MongoDB Atlas metrics
3. Test API endpoint: `/health`

**Good luck!** 🍀
