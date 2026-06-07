/**
 * 数据库模型 - 学生相关操作
 */
const { pool } = require('../config/db');

// 获取所有学生（支持分页和筛选）
const getAll = async (options = {}) => {
    const { page = 1, pageSize = 10, class_id, status, keyword } = options;
    const offset = (page - 1) * pageSize;
    
    let sql = `
        SELECT s.*, c.name as class_name, c.grade, c.major
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE 1=1
    `;
    const params = [];
    
    if (class_id) {
        sql += ' AND s.class_id = ?';
        params.push(class_id);
    }
    if (status) {
        sql += ' AND s.status = ?';
        params.push(status);
    }
    if (keyword) {
        sql += ' AND (s.name LIKE ? OR s.student_no LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
    }
    
    // 获取总数
    const [countResult] = await pool.execute(
        sql.replace('SELECT s.*, c.name as class_name, c.grade, c.major', 'SELECT COUNT(*) as total'),
        params
    );
    const total = countResult[0].total;
    
    // 获取数据
    sql += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize), parseInt(offset));
    
    const [rows] = await pool.execute(sql, params);
    
    return { rows, total, page, pageSize };
};

// 根据ID获取学生
const getById = async (id) => {
    const sql = `
        SELECT s.*, c.name as class_name, c.grade, c.major
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE s.id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
};

// 根据学号获取学生
const getByStudentNo = async (studentNo) => {
    const [rows] = await pool.execute('SELECT * FROM students WHERE student_no = ?', [studentNo]);
    return rows[0];
};

// 创建学生
const create = async (data) => {
    const { student_no, name, gender, class_id, phone, email, status } = data;
    const sql = `
        INSERT INTO students (student_no, name, gender, class_id, phone, email, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [student_no, name, gender || '男', class_id, phone, email, status || '在读']);
    return result.insertId;
};

// 批量创建学生
const batchCreate = async (students) => {
    const sql = `
        INSERT INTO students (student_no, name, gender, class_id, phone, email, status)
        VALUES ?
    `;
    const values = students.map(s => [
        s.student_no,
        s.name,
        s.gender || '男',
        s.class_id,
        s.phone || null,
        s.email || null,
        s.status || '在读'
    ]);
    const [result] = await pool.query(sql, [values]);
    return result.affectedRows;
};

// 更新学生
const update = async (id, data) => {
    const fields = [];
    const params = [];
    
    const allowedFields = ['name', 'gender', 'class_id', 'phone', 'email', 'status'];
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            fields.push(`${field} = ?`);
            params.push(data[field]);
        }
    }
    
    if (fields.length === 0) return false;
    
    params.push(id);
    const sql = `UPDATE students SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
};

// 删除学生
const remove = async (id) => {
    const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

// 获取学生统计
const getStats = async () => {
    const sql = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = '在读' THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN status = '毕业' THEN 1 ELSE 0 END) as graduated,
            SUM(CASE WHEN status = '休学' THEN 1 ELSE 0 END) as suspended
        FROM students
    `;
    const [rows] = await pool.execute(sql);
    return rows[0];
};

module.exports = {
    getAll,
    getById,
    getByStudentNo,
    create,
    batchCreate,
    update,
    remove,
    getStats
};
