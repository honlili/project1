/**
 * 认证相关 API
 */
import api from './api';

// 模拟学生账号
const mockStudents = [
    { id: 1, student_no: '2023001001', password: '123456', name: '张三', gender: '男', college: '智能产业学院', class_name: '2024人工智能1班', phone: '13800138001' },
    { id: 2, student_no: '2023001002', password: '123456', name: '李四', gender: '女', college: '智能产业学院', class_name: '2024人工智能1班', phone: '13800138002' },
    { id: 3, student_no: '2023001003', password: '123456', name: '王五', gender: '男', college: '大数据产业学院', class_name: '2024计算机1班', phone: '13800138003' }
];

// 模拟管理员账号
const mockUsers = [
    { id: 1, username: 'admin', password: 'admin123', name: '管理员', role: 'admin' }
];

// 管理员登录
export const login = async (data) => {
    try {
        const response = await api.post('/auth/login', data);
        if (response && typeof response.success === 'undefined') {
            // axios 包装
            return { success: true, data: response.data?.data || response.data, message: '登录成功' };
        }
        return response;
    } catch (error) {
        console.log('后端服务不可用，使用模拟登录');
        const user = mockUsers.find(
            (u) => u.username === data.username && u.password === data.password
        );
        if (user) {
            return {
                success: true,
                message: '登录成功',
                data: {
                    token: 'mock-token-' + Date.now(),
                    user: { id: user.id, username: user.username, name: user.name, role: user.role }
                }
            };
        }
        return { success: false, message: '用户名或密码错误' };
    }
};

// 学生账号密码登录
export const studentLogin = async (data) => {
    try {
        const response = await api.post('/auth/student-login', data);
        if (response && typeof response.success === 'undefined') {
            return { success: true, data: response.data?.data || response.data, message: '登录成功' };
        }
        return response;
    } catch (error) {
        console.log('后端服务不可用，使用模拟登录');
        const student = mockStudents.find(
            (s) => s.student_no === data.student_no && s.password === data.password
        );
        if (student) {
            return {
                success: true,
                message: '登录成功',
                data: {
                    token: 'mock-student-token-' + Date.now(),
                    user: {
                        id: student.id,
                        student_no: student.student_no,
                        name: student.name,
                        gender: student.gender,
                        college: student.college,
                        class_name: student.class_name,
                        phone: student.phone,
                        role: 'student'
                    }
                }
            };
        }
        return { success: false, message: '学号或密码错误' };
    }
};

// 获取当前用户信息
export const getCurrentUser = () => {
    return api.get('/auth/me');
};

// 修改密码
export const changePassword = (data) => {
    return api.put('/auth/password', data);
};

// ========= 学生端 API =========

const mockStudentDashboard = {
    student: { id: 1, student_no: '2023001001', name: '张三', gender: '男', college: '智能产业学院', class_name: '2024人工智能1班', phone: '13800138001' },
    stats: { total_registrations: 2, passed_count: 2, pending_count: 0, rejected_count: 0, pass_rate: 100 },
    recent: [
        { id: 1, certificate_name: '全国计算机等级考试二级', status: '已通过', score: 85, apply_date: '2024-01-15 10:30:00' },
        { id: 2, certificate_name: '普通话水平测试二级甲等', status: '已通过', score: 90, apply_date: '2024-01-05 09:00:00' }
    ]
};

const mockStudentCertificates = {
    obtained: [
        { id: 1, certificate_id: 1, name: '全国计算机等级考试二级', type: '人社', score: 85, issuing_authority: '教育部考试中心', issue_date: '2024-01-15', status: '已通过' },
        { id: 2, certificate_id: 3, name: '普通话水平测试二级甲等', type: '校内', score: 90, issuing_authority: '学校语言文字工作委员会', issue_date: '2024-01-05', status: '已通过' }
    ],
    others: [],
    obtained_cert_ids: [1, 3]
};

const mockAvailableCertificates = [
    { id: 2, name: '软件设计师（中级）', type: '人社', issuing_authority: '人力资源和社会保障部', is_required: 0 },
    { id: 4, name: '大学英语四级', type: '专业', issuing_authority: '教育部高等教育司', is_required: 1 }
];

