import { NextResponse } from 'next/server';
import { getSession } from '@/utils/session';
import { corsOptionsHandler, addCorsHeaders } from '../../cors';

// OPTIONS 요청 처리 - CORS 프리플라이트 요청 대응
export async function OPTIONS() {
  return corsOptionsHandler();
}

export async function GET(request: Request) {
  try {
    // 세션 정보 가져오기
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { 
          success: false, 
          error: '로그인이 필요합니다.' 
        },
        { status: 401 }
      );
    }

    // 세션에서 사용자 정보 반환
    const response = NextResponse.json({
      success: true,
      user: {
        id: session.userId,
        type: session.userType,
        isLoggedIn: session.isLoggedIn,
      }
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