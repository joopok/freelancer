'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// 로딩 상태를 위한 컨텍스트 인터페이스
interface LoadingContextType {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

// 로딩 컨텍스트 생성
const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
});

// 로딩 상태를 사용하기 위한 커스텀 훅
export const useLoading = () => useContext(LoadingContext);

// 로딩 컴포넌트
export function Loading() {
  const { isLoading } = useLoading();
  
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 w-full h-full bg-white bg-opacity-95 z-50 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">로딩 중...</p>
      </div>
    </div>
  );
}

// LoadingProvider 컴포넌트
export default function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 페이지 변경 시 로딩 상태 자동 해제
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);
  
  // 로딩 이벤트 리스너 추가
  useEffect(() => {
    const startLoading = () => setIsLoading(true);
    const stopLoading = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000); // 1초 후 로딩 종료 (UX 향상)
    };

    window.addEventListener('beforeunload', startLoading);
    window.addEventListener('load', stopLoading);

    return () => {
      window.removeEventListener('beforeunload', startLoading);
      window.removeEventListener('load', stopLoading);
    };
  }, []);
  
  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}
      <Loading />
    </LoadingContext.Provider>
  );
} 