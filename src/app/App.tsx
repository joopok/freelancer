"use client";

import { useState, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth';

type AppProps = {
  children: ReactNode;
};

export default function App({ children }: AppProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  // 클라이언트 측 하이드레이션이 완료됐는지 확인
  useEffect(() => {
    // Zustand 스토어 하이드레이션
    useAuthStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // 서버 사이드 렌더링 중이나 하이드레이션 전에는 로딩 상태 표시
  if (!isHydrated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
} 