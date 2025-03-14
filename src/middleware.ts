import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 보호된 경로 정의
const protectedRoutes = ['/resume', '/jobs/create'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('user_session');
  const isLoggedIn = sessionCookie !== undefined;
  const { pathname } = request.nextUrl;

  // 로그인이 필요한 페이지에 접근하려는 경우
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isLoggedIn) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 이미 로그인한 사용자가 로그인/회원가입 페이지에 접근하려는 경우
  if (authRoutes.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/resume/:path*',
    '/jobs/create',
    '/login',
    '/register',
  ],
}; 