import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PROTECTED_ROUTES, AUTH_ROUTES, MIDDLEWARE_MATCHER } from './utils/routeConstants';

// CORS 설정을 위한 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function middleware(request: NextRequest) {
  // OPTIONS 요청에 대한 처리 (CORS 프리플라이트)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const sessionCookie = request.cookies.get('user_session');
  const isLoggedIn = sessionCookie !== undefined;
  const { pathname } = request.nextUrl;

  // 로그인이 필요한 페이지에 접근하려는 경우
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route)) && !isLoggedIn) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하려는 경우
  if (AUTH_ROUTES.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 일반 요청 처리 및 CORS 헤더 추가
  const response = NextResponse.next();
  
  // API 요청인 경우 CORS 헤더 추가
  if (pathname.includes('/api/')) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
}

export const config = {
  matcher: MIDDLEWARE_MATCHER,
}; 