import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SessionUser, User } from '@/types/auth';

// User 타입을 SessionUser 타입으로 변환하는 유틸리티 함수
export const convertToSessionUser = (user: User): SessionUser => {
  return {
    id: user.id,
    name: user.name || user.username1, // 이름이 없을 경우 사용자명을 사용
    type: user.role === 'ADMIN' ? 'company' : 'individual', // 역할에 따라 타입 결정
  };
};

interface AuthState {
  user: SessionUser | null;
  isLoggedIn: boolean;
  setUser: (user: User | SessionUser | null) => void;
  logout: () => void;
}

// 영속성을 가진 스토어로 변경 (로컬 스토리지에 상태 유지)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => {
        if (!user) {
          set({ user: null, isLoggedIn: false });
          return;
        }
        
        // User 타입인지 확인 후 SessionUser로 변환
        if ('username' in user) {
          const sessionUser = convertToSessionUser(user as User);
          set({ user: sessionUser, isLoggedIn: true });
        } else {
          // 이미 SessionUser 타입이면 그대로 사용
          set({ user: user as SessionUser, isLoggedIn: true });
        }
      },
      logout: () => {
        // 로그아웃 시 로컬 스토리지의 토큰과 영속 상태 함께 제거
        if (typeof window !== 'undefined') {
          // 인증 토큰 제거
          localStorage.removeItem('auth_token');
          
          // 영속 상태 클리어
          try {
            // 영속 상태만 지우고 스토어 자체는 유지
            localStorage.removeItem('auth-storage');
          } catch (e) {
            console.error('로컬 스토리지 정리 중 오류:', e);
          }
        }
        
        // 즉시 상태 초기화
        set({ user: null, isLoggedIn: false });
      },
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
      skipHydration: true, // 클라이언트 측에서만 하이드레이션 진행
    }
  )
); 