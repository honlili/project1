/**
 * 认证相关 API
 */
import api from './api';

// 模拟用户数据
const mockUsers = [
    {
        id: 1,
        username: 'admin',
        password: 'admin123',
        name: '管理员',
        role: 'admin'
    }
];

// 登录 - 支持模拟登录和真实登录
export const login = async (data) => {
    try {
        // 先尝试真实后端登录
        const response = await api.post('/auth/login', data);
        return response;
    } catch (error) {
        // 如果后端不可用，使用模拟登录
        console.log('后端服务不可用，使用模拟登录');
        
        const user = mockUsers.find(
            u => u.username === data.username && u.password === data.password
        );
        
        if (user) {
            return {
                success: true,
                message: '登录成功',
                data: {
                    token: 'mock-token-' + Date.now(),
                    user: {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        role: user.role
                    }
                }
            };
        } else {
            return {
                success: false,
                message: '用户名或密码错误'
            };
        }
    }
};

// 获取当前用户信息
export const getCurrentUser = () => {
    return api.get('/api/auth/me');
};

// 修改密码
export const changePassword = (data) => {
    return api.put('/api/auth/password', data);
};
