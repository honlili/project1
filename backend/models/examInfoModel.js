/**
 * 数据库模型 - 考试信息相关操作
 */
const { pool } = require('../config/db');

// 创建考试信息
const create = async (data) => {
    const { registration_id, exam_time, exam_location, exam_type, score, pass_status, certificate_no, certificate_issue_date, remark } = data;
    const sql = `
        INSERT INTO exam_info (registration_id, exam_time, exam_location, exam_type, score, pass_status, certificate_no, certificate_issue_date, remark)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
        registration_id, exam_time, exam_location, exam_type, score, pass_status || 0, certificate_no, certificate_issue_date, remark
    ]);
    return result.insertId;
};

// 根据报名ID获取考试信息
const getByRegistrationId = async (registrationId) => {
    const [rows] = await pool.execute(
        'SELECT * FROM exam_info WHERE registration_id = ?',
        [registrationId]
    );
    return rows[0];
};

// 更新考试信息
const update = async (id, data) => {
    const fields = [];
    const params = [];
    
    const allowedFields = ['exam_time', 'exam_location', 'exam_type', 'score', 'pass_status', 'certificate_no', 'certificate_issue_date', 'remark'];
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            fields.push(`${field} = ?`);
            params.push(data[field]);
        }
    }
    
    if (fields.length === 0) return false;
    
    params.push(id);
    const sql = `UPDATE exam_info SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
};

// 按班级获取成绩归档
const getByClass = async (classId) => {
    const sql = `
        SELECT 
            ei.*,
            s.student_no, s.name as student_name,
            c.name as class_name,
            cert.name as certificate_name, cert.type as certificate_type,
            sr.status as registration_status
        FROM exam_info ei
        JOIN student_registrations sr ON ei.registration_id = sr.id
        JOIN students s ON sr.student_id = s.id
        JOIN certificates cert ON sr.certificate_id = cert.id
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE s.class_id = ? AND sr.status = '已通过'
        ORDER BY s.student_no, cert.name
    `;
    const [rows] = await pool.execute(sql, [classId]);
    return rows;
};

// 获取学生已获得的证书
const getStudentCertificates = async (studentId) => {
    const sql = `
        SELECT 
            ei.id, ei.score, ei.pass_status, ei.certificate_no, ei.certificate_issue_date,
            cert.id as certificate_id, cert.name as certificate_name, 
            cert.type as certificate_type, cert.issuing_authority,
            sr.apply_date
        FROM exam_info ei
        JOIN student_registrations sr ON ei.registration_id = sr.id
        JOIN certificates cert ON sr.certificate_id = cert.id
        WHERE sr.student_id = ? AND sr.status = '已通过' AND ei.pass_status = 1
        ORDER BY ei.certificate_issue_date DESC
    `;
    const [rows] = await pool.execute(sql, [studentId]);
    return rows;
};

module.exports = {
    create,
    getByRegistrationId,
    update,
    getByClass,
    getStudentCertificates
};
