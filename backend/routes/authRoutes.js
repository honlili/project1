/**
 * 路由 - 认证相关
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// 登录
router.post('/login', authController.login);

// 获取当前用户信息（需要认证）
router.get('/me', authMiddleware, authController.getCurrentUser);

// 修改密码（需要认证）
router.put('/password', authMiddleware, authController.changePassword);

module.exports = router;
