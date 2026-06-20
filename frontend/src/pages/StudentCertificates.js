/**
 * 学生端我的证书页面
 */
import { Table, Tag, Card } from 'antd';

const StudentCertificates = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // 模拟数据
    const certificates = [
        {
            id: 1,
            name: '全国计算机等级考试二级',
            type: '专业',
            issuer: '教育部考试中心',
            issue_date: '2024-01-05',
            status: '已获得',
            score: 85
        },
        {
            id: 2,
            name: '软件设计师（中级）',
            type: '人社',
            issuer: '人力资源和社会保障部',
            issue_date: '-',
            status: '审核中',
            score: 72
        },
        {
            id: 3,
            name: 'Python编程基础',
            type: '校内',
            issuer: '智能产业学院',
            issue_date: '2023-12-20',
            status: '已获得',
            score: 90
        }
    ];
    
    const columns = [
        { title: '证书名称', dataIndex: 'name', key: 'name' },
        { 
            title: '类型', 
            dataIndex: 'type', 
            key: 'type',
            render: (type) => {
                const color = {
                    '人社': 'blue',
                    '专业': 'green',
                    '校内': 'orange'
                }[type] || 'default';
                return <Tag color={color}>{type}</Tag>;
            }
        },
        { title: '发证机构', dataIndex: 'issuer', key: 'issuer' },
        { title: '发证日期', dataIndex: 'issue_date', key: 'issue_date' },
        { title: '成绩', dataIndex: 'score', key: 'score' },
        { 
            title: '状态', 
            dataIndex: 'status', 
            key: 'status',
            render: (status) => {
                const color = {
                    '已获得': 'green',
                    '审核中': 'yellow',
                    '未通过': 'red'
                }[status] || 'default';
                return <Tag color={color}>{status}</Tag>;
            }
        }
    ];
    
    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">我的证书</h2>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    学生：{user.name} ({user.username})
                </p>
            </div>
            
            <Card>
                <Table
                    dataSource={certificates}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default StudentCertificates;
