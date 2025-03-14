import { NextResponse } from 'next/server';
import { createSession, setSessionCookie } from '@/utils/session';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 임시 로그인 검증 (실제로는 DB 조회 필요)
    if (data.id === 'admin' && data.password === 'password') {
      const user = {
        id: '1',
        name: '관리자',
        email: 'admin@example.com',
        type: 'individual' as const,
      };

      const session = await createSession(user.id, user.type as 'individual' | 'company');
      setSessionCookie(session);

      return NextResponse.json({ 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
        }
      });
    }

    return NextResponse.json(
      { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 