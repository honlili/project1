/**
 * 仪表板 API
 */
import api from './api';

// 获取仪表板统计数据
export const getDashboardStats = () => {
    return api.get('/api/dashboard/stats');
};
