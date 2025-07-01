export interface LoginFormData {
  email: string;
  password: string;
}

export interface SessionUser {
  id: string;
  username?: string;
  name?: string;
  email?: string;
  password?: string;
  fullName?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
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
  id: string;
  userId: string;
  userType: 'individual' | 'company';
  isLoggedIn: boolean;
  created: number;
  expires: number;
  lastActive: number;
  userData?: {
    name?: string;
    email?: string;
    role?: string;
  };
}

export interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
  password?: string;
  fullName?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  profileImage?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
} 