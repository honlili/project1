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

// 布局组件
import MainLayout from './components/MainLayout';

// 路由守卫 - 检查登录状态
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
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
                            <PrivateRoute>
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

                    {/* 默认重定向 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
