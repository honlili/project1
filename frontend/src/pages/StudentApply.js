import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Select, Tag, Table, Spin, Empty, Row, Col } from 'antd';
import { getAvailableCertificates, getStudentRegistrations, createStudentRegistration } from '../services/authService';

const typeColor = (t) => {
    if (t === '人社') return 'blue';
    if (t === '专业') return 'green';
    if (t === '校内') return 'orange';
    return 'default';
};

const statusColor = (s) => {
    if (s === '已通过') return 'green';
    if (s === '待审核') return 'gold';
    if (s === '已驳回') return 'red';
    return 'default';
};

const StudentApply = () => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [availableLoading, setAvailableLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [available, setAvailable] = useState([]);
    const [history, setHistory] = useState([]);

    const fetchAvailable = async () => {
        setAvailableLoading(true);
        try {
            const res = await getAvailableCertificates();
            if (res && res.success) {
                setAvailable(res.data || []);
            }
        } finally {
            setAvailableLoading(false);
        }
    };

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await getStudentRegistrations();
            if (res && res.success) {
                setHistory(Array.isArray(res.data) ? res.data : []);
            }
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailable();
        fetchHistory();
    }, []);

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            const res = await createStudentRegistration({
                certificate_id: values.certificate_id,
                score: Number(values.score)
            });
            if (res.success) {
                message.success(`报名已提交：${res.message || '等待审核'}`);
                form.resetFields();
                fetchAvailable();
                fetchHistory();
            } else {
                message.error(res.message || '提交失败');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        { title: '证书', dataIndex: 'certificate_name', key: 'certificate_name', width: 260 },
        {
            title: '类型', dataIndex: 'certificate_type', key: 'certificate_type', width: 100,
            render: (v) => <Tag color={typeColor(v)}>{v}</Tag>
        },
        { title: '成绩', dataIndex: 'score', key: 'score', width: 100 },
        {
            title: '审核结果', dataIndex: 'status', key: 'status', width: 120,
            render: (v) => <Tag color={statusColor(v)}>{v}</Tag>
        },
        {
            title: 'AI初审', dataIndex: 'ai_review_result', key: 'ai_result',
            render: (v, row) => (
                <span style={{ color: '#666' }}>{row.ai_review_reason || v || '-'}</span>
            )
        },
        { title: '申请时间', dataIndex: 'apply_date', key: 'apply_date', width: 190 }
    ];

    return (
        <div style={{ padding: 16 }}>
            <div className="page-header" style={{ marginBottom: 16 }}>
                <h2 className="page-title" style={{ margin: 0 }}>报名考试</h2>
            </div>

            <Card title="提交证书考试报名" style={{ marginBottom: 16 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    size="large"
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="选择证书"
                                name="certificate_id"
                                rules={[{ required: true, message: '请选择要报名的证书' }]}
                            >
                                <Select
                                    loading={availableLoading}
                                    placeholder="请选择一个证书（已通过的不会出现）"
                                    optionFilterProp="label"
                                    options={available.map((c) => ({
                                        label: `${c.name}（${c.type}${c.is_required ? '· 必考' : ''}）`,
                                        value: c.id
                                    }))}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="考试成绩"
                                name="score"
                                rules={[
                                    { required: true, message: '请输入成绩' },
                                    { type: 'number', min: 0, max: 710, message: '成绩必须在0-710之间' }
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder="请输入考试成绩"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={submitting}
                        >
                            提交报名（系统自动初审）
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ padding: 16, background: '#fffbe6', borderRadius: 4, border: '1px solid #ffe58f' }}>
                    <h4 style={{ marginBottom: 8, color: '#faad14' }}>AI审核说明</h4>
                    <p style={{ margin: 0, color: '#666', fontSize: 14 }}>
                        系统会自动对提交的报名进行初审：
                        人社/校内/专业证书分数≥60分自动建议通过；英语四级≥425分自动建议通过，否则标记为待人工审核。
                    </p>
                </div>
            </Card>

            <Card
                title={`我的报名记录（${history.length}）`}
                extra={<Button type="link" onClick={fetchHistory} loading={historyLoading}>刷新</Button>}
            >
                <Spin spinning={historyLoading} tip="加载中...">
                    {history.length === 0 ? (
                        <Empty description="暂无报名记录" />
                    ) : (
                        <Table
                            dataSource={history}
                            columns={columns}
                            rowKey={(r) => r.id}
                            pagination={history.length > 10 ? { pageSize: 10 } : false}
                            size="middle"
                        />
                    )}
                </Spin>
            </Card>
        </div>
    );
};

export default StudentApply;
