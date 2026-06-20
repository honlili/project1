/**
 * 学生端培训资料页面
 */
import { Card, List, Tag, Button } from 'antd';
import { BookOutlined, FileTextOutlined, VideoCameraOutlined, DownloadOutlined } from '@ant-design/icons';

const StudentTraining = () => {
    // 模拟培训资料数据
    const materials = [
        {
            id: 1,
            title: 'Python编程入门教程',
            type: '视频',
            category: '编程基础',
            description: '从零开始学习Python编程，适合零基础学员',
            views: 1256,
            upload_time: '2024-01-10'
        },
        {
            id: 2,
            title: '全国计算机等级考试二级备考指南',
            type: '文档',
            category: '考试辅导',
            description: '详细的考试大纲解读和备考建议',
            views: 892,
            upload_time: '2024-01-08'
        },
        {
            id: 3,
            title: '软件设计师考试真题解析',
            type: '文档',
            category: '考试辅导',
            description: '历年真题详解，帮助考生熟悉考试形式',
            views: 654,
            upload_time: '2024-01-05'
        },
        {
            id: 4,
            title: '数据库基础教程',
            type: '视频',
            category: '编程基础',
            description: 'SQL语言入门到精通，掌握数据库操作',
            views: 987,
            upload_time: '2024-01-03'
        },
        {
            id: 5,
            title: 'Web前端开发实战',
            type: '视频',
            category: '编程基础',
            description: 'HTML、CSS、JavaScript实战项目教学',
            views: 1123,
            upload_time: '2023-12-28'
        },
        {
            id: 6,
            title: '证书考试常见问题解答',
            type: '文档',
            category: '考试辅导',
            description: '考生常见问题汇总及解答',
            views: 445,
            upload_time: '2023-12-25'
        }
    ];
    
    const getTypeIcon = (type) => {
        if (type === '视频') return <VideoCameraOutlined />;
        if (type === '文档') return <FileTextOutlined />;
        return <BookOutlined />;
    };
    
    const getTypeColor = (type) => {
        if (type === '视频') return 'purple';
        if (type === '文档') return 'blue';
        return 'default';
    };
    
    const getCategoryColor = (category) => {
        if (category === '编程基础') return 'green';
        if (category === '考试辅导') return 'orange';
        return 'default';
    };
    
    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">培训资料</h2>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    提供各类证书考试培训资料和学习资源
                </p>
            </div>
            
            <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={materials}
                renderItem={(item) => (
                    <List.Item key={item.id}>
                        <Card 
                            hoverable
                            style={{ height: '100%' }}
                            actions={[
                                <Button type="link" icon={<DownloadOutlined />}>下载</Button>
                            ]}
                        >
                            <div style={{ marginBottom: '12px' }}>
                                <Tag color={getTypeColor(item.type)} style={{ marginRight: '8px' }}>
                                    {getTypeIcon(item.type)} {item.type}
                                </Tag>
                                <Tag color={getCategoryColor(item.category)}>
                                    {item.category}
                                </Tag>
                            </div>
                            <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>{item.title}</h3>
                            <p style={{ marginBottom: '12px', color: '#666', fontSize: '14px' }}>
                                {item.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#999', fontSize: '12px' }}>
                                <span>浏览量：{item.views}</span>
                                <span>{item.upload_time}</span>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default StudentTraining;
