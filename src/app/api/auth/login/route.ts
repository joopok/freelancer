import { NextResponse } from 'next/server';
import { corsOptionsHandler, addCorsHeaders } from '../../cors';
import { generateToken } from '@/utils/jwt';

// OPTIONS 요청 처리 - CORS 프리플라이트 요청 대응
export async function OPTIONS() {
  return corsOptionsHandler();
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 임시 로그인 검증 (실제로는 DB 조회 필요)
    if (data.username1 === 'admin' && data.password === 'password') {
      const user = {
        id: '1',
        name: '관리자',
        email: 'admin@example.com',
        type: 'individual' as const,
      };

      // JWT 토큰 생성
      const token = generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type
      });
      
      console.log('로그인 성공, JWT 토큰 생성:', token.substring(0, 15) + '...');
      
      const response = NextResponse.json({ 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
        },
        token: token // JWT 토큰 응답에 포함
      });
      
      return addCorsHeaders(response);
    }

    const errorResponse = NextResponse.json(
      { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
      { status: 401 }
    );
    
    return addCorsHeaders(errorResponse);
  } catch (error) {
    console.error('Login error:', error);
    const errorResponse = NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
    
    return addCorsHeaders(errorResponse);
  }
} 