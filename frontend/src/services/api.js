import axios from 'axios';

const API_BASE = 'http://localhost:5000';
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// 请求拦截器：自动添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('响应错误:', error.response || error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // 返回错误信息，让调用者可以处理
    return Promise.reject(error.response?.data || { message: '请求失败' });
  }
);

export default api;