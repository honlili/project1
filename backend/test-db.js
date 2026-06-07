const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('========================================');
console.log('  测试数据库连接');
console.log('========================================');

async function test() {
    try {
        console.log('正在连接数据库...');
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root'
        });
        console.log('✅ 数据库连接成功');

        console.log('\n检查数据库是否存在...');
        const dbName = process.env.DB_NAME || 'double_cert_db';
        const [dbs] = await connection.execute('SHOW DATABASES LIKE ?', [dbName]);
        
        if (dbs.length === 0) {
            console.log('⚠️  数据库不存在，请先导入 db/schema.sql');
            console.log('   导入命令: mysql -u root -p < db/schema.sql');
        } else {
            console.log('✅ 数据库存在:', dbName);
            
            await connection.execute('USE ' + dbName);
            
            console.log('\n检查表格...');
            const [tables] = await connection.execute('SHOW TABLES');
            console.log('找到', tables.length, '个表');
            tables.forEach(t => {
                for (let key in t) console.log('  -', t[key]);
            });
        }

        await connection.end();
        console.log('\n========================================');
        console.log('  测试完成');
        console.log('========================================');
    } catch (err) {
        console.error('❌ 错误:', err.message);
        console.error('\n请检查:');
        console.error('  1. MySQL服务是否运行');
        console.error('  2. 用户名密码是否正确');
        console.error('  3. 是否已导入 db/schema.sql');
    }
}

test();
