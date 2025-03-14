import { cookies } from 'next/headers';
import { Session } from '@/types/auth';

const SESSION_COOKIE_NAME = 'session_id';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24시간

// 세션 생성
export async function createSession(userId: string, userType: 'individual' | 'company'): Promise<Session> {
  const session: Session = {
    userId,
    userType,
    isLoggedIn: true,
    expiresAt: Date.now() + SESSION_DURATION,
  };

  return session;
}

// 세션 쿠키 설정
export function setSessionCookie(session: Session) {
  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000, // 초 단위로 변환
  });
}

// 세션 가져오기
export async function getSession(): Promise<Session | null> {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie) {
    return null;
  }

  try {
    const session: Session = JSON.parse(sessionCookie.value);
    
    // 세션 만료 체크
    if (Date.now() > session.expiresAt) {
      cookies().delete(SESSION_COOKIE_NAME);
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

// 세션 삭제
export function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}

export const clearSession = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Logout failed');
  } catch (error) {
    console.error('Failed to clear session:', error);
    throw error;
  }
}; 