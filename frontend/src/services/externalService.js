/**
 * 外部接口 API
 */
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_KEY = process.env.REACT_APP_API_KEY || '123456';

// 获取学生所有已获得的证书
export const getStudentCertificates = (studentId) => {
    return axios.get(`${API_URL}/api/external/student-certificates`, {
        params: { student_id: studentId },
        headers: {
            'x-api-key': API_KEY
        }
    }).then(res => res.data);
};
