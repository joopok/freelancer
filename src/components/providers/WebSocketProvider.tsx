'use client';

import { useEffect } from 'react';
import wsService from '@/services/websocket';
import { useAuthStore } from '@/store/auth';

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    // 환경 변수로 WebSocket 활성화 여부 확인
    const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true';
    
    if (!enableWebSocket) {
      return;
    }

    // 로그인 상태일 때만 WebSocket 연결
    if (isLoggedIn) {
      wsService.connect();
    }

    // Cleanup on unmount or when logged out
    return () => {
      if (wsService.isConnected()) {
        wsService.disconnect();
      }
    };
  }, [isLoggedIn]);

  return <>{children}</>;
}