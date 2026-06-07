/**
 * 路由 - 报名管理
 */
const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authMiddleware } = require('../middleware/auth');
const { uploadExcel } = require('../middleware/upload');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取报名列表
router.get('/', registrationController.getAll);

// 获取待审核列表
router.get('/pending', registrationController.getPending);

// 获取报名统计
router.get('/stats', registrationController.getStats);

// 下载导入模板
router.get('/template', registrationController.downloadTemplate);

// 批量导入报名
router.post('/import', uploadExcel, registrationController.importRegistrations);

// 获取单个报名
router.get('/:id', registrationController.getById);

// 创建报名
router.post('/', registrationController.create);

// 审核通过
router.post('/:id/approve', registrationController.approve);

// 审核驳回
router.post('/:id/reject', registrationController.reject);

module.exports = router;
