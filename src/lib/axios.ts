import axios from 'axios';

// Next.js rewrites를 사용하므로 상대 경로 사용
const API_BASE_URL = '';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 요청 로그
    console.log('API Request:', {
      method: config.method,
      url: config.url,
      params: config.params,
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    // 응답 로그
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    
    return response;
  },
  (error) => {
    // 에러 로그
    console.error('Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    // 500 에러인 경우 상세 정보 출력
    if (error.response?.status === 500) {
      console.error('Server Error Details:', error.response?.data);
    }
    
    // 401 에러 처리 (인증 실패)
    if (error.response?.status === 401) {
      // 토큰 제거 및 로그인 페이지로 리다이렉트
      localStorage.removeItem('auth_token');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;