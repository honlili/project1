/**
 * 控制器 - 学生管理
 */
const studentModel = require('../models/studentModel');
const classModel = require('../models/classModel');
const xlsx = require('xlsx');
const path = require('path');

// 获取学生列表
const getAll = async (req, res) => {
    try {
        const { page, pageSize, class_id, status, keyword } = req.query;
        const result = await studentModel.getAll({
            page: parseInt(page) || 1,
            pageSize: parseInt(pageSize) || 10,
            class_id,
            status,
            keyword
        });
        
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                total: result.total,
                page: result.page,
                pageSize: result.pageSize
            }
        });
    } catch (error) {
        console.error('获取学生列表错误:', error);
        res.status(500).json({
            success: false,
            message: '获取学生列表失败'
        });
    }
};

// 获取单个学生
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentModel.getById(id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: '学生不存在'
            });
        }
        
        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('获取学生错误:', error);
        res.status(500).json({
            success: false,
            message: '获取学生失败'
        });
    }
};

// 创建学生
const create = async (req, res) => {
    try {
        const { student_no, name, gender, class_id, phone, email, status } = req.body;
        
        if (!student_no || !name) {
            return res.status(400).json({
                success: false,
                message: '学号和姓名为必填项'
            });
        }
        
        // 检查学号是否已存在
        const existing = await studentModel.getByStudentNo(student_no);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: '学号已存在'
            });
        }
        
        const id = await studentModel.create({
            student_no, name, gender, class_id, phone, email, status
        });
        
        res.status(201).json({
            success: true,
            message: '学生创建成功',
            data: { id }
        });
    } catch (error) {
        console.error('创建学生错误:', error);
        res.status(500).json({
            success: false,
            message: '创建学生失败'
        });
    }
};

// 更新学生
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const success = await studentModel.update(id, data);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: '学生不存在或无更新'
            });
        }
        
        res.json({
            success: true,
            message: '学生更新成功'
        });
    } catch (error) {
        console.error('更新学生错误:', error);
        res.status(500).json({
            success: false,
            message: '更新学生失败'
        });
    }
};

// 删除学生
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        
        const success = await studentModel.remove(id);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                message: '学生不存在'
            });
        }
        
        res.json({
            success: true,
            message: '学生删除成功'
        });
    } catch (error) {
        console.error('删除学生错误:', error);
        res.status(500).json({
            success: false,
            message: '删除学生失败'
        });
    }
};

// 批量导入学生
const importStudents = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请上传Excel文件'
            });
        }
        
        // 读取Excel文件
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        
        if (data.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Excel文件为空'
            });
        }
        
        // 获取班级列表用于匹配
        const classes = await classModel.getAll();
        const classMap = {};
        classes.forEach(c => {
            classMap[c.name] = c.id;
        });
        
        // 处理数据
        const students = [];
        const errors = [];
        
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowNum = i + 2; // Excel行号从2开始（第1行是表头）
            
            try {
                // 检查必填字段
                if (!row['学号'] || !row['姓名']) {
                    errors.push(`第${rowNum}行：学号和姓名为必填项`);
                    continue;
                }
                
                // 检查学号是否已存在
                const existing = await studentModel.getByStudentNo(row['学号']);
                if (existing) {
                    errors.push(`第${rowNum}行：学号 ${row['学号']} 已存在`);
                    continue;
                }
                
                // 匹配班级
                let classId = null;
                if (row['班级']) {
                    classId = classMap[row['班级']];
                    if (!classId) {
                        errors.push(`第${rowNum}行：班级 ${row['班级']} 不存在`);
                        continue;
                    }
                }
                
                students.push({
                    student_no: row['学号'],
                    name: row['姓名'],
                    gender: row['性别'] || '男',
                    class_id: classId,
                    phone: row['电话'] || null,
                    email: row['邮箱'] || null,
                    status: row['状态'] || '在读'
                });
            } catch (err) {
                errors.push(`第${rowNum}行：${err.message}`);
            }
        }
        
        // 批量插入
        let insertedCount = 0;
        if (students.length > 0) {
            insertedCount = await studentModel.batchCreate(students);
        }
        
        res.json({
            success: true,
            message: `成功导入 ${insertedCount} 条记录`,
            data: {
                total: data.length,
                inserted: insertedCount,
                errors: errors.length > 0 ? errors : undefined
            }
        });
    } catch (error) {
        console.error('导入学生错误:', error);
        res.status(500).json({
            success: false,
            message: '导入失败：' + error.message
        });
    }
};

// 下载学生导入模板
const downloadTemplate = (req, res) => {
    // 创建模板数据
    const template = [
        { '学号': '2023001001', '姓名': '张三', '性别': '男', '班级': '计算机2301班', '电话': '13800138000', '邮箱': 'example@email.com', '状态': '在读' },
        { '学号': '2023001002', '姓名': '李四', '性别': '女', '班级': '计算机2301班', '电话': '13800138001', '邮箱': 'example2@email.com', '状态': '在读' }
    ];
    
    const ws = xlsx.utils.json_to_sheet(template);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, '学生信息');
    
    const filePath = path.join(__dirname, '../uploads/students_template.xlsx');
    xlsx.writeFile(wb, filePath);
    
    res.download(filePath, '学生导入模板.xlsx', (err) => {
        if (err) {
            console.error('下载模板错误:', err);
        }
    });
};

// 获取学生统计
const getStats = async (req, res) => {
    try {
        const stats = await studentModel.getStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('获取学生统计错误:', error);
        res.status(500).json({
            success: false,
            message: '获取统计失败'
        });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    importStudents,
    downloadTemplate,
    getStats
};
