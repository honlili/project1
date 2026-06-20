# 学生校内双证管理系统

一个完整的学生证书管理系统，支持证书管理、学生管理、报名审核、成绩归档、培训资料、学生端入口等功能。

> 项目当前以「演示模式」运行：使用内存数据，无需安装 MySQL，一键即可启动。

## 🚀 快速启动（推荐）

### 方式一：双击 `start.bat`（最简单）

在项目根目录双击 `start.bat`：

1. 启动后端服务（http://localhost:5000）
2. 启动前端服务（http://localhost:3000）
3. 手动在浏览器打开 http://localhost:3000

### 方式二：双击 `启动系统.vbs`（无命令行闪烁）

适合不喜欢看到命令行窗口的用户。双击后会：
- 在后台启动 Node 服务
- 在新窗口显示日志
- 手动访问 http://localhost:3000

### 方式三：右键 `启动.ps1` → "使用 PowerShell 运行"

适合 Windows PowerShell 环境。

### 方式四：手动命令行

```bash
# 1. 启动后端（新终端）
cd backend
npm install    # 首次运行
npm run demo   # 启动演示模式（使用内存数据）

# 2. 启动前端（另开一个终端）
cd frontend
npm install    # 首次运行
npm start
```

### 登录账号

- **管理员端**：`admin` / `admin123`
- **学生端**：使用学生端入口登录（见下）

---

## 🖥️ 系统入口

本系统同时提供 **管理员端** 和 **学生端** 两个独立入口。

### 管理员端
访问 http://localhost:3000 → 输入 `admin` / `admin123` 即可进入管理控制台。

功能包括：
- 📊 仪表板（数据统计）
- 📜 证书管理（增删改查，区分人社 / 专业 / 校内）
- 👨‍🎓 学生管理（支持批量导入 Excel）
- ✅ 报名审核（AI 预审 + 人工审核）
- 📚 成绩归档（按班级查看证书获取情况）
- 📖 培训资料管理
- 🔌 外部接口测试
- ⚙️ 个人设置

### 学生端
登录页顶部有 **"管理员登录 / 学生登录"** 切换，选择"学生登录"后：

- 用学号登录（演示账号：`2023001001` / `123456`）
- 📋 个人中心 — 查看个人信息
- 🎓 我的证书 — 查看已获取证书
- 📝 报名考试 — 报名新的证书考试
- 📚 培训资料 — 查看学校发布的培训信息

---

## 🛠️ 项目结构

```
double-cert-system/
├── backend/                      # 后端代码
│   ├── demo-server.js           # 演示模式入口（内存数据）⭐
│   ├── app.js                   # 数据库模式入口
│   ├── config/db.js
│   ├── controllers/             # 各模块控制器
│   ├── middleware/              # 中间件（auth/apiKey/upload/errorHandler）
│   ├── models/                  # 数据模型
│   ├── routes/                  # API 路由
│   ├── uploads/                 # 用户上传文件
│   └── package.json
├── frontend/                     # 前端代码
│   ├── public/index.html
│   └── src/
│       ├── components/
│       │   ├── MainLayout.js     # 管理员端布局
│       │   └── StudentLayout.js  # 学生端布局
│       ├── pages/
│       │   ├── Login.js          # 登录（管理员/学生切换）
│       │   ├── Dashboard.js      # 管理员仪表板
│       │   ├── CertificateManage.js
│       │   ├── StudentManage.js
│       │   ├── RegistrationAudit.js
│       │   ├── ArchiveManage.js
│       │   ├── TrainingManage.js
│       │   ├── ExternalApiTest.js
│       │   ├── Settings.js       # 个人设置
│       │   ├── StudentDashboard.js   # 学生端首页
│       │   ├── StudentCertificates.js # 学生端-我的证书
│       │   ├── StudentApply.js       # 学生端-报名考试
│       │   └── StudentTraining.js    # 学生端-培训资料
│       ├── services/            # API 服务封装
│       ├── App.js               # 路由配置（管理员 + 学生）
│       ├── index.js
│       └── index.css
├── db/schema.sql                # 数据库结构（可选：真实数据库用）
├── launcher.js                  # ⭐ 跨平台一键启动器（Node.js）
├── start.bat                    # ⭐ 双击启动（Windows）
├── stop.bat                     # ⭐ 停止所有服务（Windows）
├── 启动.ps1                     # ⭐ PowerShell 版启动器
├── 停止.ps1                     # ⭐ PowerShell 版停止器
├── 启动系统.vbs                 # ⭐ 无控制台闪烁启动器
├── 快速启动.md                  # 快速使用指南
├── DEBUG.md                     # 故障排查指南
├── package.json                 # 根目录脚本（concurrently）
└── README.md                    # 当前文件
```

---

## 🎯 功能特性

| 模块 | 功能点 |
|------|--------|
| 证书管理 | 增删改查，区分人社 / 专业 / 校内三种类型 |
| 学生管理 | 信息维护、Excel 批量导入、自定义班级/学院 |
| 报名审核 | 学生报名 → AI 预审（≥60 分自动建议通过）→ 人工审核 |
| 成绩归档 | 按班级查看学生证书获取情况，支持附件上传 |
| 培训资料 | 发布培训信息和大纲 |
| 外部接口 | API Key 认证，供外部系统调用学生证书数据 |
| 仪表板 | 实时统计待审核数量、通过率等数据 |
| 学生端 | 独立学生入口，查看证书、报名、培训资料 |

