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
  user?: SessionUser;
  error?: string;
}

export interface Session {
  userId: string;
  userType: 'individual' | 'company';
  isLoggedIn: boolean;
  expiresAt: number;
} 