# 调试指南

## 常见问题排查

### 问题：页面显示"获取数据失败"

#### 第一步：检查后端是否运行

```bash
# 在 backend 目录下启动后端
cd backend
npm start
```

后端应该显示：
```
========================================
  学生校内双证管理系统 - 后端服务
========================================
  服务地址: http://localhost:5000
  ...
```

#### 第二步：检查数据库连接

```bash
# 在 backend 目录下运行数据库测试
node test-db.js
```

如果看到"数据库连接失败"，请检查：
1. MySQL服务是否运行
2. 用户名密码是否正确（.env文件）
3. 是否已导入 db/schema.sql

导入数据库的方法：
```bash
mysql -u root -p < db/schema.sql
```

#### 第三步：检查浏览器控制台

1. 按F12打开开发者工具
2. 查看 Console 标签页的错误信息
3. 查看 Network 标签页，检查请求是否成功

### 问题：登录后还是显示"获取数据失败"

1. 确保已成功登录，检查localStorage中是否有token
2. 检查后端是否正常响应
3. 检查CORS配置是否正确

### 问题："获取班级列表失败"

请确保：
1. 数据库已正确导入（包含classes表和示例数据）
2. 后端正常运行
3. 检查Network标签页，看具体错误

## 快速启动步骤

### 1. 导入数据库（仅首次）
```bash
mysql -u root -p < db/schema.sql
```

### 2. 启动后端
```bash
cd backend
# 首次运行需要安装依赖
# npm install
npm start
```

### 3. 启动前端（新终端）
```bash
cd frontend
# 首次运行需要安装依赖
# npm install
npm start
```

### 4. 访问应用
- 打开 http://localhost:3000
- 账号：admin / admin123
