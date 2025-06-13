"use client";

import { useEffect, useState, ReactNode, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';

interface StateProviderProps {
  children: ReactNode;
}

// 페이지 전환 시 상태 유지를 위한 컴포넌트
export default function StateProvider({ children }: StateProviderProps) {
  const pathname = usePathname();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [key, setKey] = useState('');
  const { isLoggedIn } = useAuthStore();

  // 키 업데이트 함수를 useCallback으로 메모이제이션
  const updateKey = useCallback(() => {
    // 인증 상태 변경 시 페이지 키 업데이트
    const newKey = `${pathname}-${isLoggedIn ? 'auth' : 'no-auth'}`;
    if (key !== newKey) {
      setKey(newKey);
    }
  }, [pathname, isLoggedIn, key]);

  // 초기 키 설정 및 인증 상태 변경 감지
  useEffect(() => {
    updateKey();
  }, [updateKey]);

  // 페이지 로드 상태 관리
  useEffect(() => {
    // 페이지 전환 시작 시 로드 상태 초기화
    setIsPageLoaded(false);
    
    // 페이지 로드 상태를 true로 설정
    const timer = requestAnimationFrame(() => {
      setIsPageLoaded(true);
    });
    
    return () => cancelAnimationFrame(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 