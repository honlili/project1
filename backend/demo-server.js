const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const mockData = {
    classes: [
        { id: 1, name: '2024人工智能1班', grade: '2024', major: '人工智能' },
        { id: 2, name: '2024人工智能2班', grade: '2024', major: '人工智能' },
        { id: 3, name: '2024计算机1班', grade: '2024', major: '计算机科学与技术' },
        { id: 4, name: '2024计算机2班', grade: '2024', major: '计算机科学与技术' },
        { id: 5, name: '2024软件工程1班', grade: '2024', major: '软件工程' },
        { id: 6, name: '2024网络工程1班', grade: '2024', major: '网络工程' }
    ],
    students: [
        { id: 1, student_no: '2023001001', name: '张三', gender: '男', college: '智能产业学院', class_name: '2024人工智能1班', phone: '13800138001', status: '在读' },
        { id: 2, student_no: '2023001002', name: '李四', gender: '女', college: '智能产业学院', class_name: '2024人工智能1班', phone: '13800138002', status: '在读' },
        { id: 3, student_no: '2023001003', name: '王五', gender: '男', college: '大数据产业学院', class_name: '2024计算机1班', phone: '13800138003', status: '在读' }
    ],
    certificates: [
        { id: 1, name: '全国计算机等级考试二级', type: '人社', is_required: 1, issuing_authority: '教育部考试中心', status: '启用' },
        { id: 2, name: '软件设计师（中级）', type: '人社', is_required: 0, issuing_authority: '人力资源和社会保障部', status: '启用' },
        { id: 3, name: '普通话水平测试二级甲等', type: '校内', is_required: 1, issuing_authority: '学校语言文字工作委员会', status: '启用' },
        { id: 4, name: '大学英语四级', type: '专业', is_required: 1, issuing_authority: '教育部高等教育司', status: '启用' }
    ],
    registrations: [
        { id: 1, student_id: 1, student_no: '2023001001', student_name: '张三', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', status: '已通过', score: 85, ai_review_result: 'pass', ai_review_reason: '成绩85分，大于等于60分，符合自动通过条件', apply_date: '2024-01-15 10:30:00' },
        { id: 2, student_id: 2, student_no: '2023001002', student_name: '李四', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 2, certificate_name: '软件设计师（中级）', certificate_type: '人社', status: '待审核', score: 72, ai_review_result: 'pass', ai_review_reason: '成绩72分，大于等于60分，建议通过', apply_date: '2024-01-16 14:20:00' },
        { id: 3, student_id: 3, student_no: '2023001003', student_name: '王五', college: '大数据产业学院', class_name: '2024计算机1班', certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', status: '待审核', score: 55, ai_review_result: 'pending', ai_review_reason: '成绩55分，低于60分，需人工审核确认', apply_date: '2024-01-17 09:15:00' }
    ],
    trainingMaterials: [
        { id: 1, title: '计算机二级考试培训通知', material_type: '培训信息', status: '已发布', view_count: 100 },
        { id: 2, title: '软件设计师考试大纲', material_type: '考试大纲', status: '已发布', view_count: 56 }
    ]
};

let userToken = null;

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: '服务运行正常（演示模式）' });
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        userToken = 'demo-token-' + Date.now();
        res.json({
            success: true,
            data: {
                token: userToken,
                user: { id: 1, username: 'admin', name: '管理员', role: '超级管理员' }
            }
        });
    } else {
        res.status(401).json({ success: false, message: '用户名或密码错误' });
    }
});

app.get('/api/auth/me', (req, res) => {
    res.json({
        success: true,
        data: { id: 1, username: 'admin', name: '管理员', role: '超级管理员' }
    });
});

app.get('/api/dashboard/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            students: { total: 3, active: 3, graduated: 0, suspended: 0 },
            certificates: { total: 4, renshe: 2, zhuanye: 1, xiaonei: 1 },
            registrations: { total: 3, pending: 2, approved: 1, rejected: 0, passRate: 33.3 },
            recentRegistrations: mockData.registrations.slice(0, 5),
            certificateRegistrationStats: mockData.certificates.map(c => ({
                certificate_name: c.name, certificate_type: c.type,
                total_registrations: mockData.registrations.filter(r => r.certificate_id === c.id).length,
                passed_count: mockData.registrations.filter(r => r.certificate_id === c.id && r.status === '已通过').length
            }))
        }
    });
});

app.get('/api/classes', (req, res) => {
    res.json({ success: true, data: mockData.classes });
});

app.get('/api/certificates', (req, res) => {
    res.json({ success: true, data: mockData.certificates, pagination: { total: mockData.certificates.length, page: 1, pageSize: 10 } });
});

