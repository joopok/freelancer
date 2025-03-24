"use client";

import { ReactElement, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { AUTH_TOKEN_NAME } from '@/utils/env';

interface ClientAppContainerProps {
  children: React.ReactNode;
}

export default function ClientAppContainer({ children }: ClientAppContainerProps): ReactElement {
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  // 하이드레이션 함수를 메모이제이션
  const hydrate = useCallback(async () => {
    try {
      // 성능 측정 시작 (개발 환경에서만)
      if (process.env.NODE_ENV !== 'production') {
        console.time('스토어 하이드레이션');
      }
      
      // 스토어 하이드레이션 수행
      await useAuthStore.persist.rehydrate();
      
      // 성능 측정 종료 (개발 환경에서만)
      if (process.env.NODE_ENV !== 'production') {
        console.timeEnd('스토어 하이드레이션');
      }
      
      // 하이드레이션 완료 표시
      setIsHydrated(true);
    } catch (error) {
      // 오류가 발생해도 앱은 계속 실행
      console.error('스토어 하이드레이션 중 오류:', error);
      setIsHydrated(true);
    }
  }, []);

  // 세션 상태 체크 함수 메모이제이션
  const checkStoreState = useCallback(async () => {
    try {
      // 스토어가 초기화되었는지 확인
      const state = useAuthStore.getState();
      
      // 로컬 스토리지에 토큰이 있는지 확인
      let hasToken = false;
      
      // 브라우저 환경에서만 실행
      if (typeof window !== 'undefined') {
        try {
          hasToken = !!localStorage.getItem(AUTH_TOKEN_NAME);
        } catch (e) {
          // 오류 발생 시 조용히 처리
        }
      }
      
      // 스토어와 토큰 상태 불일치 검사 및 조정 (불필요한 상태 업데이트 방지)
      if (state.isLoggedIn && !hasToken) {
        // 스토어는 로그인 상태지만 토큰이 없는 경우 - 로그아웃 처리
        state.logout();
      } else if (!state.isLoggedIn && hasToken) {
        // 스토어는 로그아웃 상태지만 토큰이 있는 경우 - 세션 체크 실행
        if (typeof state.checkSession === 'function') {
          await state.checkSession();
        }
      }
    } catch (err) {
      // 오류 발생 시 조용히 처리
      console.error('세션 상태 체크 중 오류:', err);
    }
  }, []);

  // Zustand 스토어 하이드레이션
  useEffect(() => {
    // 이미 하이드레이션이 완료되었으면 다시 실행하지 않음
    if (!isHydrated) {
      hydrate();
    }
  }, [hydrate, isHydrated]);

  // 경로 변경 시 세션 상태 확인
  useEffect(() => {
    if (!isHydrated) return; // 하이드레이션 완료 전에는 실행하지 않음
    
    let timerId: NodeJS.Timeout | null = null;
    
    // 세션 체크 빈도 제한 (디바운싱)
    timerId = setTimeout(checkStoreState, 200);
    
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [pathname, isHydrated, checkStoreState]);

  // 서버 사이드 렌더링 중이나 하이드레이션 전에는 로딩 상태 표시
  if (!isHydrated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">페이지 준비 중...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 