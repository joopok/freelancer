import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL, API_TIMEOUT, USE_MOCK_API, USE_API_CACHE, API_CACHE_TIME, AUTH_TOKEN_NAME } from '@/utils/env';

// 타입 정의
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  error?: string;
  message?: string;
}

export interface ApiErrorResponse {
  success: boolean;
  error: string;
  message?: string;
  code?: string | number;
}

// API 설정 타입
interface ApiConfig {
  baseURL: string;
  timeout: number;
  withCredentials: boolean;
  useMock?: boolean;
  useCache?: boolean;
  cacheTime?: number; // 캐시 유효 시간 (밀리초)
  tokenName?: string;
}

// API 설정
const apiConfig: ApiConfig = {
  baseURL: '', // Next.js rewrites를 사용하므로 빈 문자열로 설정
  timeout: API_TIMEOUT,
  withCredentials: true,
  useMock: USE_MOCK_API,
  useCache: USE_API_CACHE,
  cacheTime: API_CACHE_TIME,
  tokenName: AUTH_TOKEN_NAME
};

// 인증이 필요한 API 경로 패턴
export const PROTECTED_API_PATTERNS = [
  '/auth/user',         // 사용자 정보
  '/post/create',       // 게시물 작성
  '/post/update',       // 게시물 수정
  '/post/delete',       // 게시물 삭제
  '/comment/create',    // 댓글 작성
  '/comment/update',    // 댓글 수정
  '/comment/delete',    // 댓글 삭제
  '/like/',             // 좋아요 기능
  '/profile',           // 프로필 관련
  '/settings',          // 설정 관련
];

// 캐시 스토리지
const apiCache: Map<string, {data: any, timestamp: number}> = new Map();
const MAX_CACHE_SIZE = 100; // 최대 캐시 항목 수 제한

// 요청 URL이 캐시 가능한 GET 요청인지 확인
const isCacheable = (config: AxiosRequestConfig): boolean => {
  return apiConfig.useCache === true && config.method?.toLowerCase() === 'get';
};

// 요청 URL에 대한 캐시 키 생성
const getCacheKey = (config: AxiosRequestConfig): string => {
  return `${config.method}_${config.url}_${JSON.stringify(config.params)}`;
};

// 캐시 크기 관리 함수 추가
const manageCacheSize = (): void => {
  if (apiCache.size > MAX_CACHE_SIZE) {
    // 가장 오래된 캐시 항목 찾기
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();
    
    apiCache.forEach((value, key) => {
      if (value.timestamp < oldestTimestamp) {
        oldestTimestamp = value.timestamp;
        oldestKey = key;
      }
    });
    
    // 가장 오래된 항목 제거
    if (oldestKey) {
      apiCache.delete(oldestKey);
    }
  }
};

// 개발 환경에서만 로깅하는 유틸리티 함수
const devLog = (callback: () => void): void => {
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    callback();
  }
};

// API 경로가 보호된 패턴과 일치하는지 확인
export const isProtectedRoute = (url: string): boolean => {
  if (!url) return false;
  return PROTECTED_API_PATTERNS.some(pattern => url.includes(pattern));
};

// HTTP 메서드에 따른 색상 반환
const getMethodColor = (method: string): string => {
  switch (method) {
    case 'GET': return '#2196F3'; // 파란색
    case 'POST': return '#4CAF50'; // 녹색
    case 'PUT': return '#FF9800'; // 주황색
    case 'DELETE': return '#F44336'; // 빨간색
    case 'PATCH': return '#9C27B0'; // 보라색
    default: return '#607D8B'; // 회색
  }
};

// HTTP 상태 코드에 따른 색상 반환
const getStatusColor = (status: number): string => {
  if (status >= 200 && status < 300) return '#4CAF50'; // 2xx: 성공 (녹색)
  if (status >= 300 && status < 400) return '#FF9800'; // 3xx: 리다이렉션 (주황색)
  if (status >= 400 && status < 500) return '#F44336'; // 4xx: 클라이언트 오류 (빨간색)
  if (status >= 500) return '#9C27B0'; // 5xx: 서버 오류 (보라색)
  return '#607D8B'; // 기타 (회색)
};

