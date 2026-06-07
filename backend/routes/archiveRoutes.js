/**
 * 路由 - 成绩归档
 */
const express = require('express');
const router = express.Router();
const archiveController = require('../controllers/archiveController');
const { authMiddleware } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取班级列表
router.get('/classes', archiveController.getClasses);

// 按班级获取成绩归档
router.get('/by-class', archiveController.getByClass);

// 创建/更新考试信息
router.post('/exam-info', archiveController.createExamInfo);

// 上传成绩单附件
router.post('/upload', uploadSingle, archiveController.uploadAttachment);

module.exports = router;
