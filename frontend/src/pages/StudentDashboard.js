/**
 * 学生端个人中心页面
 */
import { Card, Row, Col, Statistic, Avatar } from 'antd';
import { UserOutlined, TrophyOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';

const StudentDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // 模拟数据
    const stats = {
        totalCertificates: 2,
        pendingApplications: 1,
        completedCourses: 3,
    };
    
    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">个人中心</h2>
            </div>
            
            {/* 用户信息卡片 */}
            <Card className="user-info-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Avatar size={80} icon={<UserOutlined />} />
                    <div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{user.name || '学生'}</h3>
                        <p style={{ margin: '4px 0', color: '#666' }}>学号：{user.username || '-'}</p>
                        <p style={{ margin: '4px 0', color: '#666' }}>学院：{user.college || '-'}</p>
                        <p style={{ margin: '4px 0', color: '#666' }}>班级：{user.class_name || '-'}</p>
                    </div>
                </div>
            </Card>
            
            {/* 统计卡片 */}
            <Row gutter={16}>
                <Col span={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="已获证书"
                            value={stats.totalCertificates}
                            prefix={<TrophyOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="待审核报名"
                            value={stats.pendingApplications}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="已修课程"
                            value={stats.completedCourses}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="stat-card">
                        <Statistic
                            title="证书通过率"
                            value={66.7}
                            suffix="%"
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>
            
            {/* 最近动态 */}
            <Card title="最近动态" style={{ marginTop: '24px' }}>
                <div style={{ paddingLeft: '16px' }}>
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>【报名成功】软件设计师（中级）考试</span>
                        <span style={{ color: '#999', fontSize: '12px' }}>2024-01-15</span>
                    </div>
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>【审核通过】全国计算机等级考试二级</span>
                        <span style={{ color: '#999', fontSize: '12px' }}>2024-01-10</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>【证书获取】全国计算机等级考试二级证书</span>
                        <span style={{ color: '#999', fontSize: '12px' }}>2024-01-05</span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default StudentDashboard;
