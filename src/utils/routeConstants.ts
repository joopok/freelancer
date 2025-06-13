// 보호된 경로 (로그인 필요)
export const PROTECTED_ROUTES = ['/resume', '/jobs/create'];

// 인증 경로 (로그인 상태에서 접근 시 리다이렉트)
export const AUTH_ROUTES = ['/login', '/register'];

// API 경로
export const API_ROUTES = ['/api'];

// 미들웨어 매처 설정
export const MIDDLEWARE_MATCHER = [
  '/resume/:path*',
  '/jobs/create',
  '/login',
  '/register',
  '/api/:path*',
]; 