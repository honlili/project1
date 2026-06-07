/**
 * 控制器 - 报名管理
 */
const registrationModel = require('../models/registrationModel');
const auditLogModel = require('../models/auditLogModel');
const examInfoModel = require('../models/examInfoModel');
const xlsx = require('xlsx');
const path = require('path');

/**
 * AI审核模拟函数
 * 规则：成绩 >= 60 分自动通过，否则待人工审核
 */
const aiReview = async (registrationId, score) => {
    let aiResult, aiReason;
    
    if (score !== null && score !== undefined) {
        if (score >= 60) {
            aiResult = 'pass';
            aiReason = `成绩 ${score} 分，达到60分及格线，建议自动通过`;
        } else {
            aiResult = 'pending';
            aiReason = `成绩 ${score} 分，未达到60分及格线，需人工审核`;
        }
    } else {
        aiResult = 'manual';
        aiReason = '未提供成绩信息，需人工审核';
    }
    
    // 更新AI审核结果
    await registrationModel.updateAiReview(registrationId, aiResult, aiReason);
    
    // 如果AI建议通过，自动更新状态
    if (aiResult === 'pass') {
        await registrationModel.updateStatus(registrationId, {
            status: '已通过',
            reviewed_by: null // AI审核
        });
        
        // 记录审核日志
        await auditLogModel.create({
            registration_id: registrationId,
            action: 'ai_review',
            old_status: '待审核',
            new_status: '已通过',
            operator_id: null,
            operator_type: 'ai',
            reason: aiReason
        });
    } else {
        // 记录AI审核日志
        await auditLogModel.create({
            registration_id: registrationId,
            action: 'ai_review',
            old_status: '待审核',
            new_status: '待审核',
            operator_id: null,
            operator_type: 'ai',
            reason: aiReason
        });
    }
    
    return { aiResult, aiReason };
};

// 获取报名列表
const getAll = async (req, res) => {
    try {
        const { page, pageSize, student_id, certificate_id, status } = req.query;
        const result = await registrationModel.getAll({
            page: parseInt(page) || 1,
            pageSize: parseInt(pageSize) || 10,
            student_id,
            certificate_id,
            status
        });
        
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                total: result.total,
                page: result.page,
                pageSize: result.pageSize
            }
        });
    } catch (error) {
        console.error('获取报名列表错误:', error);
        res.status(500).json({
            success: false,
            message: '获取报名列表失败'
        });
    }
};

// 获取待审核列表
const getPending = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const result = await registrationModel.getPending({
            page: parseInt(page) || 1,
            pageSize: parseInt(pageSize) || 10
        });
        
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                total: result.total,
                page: result.page,
                pageSize: result.pageSize
            }
        });
    } catch (error) {
        console.error('获取待审核列表错误:', error);
        res.status(500).json({
            success: false,
            message: '获取待审核列表失败'
        });
    }
};

// 获取单个报名
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await registrationModel.getById(id);
        
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: '报名记录不存在'
            });
        }
        
        // 获取审核记录
        const auditLogs = await auditLogModel.getByRegistrationId(id);
        
        res.json({
            success: true,
            data: {
                ...registration,
                auditLogs
            }
        });
    } catch (error) {
        console.error('获取报名错误:', error);
        res.status(500).json({
            success: false,
            message: '获取报名失败'
        });
    }
};

// 创建报名（学生报名）
const create = async (req, res) => {
    try {
        const { student_id, certificate_id, score, attachment_path } = req.body;
        
        if (!student_id || !certificate_id) {
            return res.status(400).json({
                success: false,
                message: '学生ID和证书ID为必填项'
            });
        }
        
        // 检查是否已报名
        const exists = await registrationModel.checkExists(student_id, certificate_id);
        if (exists) {
            return res.status(400).json({
                success: false,
                message: '该学生已报名此证书'
            });
        }
        
        // 创建报名
        const id = await registrationModel.create({
            student_id, certificate_id, score, attachment_path
        });
        
        // 触发AI审核
        const aiResult = await aiReview(id, score);
        
        // 记录提交日志
        await auditLogModel.create({
            registration_id: id,
            action: 'submit',
            old_status: null,
            new_status: '待审核',
            operator_id: student_id,
            operator_type: 'student',
            reason: '学生提交报名申请'
        });
        
        res.status(201).json({
            success: true,
            message: '报名成功',
            data: {
                id,
                aiReview: aiResult
            }
        });
    } catch (error) {
        console.error('创建报名错误:', error);
        res.status(500).json({
            success: false,
            message: '报名失败'
        });
    }
};

