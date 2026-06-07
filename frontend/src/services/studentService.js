/**
 * 学生管理 API
 */
import api from './api';

// 获取学生列表
export const getStudents = (params) => {
    return api.get('/api/students', { params });
};

// 获取学生统计
export const getStudentStats = () => {
    return api.get('/api/students/stats');
};

// 获取单个学生
export const getStudentById = (id) => {
    return api.get(`/api/students/${id}`);
};

// 创建学生
export const createStudent = (data) => {
    return api.post('/api/students', data);
};

// 更新学生
export const updateStudent = (id, data) => {
    return api.put(`/api/students/${id}`, data);
};

// 删除学生
export const deleteStudent = (id) => {
    return api.delete(`/api/students/${id}`);
};

// 批量导入学生
export const importStudents = (formData) => {
    return api.post('/api/students/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 下载导入模板
export const downloadStudentTemplate = () => {
    window.open(`${process.env.REACT_APP_API_URL}/api/students/template`, '_blank');
};
