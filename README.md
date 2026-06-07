# 学生校内双证管理系统

一个完整的学生证书管理系统，支持证书管理、学生管理、报名审核、成绩归档等功能。

## 🔴 重要：快速启动步骤

如果遇到"获取数据失败"的问题，请按以下步骤操作：

### 1. 导入数据库
```bash
# 打开终端，进入项目根目录，然后执行
mysql -u root -p < db/schema.sql
# 输入密码：root
```

### 2. 启动后端
```bash
cd backend
# 首次运行需要安装依赖（如果没安装过）
npm install
# 启动后端服务
npm start
```

后端启动成功后会看到：
```
✅ 数据库连接成功
服务运行在 http://localhost:5000
```

### 3. 启动前端（新开一个终端）
```bash
cd frontend
# 首次运行需要安装依赖（如果没安装过）
npm install
# 启动前端服务
npm start
```

### 4. 访问应用
- 浏览器打开：http://localhost:3000
- 登录账号：admin / admin123

---

## 常见问题

### ❌ 页面显示"获取数据失败"
请检查：
1. 后端服务是否运行在 http://localhost:5000
2. 数据库是否已正确导入
3. 按F12打开浏览器控制台查看具体错误信息

### ❌ 数据库连接失败
请检查：
1. MySQL服务是否已启动
2. 用户名/密码是否为 root/root
3. 已导入 db/schema.sql

更多调试信息请查看 [DEBUG.md](DEBUG.md)

---

## 技术栈

### 后端
- Node.js + Express
- MySQL 8/9 (使用 mysql2 连接池)
- JWT 认证
- 文件上传 (multer)
- Excel 导入导出 (xlsx)

### 前端
- React 18
- Ant Design 5
- React Router 6
- Axios

## 项目结构

```
double-cert-system/
├── backend/                    # 后端代码
│   ├── config/                 # 配置文件
│   │   └── db.js              # 数据库连接池配置
│   ├── controllers/            # 控制器
│   │   ├── authController.js
│   │   ├── certificateController.js
│   │   ├── studentController.js
│   │   ├── registrationController.js
│   │   ├── archiveController.js
│   │   ├── trainingController.js
│   │   ├── externalController.js
│   │   └── dashboardController.js
│   ├── middleware/              # 中间件
│   │   ├── auth.js             # JWT认证
│   │   ├── apiKey.js           # API Key认证
│   │   ├── errorHandler.js     # 错误处理
│   │   └── upload.js           # 文件上传
│   ├── models/                  # 数据模型
│   │   ├── studentModel.js
│   │   ├── classModel.js
│   │   ├── certificateModel.js
│   │   ├── registrationModel.js
│   │   ├── examInfoModel.js
│   │   ├── auditLogModel.js
│   │   ├── trainingMaterialModel.js
│   │   └── adminUserModel.js
│   ├── routes/                  # 路由
│   │   ├── authRoutes.js
│   │   ├── certificateRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── archiveRoutes.js
│   │   ├── trainingRoutes.js
│   │   ├── externalRoutes.js
│   │   └── dashboardRoutes.js
│   ├── uploads/                 # 上传文件目录
│   ├── .env                     # 环境变量
│   ├── app.js                   # 应用入口
│   └── package.json
├── frontend/                    # 前端代码
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # 组件
│   │   │   └── MainLayout.js
│   │   ├── pages/               # 页面
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── CertificateManage.js
│   │   │   ├── StudentManage.js
│   │   │   ├── RegistrationAudit.js
│   │   │   ├── ArchiveManage.js
│   │   │   ├── TrainingManage.js
│   │   │   └── ExternalApiTest.js
│   │   ├── services/            # API服务
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── certificateService.js
│   │   │   ├── studentService.js
│   │   │   ├── registrationService.js
│   │   │   ├── archiveService.js
│   │   │   ├── trainingService.js
│   │   │   ├── dashboardService.js
│   │   │   └── externalService.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   └── package.json
├── db/
│   └── schema.sql              # 数据库结构
└── README.md
```

## 快速开始

### 1. 数据库配置

确保 MySQL 已安装并运行，然后导入数据库结构：

