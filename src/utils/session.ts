/**
 * 세션 관리 유틸리티
 * 사용자 인증 세션을 생성, 검증, 관리하는 함수들을 제공합니다.
 */
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { Session } from '@/types/auth';

// 메모리 세션 저장소 (실제 프로덕션에서는 Redis 등 외부 저장소 사용 권장)
const sessions: Record<string, Session> = {};

// 세션 관련 상수
const MAX_SESSIONS = 1000; // 최대 세션 수 제한
const SESSION_CLEANUP_INTERVAL = 1000 * 60 * 15; // 15분마다 정리
const SESSION_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30일

// 만료된 세션 정리 함수
const cleanupExpiredSessions = (): void => {
  const now = Date.now();
  let expiredCount = 0;
  
  Object.keys(sessions).forEach(sessionId => {
    if (sessions[sessionId].expires < now) {
      delete sessions[sessionId];
      expiredCount++;
    }
  });
  
  if (process.env.NODE_ENV !== 'production' && expiredCount > 0) {
    console.log(`🧹 ${expiredCount}개의 만료된 세션이 정리되었습니다.`);
  }
};

// 세션 수 제한 관리
const enforceSessionLimit = (): void => {
  const sessionIds = Object.keys(sessions);
  
  if (sessionIds.length > MAX_SESSIONS) {
    // 가장 오래된 세션부터 제거
    const sessionsToRemove = sessionIds
      .map(id => ({ id, created: sessions[id].created }))
      .sort((a, b) => a.created - b.created)
      .slice(0, sessionIds.length - MAX_SESSIONS);
    
    sessionsToRemove.forEach(session => {
      delete sessions[session.id];
    });
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`⚠️ 세션 제한 초과로 ${sessionsToRemove.length}개의 세션이 제거되었습니다.`);
    }
  }
};

// 브라우저 환경에서만 세션 정리 타이머 설정
if (typeof window !== 'undefined') {
  // 주기적으로 만료된 세션 정리
  setInterval(cleanupExpiredSessions, SESSION_CLEANUP_INTERVAL);
}

/**
 * 새 세션 생성
 * @param userId 사용자 ID
 * @param userType 사용자 타입
 * @returns 생성된 세션 객체
 */
export async function createSession(
  userId: string,
  userType: 'individual' | 'company'
): Promise<Session> {
  // 세션 ID 생성 (UUID)
  const sessionId = uuidv4();
  
  // 현재 시간
  const now = Date.now();
  
  // 세션 객체 생성 (30일 유효기간)
  const session: Session = {
    id: sessionId,
    userId,
    userType,
    isLoggedIn: true,
    created: now,
    expires: now + SESSION_EXPIRY,
    lastActive: now
  };
  
  // 먼저 만료된 세션 정리
  cleanupExpiredSessions();
  
  // 세션 저장
  sessions[sessionId] = session;
  
  // 세션 수 제한 관리
  enforceSessionLimit();
  
  return session;
}

/**
 * 세션 갱신
 * @param sessionId 세션 ID
 * @returns 갱신된 세션 또는 null
 */
export async function refreshSession(sessionId: string): Promise<Session | null> {
  const session = sessions[sessionId];
  
  if (!session) {
    return null;
  }
  
  // 현재 시간
  const now = Date.now();
  
  // 만료 시간 갱신
  session.expires = now + SESSION_EXPIRY;
  // 마지막 활동 시간 갱신
  session.lastActive = now;
  
  return session;
}

/**
 * 세션 쿠키 설정
 * @param session 세션 객체
 */
export function setSessionCookie(session: Session): void {
  // 쿠키 만료 시간 설정 (세션 만료 시간과 동일)
  const expires = new Date(session.expires);
  
  // 쿠키 설정
  cookies().set({
    name: 'user_session',
    value: session.id,
    expires,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });
}

/**
 * 현재 세션 가져오기
 * @returns 현재 세션 또는 null (로그인 안된 경우)
 */
export async function getSession(): Promise<Session | null> {
  // 세션 쿠키 가져오기
  const sessionCookie = cookies().get('user_session');
  
  if (!sessionCookie) {
    return null;
  }
  
  const sessionId = sessionCookie.value;
  
  // 메모리에서 세션 조회
  const session = sessions[sessionId];
  
  // 세션이 없거나 만료된 경우
  if (!session || session.expires < Date.now()) {
    // 만료된 쿠키 제거
    if (session) {
      delete sessions[sessionId];
    }
    cookies().delete('user_session');
    return null;
  }
  
  // 세션 활성 시간 업데이트
  session.lastActive = Date.now();
  
  return session;
}

/**
 * 세션 삭제 (로그아웃)
 */
export async function deleteSession(): Promise<void> {
  // 세션 쿠키 가져오기
  const sessionCookie = cookies().get('user_session');
  
  if (sessionCookie) {
    // 메모리에서 세션 제거
    delete sessions[sessionCookie.value];
    
    // 쿠키 제거
    cookies().delete('user_session');
  }
}

/**
 * 세션 검증
 * 유효한 세션인지 확인합니다.
 * @param sessionId 세션 ID
 * @returns 유효 여부
 */
export async function validateSession(sessionId: string): Promise<boolean> {
  // 세션 가져오기
  const session = sessions[sessionId];
  
  // 세션이 없거나 만료된 경우
  if (!session || session.expires < Date.now()) {
    return false;
  }
  
  return true;
}

/**
 * 세션 통계 반환 (개발 환경용)
 */
export function getSessionStats(): { 
  active: number; 
  total: number; 
  memory: string;
} {
  const now = Date.now();
  const total = Object.keys(sessions).length;
  const active = Object.values(sessions).filter(session => 
    session.isLoggedIn && session.expires > now
  ).length;
  
  // 대략적인 메모리 사용량 계산 (바이트)
  const sessionStr = JSON.stringify(sessions);
  const memory = `${Math.round(sessionStr.length / 1024)} KB`;
  
  return { active, total, memory };
} 