const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

// ==================== MONGODB CONNECTION ====================
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quanlyhanghoa";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// ==================== MODELS ====================

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

// Hàng Hóa Schema
const hangHoaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ngayNhap: { type: String, required: true },
  tenHang: { type: String, required: true },
  soLuongNhap: { type: Number, default: 0 },
  thoiGianTra: { type: String },
  soLuongTra: { type: Number, default: 0 },
  history: [{
    time: String,
    changes: [String],
    note: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

const HangHoa = mongoose.model("HangHoa", hangHoaSchema);

// ==================== JWT CONFIG ====================
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// ==================== MIDDLEWARE XÁC THỰC ====================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

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
    req.user = user;
    next();
  });
}

// ==================== API AUTHENTICATION ====================

// ĐĂNG KÝ
app.post("/api/auth/register", async (req, res) => {
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
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username đã tồn tại"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      username,
      password: hashedPassword,
      fullName: fullName || username
    });

    await newUser.save();

    // Tạo token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        fullName: newUser.fullName
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đăng ký",
      error: error.message
    });
  }
});

// ĐĂNG NHẬP
app.post("/api/auth/login", async (req, res) => {
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
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Username hoặc password không đúng"
      });
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Username hoặc password không đúng"
      });
    }

    // Tạo token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đăng nhập",
      error: error.message
    });
  }
});

// VERIFY TOKEN
app.get("/api/auth/verify", authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: {
      userId: req.user.userId,
      username: req.user.username
    }
  });
});

// ==================== API HÀNG HÓA ====================

// 1. LẤY DANH SÁCH
app.get("/api/hanghoa", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const hangHoaList = await HangHoa.find({ userId }).sort({ createdAt: -1 });

    // Tính tổng
    const tongNhap = hangHoaList.reduce((sum, item) => sum + (item.soLuongNhap || 0), 0);
    const tongTra = hangHoaList.reduce((sum, item) => sum + (item.soLuongTra || 0), 0);
    const tonKho = tongNhap - tongTra;

    res.json({
      success: true,
      data: hangHoaList,
      summary: { tongNhap, tongTra, tonKho }
    });
  } catch (error) {
    console.error("Get list error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách",
      error: error.message
    });
  }
});

// 2. LẤY CHI TIẾT
app.get("/api/hanghoa/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const item = await HangHoa.findOne({ _id: req.params.id, userId });

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
    console.error("Get detail error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy chi tiết",
      error: error.message
    });
  }
});

// 3. THÊM MỚI
app.post("/api/hanghoa", authenticateToken, async (req, res) => {
  try {
    const { ngayNhap, tenHang, soLuongNhap, thoiGianTra, soLuongTra } = req.body;
    const userId = req.user.userId;

    if (!ngayNhap || !tenHang) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (ngayNhap, tenHang)"
      });
    }

    const newItem = new HangHoa({
      userId,
      ngayNhap,
      tenHang,
      soLuongNhap: Number(soLuongNhap) || 0,
      thoiGianTra: thoiGianTra || "",
      soLuongTra: Number(soLuongTra) || 0,
      history: []
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Thêm hàng hóa thành công",
      data: newItem
    });
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm hàng hóa",
      error: error.message
    });
  }
});

// 4. CẬP NHẬT
app.put("/api/hanghoa/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const item = await HangHoa.findOne({ _id: req.params.id, userId });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hàng hóa"
      });
    }

    const { ngayNhap, tenHang, soLuongNhap, thoiGianTra, soLuongTra, note } = req.body;

    if (!ngayNhap || !tenHang) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc"
      });
    }

    // Ghi lịch sử
    let changes = [];
    if (item.soLuongNhap != soLuongNhap)
      changes.push(`SL nhập: ${item.soLuongNhap} → ${soLuongNhap}`);
    if (item.soLuongTra != soLuongTra)
      changes.push(`SL trả: ${item.soLuongTra} → ${soLuongTra}`);
    if (item.thoiGianTra != thoiGianTra)
      changes.push(`Ngày trả: ${item.thoiGianTra || "—"} → ${thoiGianTra || "—"}`);

    if (changes.length > 0) {
      const historyEntry = {
        time: new Date().toLocaleString('vi-VN'),
        changes
      };
      if (note) historyEntry.note = note;
      item.history.push(historyEntry);
    }

    // Cập nhật
    item.ngayNhap = ngayNhap;
    item.tenHang = tenHang;
    item.soLuongNhap = Number(soLuongNhap) || 0;
    item.thoiGianTra = thoiGianTra || "";
    item.soLuongTra = Number(soLuongTra) || 0;
    item.updatedAt = new Date();

    await item.save();

    res.json({
      success: true,
      message: "Cập nhật thành công",
      data: item
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật",
      error: error.message
    });
  }
});

// 5. XÓA
app.delete("/api/hanghoa/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const item = await HangHoa.findOneAndDelete({ _id: req.params.id, userId });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hàng hóa"
      });
    }

    res.json({
      success: true,
      message: "Xóa thành công",
      data: item
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa",
      error: error.message
    });
  }
});

// ==================== HEALTH CHECK ====================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Quản lý Hàng Hóa đang hoạt động",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// ==================== SERVER ====================
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
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
