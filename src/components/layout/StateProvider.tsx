"use client";

import { ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

interface StateProviderProps {
  children: ReactNode;
}

// 페이지 전환 시 상태 유지를 위한 컴포넌트
export default function StateProvider({ children }: StateProviderProps) {
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const key = `${pathname}-${isLoggedIn ? 'auth' : 'no-auth'}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div
      key={key}
      className="flex flex-col min-h-screen transition-opacity duration-200 ease-in-out"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {children}
    </div>
  );
} 