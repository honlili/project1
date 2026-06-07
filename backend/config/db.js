const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'double_cert_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 测试连接
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ 数据库连接成功');
        connection.release();
        return true;
    } catch (err) {
        console.error('❌ 数据库连接失败:', err.message);
        console.error('  请检查数据库配置或导入 schema.sql');
        return false;
    }
};

// 启动时测试连接
testConnection();

module.exports = { pool, testConnection };
