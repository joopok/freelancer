/**
 * 환경 변수 관리 유틸리티
 * process.env에서 필요한 환경 변수를 가져와 사용할 수 있게 해줍니다.
 */

// API URL 설정 (기본값 제공)
// NEXT_PUBLIC_API_URL 환경 변수가 있으면 그 값을 사용하고, 없으면 기본값 사용
let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 상대 경로인 경우(예: /api) 검증 로직을 건너뜁니다
if (apiUrl.startsWith('http')) {
  // URL 객체로 파싱해서 검증 및 정규화 (절대 URL인 경우만)
  try {
    const url = new URL(apiUrl);
    apiUrl = url.toString();
    // 마지막 슬래시 제거 (후행 슬래시가 있을 경우)
    if (apiUrl.endsWith('/')) {
      apiUrl = apiUrl.slice(0, -1);
    }
  } catch (e) {
    // 오류 발생 시 상대 경로로 대체
    apiUrl = '/api';
  }
} else {
  // 상대 경로인 경우 마지막 슬래시 처리
  if (apiUrl.endsWith('/') && apiUrl !== '/') {
    apiUrl = apiUrl.slice(0, -1);
  }
}

// 브라우저 환경에서는 상대 경로를 사용하고, 서버 환경에서는 절대 경로를 사용
if (typeof window !== 'undefined' && apiUrl.startsWith('/')) {
  // 브라우저 환경에서 상대 경로 사용
} else if (typeof window === 'undefined' && !apiUrl.startsWith('http')) {
  // 서버 사이드에서 상대 경로가 지정된 경우 절대 URL로 변환
  apiUrl = `http://localhost:8080${apiUrl.startsWith('/') ? apiUrl : `/${apiUrl}`}`;
}

export const API_URL = apiUrl;

// 환경 설정 (개발/테스트/프로덕션)
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_TEST = NODE_ENV === 'test';

// 모의 API 설정
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// API 캐싱 설정
export const USE_API_CACHE = process.env.NEXT_PUBLIC_USE_API_CACHE === 'true';
export const API_CACHE_TIME = parseInt(process.env.NEXT_PUBLIC_API_CACHE_TIME || '300000', 10); // 기본 5분 (300000ms)

// API 타임아웃 설정
export const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10); // 기본 30초로 증가

// API 인증 설정
export const AUTH_TOKEN_NAME = process.env.NEXT_PUBLIC_AUTH_TOKEN_NAME || 'auth_token';
export const AUTH_REFRESH_TOKEN_NAME = process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_NAME || 'refresh_token';

// JWT 설정
export const JWT_SECRET = process.env.JWT_SECRET || 'jobkorea-billboard-secret-key-2024';
export const JWT_EXPIRY = process.env.JWT_EXPIRY || '30d'; // 30일

// 기타 환경 변수들
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';


// 환경 변수 로그 (개발 모드에서만)
if (IS_DEVELOPMENT) {
  // 브라우저 환경에서만 콘솔에 스타일 적용
  if (typeof window !== 'undefined') {
    console.log('%c====== 개발 환경 변수 ======', 'background: #222; color: #bada55; padding: 5px; font-size: 14px;');
    console.log('%cAPI_URL:', 'color: #2196F3; font-weight: bold;', API_URL);
    console.log('%cNODE_ENV:', 'color: #2196F3; font-weight: bold;', NODE_ENV);
    console.log('%cUSE_MOCK_API:', 'color: #2196F3; font-weight: bold;', USE_MOCK_API);
    console.log('%cUSE_API_CACHE:', 'color: #2196F3; font-weight: bold;', USE_API_CACHE);
    console.log('%cAPI_CACHE_TIME:', 'color: #2196F3; font-weight: bold;', `${API_CACHE_TIME}ms`);
    console.log('%cAPI_TIMEOUT:', 'color: #2196F3; font-weight: bold;', `${API_TIMEOUT}ms`);
    console.log('%cAPP_VERSION:', 'color: #2196F3; font-weight: bold;', APP_VERSION);
    console.log('%c==========================', 'background: #222; color: #bada55; padding: 5px; font-size: 14px;');
  } else {
    // 서버 사이드 환경에서는 일반 로그
    console.log('====== 개발 환경 변수 (서버) ======');
    console.log('API_URL:', API_URL);
    console.log('NODE_ENV:', NODE_ENV);
    console.log('USE_MOCK_API:', USE_MOCK_API);
    console.log('USE_API_CACHE:', USE_API_CACHE);
    console.log('API_CACHE_TIME:', `${API_CACHE_TIME}ms`);
    console.log('API_TIMEOUT:', `${API_TIMEOUT}ms`);
    console.log('APP_VERSION:', APP_VERSION);
    console.log('==================================');
  }
}

// 모든 환경 변수를 포함하는 객체
const env = {
  API_URL,
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  IS_TEST,
  USE_MOCK_API,
  USE_API_CACHE,
  API_CACHE_TIME,
  API_TIMEOUT,
  AUTH_TOKEN_NAME,
  AUTH_REFRESH_TOKEN_NAME,
  JWT_SECRET,
  JWT_EXPIRY,
  APP_VERSION
};

export default env; 