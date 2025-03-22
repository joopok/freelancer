"use client";

import { useState, useEffect, ReactNode, ReactElement } from 'react';
import { useAuthStore } from '@/store/auth';
import { usePathname } from 'next/navigation';
import { AUTH_TOKEN_NAME } from '@/utils/env';

type ClientAppContainerProps = {
  children: ReactNode;
};

export default function ClientAppContainer({ children }: ClientAppContainerProps): ReactElement {
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  // Zustand 스토어 하이드레이션
  useEffect(() => {
    const hydrate = async () => {
      try {
        console.log('스토어 하이드레이션 시작');
        // 스토어 하이드레이션 수행
        useAuthStore.persist.rehydrate();
        
        // 로컬 스토리지에 직접 토큰 체크
        let hasToken = false;
        try {
          hasToken = typeof window !== 'undefined' && 
                    !!localStorage.getItem(AUTH_TOKEN_NAME);
        } catch (storageErr) {
          console.error('로컬 스토리지 접근 오류:', storageErr);
        }
        
        console.log('토큰 존재 여부 (하이드레이션 직후):', hasToken);

        // 충분한 시간을 두고 세션 체크 실행
        setTimeout(async () => {
          // 안전하게 스토어 상태 접근
          const storeState = useAuthStore.getState();
          console.log('세션 체크 전 로그인 상태:', storeState.isLoggedIn);
          
          // 토큰과 로그인 상태 불일치 확인
          try {
            hasToken = typeof window !== 'undefined' && 
                      !!localStorage.getItem(AUTH_TOKEN_NAME);
          } catch (e) {
            console.error('로컬 스토리지 재확인 중 오류:', e);
          }
          
          // 불일치 상태 로깅
          if (hasToken !== storeState.isLoggedIn) {
            console.log('상태 불일치 감지:', { 
              hasToken, 
              isLoggedIn: storeState.isLoggedIn 
            });
          }
          
          if (typeof storeState.checkSession === 'function') {
            try {
              const success = await storeState.checkSession();
              console.log('명시적 세션 체크 결과:', success);
            } catch (err) {
              console.error('세션 체크 중 오류:', err);
            }
          }
          
          setIsHydrated(true);
          console.log('하이드레이션 완료 표시됨');
        }, 300);
      } catch (error) {
        console.error('스토어 하이드레이션 오류:', error);
        // 오류가 발생해도 앱은 계속 실행
        setIsHydrated(true);
      }
    };

    hydrate();
  }, []);

  // 경로 변경 시 세션 상태 확인
  useEffect(() => {
    if (!isHydrated) return; // 하이드레이션 완료 전에는 실행하지 않음
    
    // 페이지 변경 시 세션 체크
    const checkStoreState = setTimeout(async () => {
      // 스토어가 초기화되었는지 확인
      const state = useAuthStore.getState();
      
      // 로컬 스토리지에 토큰이 있는지 확인
      let hasToken = false;
      try {
        hasToken = typeof window !== 'undefined' && !!localStorage.getItem(AUTH_TOKEN_NAME);
      } catch (e) {
        console.error('경로 변경 후 로컬 스토리지 확인 중 오류:', e);
      }
      
      console.log('경로 변경 후 상태 체크:', {
        경로: pathname,
        로그인상태: state.isLoggedIn,
        사용자정보존재: !!state.user,
        토큰존재: hasToken
      });
      
      // 스토어와 토큰 상태 불일치 검사 및 조정
      if (state.isLoggedIn && !hasToken) {
        // 스토어는 로그인 상태지만 토큰이 없는 경우 - 로그아웃 처리
        console.log('불일치 감지: 스토어는 로그인 상태이나 토큰 없음 - 로그아웃 처리');
        state.logout();
      } else if (!state.isLoggedIn && hasToken) {
        // 스토어는 로그아웃 상태지만 토큰이 있는 경우 - 세션 체크 실행
        console.log('불일치 감지: 토큰은 있으나 로그인 안됨 - 세션 체크 실행');
        try {
          if (typeof state.checkSession === 'function') {
            await state.checkSession();
          }
        } catch (checkErr) {
          console.error('불일치 해결 중 세션 체크 오류:', checkErr);
        }
      }
    }, 500); // 일부 지연 시간 감소

    return () => clearTimeout(checkStoreState);
  }, [pathname, isHydrated]);

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