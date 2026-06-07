/**
 * 主布局组件
 */
import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, message } from 'antd';
import {
    DashboardOutlined,
    FileTextOutlined,
    UserOutlined,
    AuditOutlined,
    FolderOutlined,
    BookOutlined,
    ApiOutlined,
    LogoutOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // 获取当前用户
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // 菜单项
    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: '仪表板'
        },
        {
            key: '/certificates',
            icon: <FileTextOutlined />,
            label: '证书管理'
        },
        {
            key: '/students',
            icon: <UserOutlined />,
            label: '学生管理'
        },
        {
            key: '/audit',
            icon: <AuditOutlined />,
            label: '报名审核'
        },
        {
            key: '/archives',
            icon: <FolderOutlined />,
            label: '成绩归档'
        },
        {
            key: '/training',
            icon: <BookOutlined />,
            label: '培训辅导'
        },
        {
            key: '/external',
            icon: <ApiOutlined />,
            label: '接口测试'
        }
    ];

    // 用户下拉菜单
    const userMenuItems = [
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置'
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: '退出登录',
            danger: true
        }
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    const handleUserMenuClick = ({ key }) => {
        if (key === 'logout') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            message.success('已退出登录');
            navigate('/login');
        } else if (key === 'settings') {
            navigate('/settings');
        }
    };

    return (
        <Layout className="site-layout">
            {/* 侧边栏 */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                theme="light"
                style={{
                    boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: collapsed ? 16 : 18,
                        fontWeight: 600,
                        color: '#1890ff',
                        whiteSpace: 'nowrap'
                    }}>
                        {collapsed ? '双证' : '双证管理系统'}
                    </h1>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{ borderRight: 0 }}
                />
            </Sider>

            {/* 右侧内容区 */}
            <Layout>
                {/* 头部 */}
                <Header className="site-layout-header">
                    <div />
                    <Dropdown
                        menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                        placement="bottomRight"
                    >
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Avatar
                                style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                                icon={<UserOutlined />}
                            />
                            <span>{user.name || user.username || '用户'}</span>
                        </div>
                    </Dropdown>
                </Header>

                {/* 内容区 */}
                <Content className="site-layout-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
