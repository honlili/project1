/**
 * 报名审核页面
 */
import React, { useState, useEffect } from 'react';
import {
    Table, Button, Modal, Form, Input, InputNumber, Select, Space,
    message, Tag, Card, Descriptions, Divider, Alert
} from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import {
    getPendingRegistrations, getRegistrationById,
    approveRegistration, rejectRegistration
} from '../services/registrationService';

const { TextArea } = Input;

const mockRegistrations = [
    { id: 1, student_id: 1, student_no: '2023001001', student_name: '张三', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', status: '已通过', score: 85, ai_review_result: 'pass', ai_review_reason: '成绩85分，大于等于60分，符合自动通过条件', apply_date: '2024-01-15 10:30:00' },
    { id: 2, student_id: 2, student_no: '2023001002', student_name: '李四', college: '智能产业学院', class_name: '2024人工智能1班', certificate_id: 2, certificate_name: '软件设计师（中级）', certificate_type: '人社', status: '待审核', score: 72, ai_review_result: 'pass', ai_review_reason: '成绩72分，大于等于60分，建议通过', apply_date: '2024-01-16 14:20:00' },
    { id: 3, student_id: 3, student_no: '2023001003', student_name: '王五', college: '大数据产业学院', class_name: '2024计算机1班', certificate_id: 1, certificate_name: '全国计算机等级考试二级', certificate_type: '人社', status: '待审核', score: 55, ai_review_result: 'pending', ai_review_reason: '成绩55分，低于60分，需人工审核确认', apply_date: '2024-01-17 09:15:00' }
];

const RegistrationAudit = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(() => mockRegistrations.filter(r => r.status === '待审核'));
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockRegistrations.filter(r => r.status === '待审核').length });
    const [detailVisible, setDetailVisible] = useState(false);
    const [rejectVisible, setRejectVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [rejectForm] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, [pagination.current, pagination.pageSize]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getPendingRegistrations({
                page: pagination.current,
                pageSize: pagination.pageSize
            });
            if (res && res.success && res.data && res.data.length > 0) {
                setData(res.data);
                setPagination(prev => ({ ...prev, total: res.pagination?.total || res.data.length }));
            } else {
                throw new Error('No data from API');
            }
        } catch (error) {
            console.log('使用模拟数据:', error.message);
            const pending = mockRegistrations.filter(r => r.status === '待审核');
            setData(pending);
            setPagination(prev => ({ ...prev, total: pending.length }));
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (record) => {
        setCurrentRecord(record);
        setDetailVisible(true);
    };

    const handleApprove = async (id) => {
        try {
            const res = await approveRegistration(id);
            if (res.success) {
                message.success('审核通过');
                fetchData();
            } else {
                message.error(res.message || '操作失败');
            }
        } catch (error) {
            message.error('操作失败');
        }
    };

    const handleReject = (record) => {
        setCurrentRecord(record);
        rejectForm.resetFields();
        setRejectVisible(true);
    };

    const submitReject = async () => {
        try {
            const values = await rejectForm.validateFields();
            const res = await rejectRegistration(currentRecord.id, values);
            if (res.success) {
                message.success('已驳回');
                setRejectVisible(false);
                fetchData();
            } else {
                message.error(res.message || '操作失败');
            }
        } catch (error) {
            message.error('操作失败');
        }
    };

    const getAiReviewStyle = (result) => {
        const styleMap = {
            'pass': { background: '#f6ffed', borderColor: '#b7eb8f', color: '#52c41a' },
            'pending': { background: '#fffbe6', borderColor: '#ffe58f', color: '#faad14' },
            'manual': { background: '#fff1f0', borderColor: '#ffa39e', color: '#ff4d4f' }
        };
        return styleMap[result] || {};
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: '学号', dataIndex: 'student_no', key: 'student_no' },
        { title: '姓名', dataIndex: 'student_name', key: 'student_name' },
        { title: '班级', dataIndex: 'class_name', key: 'class_name' },
        { title: '证书', dataIndex: 'certificate_name', key: 'certificate_name' },
        {
            title: '类型',
            dataIndex: 'certificate_type',
            key: 'certificate_type',
            render: (type) => {
                const colorMap = { '人社': 'blue', '专业': 'green', '校内': 'purple' };
                return <Tag color={colorMap[type]}>{type}</Tag>;
            }
        },
        {
            title: '成绩',
            dataIndex: 'score',
            key: 'score',
            render: (score) => score || '-'
        },
        {
            title: 'AI预审',
            dataIndex: 'ai_review_result',
            key: 'ai_review_result',
            render: (result, record) => {
                if (!result) return '-';
                const style = getAiReviewStyle(result);
                const textMap = { 'pass': '建议通过', 'pending': '待人工审核', 'manual': '需人工审核' };
                return (
                    <Tag style={{ ...style, border: `1px solid ${style.borderColor}` }}>
                        {textMap[result]}
                    </Tag>
                );
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        详情
                    </Button>
                    <Button
                        type="link"
                        icon={<CheckOutlined />}
                        style={{ color: '#52c41a' }}
                        onClick={() => handleApprove(record.id)}
                    >
                        通过
                    </Button>
                    <Button
                        type="link"
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => handleReject(record)}
                    >
                        驳回
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">报名审核</h1>
            </div>

            <Card>
                <Alert
                    message="AI审核说明"
                    description="系统会自动对提交的报名进行初审：成绩≥60分自动建议通过，否则标记为待人工审核。请结合AI预审结果进行最终审核。"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条待审核`,
                        onChange: (page, pageSize) => {
                            setPagination(prev => ({ ...prev, current: page, pageSize }));
                        }
                    }}
                />
            </Card>

            {/* 详情弹窗 */}
            <Modal
                title="报名详情"
                open={detailVisible}
                onCancel={() => setDetailVisible(false)}
                footer={null}
                width={700}
            >
                {currentRecord && (
                    <>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="学号">{currentRecord.student_no}</Descriptions.Item>
                            <Descriptions.Item label="姓名">{currentRecord.student_name}</Descriptions.Item>
                            <Descriptions.Item label="班级">{currentRecord.class_name}</Descriptions.Item>
                            <Descriptions.Item label="证书">{currentRecord.certificate_name}</Descriptions.Item>
                            <Descriptions.Item label="证书类型">{currentRecord.certificate_type}</Descriptions.Item>
                            <Descriptions.Item label="成绩">{currentRecord.score || '-'}</Descriptions.Item>
                            <Descriptions.Item label="状态">
                                <Tag color="orange">{currentRecord.status}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="申请时间">
                                {currentRecord.apply_date ? new Date(currentRecord.apply_date).toLocaleString() : '-'}
                            </Descriptions.Item>
                        </Descriptions>

                        {currentRecord.ai_review_result && (
                            <>
                                <Divider>AI审核结果</Divider>
                                <Alert
                                    message={currentRecord.ai_review_result === 'pass' ? '建议通过' : '需人工审核'}
                                    description={currentRecord.ai_review_reason}
                                    type={currentRecord.ai_review_result === 'pass' ? 'success' : 'warning'}
                                    showIcon
                                />
                            </>
                        )}

                        <Divider>操作</Divider>
                        <Space>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => {
                                    handleApprove(currentRecord.id);
                                    setDetailVisible(false);
                                }}
                            >
                                审核通过
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => {
                                    setDetailVisible(false);
                                    handleReject(currentRecord);
                                }}
                            >
                                驳回
                            </Button>
                        </Space>
                    </>
                )}
            </Modal>

            {/* 驳回弹窗 */}
            <Modal
                title="驳回原因"
                open={rejectVisible}
                onOk={submitReject}
                onCancel={() => setRejectVisible(false)}
            >
                <Form form={rejectForm} layout="vertical">
                    <Form.Item
                        name="reject_reason"
                        label="驳回原因"
                        rules={[{ required: true, message: '请输入驳回原因' }]}
                    >
                        <TextArea rows={4} placeholder="请输入驳回原因" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RegistrationAudit;
