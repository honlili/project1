/**
 * 文件上传配置
 * 使用 multer 处理文件上传
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // 生成唯一文件名：时间戳-随机数-原文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    // 允许的文件类型
    const allowedImageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const allowedDocTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
    const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];
    
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('不支持的文件类型'), false);
    }
};

// 创建 multer 实例
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 默认10MB
    }
});

// 单文件上传（用于成绩单图片）
const uploadSingle = upload.single('file');

// 多文件上传
const uploadMultiple = upload.array('files', 5);

// Excel文件上传
const uploadExcel = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.xlsx' || ext === '.xls') {
            cb(null, true);
        } else {
            cb(new Error('只支持 Excel 文件 (.xlsx, .xls)'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}).single('file');

module.exports = {
    upload,
    uploadSingle,
    uploadMultiple,
    uploadExcel,
    uploadDir
};
