/**
 * 学生校内双证管理系统 - 后端主入口
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 导入路由
const authRoutes = require('./routes/authRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const studentRoutes = require('./routes/studentRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const archiveRoutes = require('./routes/archiveRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const externalRoutes = require('./routes/externalRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// 导入错误处理中间件
const { notFound, errorHandler } = require('./middleware/errorHandler');

// 创建 Express 应用
const app = express();
const PORT = process.env.PORT || 5000;

// =============================================
// 中间件配置
// =============================================

// CORS 配置
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// 解析 JSON 请求体
app.use(express.json({ limit: '10mb' }));

// 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务（上传的文件）
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// =============================================
// API 路由
// =============================================

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: '服务运行正常',
        timestamp: new Date().toISOString()
    });
});

// 认证路由
app.use('/api/auth', authRoutes);

// 证书管理路由
app.use('/api/certificates', certificateRoutes);

// 学生管理路由
app.use('/api/students', studentRoutes);

// 报名管理路由
app.use('/api/registrations', registrationRoutes);

// 成绩归档路由
app.use('/api/archives', archiveRoutes);

// 培训资料路由
app.use('/api/training', trainingRoutes);

// 外部接口路由
app.use('/api/external', externalRoutes);

// 仪表板路由
app.use('/api/dashboard', dashboardRoutes);

// =============================================
// 错误处理
// =============================================

// 404 处理
app.use(notFound);

// 全局错误处理
app.use(errorHandler);

// =============================================
// 启动服务器
// =============================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log('  学生校内双证管理系统 - 后端服务');
    console.log('========================================');
    console.log(`  服务地址: http://localhost:${PORT}`);
    console.log(`  API 前缀: /api`);
    console.log(`  环境: ${process.env.NODE_ENV || 'development'}`);
    console.log('========================================');
    console.log('');
    console.log('可用的 API 端点:');
    console.log('  POST   /api/auth/login          - 登录');
    console.log('  GET    /api/certificates        - 获取证书列表');
    console.log('  GET    /api/students            - 获取学生列表');
    console.log('  GET    /api/registrations       - 获取报名列表');
    console.log('  GET    /api/registrations/pending - 获取待审核列表');
    console.log('  GET    /api/archives/by-class   - 按班级获取成绩归档');
    console.log('  GET    /api/training            - 获取培训资料');
    console.log('  GET    /api/dashboard/stats     - 获取仪表板统计');
    console.log('  GET    /api/external/student-certificates - 外部接口');
    console.log('');
});

module.exports = app;
