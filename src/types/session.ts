export interface Session {
  userId: string;
  userType: 'individual' | 'company';
  isLoggedIn: boolean;
  expiresAt: number;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  type: 'individual' | 'company';
} 