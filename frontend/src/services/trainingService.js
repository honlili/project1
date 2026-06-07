/**
 * 培训资料 API
 */
import api from './api';

// 获取培训资料列表
export const getTrainingMaterials = (params) => {
    return api.get('/api/training', { params });
};

// 获取已发布的培训资料
export const getPublishedMaterials = () => {
    return api.get('/api/training/published');
};

// 获取单个培训资料
export const getTrainingById = (id) => {
    return api.get(`/api/training/${id}`);
};

// 创建培训资料
export const createTraining = (data) => {
    return api.post('/api/training', data);
};

// 更新培训资料
export const updateTraining = (id, data) => {
    return api.put(`/api/training/${id}`, data);
};

// 删除培训资料
export const deleteTraining = (id) => {
    return api.delete(`/api/training/${id}`);
};

// 上传附件
export const uploadTrainingFile = (formData) => {
    return api.post('/api/training/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
