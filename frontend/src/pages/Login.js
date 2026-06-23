/**
 * 登录页面
 */
import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Checkbox, Tabs } from 'antd';
import { UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, BookOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login, studentLogin } from '../services/authService';

const { TabPane } = Tabs;

// 模拟学生数据
const mockStudents = [
    { student_no: '2023001001', name: '张三', college: '智能产业学院', class_name: '2024人工智能1班' },
    { student_no: '2023001002', name: '李四', college: '智能产业学院', class_name: '2024人工智能1班' },
    { student_no: '2023001003', name: '王五', college: '大数据产业学院', class_name: '2024计算机1班' },
    { student_no: '2023001004', name: '赵六', college: '大数据产业学院', class_name: '2024计算机1班' },
    { student_no: '2023001005', name: '钱七', college: '现代通信产业学院', class_name: '2024通信1班' },
    { student_no: '2023001006', name: '孙八', college: '现代通信产业学院', class_name: '2024通信1班' },
    { student_no: '2023001007', name: '周九', college: '游戏产业学院', class_name: '2024游戏开发1班' },
    { student_no: '2023001008', name: '吴十', college: '游戏产业学院', class_name: '2024游戏开发1班' },
    { student_no: '2023001009', name: '郑十一', college: '数字金融产业学院', class_name: '2024金融科技1班' },
    { student_no: '2023001010', name: '王小明', college: '数字金融产业学院', class_name: '2024金融科技1班' },
    { student_no: '2023001011', name: '李晓华', college: '未来技术产业学院', class_name: '2024未来技术1班' },
    { student_no: '2023001012', name: '张大伟', college: '未来技术产业学院', class_name: '2024未来技术1班' },
    { student_no: '2023001013', name: '王小丽', college: '智能建造产业学院', class_name: '2024智能建造1班' },
    { student_no: '2023001014', name: '赵小军', college: '智能建造产业学院', class_name: '2024智能建造1班' },
    { student_no: '2023001015', name: '孙小美', college: '数字影视传媒产业学院', class_name: '2024影视制作1班' },
    { student_no: '2023001016', name: '周小伟', college: '数字影视传媒产业学院', class_name: '2024影视制作1班' },
    { student_no: '2023001017', name: '吴小芳', college: '国际学院', class_name: '2024国际班' },
    { student_no: '2023001018', name: '郑小龙', college: '国际学院', class_name: '2024国际班' },
    { student_no: '2023001019', name: '陈小红', college: '智能产业学院', class_name: '2024人工智能2班' },
    { student_no: '2023001020', name: '杨小刚', college: '智能产业学院', class_name: '2024人工智能2班' },
    { student_no: '2023001021', name: '黄小丽', college: '大数据产业学院', class_name: '2024计算机2班' },
    { student_no: '2023001022', name: '梁小龙', college: '大数据产业学院', class_name: '2024计算机2班' },
    { student_no: '2023001023', name: '林小芳', college: '现代通信产业学院', class_name: '2024通信2班' },
    { student_no: '2023001024', name: '罗小军', college: '现代通信产业学院', class_name: '2024通信2班' },
    { student_no: '2023001025', name: '高小美', college: '游戏产业学院', class_name: '2024游戏开发2班' },
    { student_no: '2023001026', name: '何小伟', college: '游戏产业学院', class_name: '2024游戏开发2班' },
    { student_no: '2023001027', name: '郭小芳', college: '数字金融产业学院', class_name: '2024金融科技2班' },
    { student_no: '2023001028', name: '马小龙', college: '数字金融产业学院', class_name: '2024金融科技2班' },
    { student_no: '2023001029', name: '朱小丽', college: '未来技术产业学院', class_name: '2024未来技术2班' },
    { student_no: '2023001030', name: '胡小军', college: '未来技术产业学院', class_name: '2024未来技术2班' },
];

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('admin');
    const navigate = useNavigate();

    // 管理员登录
    const handleAdminLogin = async (values) => {
        setLoading(true);
        try {
            const res = await login(values);
            if (res.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('role', 'admin');
                message.success('登录成功');
                navigate('/');
            } else {
                message.error(res.message || '登录失败');
            }
        } catch (error) {
            message.error(error.message || '登录失败，请检查后端服务是否启动');
        } finally {
            setLoading(false);
        }
    };

    // 学生登录（学号 + 密码）
    const handleStudentLogin = async (values) => {
        setLoading(true);
        try {
            const res = await studentLogin({
                student_no: values.student_no,
                password: values.password
            });

            if (res.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('role', 'student');
                message.success(`欢迎回来，${res.data.user.name}`);
                navigate('/student');
            } else {
                message.error(res.message || '学号或密码错误');
            }
        } catch (error) {
            message.error(error.message || '登录失败，请检查后端服务是否启动');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                {/* 左侧区域 */}
                <div className="login-left">
                    <div className="login-brand">
                        <div className="brand-icon">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="8" y="8" width="48" height="48" rx="8" fill="#1890ff"/>
                                <path d="M24 28h16v8h-16v-8zM24 40h16v8h-16v-8z" fill="white"/>
                            </svg>
                        </div>
                        <h1 className="brand-title">双证管理系统</h1>
                        <p className="brand-desc">学生校内双证管理平台</p>
                    </div>
                    <div className="login-features">
                        <div className="feature-item">
                            <div className="feature-icon">📋</div>
                            <span>证书管理</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">👥</div>
                            <span>学生管理</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">✅</div>
                            <span>报名审核</span>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">📊</div>
                            <span>成绩归档</span>
                        </div>
                    </div>
                </div>
                
                {/* 右侧登录区域 */}
                <div className="login-right">
                    <Card className="login-card">
                        <div className="login-header">
                            <h2 className="login-title">欢迎登录</h2>
                            <p className="login-subtitle">请选择登录角色</p>
                        </div>
                        
                        <Tabs 
                            activeKey={activeTab} 
                            onChange={setActiveTab}
                            className="login-tabs"
                        >
                            {/* 管理员登录 */}
                            <TabPane 
                                tab={<><UserOutlined /> 管理员登录</>} 
                                key="admin"
                            >
                                <Form
                                    name="admin-login"
                                    onFinish={handleAdminLogin}
                                    autoComplete="off"
                                    size="large"
                                >
                                    <Form.Item
                                        name="username"
                                        rules={[
                                            { required: true, message: '请输入用户名' },
                                            { min: 3, message: '用户名至少3个字符' }
                                        ]}
                                    >
                                        <Input 
                                            prefix={<UserOutlined className="input-icon" />} 
                                            placeholder="请输入用户名"
                                            className="login-input"
                                        />
                                    </Form.Item>
                                    
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            { required: true, message: '请输入密码' },
                                            { min: 6, message: '密码至少6个字符' }
                                        ]}
                                    >
                                        <Input.Password 
                                            prefix={<LockOutlined className="input-icon" />} 
                                            placeholder="请输入密码"
                                            className="login-input"
                                            iconRender={(visible) => (
                                                visible ? (
                                                    <EyeInvisibleOutlined onClick={() => setShowPassword(!showPassword)} />
                                                ) : (
                                                    <EyeOutlined onClick={() => setShowPassword(!showPassword)} />
                                                )
                                            )}
                                        />
                                    </Form.Item>
                                    
                                    <Form.Item className="login-form-item">
                                        <Checkbox className="remember-checkbox">记住我</Checkbox>
                                        <a href="#" className="forgot-link">忘记密码？</a>
                                    </Form.Item>
                                    
                                    <Form.Item>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={loading} 
                                            block
                                            className="login-button"
                                        >
                                            登 录
                                        </Button>
                                    </Form.Item>
                                </Form>
                                
                                <div className="login-footer">
                                    <div className="demo-info">
                                        <span className="demo-label">演示账号：</span>
                                        <span className="demo-value">admin</span>
                                        <span className="demo-separator">/</span>
                                        <span className="demo-value">admin123</span>
                                    </div>
                                </div>
                            </TabPane>
                            
                            {/* 学生登录 */}
                            <TabPane 
                                tab={<><BookOutlined /> 学生登录</>} 
                                key="student"
                            >
                                <Form
                                    name="student-login"
                                    onFinish={handleStudentLogin}
                                    autoComplete="off"
                                    size="large"
                                >
                                    <Form.Item
                                        name="student_no"
                                        rules={[
                                            { required: true, message: '请输入学号' },
                                            { min: 8, message: '学号至少8位' }
                                        ]}
                                    >
                                        <Input 
                                            prefix={<BookOutlined className="input-icon" />} 
                                            placeholder="请输入学号"
                                            className="login-input"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        rules={[
                                            { required: true, message: '请输入密码' },
                                            { min: 6, message: '密码至少6位' }
                                        ]}
                                    >
                                        <Input.Password 
                                            prefix={<LockOutlined className="input-icon" />} 
                                            placeholder="请输入密码"
                                            className="login-input"
                                        />
                                    </Form.Item>
                                    
                                    <Form.Item>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={loading} 
                                            block
                                            className="login-button"
                                        >
                                            登 录
                                        </Button>
                                    </Form.Item>
                                </Form>
                                
                                <div className="login-footer">
                                    <div className="demo-info student-demo">
                                        <span className="demo-label">演示账号：</span>
                                        <span className="demo-value">2023001001</span>
                                        <span className="demo-separator">/</span>
                                        <span className="demo-value">123456</span>
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
