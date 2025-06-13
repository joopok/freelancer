import { AuthResponse, LoginRequest, User } from '@/types/auth';
import axios from 'axios';
import api, { ApiUtils } from '@/utils/api';
import { AUTH_TOKEN_NAME, USE_MOCK_API, API_URL } from '@/utils/env';

/**
 * 인증 관련 API 서비스
 * API 요청 및 응답 처리를 담당합니다.
 */
export const authService = {
  /**
   * 로그인 API 호출
   * 사용자 로그인을 처리하고 인증 토큰을 반환합니다.
   */
  async login(username1: string, password: string): Promise<AuthResponse> {
    try {
      // 입력값 검증
      if (!username1 || !password) {
        throw new Error('아이디와 비밀번호를 모두 입력해주세요.');
      }
      
      // 로그인 API 호출
      const loginData: LoginRequest = { username1, password };
      const response = await api.post<any>('/auth/login', loginData);
      
      // 응답 데이터 검증
      if (!response.data) {
        throw new Error('서버 응답 오류가 발생했습니다.');
      }
      
      // API 응답 구조에 맞게 데이터 변환
      const responseData = response.data;
      
      // API 응답 구조 매핑
      const authResponse: AuthResponse = {
        success: responseData.success,
        error: responseData.message || null,
        token: responseData.data?.access_token || null,
        user: responseData.data ? {
          id: responseData.data.username1 || responseData.data.username || '',
          username1: responseData.data.username1 || responseData.data.username || '',
          name: responseData.data.name || responseData.data.username || responseData.data.username1 || '',
          email: responseData.data.email || '',
          role: responseData.data.role || ''
        } : undefined
      };
      
      return authResponse;
    } catch (error: unknown) {
      // 에러 처리 (중앙화된 유틸리티 활용)
      const errorMessage = ApiUtils.getErrorMessage(error);
      
      // Network Error인 경우 사용자 친화적 오류 메시지로 변환
      if (axios.isAxiosError(error) && error.message === 'Network Error') {
        return Promise.reject(new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하거나 네트워크 연결을 확인해주세요.'));
      }
      
      throw new Error(errorMessage);
    }
  },

  /**
   * 로그아웃 API 호출
   * 사용자 세션을 종료하고 토큰을 무효화합니다.
   */
  async logout(): Promise<void> {
    try {
      // 백엔드 로그아웃 API 호출
      await api.post('/auth/logout');
      
      // 클라이언트 측 상태 정리
      if (typeof window !== 'undefined') {
        // 로컬 스토리지에서 토큰 제거
        localStorage.removeItem(AUTH_TOKEN_NAME);
        
        // 추가 안전장치: 세션 스토리지 정리
        sessionStorage.clear();
        
        // API 캐시 초기화 (인증 관련 캐시만)
        ApiUtils.clearCache('/auth/');
      }
    } catch (error: unknown) {
      // 로그아웃 실패 시에도 클라이언트 상태는 정리
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_NAME);
        sessionStorage.clear();
      }
      
      // 오류를 다시 던져 호출자가 처리할 수 있게 함
      throw new Error(ApiUtils.getErrorMessage(error));
    }
  },

  /**
   * 세션 체크 API 호출
   * 현재 사용자의 인증 상태를 확인합니다.
   */
  async checkSession(): Promise<AuthResponse> {
    try {
      // 로그인 페이지에서는 세션 체크 생략
      if (typeof window !== 'undefined' && (
        window.location.pathname === '/login' ||
        window.location.pathname.includes('/login')
      )) {
        return { success: false, error: '로그인 페이지에서는 세션 체크를 수행하지 않습니다.' } as AuthResponse;
      }
      
      // 세션 체크 API 호출
      const response = await api.get<AuthResponse>('/auth/session');
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // 401 오류는 정상적인 로그아웃 상태로 처리
        if (error.response?.status === 401) {
          // 클라이언트 측 상태 정리 (토큰 만료)
          if (typeof window !== 'undefined') {
            localStorage.removeItem(AUTH_TOKEN_NAME);
          }
          
          return { success: false, error: '인증 만료' } as AuthResponse;
        }
        
        // 기타 오류
        const errorMessage = ApiUtils.getErrorMessage(error);
        throw new Error(errorMessage);
      }
      
      // 일반 오류
      throw error;
    }
  },

  /**
   * 사용자 등록(회원가입) API 호출
   */
  async register(userData: any): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = ApiUtils.getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * 비밀번호 재설정 요청 API 호출
   */
  async resetPasswordRequest(email: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/reset-password-request', { email });
      return response.data;
    } catch (error: unknown) {
      const errorMessage = ApiUtils.getErrorMessage(error);
      throw new Error(errorMessage);
    }
  },

  /**
   * 비밀번호 재설정 완료 API 호출
   */
  async resetPasswordComplete(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/reset-password-complete', { 
        token, 
        newPassword 
      });
      return response.data;
    } catch (error: unknown) {
      const errorMessage = ApiUtils.getErrorMessage(error);
      throw new Error(errorMessage);
    }
  }
}; 