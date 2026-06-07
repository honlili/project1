/**
 * 路由 - 仪表板
 */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

// 获取仪表板统计数据
router.get('/stats', authMiddleware, dashboardController.getDashboardStats);

module.exports = router;
