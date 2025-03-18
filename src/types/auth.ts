export interface LoginFormData {
  email: string;
  password: string;
}

export interface SessionUser {
  id: string;
  name?: string;
  type: 'individual' | 'company';
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  message?: string;
}

export interface Session {
  userId: string;
  userType: 'individual' | 'company';
  isLoggedIn: boolean;
  expiresAt: number;
}

export interface User {
  id: string;
  username1: string;
  name?: string;
  email?: string;
  role?: string;
  profileImage?: string;
}

export interface LoginRequest {
  username1: string;
  password: string;
} 