```bash
# 方式一：使用 MySQL 命令行
mysql -u root -p < db/schema.sql

# 方式二：登录 MySQL 后执行
mysql -u root -p
source db/schema.sql
```

数据库配置信息：
- 数据库名：double_cert_db
- 用户：root
- 密码：root
- 端口：3306

### 2. 后端配置与启动

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 或启动生产服务器
npm start
```

后端服务将在 http://localhost:5000 启动

### 3. 前端配置与启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

前端服务将在 http://localhost:3000 启动

### 4. 访问系统

打开浏览器访问 http://localhost:3000

默认管理员账号：
- 用户名：admin
- 密码：admin123

## API 接口说明

### 认证接口
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户信息

### 证书管理
- `GET /api/certificates` - 获取证书列表
- `GET /api/certificates/active` - 获取启用的证书
- `POST /api/certificates` - 创建证书
- `PUT /api/certificates/:id` - 更新证书
- `DELETE /api/certificates/:id` - 删除证书

### 学生管理
- `GET /api/students` - 获取学生列表
- `POST /api/students` - 创建学生
- `POST /api/students/import` - 批量导入学生
- `GET /api/students/template` - 下载导入模板

### 报名管理
- `GET /api/registrations` - 获取报名列表
- `GET /api/registrations/pending` - 获取待审核列表
- `POST /api/registrations` - 创建报名
- `POST /api/registrations/:id/approve` - 审核通过
- `POST /api/registrations/:id/reject` - 审核驳回

### 成绩归档
- `GET /api/archives/by-class?class_id=xxx` - 按班级获取成绩归档
- `POST /api/archives/exam-info` - 创建/更新考试信息
- `POST /api/archives/upload` - 上传成绩单附件

### 培训资料
- `GET /api/training` - 获取培训资料列表
- `POST /api/training` - 创建培训资料
- `PUT /api/training/:id` - 更新培训资料
- `DELETE /api/training/:id` - 删除培训资料

### 外部接口
- `GET /api/external/student-certificates?student_id=xxx` - 获取学生证书信息
  - 认证方式：Header `x-api-key: 123456`

## AI 审核功能

系统提供 AI 审核模拟功能：
- 当学生报名时，系统自动进行初审
- 规则：成绩 ≥ 60 分自动建议通过，否则标记为待人工审核
- 管理员可查看 AI 预审结果，结合实际情况进行最终审核

## 批量导入

### 学生导入模板格式
| 学号 | 姓名 | 性别 | 班级 | 电话 | 邮箱 | 状态 |
|------|------|------|------|------|------|------|
| 2023001001 | 张三 | 男 | 计算机2301班 | 13800138000 | example@email.com | 在读 |

### 报名导入模板格式
| 学生ID | 证书ID | 成绩 |
|--------|--------|------|
| 1 | 1 | 85 |

## 环境变量说明

### 后端 (.env)
```
DB_HOST=localhost          # 数据库主机
DB_PORT=3306               # 数据库端口
DB_USER=root               # 数据库用户
DB_PASSWORD=root           # 数据库密码
DB_NAME=double_cert_db     # 数据库名
PORT=5000                  # 服务端口
JWT_SECRET=xxx             # JWT密钥
JWT_EXPIRES_IN=24h         # Token过期时间
API_KEY=123456             # 外部接口API Key
```

### 前端 (.env)
```
REACT_APP_API_URL=http://localhost:5000  # 后端API地址
REACT_APP_API_KEY=123456                 # API Key
```

## 功能特性

1. **证书管理** - 支持证书的增删改查，区分人社/专业/校内类型
2. **学生管理** - 学生信息维护，支持批量导入
3. **报名审核** - 学生报名证书考试，AI初审 + 人工审核
4. **成绩归档** - 按班级查看学生证书获取情况，支持附件上传
5. **培训资料** - 发布培训信息和辅导材料
6. **外部接口** - 提供简单的 API Key 认证接口供外部系统调用
7. **仪表板** - 展示待审核数量、通过率等统计数据

## 注意事项

1. 首次运行前请确保已正确导入数据库结构
2. 后端服务默认运行在 5000 端口，前端运行在 3000 端口
3. 上传的文件存储在 backend/uploads 目录
4. 生产环境请修改 JWT_SECRET 和 API_KEY 为更安全的值

## License

MIT
