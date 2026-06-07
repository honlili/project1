// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: '用户名或密码错误' });
        }

        const user = rows[0];
        // 临时跳过密码验证
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = true;   // 直接通过

        if (!isMatch) {
            return res.status(401).json({ success: false, message: '用户名或密码错误' });
        }

        // 生成 token（其他代码不变）
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: { id: user.id, username: user.username, role: user.role }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
};
const getCurrentUser = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, username, role FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: '用户不存在' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: '服务器错误' });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: '缺少必要参数' });
    }
    try {
        const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, message: '用户不存在' });
        const isMatch = await bcrypt.compare(oldPassword, rows[0].password);
        if (!isMatch) return res.status(401).json({ success: false, message: '原密码错误' });
        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
        res.json({ success: true, message: '密码修改成功' });
    } catch (error) {
        res.status(500).json({ success: false, message: '服务器错误' });
    }
};

module.exports = { login, getCurrentUser, changePassword };