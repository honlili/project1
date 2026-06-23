/**
 * 学生端布局组件 - 现代化设计
 */
import { Layout, Menu, Button, Tooltip } from 'antd';
import {
    HomeOutlined,
    FileTextOutlined,
    BookOutlined,
    FileAddOutlined,
    LogoutOutlined,
    UserOutlined,
    SettingOutlined,
    RobotOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { message } from 'antd';

const { Header, Content, Sider } = Layout;

const StudentLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const initial = (user.name || '学')[0];
    
    const menuItems = [
        { key: '/student', icon: <HomeOutlined />, label: '个人中心' },
        { key: '/student/certificates', icon: <FileTextOutlined />, label: '我的证书' },
        { key: '/student/apply', icon: <FileAddOutlined />, label: '报名考试' },
        { key: '/student/training', icon: <BookOutlined />, label: '培训资料' },
        { key: '/student/ai-chat', icon: <RobotOutlined />, label: 'AI智能问答' },
        { key: '/student/settings', icon: <SettingOutlined />, label: '个人设置' }
    ];
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        message.success('退出成功');
        navigate('/login');
    };
    
    return (
        <Layout className="student-layout">
            <Header className="student-header">
                <div className="logo-area">
                    <span className="logo-icon">🎓</span>
                    <span>双证管理系统</span>
                </div>
                <div className="user-area">
                    <div className="user-avatar">{initial}</div>
                    <span>{user.name || '学生'}</span>
                    <Tooltip title="退出登录">
                        <Button 
                            className="logout-btn"
                            size="small"
                            onClick={handleLogout}
                            icon={<LogoutOutlined />}
                        >
                            退出
                        </Button>
                    </Tooltip>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="student-sider" theme="dark">
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        onClick={({ key }) => navigate(key)}
                    />
                </Sider>
                <Layout className="student-content">
                    <Content className="student-content-inner">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default StudentLayout;
