/**
 * 证书管理 API
 */
import api from './api';

// 获取证书列表
export const getCertificates = (params) => {
    return api.get('/api/certificates', { params });
};

// 获取启用的证书
export const getActiveCertificates = () => {
    return api.get('/api/certificates/active');
};

// 获取证书统计
export const getCertificateStats = () => {
    return api.get('/api/certificates/stats');
};

// 获取单个证书
export const getCertificateById = (id) => {
    return api.get(`/api/certificates/${id}`);
};

// 创建证书
export const createCertificate = (data) => {
    return api.post('/api/certificates', data);
};

// 更新证书
export const updateCertificate = (id, data) => {
    return api.put(`/api/certificates/${id}`, data);
};

// 删除证书
export const deleteCertificate = (id) => {
    return api.delete(`/api/certificates/${id}`);
};