app.get('/api/certificates/active', (req, res) => {
    res.json({ success: true, data: mockData.certificates });
});

app.post('/api/certificates', (req, res) => {
    const newCert = { ...req.body, id: mockData.certificates.length + 1 };
    mockData.certificates.push(newCert);
    res.json({ success: true, message: '创建成功', data: { id: newCert.id } });
});

app.put('/api/certificates/:id', (req, res) => {
    const index = mockData.certificates.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
        mockData.certificates[index] = { ...mockData.certificates[index], ...req.body };
    }
    res.json({ success: true, message: '更新成功' });
});

app.delete('/api/certificates/:id', (req, res) => {
    mockData.certificates = mockData.certificates.filter(c => c.id !== parseInt(req.params.id));
    res.json({ success: true, message: '删除成功' });
});

app.get('/api/students', (req, res) => {
    res.json({ success: true, data: mockData.students, pagination: { total: mockData.students.length, page: 1, pageSize: 10 } });
});

app.post('/api/students', (req, res) => {
    const { class_name } = req.body;
    const newStudent = { 
        ...req.body, 
        id: mockData.students.length + 1,
        class_name: class_name || ''
    };
    mockData.students.push(newStudent);
    res.json({ success: true, message: '创建成功', data: { id: newStudent.id } });
});

app.put('/api/students/:id', (req, res) => {
    const index = mockData.students.findIndex(s => s.id === parseInt(req.params.id));
    if (index !== -1) {
        const { class_name } = req.body;
        mockData.students[index] = { 
            ...mockData.students[index], 
            ...req.body,
            class_name: class_name !== undefined ? class_name : mockData.students[index].class_name
        };
    }
    res.json({ success: true, message: '更新成功' });
});

app.delete('/api/students/:id', (req, res) => {
    mockData.students = mockData.students.filter(s => s.id !== parseInt(req.params.id));
    res.json({ success: true, message: '删除成功' });
});

app.get('/api/registrations', (req, res) => {
    res.json({ success: true, data: mockData.registrations, pagination: { total: mockData.registrations.length, page: 1, pageSize: 10 } });
});

app.get('/api/registrations/:id', (req, res) => {
    const reg = mockData.registrations.find(r => r.id === parseInt(req.params.id));
    if (reg) {
        res.json({ success: true, data: reg });
    } else {
        res.json({ success: false, message: '记录不存在' });
    }
});

app.get('/api/registrations/pending', (req, res) => {
    const pending = mockData.registrations.filter(r => r.status === '待审核');
    res.json({ success: true, data: pending, pagination: { total: pending.length, page: 1, pageSize: 10 } });
});

app.post('/api/registrations/:id/approve', (req, res) => {
    const reg = mockData.registrations.find(r => r.id === parseInt(req.params.id));
    if (reg) {
        reg.status = '已通过';
    }
    res.json({ success: true, message: '审核通过' });
});

app.post('/api/registrations/:id/reject', (req, res) => {
    const reg = mockData.registrations.find(r => r.id === parseInt(req.params.id));
    if (reg) {
        reg.status = '已驳回';
    }
    res.json({ success: true, message: '已驳回' });
});

app.get('/api/archives/classes', (req, res) => {
    res.json({ success: true, data: mockData.classes });
});

app.get('/api/archives/by-class', (req, res) => {
    const classId = parseInt(req.query.class_id);
    const filtered = mockData.registrations.filter(r => r.class_id === classId || classId === 1);
    res.json({ success: true, data: filtered.map(r => ({ ...r, pass_status: r.status === '已通过' ? 1 : 0 })) });
});

app.get('/api/training', (req, res) => {
    res.json({ success: true, data: mockData.trainingMaterials, pagination: { total: mockData.trainingMaterials.length, page: 1, pageSize: 10 } });
});

app.get('/api/external/student-certificates', (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== '123456') {
        return res.status(403).json({ success: false, message: 'API Key无效' });
    }
    res.json({
        success: true,
        data: {
            student_id: parseInt(req.query.student_id) || 1,
            total: 2,
            certificates: [
                { certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', score: 85 },
                { certificate_id: 4, certificate_name: '大学英语四级', certificate_type: '专业', score: 450 }
            ]
        }
    });
});

app.listen(PORT, () => {
    console.log('========================================');
    console.log('  学生校内双证管理系统 - 演示版');
    console.log('========================================');
    console.log(`  服务地址: http://localhost:${PORT}`);
    console.log('  注意: 这是演示版本，使用内存数据');
    console.log('  账号: admin / admin123');
    console.log('========================================');
    console.log('');
});