const mockStudentRegistrations = [
    { id: 1, certificate_name: '全国计算机等级考试二级', status: '已通过', score: 85, apply_date: '2024-01-15 10:30:00', ai_review_reason: '成绩85分，大于等于60分，自动通过' },
    { id: 2, certificate_name: '普通话水平测试二级甲等', status: '已通过', score: 90, apply_date: '2024-01-05 09:00:00', ai_review_reason: '成绩90分，大于等于60分，自动通过' }
];

const mockTrainingMaterials = [
    { id: 1, title: '计算机等级考试二级（MS Office）备考资料', description: '针对全国计算机等级考试二级的经典教程与题库合集', category: '考试备考', file_url: '#', upload_time: '2024-01-01 10:00:00' },
    { id: 2, title: '普通话水平测试标准朗读素材', description: '普通话二级甲等及以上考试标准朗读素材与发音要点', category: '语言技能', file_url: '#', upload_time: '2024-01-03 11:20:00' },
    { id: 3, title: '大学英语四级真题精讲（近三年）', description: '大学英语四级近三年真题与答案解析', category: '外语', file_url: '#', upload_time: '2024-01-10 15:30:00' },
    { id: 4, title: '软件设计师考试大纲与历年真题', description: '软件设计师中级考试大纲、历年真题及答案解析', category: '考试备考', file_url: '#', upload_time: '2024-02-01 09:00:00' }
];

const getStudentNo = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return user.student_no || mockStudentDashboard.student.student_no;
    } catch {
        return mockStudentDashboard.student.student_no;
    }
};

export const getStudentDashboard = async () => {
    try {
        const response = await api.get(`/api/student/dashboard?student_no=${getStudentNo()}`);
        if (response && typeof response.success === 'undefined') {
            return { success: true, data: response.data?.data || response.data };
        }
        return response;
    } catch (error) {
        console.log('学生仪表板接口不可用，使用模拟数据');
        return { success: true, data: mockStudentDashboard };
    }
};

export const getCurrentStudent = async () => {
    try {
        const res = await getStudentDashboard();
        if (res && res.success && res.data && res.data.student) {
            return { success: true, data: res.data.student };
        }
        throw new Error('no student data');
    } catch (error) {
        return { success: true, data: mockStudentDashboard.student };
    }
};

export const getStudentCertificates = async () => {
    try {
        const response = await api.get(`/api/student/certificates?student_no=${getStudentNo()}`);
        if (response && typeof response.success === 'undefined') {
            return { success: true, data: response.data?.data || response.data };
        }
        return response;
    } catch (error) {
        console.log('学生证书接口不可用，使用模拟数据');
        return { success: true, data: mockStudentCertificates };
    }
};

export const getAvailableCertificates = async () => {
    try {
        const response = await api.get(`/api/student/available-certificates?student_no=${getStudentNo()}`);
        if (response && typeof response.success === 'undefined') {
            return { success: true, data: response.data?.data || response.data };
        }
        return response;
    } catch (error) {
        console.log('可报名证书接口不可用，使用模拟数据');
        return { success: true, data: mockAvailableCertificates };
    }
};

export const getStudentRegistrations = async () => {
    try {
        const response = await api.get(`/api/student/registrations?student_no=${getStudentNo()}`);
        if (response && typeof response.success === 'undefined') {
            return { success: true, data: response.data?.data || response.data };
        }
        return response;
    } catch (error) {
        console.log('学生报名接口不可用，使用模拟数据');
        return { success: true, data: mockStudentRegistrations };
    }
};

export const createStudentRegistration = async (data) => {
    const payload = { student_no: getStudentNo(), ...data };
    try {
        const response = await api.post('/api/student/registrations', payload);
        if (response && typeof response.success === 'undefined') {
            return { success: true, data: response.data?.data || response.data, message: '报名成功' };
        }
        return response;
    } catch (error) {
        console.log('提交报名接口不可用，使用模拟提交');
        const cert = mockAvailableCertificates.find((c) => c.id === data.certificate_id);
        const newReg = {
            id: mockStudentRegistrations.length + 1,
            certificate_id: data.certificate_id,
            certificate_name: cert ? cert.name : '新证书',
            status: data.score >= 60 ? '已通过' : '待审核',
            score: data.score,
            apply_date: new Date().toISOString().replace('T', ' ').slice(0, 19)
        };
        mockStudentRegistrations.unshift(newReg);
        return { success: true, data: newReg, message: '报名已提交' };
    }
};

