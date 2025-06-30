import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SessionUser, User } from '@/types/auth';
import { AUTH_TOKEN_NAME } from '@/utils/env';
import { decodeToken, verifyToken, isTokenExpired, JwtPayload } from '@/utils/jwt';
import { jwtDecode } from 'jwt-decode';

// User 타입을 SessionUser 타입으로 변환하는 유틸리티 함수
export const convertToSessionUser = (user: User): SessionUser => {
  return {
    id: user.id,
    username: user.username || user.username, // 이름이 없을 경우 사용자명을 사용
    type: user.role === 'ADMIN' ? 'company' : 'individual', // 역할에 따라 타입 결정
  };
};

interface AuthState {
  user: SessionUser | null;
  isLoggedIn: boolean;
  setUser: (user: User | SessionUser | null) => void;
  logout: () => void;
  checkSession: () => Promise<boolean>;
}

// 영속성을 가진 스토어로 변경 (로컬 스토리지에 상태 유지)
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
          try {
            // 인증 토큰 제거
            localStorage.removeItem(AUTH_TOKEN_NAME);
            
            // 영속 상태 클리어
            localStorage.removeItem('auth-storage');
          } catch (e) {
            // 오류 처리 (로깅 없음)
          }
        }
        
        // 즉시 상태 초기화
        set({ user: null, isLoggedIn: false });
      },
      checkSession: async () => {
        // 서버 사이드에서는 실행하지 않음
        if (typeof window === 'undefined') {
          return false;
        }
        
        try {
          // 현재 상태 확인
          const currentState = get();
          
          // 로컬 스토리지에서 토큰 가져오기
          let token: string | null = null;
          
          try {
            token = localStorage.getItem(AUTH_TOKEN_NAME);
          } catch (e) {
            // 오류 발생 시 로그아웃 상태로 설정하고 종료
            if (currentState.isLoggedIn) {
              set({ user: null, isLoggedIn: false });
            }
            return false;
          }
          
          if (!token) {
            // 토큰이 없으면 로그아웃 상태로 설정
            if (currentState.isLoggedIn || currentState.user) {
              set({ user: null, isLoggedIn: false });
            }
            return false;
          }
          
          // 토큰 기본 형식 검증
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            localStorage.removeItem(AUTH_TOKEN_NAME);
            set({ user: null, isLoggedIn: false });
            return false;
          }
          
          // Base64 URL 디코딩 함수
          const base64UrlDecode = (str: string): string => {
            // Base64 URL을 일반 Base64로 변환
            let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            // 패딩 추가
            while (base64.length % 4) {
              base64 += '=';
            }
            // 디코딩 및 UTF-8 문자열로 변환
            try {
              const decoded = atob(base64);
              return decoded;
            } catch (e) {
              return '';
            }
          };
          
          // 만료 여부 수동 확인 (안전한 방법)
          let isManuallyValid = false;
          let manualPayload: JwtPayload | null = null;
          
          try {
            const payloadJson = base64UrlDecode(tokenParts[1]);
            if (payloadJson) {
              manualPayload = JSON.parse(payloadJson) as JwtPayload;
              
              // 만료 시간 확인
              if (manualPayload && typeof manualPayload.exp === 'number') {
                const now = Math.floor(Date.now() / 1000);
                if (manualPayload.exp <= now) {
                  // 토큰 만료됨
                  localStorage.removeItem(AUTH_TOKEN_NAME);
                  set({ user: null, isLoggedIn: false });
                  return false;
                } else {
                  // 만료되지 않음
                  isManuallyValid = true;
                }
              }
            }
          } catch (e) {
            // 오류 처리 (로깅 없음)
          }
          
          // verifyToken 시도 (오류 발생 가능)
          let isValid = false;
          try {
            isValid = verifyToken(token);
          } catch (verifyError) {
            // 수동 검증 결과 사용
            isValid = isManuallyValid;
          }
          
          if (!isValid) {
            localStorage.removeItem(AUTH_TOKEN_NAME);
            set({ user: null, isLoggedIn: false });
            return false;
          }
          
          // 토큰 디코딩 (수동 파싱 또는 라이브러리 사용)
          let payload: JwtPayload | null = null;
          
          // 이미 수동으로 디코딩한 페이로드가 있으면 사용
          if (manualPayload && manualPayload.id) {
            payload = manualPayload;
          } else {
            try {
              // 라이브러리 사용 디코딩 시도
              payload = jwtDecode<JwtPayload>(token);
            } catch (error) {
              // 파싱 오류 발생 시 검증 단계로 진행
            }
          }
          
          // 토큰에서 사용자 정보 추출
          const sessionUser: SessionUser = {
            id: payload?.id || payload?.sub || '',
            name: payload?.name || '',
            type: payload?.type || 'individual',
          };
          
          // ID가 비어있으면 유효하지 않은 사용자로 간주
          if (!sessionUser.id) {
            localStorage.removeItem(AUTH_TOKEN_NAME);
            set({ user: null, isLoggedIn: false });
            return false;
          }
          
          // 현재 상태와 비교하여 불필요한 상태 업데이트 방지
          if (!currentState.isLoggedIn || !currentState.user || currentState.user.id !== sessionUser.id) {
            set({ user: sessionUser, isLoggedIn: true });
            
            // 업데이트 후 검증
            setTimeout(() => {
              const updatedState = get();
              if (!updatedState.isLoggedIn || !updatedState.user) {
                set({ user: sessionUser, isLoggedIn: true });
              }
            }, 0);
          }
          
          return true;
        } catch (error) {
          // 오류 처리 (로깅 없음)
          return false;
        }
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: true, // 클라이언트 측에서만 하이드레이션 진행
    }
  )
); 