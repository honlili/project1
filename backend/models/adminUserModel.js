/**
 * 数据库模型 - 管理员用户相关操作
 */
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

// 根据用户名获取用户
const getByUsername = async (username) => {
    const [rows] = await pool.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
    return rows[0];
};

// 根据ID获取用户
const getById = async (id) => {
    const [rows] = await pool.execute('SELECT id, username, name, role, status, last_login, created_at FROM admin_users WHERE id = ?', [id]);
    return rows[0];
};

// 验证用户登录
const validateLogin = async (username, password) => {
    const user = await getByUsername(username);
    
    if (!user) {
        return { success: false, message: '用户名不存在' };
    }
    
    if (user.status !== 1) {
        return { success: false, message: '账号已被禁用' };
    }
    
    // 验证密码（实际项目中应该使用bcrypt加密）
    // 这里简化处理，支持明文和bcrypt两种方式
    let isMatch = false;
    if (user.password === password) {
        isMatch = true;
    } else {
        isMatch = await bcrypt.compare(password, user.password);
    }
    
    if (!isMatch) {
        return { success: false, message: '密码错误' };
    }
    
    // 更新最后登录时间
    await pool.execute('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);
    
    return {
        success: true,
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
        }
    };
};

// 创建用户
const create = async (data) => {
    const { username, password, name, role } = data;
    
    // 检查用户名是否已存在
    const existing = await getByUsername(username);
    if (existing) {
        return { success: false, message: '用户名已存在' };
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const sql = `
        INSERT INTO admin_users (username, password, name, role)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [username, hashedPassword, name, role || '普通管理员']);
    return { success: true, id: result.insertId };
};

// 更新用户
const update = async (id, data) => {
    const fields = [];
    const params = [];
    
    if (data.name) {
        fields.push('name = ?');
        params.push(data.name);
    }
    if (data.role) {
        fields.push('role = ?');
        params.push(data.role);
    }
    if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        fields.push('password = ?');
        params.push(hashedPassword);
    }
    if (data.status !== undefined) {
        fields.push('status = ?');
        params.push(data.status);
    }
    
    if (fields.length === 0) return false;
    
    params.push(id);
    const sql = `UPDATE admin_users SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(sql, params);
    return result.affectedRows > 0;
};

// 获取所有用户
const getAll = async () => {
    const [rows] = await pool.execute(
        'SELECT id, username, name, role, status, last_login, created_at FROM admin_users ORDER BY created_at DESC'
    );
    return rows;
};

// 删除用户
const remove = async (id) => {
    const [result] = await pool.execute('DELETE FROM admin_users WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = {
    getByUsername,
    getById,
    validateLogin,
    create,
    update,
    getAll,
    remove
};
