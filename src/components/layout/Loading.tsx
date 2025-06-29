'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, memo } from 'react';

// 로딩 상태를 위한 컨텍스트 인터페이스
interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean, debugInfo?: string) => void;
  debugInfo?: string;
}

// 로딩 컨텍스트 생성
const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {},
  debugInfo: undefined
});

// 로딩 상태를 사용하기 위한 커스텀 훅
export const useLoading = () => useContext(LoadingContext);

// 1초 로딩 상수
const LOADING_DURATION = 1000;

// 로딩 UI 컴포넌트 메모이제이션 - Framer Motion 제거
const LoadingUI = memo(({ debugInfo }: { debugInfo?: string }) => (
  <div
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900"
  >
    <div className="relative">
      {/* 로고 */}
      <div className="mb-6 flex items-center justify-center animate-pulse">
        <div className="text-white text-4xl font-bold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">
            잡코리아 빌보드
          </span>
        </div>
      </div>
      
      {/* 로딩 스피너 - 3D 효과와 다중 링 */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-20 h-20">
            {/* 외부 링 */}
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-pink-500 border-r-purple-500 border-b-blue-500 border-l-cyan-500 rounded-full animate-spin"></div>
            {/* 중간 링 */}
            <div className="absolute top-2 left-2 w-16 h-16 border-3 border-t-yellow-400 border-r-orange-400 border-b-red-400 border-l-pink-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            {/* 내부 링 */}
            <div className="absolute top-4 left-4 w-12 h-12 border-2 border-t-green-400 border-r-blue-400 border-b-purple-400 border-l-indigo-400 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
            {/* 중심 점 */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* 로딩 메시지와 디버그 정보 */}
      <div className="mt-6 text-center text-white animate-pulse">
        <p>페이지 로딩 중입니다...</p>
        {process.env.NODE_ENV !== 'production' && debugInfo && (
          <p className="mt-2 text-xs text-blue-200 opacity-80">{debugInfo}</p>
        )}
      </div>
    </div>
    
    {/* 배경 요소 */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: '60px 60px'
      }}></div>
      <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500 opacity-20 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500 opacity-20 blur-2xl animate-pulse"></div>
    </div>

  </div>
));

LoadingUI.displayName = 'LoadingUI';

// 로딩 컴포넌트
export default function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  
  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 로딩 상태 설정 함수를 확장 - useCallback으로 메모이제이션
  const handleSetLoading = useCallback((isLoading: boolean, info?: string) => {
    if (typeof window === 'undefined') return; // 서버사이드에서는 실행하지 않음
    
    setLoading(isLoading);
    if (info) {
      setDebugInfo(info);
    } else {
      setDebugInfo(undefined);
    }

    // 이전 타이머가 있다면 초기화
    if ((window as any).__loadingTimer) {
      clearTimeout((window as any).__loadingTimer);
      (window as any).__loadingTimer = null;
    }

    // 로딩 시작 시 타이머 설정
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoading(false);
        setDebugInfo('타이머 종료로 인한 로딩 해제');
      }, LOADING_DURATION);

      // 타이머 ID를 전역 변수로 저장
      (window as any).__loadingTimer = timer;
    }
  }, []);
  
  // 로딩 이벤트 리스너 추가
  useEffect(() => {
    // 브라우저 환경에서만 실행
    if (typeof window === 'undefined') return;
    
    // 이미 리스너가 등록되어 있는지 확인 (전역 플래그 사용)
    if ((window as any).__loadingListenersAttached) return;
    
    // 함수 메모이제이션
    const startLoading = () => setLoading(true);
    const stopLoading = () => {
      setTimeout(() => {
        setLoading(false);
      }, 200); // 로딩 지속 시간 단축 (500ms에서 200ms로)
    };

    window.addEventListener('beforeunload', startLoading);
    window.addEventListener('load', stopLoading);
    
    // 리스너 등록 플래그 설정
    (window as any).__loadingListenersAttached = true;

    return () => {
      window.removeEventListener('beforeunload', startLoading);
      window.removeEventListener('load', stopLoading);
      // 플래그 제거
      (window as any).__loadingListenersAttached = false;
      
      // 컴포넌트 언마운트 시 로딩 타이머 제거
      if ((window as any).__loadingTimer) {
        clearTimeout((window as any).__loadingTimer);
        (window as any).__loadingTimer = null;
      }
    };
  }, []);
  
  return (
    <LoadingContext.Provider value={{ loading, setLoading: handleSetLoading, debugInfo }}>
      {children}
      {mounted && loading && <LoadingUI debugInfo={debugInfo} />}
    </LoadingContext.Provider>
  );
} 