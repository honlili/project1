/**
 * 数据库模型 - 审核记录相关操作
 */
const { pool } = require('../config/db');

// 创建审核记录
const create = async (data) => {
    const { registration_id, action, old_status, new_status, operator_id, operator_type, reason } = data;
    const sql = `
        INSERT INTO audit_logs (registration_id, action, old_status, new_status, operator_id, operator_type, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
        registration_id, action, old_status, new_status, operator_id, operator_type || 'admin', reason
    ]);
    return result.insertId;
};

// 获取报名的审核记录
const getByRegistrationId = async (registrationId) => {
    const sql = `
        SELECT al.*, au.name as operator_name
        FROM audit_logs al
        LEFT JOIN admin_users au ON al.operator_id = au.id
        WHERE al.registration_id = ?
        ORDER BY al.created_at DESC
    `;
    const [rows] = await pool.execute(sql, [registrationId]);
    return rows;
};

// 获取审核记录列表
const getAll = async (options = {}) => {
    const { page = 1, pageSize = 20, action } = options;
    const offset = (page - 1) * pageSize;
    
    let sql = `
        SELECT al.*, 
            s.student_no, s.name as student_name,
            cert.name as certificate_name,
            au.name as operator_name
        FROM audit_logs al
        JOIN student_registrations sr ON al.registration_id = sr.id
        JOIN students s ON sr.student_id = s.id
        JOIN certificates cert ON sr.certificate_id = cert.id
        LEFT JOIN admin_users au ON al.operator_id = au.id
        WHERE 1=1
    `;
    const params = [];
    
    if (action) {
        sql += ' AND al.action = ?';
        params.push(action);
    }
    
    sql += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize), parseInt(offset));
    
    const [rows] = await pool.execute(sql, params);
    return rows;
};

module.exports = {
    create,
    getByRegistrationId,
    getAll
};
