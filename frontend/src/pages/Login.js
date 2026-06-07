/**
 * 登录页面
 */
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await login(values);
            if (res.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                message.success('登录成功');
                navigate('/');
            } else {
                message.error(res.message || '登录失败');
            }
        } catch (error) {
            message.error(error.message || '登录失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="login-title">学生校内双证管理系统</h1>
                <Form
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>
                    默认账号：admin / admin123
                </div>
            </div>
        </div>
    );
};

export default Login;