// api 인스턴스 생성
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiConfig.baseURL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: apiConfig.withCredentials,
    timeout: apiConfig.timeout
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      // 개발 모드에서 요청 로깅
      if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
        const methodColor = getMethodColor(config.method?.toUpperCase() || 'GET');
        console.group(`%c📡 API 요청: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, 
          `color: ${methodColor}; font-weight: bold;`);
        
        // 파라미터가 있을 경우만 로깅
        if (config.params && Object.keys(config.params).length > 0) {
          console.log('%c파라미터:', 'color: #9C27B0; font-weight: bold;', config.params);
        }
        
        // 데이터가 있을 경우 정보 제공 (민감 정보는 보호)
        if (config.data) {
          // 패스워드 필드를 가린 데이터 복사본 생성
          const sanitizedData = { ...config.data };
          if (sanitizedData.password) sanitizedData.password = '********';
          if (sanitizedData.token) sanitizedData.token = '********';
          console.log('%c요청 데이터:', 'color: #FF9800; font-weight: bold;', sanitizedData);
        }
        
        // 헤더 정보 (토큰 마스킹)
        const sanitizedHeaders = { ...config.headers };
        if (sanitizedHeaders.Authorization) {
          sanitizedHeaders.Authorization = 'Bearer ***********';
        }
        console.log('%c헤더:', 'color: #607D8B; font-weight: bold;', sanitizedHeaders);
        
        console.groupEnd();
      }

      // 캐시된 응답이 있는지 확인
      if (isCacheable(config)) {
        const cacheKey = getCacheKey(config);
        const cachedData = apiCache.get(cacheKey);
        
        if (cachedData && (Date.now() - cachedData.timestamp) < apiConfig.cacheTime!) {
          // 캐시가 유효한 경우, 캐시된 데이터를 사용하도록 표시
          config.adapter = (config) => {
            return Promise.resolve({
              data: cachedData.data,
              status: 200,
              statusText: 'OK (cached)',
              headers: {},
              config,
            } as AxiosResponse);
          };
          if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
            console.log('%c🔄 캐시된 데이터 사용:', 'color: #8BC34A; font-weight: bold;', config.url);
          }
        }
      }

      // 인증 토큰 추가 (필요한 경우)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem(apiConfig.tokenName || 'auth_token');
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => {
      if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
        console.error('%c🚫 API 요청 구성 실패:', 'color: #F44336; font-weight: bold;', error);
      }
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response) => {
      // 개발 모드에서 응답 로깅
      devLog(() => {
        const statusColor = getStatusColor(response.status);
        console.group(`%c✅ API 응답: ${response.status} ${response.config.url}`, 
          `color: ${statusColor}; font-weight: bold;`);
        
        console.log('%c응답 데이터:', 'color: #4CAF50; font-weight: bold;', response.data);
        
        // 성능 정보
        const dataSize = JSON.stringify(response.data).length;
        const sizeFormatted = dataSize > 1024 
          ? `${(dataSize / 1024).toFixed(2)} KB` 
          : `${dataSize} bytes`;
        
        console.log('%c성능 정보:', 'color: #FF5722; font-weight: bold;', {
          크기: sizeFormatted,
          캐시됨: response.statusText === 'OK (cached)',
          상태: response.statusText
        });
        
        console.groupEnd();
      });

      // 응답 캐싱 (GET 요청인 경우)
      if (isCacheable(response.config) && response.statusText !== 'OK (cached)') {
        const cacheKey = getCacheKey(response.config);
        
        // 데이터 크기 검사 추가 (큰 응답은 캐시하지 않음)
        const dataSize = JSON.stringify(response.data).length;
        if (dataSize <= 1024 * 50) { // 50KB 이하만 캐시
          apiCache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now()
          });
          
          // 캐시 크기 관리
          manageCacheSize();
        }
      }

      return response;
    },
    (error: AxiosError) => {
      // 에러 응답 처리
      if (error.response) {
        // 서버가 응답을 반환한 경우 (2xx 외의 상태 코드)
        console.error('❌ API 오류:', {
          status: error.response.status,
          url: error.config?.url,
          method: error.config?.method,
          data: error.response.data
        });
        
        // 401 Unauthorized 에러 처리 (토큰 만료 등)
        if (error.response.status === 401) {
          // 현재 페이지가 이미 로그인 페이지인 경우 리다이렉트하지 않음
          const isLoginPage = typeof window !== 'undefined' && (
            window.location.pathname === '/login' || 
            window.location.pathname.includes('/login')
          );
          
          // 요청 URL이 보호된 API인지 확인
          const url = error.config?.url || '';
          const isProtected = isProtectedRoute(url);
          
          // 로그인 페이지가 아니고, 보호된 API인 경우에만 리다이렉트
          if (!isLoginPage && isProtected) {
            // 현재 URL을 저장하여 로그인 후 원래 페이지로 돌아갈 수 있도록 함
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
              // 토큰 제거 (만료된 것으로 간주)
              localStorage.removeItem(apiConfig.tokenName || 'auth_token');
              console.log('인증 토큰 만료로 로그인 페이지로 이동합니다.');
              window.location.href = '/login';
            }
          }
        }
      } else if (error.request) {
        // 요청은 전송되었지만 응답을 받지 못한 경우 (서버 연결 실패)
        console.error('⚠️ 서버 응답 없음:', {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          timeout: error.config?.timeout
        });
        
        // CORS 문제 확인을 위한 메시지
        if (process.env.NODE_ENV === 'development') {
          console.error('가능한 원인: CORS 정책 위반 또는 서버 접근 불가');
          console.error('권장 조치: 1. 서버 실행 확인, 2. CORS 설정 확인, 3. URL 경로 확인');
        }
      } else {
        // 요청 설정 중 오류가 발생한 경우
        console.error('🔴 요청 오류:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// API 인스턴스 생성
const api = createApiInstance();

// API 유틸리티 클래스 - 추가적인 기능 제공
export class ApiUtils {
  // 캐시 정리 함수
  static clearCache(url?: string): void {
    if (url) {
      // 특정 URL 관련 캐시만 삭제
      const urlPattern = new RegExp(url);
      const keysToDelete: string[] = [];
      
      apiCache.forEach((_, key) => {
        if (urlPattern.test(key)) {
          keysToDelete.push(key);
        }
      });
      
      keysToDelete.forEach(key => apiCache.delete(key));
    } else {
      // 모든 캐시 삭제
      apiCache.clear();
    }
  }
  
  // 캐시 통계 확인 (개발용)
  static getCacheStats(): { size: number, totalBytes: number, items: Record<string, string> } {
    let totalBytes = 0;
    const items: Record<string, string> = {};
    
    apiCache.forEach((value, key) => {
      const dataSize = JSON.stringify(value.data).length;
      totalBytes += dataSize;
      items[key] = `${dataSize > 1024 ? (dataSize / 1024).toFixed(2) + ' KB' : dataSize + ' bytes'}`;
    });
    
    return {
      size: apiCache.size,
      totalBytes,
      items
    };
  }

  // 에러 메시지 추출 헬퍼 함수
  static getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      // API 응답에서 에러 메시지 추출
      return error.response?.data?.error || 
             error.response?.data?.message || 
             error.message || 
             '알 수 없는 오류가 발생했습니다.';
    }
    
    // 일반 에러 객체인 경우
    if (error instanceof Error) {
      return error.message;
    }
    
    // 기타 경우
    return '알 수 없는 오류가 발생했습니다.';
  }

  // 응답 데이터 표준화
  static formatResponse<T>(data: any): ApiResponse<T> {
    // 이미 ApiResponse 형식이면 그대로 반환
    if (data && typeof data === 'object' && 'success' in data) {
      return data as ApiResponse<T>;
    }
    
    // 아니면 ApiResponse 형식으로 변환
    return {
      success: true,
      data
    };
  }
}

export default api; 