---

## 🎓 演示模式 vs 数据库模式

### 演示模式（默认，推荐先跑）

- 使用 **内存数据**（`backend/demo-server.js`）
- 无需安装 MySQL
- 启动更快，环境依赖少
- 重启后数据恢复初始状态

```bash
cd backend
npm run demo
```

### 数据库模式（需要真实数据时）

- 使用 **MySQL**，需要先导入 `db/schema.sql`
- 数据持久化保存

```bash
# 1. 导入数据库
mysql -u root -p < db/schema.sql

# 2. 启动后端
cd backend
npm start     # 对应 app.js（数据库模式）

# 3. 启动前端
cd frontend
npm start
```

数据库配置（详见 `backend/config/db.js`）：
- 数据库名：`double_cert_db`
- 用户：`root`
- 密码：`root`
- 端口：`3306`

---

## 🔌 API 接口说明

### 认证接口
- `POST /api/auth/login` — 登录
- `GET /api/auth/me` — 获取当前用户信息

### 证书管理
- `GET /api/certificates` — 获取证书列表
- `POST /api/certificates` — 创建证书
- `PUT /api/certificates/:id` — 更新证书
- `DELETE /api/certificates/:id` — 删除证书

### 学生管理
- `GET /api/students` — 获取学生列表
- `POST /api/students` — 创建学生
- `POST /api/students/import` — 批量导入学生（Excel）
- `GET /api/students/template` — 下载导入模板

### 报名管理
- `GET /api/registrations` — 获取报名列表
- `POST /api/registrations` — 创建报名
- `POST /api/registrations/:id/approve` — 审核通过
- `POST /api/registrations/:id/reject` — 审核驳回

### 成绩归档
- `GET /api/archives/by-class?class_id=xxx` — 按班级查看
- `POST /api/archives/exam-info` — 创建/更新考试信息
- `POST /api/archives/upload` — 上传成绩单附件

### 培训资料
- `GET /api/training` — 获取培训资料列表
- `POST /api/training` — 创建培训资料
- `PUT /api/training/:id` — 更新培训资料
- `DELETE /api/training/:id` — 删除培训资料

### 外部接口（API Key 认证）
- `GET /api/external/student-certificates?student_id=xxx` — 获取学生证书信息
  - 认证方式：请求头 `x-api-key: 123456`

---

## 📦 技术栈

### 后端
- Node.js + Express
- MySQL 8/9（使用 mysql2 连接池）
- JWT 认证
- 文件上传（multer）
- Excel 导入导出（xlsx）

### 前端
- React 18
- Ant Design 5
- React Router 6
- Axios

### 一键启动器
- 跨平台 Node.js 脚本（`launcher.js`）
- Windows 批处理脚本（`.bat`）
- PowerShell 脚本（`.ps1`）
- VBScript（`.vbs`）
- Concurrently 同时启动前后端

---

## 🌍 环境变量说明

### 后端 `backend/.env`
```
DB_HOST=localhost          # 数据库主机
DB_PORT=3306               # 数据库端口
DB_USER=root               # 数据库用户
DB_PASSWORD=root           # 数据库密码
DB_NAME=double_cert_db     # 数据库名
PORT=5000                  # 服务端口
JWT_SECRET=xxx             # JWT 密钥
JWT_EXPIRES_IN=24h         # Token 过期时间
API_KEY=123456             # 外部接口 API Key
```

### 前端 `frontend/.env`
```
REACT_APP_API_URL=http://localhost:5000   # 后端 API 地址
REACT_APP_API_KEY=123456                  # API Key
```

---

## 🛑 停止服务

- 双击 `stop.bat`（推荐）
- 或在服务窗口按 `Ctrl + C`
- 或运行 `停止.ps1`

停止后会关闭所有 Node.js 进程，释放 5000 和 3000 端口。

---

## ❓ 常见问题

### Q: 浏览器打开后显示"无法访问此网站"？
前端需要 ~15-30 秒编译。等待片刻后刷新页面即可。

### Q: 页面显示"获取数据失败"？
1. 检查后端服务是否运行：打开 http://localhost:5000/api/health
2. 若返回 JSON 说明后端正常，否则需要重新启动后端
3. 更多调试信息请查看 `DEBUG.md`

### Q: "双击 start.bat 后提示 npm 不是内部命令"？
请先安装 Node.js（https://nodejs.org/）。安装完成后重新双击 `start.bat`。

### Q: 端口 5000 / 3000 被占用？
双击 `stop.bat` 可停止所有相关进程。或在终端执行 `taskkill /F /IM node.exe`。

### Q: 数据被重置了？
演示模式使用内存数据，**重启后端会恢复初始数据**。如果需要持久化，请使用数据库模式启动（`npm start` 而非 `npm run demo`）。

---

## ⚠️ 注意事项

1. 演示模式数据重启后会被重置，生产使用请切换到数据库模式
2. 后端默认 5000 端口，前端默认 3000 端口
3. 上传的文件存储在 `backend/uploads` 目录
4. 生产环境请修改 `JWT_SECRET` 和 `API_KEY` 为更安全的值
5. 首次使用 `npm install` 安装依赖需要几分钟，之后再启动就非常快了

---

## 📝 License

MIT
