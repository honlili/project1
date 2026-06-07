/**
 * 数据库模型 - 班级相关操作
 */
const { pool } = require('../config/db');

// 获取所有班级
const getAll = async () => {
    const sql = `
        SELECT c.*, 
            (SELECT COUNT(*) FROM students s WHERE s.class_id = c.id) as student_count
        FROM classes c
        ORDER BY c.created_at DESC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
};

// 根据ID获取班级
const getById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM classes WHERE id = ?', [id]);
    return rows[0];
};

// 创建班级
const create = async (data) => {
    const { name, grade, major } = data;
    const sql = 'INSERT INTO classes (name, grade, major) VALUES (?, ?, ?)';
    const [result] = await pool.execute(sql, [name, grade, major]);
    return result.insertId;
};

// 更新班级
const update = async (id, data) => {
    const { name, grade, major } = data;
    const sql = 'UPDATE classes SET name = ?, grade = ?, major = ? WHERE id = ?';
    const [result] = await pool.execute(sql, [name, grade, major, id]);
    return result.affectedRows > 0;
};

// 删除班级
const remove = async (id) => {
    const [result] = await pool.execute('DELETE FROM classes WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
