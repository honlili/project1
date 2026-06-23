/**
 * 仪表板页面
 */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Spin, Tag } from 'antd';
import {
    UserOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../services/dashboardService';

const mockStats = {
    students: { total: 12 },
    certificates: { total: 12 },
    registrations: { pending: 7, approved: 17, rejected: 6, passRate: 56.7 },
    recentRegistrations: [
        { id: 30, student_no: '2023001003', student_name: '王五', certificate_name: '大学英语四级（CET-4）', status: '已驳回', apply_date: '2024/5/5 16:30:00' },
        { id: 27, student_no: '2023001011', student_name: '黄三', certificate_name: '信息安全管理师', status: '待审核', apply_date: '2024/5/30 11:00:00' },
        { id: 18, student_no: '2023001007', student_name: '吴九', certificate_name: '大学英语四级（CET-4）', status: '已驳回', apply_date: '2024/5/28 14:00:00' },
        { id: 15, student_no: '2023001006', student_name: '周八', certificate_name: '人工智能训练师', status: '待审核', apply_date: '2024/5/25 08:40:00' },
        { id: 10, student_no: '2023001004', student_name: '赵六', certificate_name: '计算机程序设计员（高级）', status: '已通过', apply_date: '2024/5/8 14:30:00' }
    ],
    certificateRegistrationStats: [
        { certificate_name: '全国计算机等级考试二级', certificate_type: '人社', total_registrations: 5, passed_count: 4 },
        { certificate_name: '软件设计师（中级）', certificate_type: '人社', total_registrations: 2, passed_count: 1 },
        { certificate_name: '普通话水平测试二级甲等', certificate_type: '校内', total_registrations: 3, passed_count: 3 },
        { certificate_name: '大学英语四级（CET-4）', certificate_type: '专业', total_registrations: 5, passed_count: 2 },
        { certificate_name: '大学英语六级（CET-6）', certificate_type: '专业', total_registrations: 2, passed_count: 0 },
        { certificate_name: '网络工程师（中级）', certificate_type: '人社', total_registrations: 2, passed_count: 2 },
        { certificate_name: '数据库系统工程师（中级）', certificate_type: '人社', total_registrations: 3, passed_count: 2 },
        { certificate_name: '计算机程序设计员（高级）', certificate_type: '人社', total_registrations: 2, passed_count: 1 },
        { certificate_name: '人工智能训练师', certificate_type: '人社', total_registrations: 1, passed_count: 0 },
        { certificate_name: '信息安全管理师', certificate_type: '人社', total_registrations: 2, passed_count: 0 },
        { certificate_name: '校内英语应用能力A级', certificate_type: '校内', total_registrations: 1, passed_count: 1 },
        { certificate_name: '校内创新创业实践证书', certificate_type: '校内', total_registrations: 2, passed_count: 2 }
    ]
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(mockStats);

    const statCards = [
        { key: 'students', title: '学生总数', icon: <UserOutlined />, color: '#1890ff', path: '/students' },
        { key: 'certificates', title: '证书总数', icon: <FileTextOutlined />, color: '#52c41a', path: '/certificates' },
        { key: 'pending', title: '待审核', icon: <ClockCircleOutlined />, color: '#faad14', path: '/audit' },
        { key: 'approved', title: '已通过', icon: <CheckCircleOutlined />, color: '#52c41a', path: '/audit' }
    ];

    const getStatValue = (key) => {
        switch (key) {
            case 'students': return stats?.students?.total || 0;
            case 'certificates': return stats?.certificates?.total || 0;
            case 'pending': return stats?.registrations?.pending || 0;
            case 'approved': return stats?.registrations?.approved || 0;
            default: return 0;
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getDashboardStats();
                if (res && res.success && res.data) {
                    setStats(res.data);
                }
            } catch (e) {
                console.log('仪表盘API不可用，使用模拟数据');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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

            {/* 统计卡片 - 点击跳转 */}
            <Row gutter={[16, 16]}>
                {statCards.map((card) => (
                    <Col xs={24} sm={12} lg={6} key={card.key}>
                        <Card
                            className="stat-card"
                            hoverable
                            onClick={() => navigate(card.path)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Statistic
                                title={
                                    <span>
                                        {card.title}
                                        <ArrowRightOutlined style={{ marginLeft: 6, fontSize: 12, opacity: 0.5 }} />
                                    </span>
                                }
                                value={getStatValue(card.key)}
                                prefix={card.icon}
                                valueStyle={{ color: card.color }}
                            />
                        </Card>
                    </Col>
                ))}
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
                    <Card
                        title={
                            <span
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate('/audit')}
                            >
                                最近报名记录 <ArrowRightOutlined style={{ fontSize: 12, opacity: 0.5 }} />
                            </span>
                        }
                    >
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
