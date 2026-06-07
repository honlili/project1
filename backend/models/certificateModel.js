/**
 * 数据库模型 - 证书相关操作
 */
const { pool } = require('../config/db');

// 获取所有证书（支持分页和筛选）
const getAll = async (options = {}) => {
    const { page = 1, pageSize = 10, type, status, keyword } = options;
    const offset = (page - 1) * pageSize;
    
    let sql = 'SELECT * FROM certificates WHERE 1=1';
    const params = [];
    
    if (type) {
        sql += ' AND type = ?';
        params.push(type);
    }
    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }
    if (keyword) {
        sql += ' AND (name LIKE ? OR issuing_authority LIKE ?)';
        params.push(`%${keyword}%`, `%${keyword}%`);
    }
    
    // 获取总数
    const [countResult] = await pool.execute(
        sql.replace('SELECT *', 'SELECT COUNT(*) as total'),
        params
    );
    const total = countResult[0].total;
    
    // 获取数据
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize), parseInt(offset));
    
    const [rows] = await pool.execute(sql, params);
    
    return { rows, total, page, pageSize };
};

// 获取所有启用的证书（下拉选择用）
const getActive = async () => {
    const [rows] = await pool.execute(
        'SELECT id, name, type, is_required, issuing_authority FROM certificates WHERE status = ? ORDER BY name',
        ['启用']
    );
    return rows;
};

// 根据ID获取证书
const getById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [id]);
    return rows[0];
};

// 创建证书
const create = async (data) => {
    const { name, type, is_required, issuing_authority, description, status } = data;
    const sql = `
        INSERT INTO certificates (name, type, is_required, issuing_authority, description, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
        name, type, is_required || 0, issuing_authority, description, status || '启用'
    ]);
    return result.insertId;
};

// 更新证书
const update = async (id, data) => {
    const fields = [];
    const params = [];
    
    const allowedFields = ['name', 'type', 'is_required', 'issuing_authority', 'description', 'status'];
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            fields.push(`${field} = ?`);
            params.push(data[field]);
        }
    }
    
    if (fields.length === 0) return false;
    
    params.push(id);
    const sql = `UPDATE certificates SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
};

// 删除证书
const remove = async (id) => {
    const [result] = await pool.execute('DELETE FROM certificates WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

// 获取证书统计
const getStats = async () => {
    const sql = `
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN type = '人社' THEN 1 ELSE 0 END) as renshe,
            SUM(CASE WHEN type = '专业' THEN 1 ELSE 0 END) as zhuanye,
            SUM(CASE WHEN type = '校内' THEN 1 ELSE 0 END) as xiaonei,
            SUM(CASE WHEN is_required = 1 THEN 1 ELSE 0 END) as required_count
        FROM certificates
        WHERE status = '启用'
    `;
    const [rows] = await pool.execute(sql);
    return rows[0];
};

module.exports = {
    getAll,
    getActive,
    getById,
    create,
    update,
    remove,
    getStats
};
