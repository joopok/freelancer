"use client";

import { useState, useEffect, ReactNode, ReactElement } from 'react';
import { useAuthStore } from '@/store/auth';
import { usePathname } from 'next/navigation';

type ClientAppContainerProps = {
  children: ReactNode;
};

export default function ClientAppContainer({ children }: ClientAppContainerProps): ReactElement {
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  // Zustand 스토어 하이드레이션
  useEffect(() => {
    try {
      // 스토어 하이드레이션 수행
      useAuthStore.persist.rehydrate();
      setIsHydrated(true);
    } catch (error) {
      console.error('스토어 하이드레이션 오류:', error);
      // 오류가 발생해도 앱은 계속 실행
      setIsHydrated(true);
    }
  }, []);

  // 경로 변경 시 재렌더링을 방지하기 위한 키 관리
  useEffect(() => {
    // 페이지 변경 시 잠시 후 스토어 상태 확인
    const checkStoreState = setTimeout(() => {
      // 스토어가 초기화되었는지 확인
      const state = useAuthStore.getState();
      if (!state.isLoggedIn && state.user === null) {
        // 로그아웃 상태가 확인되면 로컬 스토리지 정리
        try {
          // 로컬 스토리지 초기화 (중복 정리이지만 안전성을 위해)
          if (typeof window !== 'undefined') {
            // auth 관련 스토리지 정리
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth-storage');
          }
        } catch (e) {
          console.error('로컬 스토리지 정리 중 오류:', e);
        }
      }
    }, 100);

    return () => clearTimeout(checkStoreState);
  }, [pathname]);

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