import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Descriptions, List, Tag, Spin, Empty } from 'antd';
import { UserOutlined, TrophyOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getStudentDashboard } from '../services/authService';

const getStatIcon = (key) => {
    switch (key) {
        case 'total': return <FileTextOutlined />;
        case 'passed': return <TrophyOutlined />;
        case 'pending': return <ClockCircleOutlined />;
        default: return <CheckCircleOutlined />;
    }
};

const getStatColor = (key) => {
    switch (key) {
        case 'total': return '#1890ff';
        case 'passed': return '#52c41a';
        case 'pending': return '#faad14';
        default: return '#722ed1';
    }
};

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

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getStudentDashboard();
            if (res && res.success) {
                setData(res.data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const student = data?.student || {};
    const stats = data?.stats || { total_registrations: 0, passed_count: 0, pending_count: 0, rejected_count: 0, pass_rate: 0 };
    const recent = data?.recent || [];

    const statCards = [
        { key: 'total', title: '报名总数', icon: getStatIcon('total'), color: getStatColor('total'), path: '/student/apply' },
        { key: 'passed', title: '已通过', icon: getStatIcon('passed'), color: getStatColor('passed'), path: '/student/certificates' },
        { key: 'pending', title: '待审核', icon: getStatIcon('pending'), color: getStatColor('pending'), path: '/student/apply' },
        { key: 'rate', title: '通过率', icon: getStatIcon('rate'), color: getStatColor('rate'), path: '/student/certificates', suffix: '%' }
    ];

    const getStatValue = (key) => {
        switch (key) {
            case 'total': return stats.total_registrations;
            case 'passed': return stats.passed_count;
            case 'pending': return stats.pending_count;
            case 'rate': return stats.pass_rate;
            default: return 0;
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <Spin spinning={loading} tip="加载中...">
                <div className="page-header" style={{ marginBottom: 16 }}>
                    <h2 className="page-title" style={{ margin: 0 }}>个人中心</h2>
                </div>

                <Card
                    className="user-info-card"
                    style={{ marginBottom: 16 }}
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <UserOutlined style={{ fontSize: 22, color: '#1890ff' }} />
                            <span>个人信息</span>
                        </div>
                    }
                >
                    {loading && !data ? (
                        <Empty description="加载中" />
                    ) : (
                        <Descriptions column={3} bordered size="small">
                            <Descriptions.Item label="姓名">{student.name || '-'}</Descriptions.Item>
                            <Descriptions.Item label="学号">{student.student_no || '-'}</Descriptions.Item>
                            <Descriptions.Item label="性别">{student.gender || '-'}</Descriptions.Item>
                            <Descriptions.Item label="学院">{student.college || '-'}</Descriptions.Item>
                            <Descriptions.Item label="班级">{student.class_name || '-'}</Descriptions.Item>
                            <Descriptions.Item label="联系电话">{student.phone || '-'}</Descriptions.Item>
                        </Descriptions>
                    )}
                </Card>

                <Row gutter={[16, 16]} style={{ marginBottom: 8 }}>
                    {statCards.map((card) => (
                        <Col xs={12} sm={12} md={6} key={card.key}>
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
                                    suffix={card.suffix}
                                    valueStyle={{ color: card.color }}
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Card
                    title={
                        <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/student/apply')}
                        >
                            最近动态 <ArrowRightOutlined style={{ fontSize: 12, opacity: 0.5 }} />
                        </span>
                    }
                    style={{ marginTop: 16 }}
                >
                    {recent.length === 0 ? (
                        <Empty description="暂无报名记录" />
                    ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={recent}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={
                                            <span>
                                                <Tag color={typeColor(item.certificate_type)}>{item.certificate_type}</Tag>
                                                {item.certificate_name}
                                            </span>
                                        }
                                        description={
                                            <span>
                                                成绩：<b>{item.score}</b>　审核：
                                                <Tag color={statusColor(item.status)} style={{ marginLeft: 4 }}>{item.status}</Tag>
                                                {item.ai_review_reason && (
                                                    <span style={{ marginLeft: 8, color: '#666' }}>
                                                        AI初审：{item.ai_review_reason}
                                                    </span>
                                                )}
                                            </span>
                                        }
                                    />
                                    <span style={{ color: '#999', fontSize: 12 }}>{item.apply_date}</span>
                                </List.Item>
                            )}
                        />
                    )}
                </Card>
            </Spin>
        </div>
    );
};

export default StudentDashboard;
