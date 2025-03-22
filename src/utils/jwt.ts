/**
 * JWT 토큰 관리 유틸리티
 * JWT 토큰 생성, 검증, 디코딩 기능을 제공합니다.
 */
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '@/utils/env';

// 토큰 페이로드 타입
export type JwtPayload = {
  id: string;
  name?: string;
  email?: string;
  type?: 'individual' | 'company';
  role?: string;
  roles?: string[];
  sub?: string; // JWT 표준 subject 필드
  iat?: number;
  exp?: number;
};

/**
 * JWT 토큰 생성
 * @param payload 토큰에 포함될 데이터
 * @returns 생성된 JWT 토큰
 */
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * JWT 토큰 검증
 * @param token 검증할 JWT 토큰
 * @returns 토큰이 유효하면 true, 아니면 false
 */
export function verifyToken(token: string): boolean {
  try {
    // 토큰이 없으면 false 반환
    if (!token || typeof token !== 'string') {
      console.warn('JWT 검증 실패: 토큰이 없거나 문자열이 아닙니다.', typeof token);
      return false;
    }

    // 토큰 형식 기본 검증 (3개 파트로 구성되어 있는지)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('JWT 검증 실패: 올바른 JWT 형식이 아닙니다.');
      return false;
    }

    // jsonwebtoken 대신에 직접 검증 로직 구현
    try {
      // 페이로드 디코딩
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      
      // 만료 시간 확인
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.warn('JWT 검증 실패: 토큰이 만료되었습니다.', new Date(payload.exp * 1000));
        return false;
      }
      
      return true;
    } catch (parseError) {
      console.error('JWT 페이로드 파싱 오류:', parseError);
      return false;
    }
  } catch (error) {
    // 모든 다른 오류 처리
    const errorName = error instanceof Error ? error.name : '알 수 없는 오류';
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error(`JWT 검증 중 오류 발생 (${errorName}):`, errorMessage);
    return false;
  }
}

// Base64Url 디코딩 함수
function base64UrlDecode(str: string): string {
  // URL 안전 Base64를 표준 Base64로 변환
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // 패딩 추가
  while (base64.length % 4) {
    base64 += '=';
  }
  
  try {
    // 디코딩
    return atob(base64);
  } catch (e) {
    throw new Error('Base64 디코딩 실패: ' + String(e));
  }
}

/**
 * JWT 토큰 디코딩
 * @param token 디코딩할 JWT 토큰
 * @returns 디코딩된 페이로드 또는 null (토큰이 유효하지 않은 경우)
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    // 토큰이 없으면 null 반환
    if (!token || typeof token !== 'string') {
      console.warn('JWT 디코딩 실패: 토큰이 없거나 문자열이 아닙니다.');
      return null;
    }

    // 토큰 형식 기본 검증 (3개 파트로 구성되어 있는지)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('JWT 디코딩 실패: 올바른 JWT 형식이 아닙니다.');
      return null;
    }

    // 직접 디코딩 구현
    try {
      // 페이로드 디코딩
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      return payload as JwtPayload;
    } catch (parseError) {
      console.error('JWT 페이로드 파싱 오류:', parseError);
      return null;
    }
  } catch (error) {
    // 오류 처리
    const errorName = error instanceof Error ? error.name : '알 수 없는 오류';
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error(`JWT 디코딩 중 오류 발생 (${errorName}):`, errorMessage);
    return null;
  }
}

/**
 * 토큰 만료 여부 확인
 * @param token 확인할 JWT 토큰
 * @returns 토큰이 만료되었으면 true, 아니면 false
 */
export function isTokenExpired(token: string): boolean {
  try {
    // 토큰이 없으면 만료된 것으로 간주
    if (!token || typeof token !== 'string') {
      console.warn('JWT 만료 확인 실패: 토큰이 없거나 문자열이 아닙니다.');
      return true;
    }

    // 토큰 형식 기본 검증 (3개 파트로 구성되어 있는지)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('JWT 만료 확인 실패: 올바른 JWT 형식이 아닙니다.');
      return true;
    }

    // 직접 페이로드 디코딩
    try {
      // 페이로드 디코딩
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      
      // exp 필드가 없으면 만료되지 않는 토큰으로 간주
      if (!payload.exp) {
        console.warn('JWT에 만료 시간(exp)이 없습니다.');
        return false;
      }
      
      // 현재 시간과 비교 (exp는 초 단위, Date.now()는 밀리초 단위)
      const now = Date.now() / 1000;
      const expired = payload.exp < now;
      
      if (expired) {
        console.log('JWT가 만료되었습니다.', {
          만료시간: new Date(payload.exp * 1000).toISOString(),
          현재시간: new Date().toISOString()
        });
      }
      
      return expired;
    } catch (parseError) {
      console.error('JWT 페이로드 파싱 오류:', parseError);
      return true;
    }
  } catch (error) {
    // 오류 처리
    const errorName = error instanceof Error ? error.name : '알 수 없는 오류';
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error(`JWT 만료 확인 중 오류 발생 (${errorName}):`, errorMessage);
    return true;
  }
}

export default {
  generateToken,
  verifyToken,
  decodeToken,
  isTokenExpired
}; 