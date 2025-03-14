import { AuthResponse } from '@/types/auth';

const BASE_URL = 'http://localhost:8081/api';

export const authService = {
  // 로그인 API 호출
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
        credentials: "include", // 쿠키를 주고받기 위해 필요
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '로그인에 실패했습니다.');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // 로그아웃 API 호출
  async logout(): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('로그아웃에 실패했습니다.');
      }
    } catch (error) {
      throw error;
    }
  },

  // 세션 체크 API 호출
  async checkSession(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/session`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '세션 확인에 실패했습니다.');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
}; 