/**
 * 路由 - 外部接口
 * 使用 API Key 认证
 */
const express = require('express');
const router = express.Router();
const externalController = require('../controllers/externalController');
const apiKeyMiddleware = require('../middleware/apiKey');

// 所有外部接口使用 API Key 认证
router.use(apiKeyMiddleware);

// 获取学生所有已获得的证书
router.get('/student-certificates', externalController.getStudentCertificates);

module.exports = router;