// 审核通过
const approve = async (req, res) => {
    try {
        const { id } = req.params;
        const { score, attachment_path } = req.body;
        
        const registration = await registrationModel.getById(id);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: '报名记录不存在'
            });
        }
        
        if (registration.status !== '待审核') {
            return res.status(400).json({
                success: false,
                message: '该报名不在待审核状态'
            });
        }
        
        // 更新状态
        await registrationModel.updateStatus(id, {
            status: '已通过',
            reviewed_by: req.user.id,
            score,
            attachment_path
        });
        
        // 记录审核日志
        await auditLogModel.create({
            registration_id: id,
            action: 'approve',
            old_status: '待审核',
            new_status: '已通过',
            operator_id: req.user.id,
            operator_type: 'admin',
            reason: '管理员审核通过'
        });
        
        res.json({
            success: true,
            message: '审核通过'
        });
    } catch (error) {
        console.error('审核通过错误:', error);
        res.status(500).json({
            success: false,
            message: '审核失败'
        });
    }
};

// 审核驳回
const reject = async (req, res) => {
    try {
        const { id } = req.params;
        const { reject_reason } = req.body;
        
        if (!reject_reason) {
            return res.status(400).json({
                success: false,
                message: '请填写驳回原因'
            });
        }
        
        const registration = await registrationModel.getById(id);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: '报名记录不存在'
            });
        }
        
        if (registration.status !== '待审核') {
            return res.status(400).json({
                success: false,
                message: '该报名不在待审核状态'
            });
        }
        
        // 更新状态
        await registrationModel.updateStatus(id, {
            status: '已驳回',
            reviewed_by: req.user.id,
            reject_reason
        });
        
        // 记录审核日志
        await auditLogModel.create({
            registration_id: id,
            action: 'reject',
            old_status: '待审核',
            new_status: '已驳回',
            operator_id: req.user.id,
            operator_type: 'admin',
            reason: reject_reason
        });
        
        res.json({
            success: true,
            message: '已驳回'
        });
    } catch (error) {
        console.error('审核驳回错误:', error);
        res.status(500).json({
            success: false,
            message: '驳回失败'
        });
    }
};

// 批量导入报名
const importRegistrations = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请上传Excel文件'
            });
        }
        
        // 读取Excel文件
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        
        if (data.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Excel文件为空'
            });
        }
        
        const registrations = [];
        const errors = [];
        
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNum = i + 2;
            
            try {
                if (!row['学生ID'] || !row['证书ID']) {
                    errors.push(`第${rowNum}行：学生ID和证书ID为必填项`);
                    continue;
                }
                
                // 检查是否已报名
                const exists = await registrationModel.checkExists(row['学生ID'], row['证书ID']);
                if (exists) {
                    errors.push(`第${rowNum}行：该学生已报名此证书`);
                    continue;
                }
                
                registrations.push({
                    student_id: row['学生ID'],
                    certificate_id: row['证书ID'],
                    score: row['成绩'] || null
                });
            } catch (err) {
                errors.push(`第${rowNum}行：${err.message}`);
            }
        }
        
        // 批量插入
        let insertedCount = 0;
        if (registrations.length > 0) {
            insertedCount = await registrationModel.batchCreate(registrations);
            
            // 对每个报名执行AI审核
            for (const reg of registrations) {
                // 获取刚插入的报名ID（简化处理）
                // 实际项目中应该返回插入的ID列表
            }
        }
        
        res.json({
            success: true,
            message: `成功导入 ${insertedCount} 条记录`,
            data: {
                total: data.length,
                inserted: insertedCount,
                errors: errors.length > 0 ? errors : undefined
            }
        });
    } catch (error) {
        console.error('导入报名错误:', error);
        res.status(500).json({
            success: false,
            message: '导入失败：' + error.message
        });
    }
};

// 下载报名导入模板
const downloadTemplate = (req, res) => {
    const template = [
        { '学生ID': 1, '证书ID': 1, '成绩': 85 },
        { '学生ID': 2, '证书ID': 1, '成绩': 72 }
    ];
    
    const ws = xlsx.utils.json_to_sheet(template);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, '报名信息');
    
    const filePath = path.join(__dirname, '../uploads/registrations_template.xlsx');
    xlsx.writeFile(wb, filePath);
    
    res.download(filePath, '报名导入模板.xlsx', (err) => {
        if (err) {
            console.error('下载模板错误:', err);
        }
    });
};

// 获取报名统计
const getStats = async (req, res) => {
    try {
        const stats = await registrationModel.getStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('获取报名统计错误:', error);
        res.status(500).json({
            success: false,
            message: '获取统计失败'
        });
    }
};

module.exports = {
    getAll,
    getPending,
    getById,
    create,
    approve,
    reject,
    importRegistrations,
    downloadTemplate,
    getStats,
    aiReview
};
