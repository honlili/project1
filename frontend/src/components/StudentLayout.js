/**
 * 学生端布局组件
 */
import { Layout, Menu, Button } from 'antd';
import { 
    HomeOutlined, 
    FileTextOutlined, 
    BookOutlined, 
    FileAddOutlined,
    LogoutOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';

const { Header, Content, Sider } = Layout;

const StudentLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const menuItems = [
        { key: '/student', icon: <HomeOutlined />, label: '个人中心' },
        { key: '/student/certificates', icon: <FileTextOutlined />, label: '我的证书' },
        { key: '/student/apply', icon: <FileAddOutlined />, label: '报名考试' },
        { key: '/student/training', icon: <BookOutlined />, label: '培训资料' },
    ];
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        message.success('退出成功');
        navigate('/login');
    };
    
    return (
        <Layout className="site-layout" style={{ minHeight: '100vh' }}>
            <Header className="site-layout-header">
                <div className="logo" style={{ fontSize: '18px', fontWeight: '600', color: '#1890ff' }}>
                    双证管理系统 - 学生端
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="user-info">
                        <UserOutlined style={{ marginRight: '8px' }} />
                        {user.name || '学生'}
                    </span>
                    <Button 
                        type="default" 
                        onClick={handleLogout}
                        icon={<LogoutOutlined />}
                    >
                        退出登录
                    </Button>
                </div>
            </Header>
            <Layout>
                <Sider width={200} theme="light">
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
                        onClick={({ key }) => navigate(key)}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content className="site-layout-content">
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default StudentLayout;
