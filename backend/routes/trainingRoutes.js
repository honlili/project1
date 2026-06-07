/**
 * 路由 - 培训资料管理
 */
const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// 获取已发布的培训资料（可选认证）
router.get('/published', optionalAuth, trainingController.getPublished);

// 以下路由需要认证
router.use(authMiddleware);

// 获取培训资料列表
router.get('/', trainingController.getAll);

// 获取单个培训资料
router.get('/:id', trainingController.getById);

// 创建培训资料
router.post('/', trainingController.create);

// 更新培训资料
router.put('/:id', trainingController.update);

// 删除培训资料
router.delete('/:id', trainingController.remove);

// 上传附件
router.post('/upload', uploadSingle, trainingController.uploadFile);

module.exports = router;
