/**
 * 个人设置页面
 */
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, message, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const Settings = () => {
    const [form] = Form.useForm();
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);
        form.setFieldsValue({
            name: storedUser.name || '',
            username: storedUser.username || '',
            email: storedUser.email || '',
            phone: storedUser.phone || '',
            remark: storedUser.remark || ''
        });
    }, []);

    const handleProfileSubmit = async () => {
        try {
            const values = await form.validateFields();
            const updatedUser = { ...user, ...values };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            message.success('个人信息更新成功');
        } catch (error) {
            message.error('更新失败');
        }
    };

    const handlePasswordSubmit = async (passwordForm) => {
        try {
            const values = await passwordForm.validateFields();
            if (values.newPassword !== values.confirmPassword) {
                message.error('两次输入的密码不一致');
                return;
            }
            if (values.newPassword.length < 6) {
                message.error('密码长度至少6位');
                return;
            }
            message.success('密码修改成功');
            passwordForm.resetFields();
        } catch (error) {
            message.error('修改失败');
        }
    };

    const handleUpload = (info) => {
        if (info.file.status === 'done') {
            message.success('头像上传成功');
        } else if (info.file.status === 'error') {
            message.error('头像上传失败');
        }
    };

    const tabs = [
        { key: 'profile', label: '个人信息' },
        { key: 'password', label: '修改密码' }
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">个人设置</h1>
            </div>

            <Card>
                <div style={{ marginBottom: 24 }}>
                    <Space>
                        {tabs.map(tab => (
                            <Button
                                key={tab.key}
                                type={activeTab === tab.key ? 'primary' : 'default'}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </Space>
                </div>

                <Divider />

                {activeTab === 'profile' && (
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                            <Avatar
                                size={128}
                                icon={<UserOutlined />}
                                style={{ marginRight: 24 }}
                            />
                            <Upload
                                name="avatar"
                                action={`${process.env.REACT_APP_API_URL}/api/users/avatar`}
                                headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
                                onChange={handleUpload}
                                showUploadList={false}
                            >
                                <Button icon={<UploadOutlined />}>更换头像</Button>
                            </Upload>
                        </div>

                        <Form form={form} layout="vertical" onFinish={handleProfileSubmit}>
                            <div style={{ maxWidth: 600 }}>
                                <Form.Item
                                    name="username"
                                    label="用户名"
                                    rules={[{ required: true, message: '请输入用户名' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="请输入用户名"
                                        disabled
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="name"
                                    label="姓名"
                                    rules={[{ required: true, message: '请输入姓名' }]}
                                >
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="请输入姓名"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    label="邮箱"
                                    rules={[
                                        { required: true, message: '请输入邮箱' },
                                        { type: 'email', message: '请输入有效的邮箱' }
                                    ]}
                                >
                                    <Input
                                        prefix={<MailOutlined />}
                                        placeholder="请输入邮箱"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="联系电话"
                                >
                                    <Input
                                        prefix={<PhoneOutlined />}
                                        placeholder="请输入联系电话"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="remark"
                                    label="备注"
                                >
                                    <TextArea rows={3} placeholder="请输入备注信息" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        保存修改
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div style={{ maxWidth: 400 }}>
                        <Form layout="vertical" onFinish={handlePasswordSubmit}>
                            <Form.Item
                                name="oldPassword"
                                label="原密码"
                                rules={[{ required: true, message: '请输入原密码' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="请输入原密码"
                                />
                            </Form.Item>

                            <Form.Item
                                name="newPassword"
                                label="新密码"
                                rules={[
                                    { required: true, message: '请输入新密码' },
                                    { min: 6, message: '密码长度至少6位' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="请输入新密码"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label="确认密码"
                                rules={[{ required: true, message: '请确认密码' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="请再次输入新密码"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    修改密码
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Settings;