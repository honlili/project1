import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Divider, Alert } from 'antd';
import { UserOutlined, SettingOutlined } from '@ant-design/icons';
import { updateStudentProfile, getCurrentStudent } from '../services/authService';

const StudentSettings = () => {
    const [student, setStudent] = useState({});
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await getCurrentStudent();
                if (res && res.success && res.data) {
                    setStudent(res.data);
                    profileForm.setFieldsValue({ phone: res.data.phone || '' });
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, [profileForm]);

    const handleUpdateProfile = async (values) => {
        setProfileLoading(true);
        try {
            const res = await updateStudentProfile({ phone: values.phone });
            if (res && res.success) {
                // 同步更新 localStorage
                const raw = JSON.parse(localStorage.getItem('user') || '{}');
                const updated = { ...raw, phone: values.phone };
                localStorage.setItem('user', JSON.stringify(updated));
                message.success('个人信息已更新');
            } else {
                message.error(res?.message || '更新失败');
            }
        } catch (error) {
            message.error(error?.message || '更新失败');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleUpdatePassword = async (values) => {
        setPasswordLoading(true);
        try {
            if (values.new_password !== values.confirm_password) {
                message.error('两次输入的新密码不一致');
                return;
            }
            const res = await updateStudentProfile({
                old_password: values.old_password,
                new_password: values.new_password
            });
            if (res && res.success) {
                message.success('密码已更新');
                passwordForm.resetFields();
            } else {
                message.error(res?.message || '原密码错误');
            }
        } catch (error) {
            message.error(error?.message || '更新失败');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <div className="page-header" style={{ marginBottom: 16 }}>
                <h2 className="page-title" style={{ margin: 0 }}>个人设置</h2>
            </div>

            <Alert
                message={`当前登录：${student.name || '-'}（学号：${student.student_no || '-'}）`}
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <Card
                title={
                    <span>
                        <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        个人信息
                    </span>
                }
                style={{ marginBottom: 16 }}
            >
                <Form
                    form={profileForm}
                    layout="vertical"
                    size="large"
                    initialValues={{ phone: student.phone || '' }}
                    onFinish={handleUpdateProfile}
                >
                    <Form.Item label="学号">
                        <Input value={student.student_no || '-'} disabled />
                    </Form.Item>
                    <Form.Item label="姓名">
                        <Input value={student.name || '-'} disabled />
                    </Form.Item>
                    <Form.Item label="学院">
                        <Input value={student.college || '-'} disabled />
                    </Form.Item>
                    <Form.Item label="班级">
                        <Input value={student.class_name || '-'} disabled />
                    </Form.Item>
                    <Form.Item
                        label="联系电话"
                        name="phone"
                        rules={[{ max: 20, message: '最多20个字符' }]}
                    >
                        <Input placeholder="请输入联系电话" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={profileLoading}>
                            保存修改
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            <Divider />

            <Card
                title={
                    <span>
                        <SettingOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        修改密码
                    </span>
                }
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    size="large"
                    onFinish={handleUpdatePassword}
                >
                    <Form.Item
                        label="原密码"
                        name="old_password"
                        rules={[
                            { required: true, message: '请输入原密码' },
                            { min: 6, message: '密码至少6位' }
                        ]}
                    >
                        <Input.Password placeholder="请输入原密码" />
                    </Form.Item>
                    <Form.Item
                        label="新密码"
                        name="new_password"
                        rules={[
                            { required: true, message: '请输入新密码' },
                            { min: 6, message: '密码至少6位' }
                        ]}
                    >
                        <Input.Password placeholder="请输入新密码（至少6位）" />
                    </Form.Item>
                    <Form.Item
                        label="确认新密码"
                        name="confirm_password"
                        rules={[
                            { required: true, message: '请再次输入新密码' },
                            { min: 6, message: '密码至少6位' }
                        ]}
                    >
                        <Input.Password placeholder="请再次输入新密码" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={passwordLoading}>
                            修改密码
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default StudentSettings;
