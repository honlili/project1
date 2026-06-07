/**
 * 控制器 - 仪表板统计
 */
const studentModel = require('../models/studentModel');
const certificateModel = require('../models/certificateModel');
const registrationModel = require('../models/registrationModel');
const pool = require('../config/db');

// 获取仪表板统计数据
const getDashboardStats = async (req, res) => {
    try {
        // 并行获取各项统计
        const [studentStats, certificateStats, registrationStats] = await Promise.all([
            studentModel.getStats(),
            certificateModel.getStats(),
            registrationModel.getStats()
        ]);
        
        // 计算通过率
        const passRate = registrationStats.total > 0 
            ? ((registrationStats.approved / registrationStats.total) * 100).toFixed(2) 
            : 0;
        
        // 获取最近报名记录
        const recentSql = `
            SELECT sr.id, sr.status, sr.apply_date,
                s.name as student_name, s.student_no,
                cert.name as certificate_name
            FROM student_registrations sr
            JOIN students s ON sr.student_id = s.id
            JOIN certificates cert ON sr.certificate_id = cert.id
            ORDER BY sr.created_at DESC
            LIMIT 5
        `;
        const [recentRegistrations] = await pool.execute(recentSql);
        
        // 获取各证书报名统计
        const certStatsSql = `
            SELECT 
                cert.name as certificate_name,
                cert.type as certificate_type,
                COUNT(sr.id) as total_registrations,
                SUM(CASE WHEN sr.status = '已通过' THEN 1 ELSE 0 END) as passed_count
            FROM certificates cert
            LEFT JOIN student_registrations sr ON cert.id = sr.certificate_id
            WHERE cert.status = '启用'
            GROUP BY cert.id, cert.name, cert.type
            ORDER BY total_registrations DESC
            LIMIT 10
        `;
        const [certificateRegistrationStats] = await pool.execute(certStatsSql);
        
        res.json({
            success: true,
            data: {
                students: studentStats,
                certificates: certificateStats,
                registrations: {
                    ...registrationStats,
                    passRate: parseFloat(passRate)
                },
                recentRegistrations,
                certificateRegistrationStats
            }
        });
    } catch (error) {
        console.error('获取仪表板统计错误:', error);
        res.status(500).json({
            success: false,
            message: '获取统计数据失败'
        });
    }
};

module.exports = {
    getDashboardStats
};
