'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { AUTH_TOKEN_NAME } from '@/utils/env';

interface AuthProviderProps {
  children: React.ReactNode;
}

// 최대 재시도 횟수
const MAX_RETRY_COUNT = 3;
// 세션 체크 지연 시간 (ms)
const INITIAL_DELAY = 300;

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { checkSession, isLoggedIn } = useAuthStore();
  const [sessionChecked, setSessionChecked] = useState(false);

  // 인증 상태 검증 및 동기화
  useEffect(() => {
    // 컴포넌트 마운트 시에만 실행
    const checkAuthStatus = async () => {
      try {
        console.log('AuthProvider: 세션 체크 시작');
        
        // 로컬 스토리지 토큰 존재 여부 확인
        let hasToken = false;
        try {
          hasToken = typeof window !== 'undefined' && 
                    !!localStorage.getItem(AUTH_TOKEN_NAME);
        } catch (e) {
          console.error('로컬 스토리지 접근 오류:', e);
        }
        
        console.log('AuthProvider: 토큰 존재 여부', hasToken);
        
        // 지연 시작: 다른 컴포넌트 초기화 완료 후 세션 체크를 수행하기 위함
        await new Promise(resolve => setTimeout(resolve, INITIAL_DELAY));
        
        // 세션 체크 로직 실행
        let retryCount = 0;
        let success = false;
        
        // 재시도 메커니즘 추가
        while (retryCount < MAX_RETRY_COUNT && !success) {
          try {
            success = await checkSession();
            console.log(`AuthProvider: 세션 체크 결과 (시도 ${retryCount + 1})`, success);
            
            // 토큰이 있는데 로그인 상태가 아니면 추가 시도
            if (hasToken && !isLoggedIn && !success) {
              console.log('AuthProvider: 토큰 있으나 로그인 안됨, 재시도');
              retryCount++;
              
              // 각 재시도마다 지연 시간 증가
              if (retryCount < MAX_RETRY_COUNT) {
                await new Promise(resolve => setTimeout(resolve, INITIAL_DELAY * retryCount));
              }
            } else {
              // 정상적으로 처리됨
              break;
            }
          } catch (error) {
            console.error(`AuthProvider: 세션 체크 오류 (시도 ${retryCount + 1})`, error);
            retryCount++;
            
            // 각 재시도마다 지연 시간 증가
            if (retryCount < MAX_RETRY_COUNT) {
              await new Promise(resolve => setTimeout(resolve, INITIAL_DELAY * retryCount));
            }
          }
        }
        
        // 최종 결과 로깅
        console.log('AuthProvider: 세션 체크 완료, 최종 로그인 상태:', 
          isLoggedIn ? '로그인됨' : '로그인되지 않음',
          `(시도 횟수: ${retryCount + 1})`
        );
        
        // 세션 체크 완료 표시
        setSessionChecked(true);
      } catch (error) {
        console.error('AuthProvider: 세션 체크 중 심각한 오류', error);
        setSessionChecked(true);
      }
    };

    checkAuthStatus();
    // 의존성 배열을 비워서 컴포넌트 마운트 시에만 실행되도록 함
  }, []);

  // 마운트 직후에는 가시적인 변화 없이 세션 체크만 진행
  return <>{children}</>;
};

export default AuthProvider; 