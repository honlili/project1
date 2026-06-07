/**
 * 控制器 - 外部接口
 * 提供 API Key 认证的外部接口
 */
const examInfoModel = require('../models/examInfoModel');

// 获取学生所有已获得的证书
const getStudentCertificates = async (req, res) => {
    try {
        const { student_id } = req.query;
        
        if (!student_id) {
            return res.status(400).json({
                success: false,
                message: '请提供学生ID (student_id)'
            });
        }
        
        const certificates = await examInfoModel.getStudentCertificates(student_id);
        
        res.json({
            success: true,
            data: {
                student_id: parseInt(student_id),
                total: certificates.length,
                certificates: certificates.map(cert => ({
                    certificate_id: cert.certificate_id,
                    certificate_name: cert.certificate_name,
                    certificate_type: cert.certificate_type,
                    issuing_authority: cert.issuing_authority,
                    certificate_no: cert.certificate_no,
                    issue_date: cert.certificate_issue_date,
                    score: cert.score,
                    apply_date: cert.apply_date
                }))
            }
        });
    } catch (error) {
        console.error('获取学生证书错误:', error);
        res.status(500).json({
            success: false,
            message: '获取学生证书失败'
        });
    }
};

module.exports = {
    getStudentCertificates
};
