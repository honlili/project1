/**
 * 路由 - 证书管理
 */
const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authMiddleware } = require('../middleware/auth');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取证书列表
router.get('/', certificateController.getAll);

// 获取启用的证书（下拉选择用）
router.get('/active', certificateController.getActive);

// 获取证书统计
router.get('/stats', certificateController.getStats);

// 获取单个证书
router.get('/:id', certificateController.getById);

// 创建证书
router.post('/', certificateController.create);

// 更新证书
router.put('/:id', certificateController.update);

// 删除证书
router.delete('/:id', certificateController.remove);

module.exports = router;
