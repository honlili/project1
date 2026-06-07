/**
 * 认证相关 API
 */
import api from './api';

// 登录
export const login = (data) => {
    return api.post('/auth/login', data);
};

// 获取当前用户信息
export const getCurrentUser = () => {
    return api.get('/api/auth/me');
};

// 修改密码
export const changePassword = (data) => {
    return api.put('/api/auth/password', data);
};
