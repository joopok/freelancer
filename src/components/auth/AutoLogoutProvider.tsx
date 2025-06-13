'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/layout/Loading';
import { AUTH_TOKEN_NAME } from '@/utils/env';

interface AutoLogoutProviderProps {
  children: React.ReactNode;
}

const LOGOUT_TIMEOUT = 10 * 60 * 1000; // 10분

const AutoLogoutProvider: React.FC<AutoLogoutProviderProps> = ({ children }) => {
  const { isLoggedIn, logout } = useAuthStore();
  const router = useRouter();
  const { setLoading } = useLoading();
  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [initialized, setInitialized] = useState(false);
  const listenersAttachedRef = useRef(false);

  // 로그인 상태 변경 감지 전에 초기화 확인
  useEffect(() => {
    const checkInitial = setTimeout(() => {
      setInitialized(true);
    }, 300); // 타임아웃 단축
    
    return () => clearTimeout(checkInitial);
  }, []);

  // 타이머 초기화 함수
  const resetTimer = () => {
    // 기존 타이머가 있으면 제거
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    
    // 새 타이머 설정 (로그인 상태일 때만)
    if (isLoggedIn) {
      logoutTimerRef.current = setTimeout(async () => {
        try {
          console.log('자동 로그아웃: 비활성 타이머 만료');
          
          // 토큰이 여전히 있는지 확인
          const hasToken = typeof window !== 'undefined' && 
                          localStorage.getItem(AUTH_TOKEN_NAME);
                          
          if (!hasToken) {
            console.log('자동 로그아웃: 토큰이 이미 없음, 로그아웃 처리 취소');
            return;
          }
          
          // 로딩 상태 설정
          setLoading(true, '자동 로그아웃 처리 중');
          
          // 로그아웃 실행
          await logout();
          
          // 홈으로 이동
          router.push('/');
          
          // 알림 메시지 설정
          alert('장시간 활동이 없어 자동 로그아웃되었습니다.');
          
          // 로딩 상태 해제
          setLoading(false);
        } catch (error) {
          console.error('자동 로그아웃 처리 중 오류:', error);
          setLoading(false);
        }
      }, LOGOUT_TIMEOUT);
    }
  };

  // 로그인 상태 변경 시 타이머 초기화
  useEffect(() => {
    if (!initialized) return;
    
    if (isLoggedIn) {
      console.log('자동 로그아웃: 사용자 로그인 감지, 타이머 시작');
      resetTimer();
    } else if (logoutTimerRef.current) {
      console.log('자동 로그아웃: 사용자 로그아웃 감지, 타이머 제거');
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, [isLoggedIn, initialized]);

  // 사용자 활동 이벤트 리스너
  useEffect(() => {
    if (!isLoggedIn || !initialized || listenersAttachedRef.current) return;
    
    // 이벤트 리스너가 이미 등록되어 있는지 확인
    listenersAttachedRef.current = true;
    
    // 인증된 사용자의 활동을 감지할 이벤트 리스너
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // 타이머 재설정 이벤트 핸들러
    const resetTimerHandler = () => {
      if (isLoggedIn) {
        resetTimer();
      }
    };
    
    // 이벤트 리스너 등록
    events.forEach(event => {
      window.addEventListener(event, resetTimerHandler);
    });
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      listenersAttachedRef.current = false;
      events.forEach(event => {
        window.removeEventListener(event, resetTimerHandler);
      });
    };
  }, [isLoggedIn, initialized, resetTimer]);

  return <>{children}</>;
};

export default AutoLogoutProvider; 