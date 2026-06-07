/**
 * 控制器 - 成绩归档
 */
const examInfoModel = require('../models/examInfoModel');
const registrationModel = require('../models/registrationModel');
const classModel = require('../models/classModel');

// 创建/更新考试信息
const createExamInfo = async (req, res) => {
    try {
        const { registration_id, exam_time, exam_location, exam_type, score, pass_status, certificate_no, certificate_issue_date, remark } = req.body;
        
        if (!registration_id) {
            return res.status(400).json({
                success: false,
                message: '报名ID为必填项'
            });
        }
        
        // 检查报名是否存在
        const registration = await registrationModel.getById(registration_id);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: '报名记录不存在'
            });
        }
        
        // 检查是否已有考试信息
        const existing = await examInfoModel.getByRegistrationId(registration_id);
        
        let result;
        if (existing) {
            // 更新
            await examInfoModel.update(existing.id, {
                exam_time, exam_location, exam_type, score, pass_status, certificate_no, certificate_issue_date, remark
            });
            result = existing.id;
        } else {
            // 创建
            result = await examInfoModel.create({
                registration_id, exam_time, exam_location, exam_type, score, pass_status, certificate_no, certificate_issue_date, remark
            });
        }
        
        res.json({
            success: true,
            message: existing ? '考试信息更新成功' : '考试信息创建成功',
            data: { id: result }
        });
    } catch (error) {
        console.error('创建考试信息错误:', error);
        res.status(500).json({
            success: false,
            message: '操作失败'
        });
    }
};

// 按班级获取成绩归档
const getByClass = async (req, res) => {
    try {
        const { class_id } = req.query;
        
        if (!class_id) {
            return res.status(400).json({
                success: false,
                message: '请选择班级'
            });
        }
        
        const records = await examInfoModel.getByClass(class_id);
        
        res.json({
            success: true,
            data: records
        });
    } catch (error) {
        console.error('获取成绩归档错误:', error);
        res.status(500).json({
            success: false,
            message: '获取失败'
        });
    }
};

// 获取班级列表（用于筛选）
const getClasses = async (req, res) => {
    try {
        const classes = await classModel.getAll();
        res.json({
            success: true,
            data: classes
        });
    } catch (error) {
        console.error('获取班级列表错误:', error);
        res.status(500).json({
            success: false,
            message: '获取失败'
        });
    }
};

// 上传成绩单附件
const uploadAttachment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请上传文件'
            });
        }
        
        const { registration_id } = req.body;
        
        // 更新报名记录的附件路径
        if (registration_id) {
            await registrationModel.updateStatus(registration_id, {
                attachment_path: `/uploads/${req.file.filename}`
            });
        }
        
        res.json({
            success: true,
            message: '文件上传成功',
            data: {
                path: `/uploads/${req.file.filename}`,
                filename: req.file.filename
            }
        });
    } catch (error) {
        console.error('上传附件错误:', error);
        res.status(500).json({
            success: false,
            message: '上传失败'
        });
    }
};

module.exports = {
    createExamInfo,
    getByClass,
    getClasses,
    uploadAttachment
};
