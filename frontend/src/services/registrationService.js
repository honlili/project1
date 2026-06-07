/**
 * 报名管理 API
 */
import api from './api';

// 获取报名列表
export const getRegistrations = (params) => {
    return api.get('/api/registrations', { params });
};

// 获取待审核列表
export const getPendingRegistrations = (params) => {
    return api.get('/api/registrations/pending', { params });
};

// 获取报名统计
export const getRegistrationStats = () => {
    return api.get('/api/registrations/stats');
};

// 获取单个报名
export const getRegistrationById = (id) => {
    return api.get(`/api/registrations/${id}`);
};

// 创建报名
export const createRegistration = (data) => {
    return api.post('/api/registrations', data);
};

// 审核通过
export const approveRegistration = (id, data) => {
    return api.post(`/api/registrations/${id}/approve`, data);
};

// 审核驳回
export const rejectRegistration = (id, data) => {
    return api.post(`/api/registrations/${id}/reject`, data);
};

// 批量导入报名
export const importRegistrations = (formData) => {
    return api.post('/api/registrations/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 下载导入模板
export const downloadRegistrationTemplate = () => {
    window.open(`${process.env.REACT_APP_API_URL}/api/registrations/template`, '_blank');
};
