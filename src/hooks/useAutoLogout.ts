'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/layout/Loading';

const LOGOUT_TIMEOUT = 10 * 60 * 1000; // 10분

export const useAutoLogout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const { setLoading } = useLoading();

  useEffect(() => {
    let logoutTimer: NodeJS.Timeout;

    const resetTimer = () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      
      logoutTimer = setTimeout(async () => {
        setLoading(true, '자동 로그아웃 처리 중...');
        await logout();
        router.push('/');
        setLoading(false);
        alert('10분 동안 활동이 없어 자동으로 로그아웃되었습니다.');
      }, LOGOUT_TIMEOUT);
    };

    // 사용자 활동 이벤트 리스너
    const handleUserActivity = () => {
      resetTimer();
    };

    // 이벤트 리스너 등록
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // 초기 타이머 설정
    resetTimer();

    // 클린업 함수
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [logout, router, setLoading]);
}; 