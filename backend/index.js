const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Cho phép frontend gọi API

// Secret key cho JWT (trong thực tế nên lưu trong .env)
const JWT_SECRET = "your-secret-key-change-in-production";

// Dữ liệu tạm (trong thực tế sẽ dùng database)
let users = []; // Danh sách người dùng
let danhSachHang = [];
let nextUserId = 1;
let nextId = 1;

// ==================== MIDDLEWARE XÁC THỰC ====================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập"
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn"
      });
    }
    req.user = user; // Lưu thông tin user vào request
    next();
  });
}

// ==================== API AUTHENTICATION ====================

// ĐĂNG KÝ
app.post("/api/auth/register", (req, res) => {
  try {
    const { username, password, fullName } = req.body;

    // Validate
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ username và password"
      });
    }

    // Kiểm tra username đã tồn tại
    if (users.find(u => u.username === username)) {
      return res.status(400).json({
        success: false,
        message: "Username đã tồn tại"
      });
    }

    // Tạo user mới (trong thực tế cần hash password)
    const newUser = {
      id: nextUserId++,
      username,
      password, // CẢNH BÁO: Trong thực tế cần hash password với bcrypt
      fullName: fullName || username,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Tạo token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.fullName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi đăng ký",
      error: error.message
    });
  }
});

// ĐĂNG NHẬP
app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ username và password"
      });
    }

    // Tìm user
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Username hoặc password không đúng"
      });
    }

    // Tạo token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi đăng nhập",
      error: error.message
    });
  }
});

// VERIFY TOKEN (kiểm tra token còn hợp lệ không)
app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      userId: req.user.userId,
      username: req.user.username
    }
  });
});

// ==================== API ENDPOINTS ====================

// 1. LẤY DANH SÁCH TẤT CẢ HÀNG HÓA (của user hiện tại)
app.get("/api/hanghoa", authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Chỉ lấy hàng hóa của user này
    const userHangHoa = danhSachHang.filter(h => h.userId === userId);
    
    // Tính tổng nhập, tổng trả, tồn kho
    const tongNhap = userHangHoa.reduce((sum, item) => sum + (Number(item.soLuongNhap) || 0), 0);
    const tongTra = userHangHoa.reduce((sum, item) => sum + (Number(item.soLuongTra) || 0), 0);
    const tonKho = tongNhap - tongTra;

    res.json({
      success: true,
      data: userHangHoa,
      summary: {
        tongNhap,
        tongTra,
        tonKho
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách",
      error: error.message
    });
  }
});

// 2. LẤY CHI TIẾT MỘT HÀNG HÓA (của user hiện tại)
app.get("/api/hanghoa/:id", authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.userId;
    const item = danhSachHang.find(h => h.id === id && h.userId === userId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hàng hóa"
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết",
      error: error.message
    });
  }
});

// 3. THÊM HÀNG HÓA MỚI (gắn với userId)
app.post("/api/hanghoa", authenticateToken, (req, res) => {
  try {
    const { ngayNhap, tenHang, soLuongNhap, thoiGianTra, soLuongTra } = req.body;
    const userId = req.user.userId;
    
    // Validate dữ liệu
    if (!ngayNhap || !tenHang) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (ngayNhap, tenHang)"
      });
    }
    
    const newItem = {
      id: nextId++,
      userId, // Gắn với user hiện tại
      ngayNhap,
      tenHang,
      soLuongNhap: Number(soLuongNhap) || 0,
      thoiGianTra: thoiGianTra || "",
      soLuongTra: Number(soLuongTra) || 0,
      history: [],
      createdAt: new Date().toISOString()
    };
    
    danhSachHang.push(newItem);
    
    res.status(201).json({
      success: true,
      message: "Thêm hàng hóa thành công",
      data: newItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm hàng hóa",
      error: error.message
    });
  }
});

// 4. CẬP NHẬT HÀNG HÓA (chỉ cập nhật của chính mình)
app.put("/api/hanghoa/:id", authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.userId;
    const index = danhSachHang.findIndex(h => h.id === id && h.userId === userId);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hàng hóa"
      });
    }
    
    const old = danhSachHang[index];
    const { ngayNhap, tenHang, soLuongNhap, thoiGianTra, soLuongTra, note } = req.body;
    
    // Validate
    if (!ngayNhap || !tenHang) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc"
      });
    }
    
    // Ghi lại lịch sử thay đổi
    let changes = [];
    if (old.soLuongNhap != soLuongNhap)
      changes.push(`SL nhập: ${old.soLuongNhap} → ${soLuongNhap}`);
    if (old.soLuongTra != soLuongTra)
      changes.push(`SL trả: ${old.soLuongTra} → ${soLuongTra}`);
    if (old.thoiGianTra != thoiGianTra)
      changes.push(`Ngày trả: ${old.thoiGianTra || "—"} → ${thoiGianTra || "—"}`);
    
    if (changes.length > 0) {
      const historyEntry = {
        time: new Date().toLocaleString('vi-VN'),
        changes: changes
      };
      
      if (note) {
        historyEntry.note = note;
      }
      
      old.history.push(historyEntry);
    }
    
    // Cập nhật dữ liệu
    danhSachHang[index] = {
      ...old,
      ngayNhap,
      tenHang,
      soLuongNhap: Number(soLuongNhap) || 0,
      thoiGianTra: thoiGianTra || "",
      soLuongTra: Number(soLuongTra) || 0,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: "Cập nhật thành công",
      data: danhSachHang[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật",
      error: error.message
    });
  }
});

// 5. XÓA HÀNG HÓA (chỉ xóa của chính mình)
app.delete("/api/hanghoa/:id", authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user.userId;
    const index = danhSachHang.findIndex(h => h.id === id && h.userId === userId);
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hàng hóa"
      });
    }
    
    const deleted = danhSachHang.splice(index, 1)[0];
    
    res.json({
      success: true,
      message: "Xóa thành công",
      data: deleted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa",
      error: error.message
    });
  }
});

// 6. XÓA TẤT CẢ (để test)
app.delete("/api/hanghoa", (req, res) => {
  danhSachHang = [];
  nextId = 1;
  res.json({
    success: true,
    message: "Đã xóa tất cả dữ liệu"
  });
});

// ==================== SERVER ====================
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📋 API endpoints:`);
  console.log(`   POST   /api/auth/register - Đăng ký`);
  console.log(`   POST   /api/auth/login    - Đăng nhập`);
  console.log(`   GET    /api/auth/verify   - Verify token`);
  console.log(`   GET    /api/hanghoa       - Lấy danh sách`);
  console.log(`   GET    /api/hanghoa/:id   - Lấy chi tiết`);
  console.log(`   POST   /api/hanghoa       - Thêm mới`);
  console.log(`   PUT    /api/hanghoa/:id   - Cập nhật`);
  console.log(`   DELETE /api/hanghoa/:id   - Xóa`);
});
