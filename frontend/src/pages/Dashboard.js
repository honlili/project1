/**
 * 仪表板页面
 */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Spin, Tag } from 'antd';
import {
    UserOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { getDashboardStats } from '../services/dashboardService';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await getDashboardStats();
            if (res.success) {
                setStats(res.data);
            }
        } catch (error) {
            console.error('获取统计数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
                <Spin size="large" />
            </div>
        );
    }

    // 最近报名表格列
    const recentColumns = [
        { title: '学号', dataIndex: 'student_no', key: 'student_no' },
        { title: '姓名', dataIndex: 'student_name', key: 'student_name' },
        { title: '证书', dataIndex: 'certificate_name', key: 'certificate_name' },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colorMap = {
                    '待审核': 'orange',
                    '已通过': 'green',
                    '已驳回': 'red'
                };
                return <Tag color={colorMap[status]}>{status}</Tag>;
            }
        },
        {
            title: '申请时间',
            dataIndex: 'apply_date',
            key: 'apply_date',
            render: (date) => date ? new Date(date).toLocaleString() : '-'
        }
    ];

    // 证书报名统计表格列
    const certStatColumns = [
        { title: '证书名称', dataIndex: 'certificate_name', key: 'certificate_name' },
        {
            title: '类型',
            dataIndex: 'certificate_type',
            key: 'certificate_type',
            render: (type) => {
                const colorMap = { '人社': 'blue', '专业': 'green', '校内': 'purple' };
                return <Tag color={colorMap[type]}>{type}</Tag>;
            }
        },
        { title: '报名人数', dataIndex: 'total_registrations', key: 'total_registrations' },
        { title: '通过人数', dataIndex: 'passed_count', key: 'passed_count' }
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">仪表板</h1>
            </div>

            {/* 统计卡片 */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="学生总数"
                            value={stats?.students?.total || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="证书总数"
                            value={stats?.certificates?.total || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="待审核"
                            value={stats?.registrations?.pending || 0}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="已通过"
                            value={stats?.registrations?.approved || 0}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 通过率 */}
            <Card style={{ marginTop: 16 }}>
                <h3 style={{ marginBottom: 16 }}>审核通过率</h3>
                <Progress
                    percent={stats?.registrations?.passRate || 0}
                    status={stats?.registrations?.passRate >= 60 ? 'success' : 'normal'}
                    strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068'
                    }}
                />
            </Card>

            {/* 最近报名和证书统计 */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col xs={24} lg={12}>
                    <Card title="最近报名记录">
                        <Table
                            columns={recentColumns}
                            dataSource={stats?.recentRegistrations || []}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="证书报名统计">
                        <Table
                            columns={certStatColumns}
                            dataSource={stats?.certificateRegistrationStats || []}
                            rowKey="certificate_name"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
