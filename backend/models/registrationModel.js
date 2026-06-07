/**
 * 数据库模型 - 报名相关操作
 */
const { pool } = require('../config/db');

// 获取所有报名（支持分页和筛选）
const getAll = async (options = {}) => {
    const { page = 1, pageSize = 10, student_id, certificate_id, status } = options;
    const offset = (page - 1) * pageSize;
    
    let sql = `
        SELECT sr.*, 
            s.student_no, s.name as student_name,
            c.name as class_name,
            cert.name as certificate_name, cert.type as certificate_type
        FROM student_registrations sr
        JOIN students s ON sr.student_id = s.id
        JOIN certificates cert ON sr.certificate_id = cert.id
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE 1=1
    `;
    const params = [];
    
    if (student_id) {
        sql += ' AND sr.student_id = ?';
        params.push(student_id);
    }
    if (certificate_id) {
        sql += ' AND sr.certificate_id = ?';
        params.push(certificate_id);
    }
    if (status) {
        sql += ' AND sr.status = ?';
        params.push(status);
    }
    
    // 获取总数
    const countSql = sql.replace(
        /SELECT sr\.\*,[\s\S]*?FROM/,
        'SELECT COUNT(*) as total FROM'
    );
    const [countResult] = await pool.execute(countSql, params);
    const total = countResult[0].total;
    
    // 获取数据
    sql += ' ORDER BY sr.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize), parseInt(offset));
    
    const [rows] = await pool.execute(sql, params);
    
    return { rows, total, page, pageSize };
};

// 获取待审核报名列表
const getPending = async (options = {}) => {
    const { page = 1, pageSize = 10 } = options;
    const offset = (page - 1) * pageSize;
    
    const countSql = `
        SELECT COUNT(*) as total FROM student_registrations WHERE status = '待审核'
    `;
    const [countResult] = await pool.execute(countSql);
    const total = countResult[0].total;
    
    const sql = `
        SELECT sr.*, 
            s.student_no, s.name as student_name,
            c.name as class_name,
            cert.name as certificate_name, cert.type as certificate_type
        FROM student_registrations sr
        JOIN students s ON sr.student_id = s.id
        JOIN certificates cert ON sr.certificate_id = cert.id
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE sr.status = '待审核'
        ORDER BY sr.created_at DESC
        LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.execute(sql, [parseInt(pageSize), parseInt(offset)]);
    
    return { rows, total, page, pageSize };
};

// 根据ID获取报名
const getById = async (id) => {
    const sql = `
        SELECT sr.*, 
            s.student_no, s.name as student_name,
            c.name as class_name,
            cert.name as certificate_name, cert.type as certificate_type
        FROM student_registrations sr
        JOIN students s ON sr.student_id = s.id
        JOIN certificates cert ON sr.certificate_id = cert.id
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE sr.id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
};

// 创建报名
const create = async (data) => {
    const { student_id, certificate_id, score, attachment_path } = data;
    const sql = `
        INSERT INTO student_registrations (student_id, certificate_id, score, attachment_path, status)
        VALUES (?, ?, ?, ?, '待审核')
    `;
    const [result] = await pool.execute(sql, [student_id, certificate_id, score || null, attachment_path || null]);
    return result.insertId;
};

// 批量创建报名
const batchCreate = async (registrations) => {
    const sql = `
        INSERT INTO student_registrations (student_id, certificate_id, score, status)
        VALUES ?
    `;
    const values = registrations.map(r => [
        r.student_id,
        r.certificate_id,
        r.score || null,
        '待审核'
    ]);
    const [result] = await pool.query(sql, [values]);
    return result.affectedRows;
};

// 更新报名状态
const updateStatus = async (id, data) => {
    const { status, reviewed_by, reject_reason, score, attachment_path } = data;
    const sql = `
        UPDATE student_registrations 
        SET status = ?, reviewed_at = NOW(), reviewed_by = ?, reject_reason = ?,
            score = COALESCE(?, score), attachment_path = COALESCE(?, attachment_path)
        WHERE id = ?
    `;
    const [result] = await pool.execute(sql, [status, reviewed_by, reject_reason || null, score || null, attachment_path || null, id]);
    return result.affectedRows > 0;
};

// 更新AI审核结果
const updateAiReview = async (id, aiResult, aiReason) => {
    const sql = `
        UPDATE student_registrations 
        SET ai_review_result = ?, ai_review_reason = ?
        WHERE id = ?
    `;
    const [result] = await pool.execute(sql, [aiResult, aiReason, id]);
    return result.affectedRows > 0;
};

// 删除报名
const remove = async (id) => {
    const [result] = await pool.execute('DELETE FROM student_registrations WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

// 获取报名统计
const getStats = async () => {
    const sql = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = '待审核' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = '已通过' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = '已驳回' THEN 1 ELSE 0 END) as rejected
        FROM student_registrations
    `;
    const [rows] = await pool.execute(sql);
    return rows[0];
};

// 检查学生是否已报名该证书
const checkExists = async (studentId, certificateId) => {
    const [rows] = await pool.execute(
        'SELECT id FROM student_registrations WHERE student_id = ? AND certificate_id = ?',
        [studentId, certificateId]
    );
    return rows.length > 0;
};

module.exports = {
    getAll,
    getPending,
    getById,
    create,
    batchCreate,
    updateStatus,
    updateAiReview,
    remove,
    getStats,
    checkExists
};
