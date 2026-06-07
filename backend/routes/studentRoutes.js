/**
 * 路由 - 学生管理
 */
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authMiddleware } = require('../middleware/auth');
const { uploadExcel } = require('../middleware/upload');

// 所有路由都需要认证
router.use(authMiddleware);

// 获取学生列表
router.get('/', studentController.getAll);

// 获取学生统计
router.get('/stats', studentController.getStats);

// 下载导入模板
router.get('/template', studentController.downloadTemplate);

// 批量导入学生
router.post('/import', uploadExcel, studentController.importStudents);

// 获取单个学生
router.get('/:id', studentController.getById);

// 创建学生
router.post('/', studentController.create);

// 更新学生
router.put('/:id', studentController.update);

// 删除学生
router.delete('/:id', studentController.remove);

module.exports = router;
