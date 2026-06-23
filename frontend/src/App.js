/**
 * 主应用入口
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 页面组件
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CertificateManage from './pages/CertificateManage';
import StudentManage from './pages/StudentManage';
import RegistrationAudit from './pages/RegistrationAudit';
import ArchiveManage from './pages/ArchiveManage';
import TrainingManage from './pages/TrainingManage';
import ExternalApiTest from './pages/ExternalApiTest';
import Settings from './pages/Settings';

// 学生端页面
import StudentDashboard from './pages/StudentDashboard';
import StudentCertificates from './pages/StudentCertificates';
import StudentApply from './pages/StudentApply';
import StudentTraining from './pages/StudentTraining';
import StudentSettings from './pages/StudentSettings';
import StudentAiChat from './pages/StudentAiChat';

// 布局组件
import MainLayout from './components/MainLayout';
import StudentLayout from './components/StudentLayout';

// 路由守卫 - 检查登录状态并按角色限制
const PrivateRoute = ({ children, requireRole }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!token || !user) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        return <Navigate to="/login" replace />;
    }

    if (requireRole === 'student' && role === 'admin') {
        // 管理员走错页面，送回管理端
        return <Navigate to="/" replace />;
    }
    if (requireRole === 'admin' && role === 'student') {
        // 学生走错页面，送回学生端
        return <Navigate to="/student" replace />;
    }

    return children;
};

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <Routes>
                    {/* 登录页面 */}
                    <Route path="/login" element={<Login />} />

                    {/* 需要登录的页面 */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute requireRole="admin">
                                <MainLayout />
                            </PrivateRoute>
                        }
                    >
                        {/* 仪表板 */}
                        <Route index element={<Dashboard />} />

                        {/* 证书管理 */}
                        <Route path="certificates" element={<CertificateManage />} />

                        {/* 学生管理 */}
                        <Route path="students" element={<StudentManage />} />

                        {/* 报名审核 */}
                        <Route path="audit" element={<RegistrationAudit />} />

                        {/* 成绩归档 */}
                        <Route path="archives" element={<ArchiveManage />} />

                        {/* 培训辅导 */}
                        <Route path="training" element={<TrainingManage />} />

                        {/* 外部接口测试 */}
                        <Route path="external" element={<ExternalApiTest />} />

                        {/* 个人设置 */}
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* 学生端路由 */}
                    <Route
                        path="/student"
                        element={
                            <PrivateRoute requireRole="student">
                                <StudentLayout />
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<StudentDashboard />} />
                        <Route path="certificates" element={<StudentCertificates />} />
                        <Route path="apply" element={<StudentApply />} />
                        <Route path="training" element={<StudentTraining />} />
                        <Route path="ai-chat" element={<StudentAiChat />} />
                        <Route path="settings" element={<StudentSettings />} />
                    </Route>

                    {/* 默认重定向 */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
