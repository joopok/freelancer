'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { AUTH_TOKEN_NAME } from '@/utils/env';

interface AuthProviderProps {
  children: React.ReactNode;
}

// 최대 재시도 횟수 (한 번으로 충분함)
const MAX_RETRY_COUNT = 1;
// 세션 체크 지연 시간 (ms)
const INITIAL_DELAY = 300;

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { checkSession, isLoggedIn } = useAuthStore();
  const [sessionChecked, setSessionChecked] = useState(false);

  // 인증 상태 검증 및 동기화 (Callback 패턴으로 변경)
  const checkAuthStatus = useCallback(async () => {
    if (sessionChecked) return; // 이미 체크했으면 중복 실행 방지
  
    try {
      // 로컬 스토리지 토큰 존재 여부 확인
      let hasToken = false;
      try {
        hasToken = typeof window !== 'undefined' && 
                  !!localStorage.getItem(AUTH_TOKEN_NAME);
      } catch (e) {
        // 오류 발생 시 조용히 처리
      }
      
      // 세션 체크 실행
      const success = await checkSession();
      
      // 세션 체크 완료 표시
      setSessionChecked(true);
    } catch (error) {
      setSessionChecked(true);
    }
  }, [checkSession, sessionChecked]);

  // 컴포넌트 마운트 시에만 실행
  useEffect(() => {
    // 약간의 지연 후 세션 체크 실행
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, INITIAL_DELAY);
    
    return () => clearTimeout(timer);
  }, [checkAuthStatus]);

  // 마운트 직후에는 가시적인 변화 없이 세션 체크만 진행
  return <>{children}</>;
};

export default AuthProvider; 