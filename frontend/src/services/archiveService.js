/**
 * 成绩归档 API
 */
import api from './api';

// 获取班级列表
export const getClasses = () => {
    return api.get('/api/archives/classes');
};

// 按班级获取成绩归档
export const getArchivesByClass = (classId) => {
    return api.get('/api/archives/by-class', { params: { class_id: classId } });
};

// 创建/更新考试信息
export const createExamInfo = (data) => {
    return api.post('/api/archives/exam-info', data);
};

// 上传附件
export const uploadAttachment = (formData) => {
    return api.post('/api/archives/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