export const getStudentTraining = async (params) => {
    try {
        let url = '/api/student/training';
        if (params && params.keyword) url += `?keyword=${encodeURIComponent(params.keyword)}`;
        const response = await api.get(url);
        if (response && typeof response.success === 'undefined') {
            return { success: true, data: response.data?.data || response.data };
        }
        return response;
    } catch (error) {
        console.log('培训资料接口不可用，使用模拟数据');
        let list = mockTrainingMaterials;
        if (params && params.keyword) {
            const kw = String(params.keyword).toLowerCase();
            list = list.filter((m) => (m.title + m.description).toLowerCase().includes(kw));
        }
        return { success: true, data: list };
    }
};

export const updateStudentProfile = async (data) => {
    const payload = { student_no: getStudentNo(), ...data };
    try {
        const response = await api.put('/api/student/profile', payload);
        if (response && typeof response.success === 'undefined') {
            return { success: true, data: response.data?.data || response.data, message: '更新成功' };
        }
        return response;
    } catch (error) {
        console.log('资料更新接口不可用，使用模拟更新');
        if (data.phone !== undefined) mockStudentDashboard.student.phone = data.phone;
        return { success: true, data: mockStudentDashboard.student, message: '更新成功' };
    }
};

// ========= AI智能问答 =========
export const sendAiChat = async (question) => {
    try {
        const response = await api.post('/api/student/ai-chat', { question });
        if (response && typeof response.success === 'undefined') {
            return { success: true, data: response.data?.data || response.data };
        }
        return response;
    } catch (error) {
        console.log('AI问答接口不可用，使用本地模拟');
        return { success: true, data: { question, answer: aiLocalAnswer(question), timestamp: new Date().toISOString() } };
    }
};

export const getAiQuickQuestions = async () => {
    try {
        const response = await api.get('/api/student/ai-quick-questions');
        if (response && typeof response.success === 'undefined') {
            return { success: true, data: response.data?.data || response.data };
        }
        return response;
    } catch (error) {
        return {
            success: true,
            data: [
                '怎么报名证书考试？',
                '证书有哪些类型？',
                '多少分才算及格？',
                '怎么下载培训资料？',
                '如何修改密码？',
                '双证毕业有什么要求？'
            ]
        };
    }
};

// 本地AI模拟回答（后端不可用时的兜底）
const aiLocalAnswer = (q) => {
    const ql = q.toLowerCase();
    if (ql.includes('报名') || ql.includes('考试') || ql.includes('报考')) {
        return '📋 **证书考试报名流程**：\n\n1. 登录系统，点击左侧菜单「报名考试」\n2. 在下拉列表中选择要报考的证书\n3. 输入考试成绩\n4. 点击「提交报名」按钮\n\n> 系统会自动进行AI初审，≥60分自动通过（英语四级≥425分）。';
    }
    if (ql.includes('证书') || ql.includes('类型')) {
        return '🏷️ **证书类型说明**：\n\n本系统管理三类证书：\n- **人社**：国家职业资格证书\n- **校内**：学校内部证书\n- **专业**：专业类证书\n\n部分证书为「必考」类型，毕业前必须通过。';
    }
    if (ql.includes('成绩') || ql.includes('分数') || ql.includes('及格') || ql.includes('通过')) {
        return '📊 **成绩与分数线**：\n\n- 人社/校内/专业证书：≥60分合格\n- 英语四级/六级：≥425分通过\n\n低于分数线将进入「待审核」状态。';
    }
    if (ql.includes('培训') || ql.includes('资料') || ql.includes('下载') || ql.includes('学习')) {
        return '📚 **培训资料获取**：\n\n点击左侧菜单「培训资料」，可按分类筛选或搜索标题，点击「下载」按钮获取资料。';
    }
    if (ql.includes('密码') || ql.includes('修改') || ql.includes('登录')) {
        return '🔐 **密码管理**：\n\n在「个人设置」页面可修改密码，需要输入原密码和新密码。忘记密码请联系辅导员。';
    }
    return '🤖 我是双证管理系统AI助手，可以帮你解答报名、证书、成绩、培训等相关问题。请详细描述你的问题，我会尽力帮你解答！';
};
