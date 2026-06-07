/**
 * 外部接口测试页面
 */
import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Alert, Divider, Typography } from 'antd';
import { ApiOutlined, SendOutlined } from '@ant-design/icons';
import { getStudentCertificates } from '../services/externalService';

const { Text, Paragraph } = Typography;

const ExternalApiTest = () => {
    const [loading, setLoading] = useState(false);
    const [studentId, setStudentId] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleTest = async () => {
        if (!studentId) {
            message.warning('请输入学生ID');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await getStudentCertificates(studentId);
            if (res.success) {
                setResult(res.data);
            } else {
                setError(res.message || '请求失败');
            }
        } catch (error) {
            setError(error.message || '请求失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">外部接口测试</h1>
            </div>

            <Card>
                <Alert
                    message="接口说明"
                    description={
                        <div>
                            <Paragraph>
                                <Text strong>接口地址：</Text>
                                <Text code>GET /api/external/student-certificates?student_id=xxx</Text>
                            </Paragraph>
                            <Paragraph>
                                <Text strong>认证方式：</Text>
                                <Text code>Header: x-api-key: 123456</Text>
                            </Paragraph>
                            <Paragraph>
                                <Text strong>功能：</Text>
                                返回指定学生所有已获得的证书信息（JSON格式）
                            </Paragraph>
                        </div>
                    }
                    type="info"
                    showIcon
                    icon={<ApiOutlined />}
                    style={{ marginBottom: 24 }}
                />

                <Divider>测试接口</Divider>

                <Form layout="inline" style={{ marginBottom: 24 }}>
                    <Form.Item label="学生ID">
                        <Input
                            placeholder="请输入学生ID"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            style={{ width: 200 }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            loading={loading}
                            onClick={handleTest}
                        >
                            发送请求
                        </Button>
                    </Form.Item>
                </Form>

                {error && (
                    <Alert
                        message="请求失败"
                        description={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {result && (
                    <>
                        <Alert
                            message="请求成功"
                            description={`找到 ${result.total} 条证书记录`}
                            type="success"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />

                        <div className="api-test-result">
                            <pre>{JSON.stringify(result, null, 2)}</pre>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default ExternalApiTest;
