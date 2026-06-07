/**
 * 数据库模型 - 培训资料相关操作
 */
const { pool } = require('../config/db');

// 获取所有培训资料（支持分页和筛选）
const getAll = async (options = {}) => {
    const { page = 1, pageSize = 10, material_type, certificate_id, status, keyword } = options;
    const offset = (page - 1) * pageSize;
    
    let sql = `
        SELECT tm.*, cert.name as certificate_name
        FROM training_materials tm
        LEFT JOIN certificates cert ON tm.certificate_id = cert.id
        WHERE 1=1
    `;
    const params = [];
    
    if (material_type) {
        sql += ' AND tm.material_type = ?';
        params.push(material_type);
    }
    if (certificate_id) {
        sql += ' AND tm.certificate_id = ?';
        params.push(certificate_id);
    }
    if (status) {
        sql += ' AND tm.status = ?';
        params.push(status);
    }
    if (keyword) {
        sql += ' AND tm.title LIKE ?';
        params.push(`%${keyword}%`);
    }
    
    // 获取总数
    const [countResult] = await pool.execute(
        sql.replace(/SELECT tm\.\*,[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM'),
        params
    );
    const total = countResult[0].total;
    
    // 获取数据
    sql += ' ORDER BY tm.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(pageSize), parseInt(offset));
    
    const [rows] = await pool.execute(sql, params);
    
    return { rows, total, page, pageSize };
};

// 获取已发布的培训资料
const getPublished = async () => {
    const sql = `
        SELECT tm.*, cert.name as certificate_name
        FROM training_materials tm
        LEFT JOIN certificates cert ON tm.certificate_id = cert.id
        WHERE tm.status = '已发布'
        ORDER BY tm.publish_date DESC, tm.created_at DESC
    `;
    const [rows] = await pool.execute(sql);
    return rows;
};

// 根据ID获取培训资料
const getById = async (id) => {
    const sql = `
        SELECT tm.*, cert.name as certificate_name
        FROM training_materials tm
        LEFT JOIN certificates cert ON tm.certificate_id = cert.id
        WHERE tm.id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0];
};

// 创建培训资料
const create = async (data) => {
    const { title, content, material_type, certificate_id, file_path, publish_date, status, created_by } = data;
    const sql = `
        INSERT INTO training_materials (title, content, material_type, certificate_id, file_path, publish_date, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
        title, content, material_type || '培训信息', certificate_id, file_path, publish_date || new Date(), status || '已发布', created_by
    ]);
    return result.insertId;
};

// 更新培训资料
const update = async (id, data) => {
    const fields = [];
    const params = [];
    
    const allowedFields = ['title', 'content', 'material_type', 'certificate_id', 'file_path', 'publish_date', 'status'];
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            fields.push(`${field} = ?`);
            params.push(data[field]);
        }
    }
    
    if (fields.length === 0) return false;
    
    params.push(id);
    const sql = `UPDATE training_materials SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
};

// 删除培训资料
const remove = async (id) => {
    const [result] = await pool.execute('DELETE FROM training_materials WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

// 增加浏览次数
const incrementViewCount = async (id) => {
    await pool.execute('UPDATE training_materials SET view_count = view_count + 1 WHERE id = ?', [id]);
};

module.exports = {
    getAll,
    getPublished,
    getById,
    create,
    update,
    remove,
    incrementViewCount
};
