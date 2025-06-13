import { NextResponse } from 'next/server';
import { corsOptionsHandler, addCorsHeaders } from '../../cors';
import { decodeToken, verifyToken } from '@/utils/jwt';

// OPTIONS 요청 처리 - CORS 프리플라이트 요청 대응
export async function OPTIONS() {
  return corsOptionsHandler();
}

export async function GET(request: Request) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          success: false, 
          error: '인증 토큰이 제공되지 않았습니다.' 
        },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // 토큰 검증
    if (!verifyToken(token)) {
      return NextResponse.json(
        { 
          success: false, 
          error: '유효하지 않은 인증 토큰입니다.' 
        },
        { status: 401 }
      );
    }
    
    // 토큰에서 사용자 정보 추출
    const payload = decodeToken(token);
    if (!payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: '토큰에서 사용자 정보를 추출할 수 없습니다.' 
        },
        { status: 401 }
      );
    }
    
    // 세션에서 사용자 정보 반환 (User 인터페이스에 맞게 조정)
    const response = NextResponse.json({
      success: true,
      user: {
        id: payload.id,
        username1: payload.id, // 필수 필드이므로 id로 대체
        name: payload.name || '',
        email: payload.email || '',
        role: payload.roles?.[0] || payload.role || '', // JWT 페이로드의 roles 배열 또는 role 필드 사용
        type: payload.type || 'individual'
      },
      token: token // 토큰도 함께 반환
    });
    
    return addCorsHeaders(response);

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '세션 확인 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 