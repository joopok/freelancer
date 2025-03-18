"use client";

import { useEffect, useState, ReactNode } from 'react';
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
  const [key, setKey] = useState(pathname || 'default');
  const { isLoggedIn } = useAuthStore();

  // 인증 상태가 변경되면 키를 업데이트하여 새로운 애니메이션 적용
  useEffect(() => {
    // 인증 상태 변경 시 페이지 키 업데이트
    setKey(`${pathname}-${isLoggedIn ? 'auth' : 'no-auth'}-${Date.now()}`);
  }, [pathname, isLoggedIn]);

  // 페이지 로드 상태 관리
  useEffect(() => {
    // 페이지 전환 시작 시 로드 상태 초기화
    setIsPageLoaded(false);
    
    // 약간의 지연 후 페이지 로드 상태를 true로 설정
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 