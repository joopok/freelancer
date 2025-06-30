import { NextResponse } from 'next/server';
import { corsOptionsHandler, addCorsHeaders } from '../../cors';
import { generateToken } from '@/utils/jwt';
import { UserService } from '@/services/database';
import bcrypt from 'bcryptjs';
import { createSession } from '@/utils/session';

// OPTIONS 요청 처리 - CORS 프리플라이트 요청 대응
export async function OPTIONS() {
  return corsOptionsHandler();
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { username, password } = data;

    if (!username || !password) {
      const errorResponse = NextResponse.json(
        { success: false, error: '아이디와 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
      return addCorsHeaders(errorResponse);
    }

    // 1. 사용자 조회 (username 필드를 username으로 매핑)
    const user = await UserService.findByUsername(username);

    if (!user) {
      const errorResponse = NextResponse.json(
        { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
      return addCorsHeaders(errorResponse);
    }

    // 2. 비밀번호 검증
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      const errorResponse = NextResponse.json(
        { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
      return addCorsHeaders(errorResponse);
    }

    // 3. JWT 토큰 생성
    const token = generateToken({
      id: user.id.toString(),
      name: user.full_name || user.username,
      email: user.email,
      type: user.role === 'client' ? 'company' : 'individual',
      role: user.role
    });

    // 4. 세션 생성 (선택 사항: JWT만으로 충분할 수 있음)
    await createSession(user.id.toString(), user.role === 'client' ? 'company' : 'individual');

    // 5. 마지막 로그인 시간 업데이트
    await UserService.updateLastLogin(user.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id.toString(),
        username: user.username,
        name: user.full_name || user.username,
        email: user.email,
        type: user.role === 'client' ? 'company' : 'individual',
        role: user.role
      },
      token: token
    });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Login error:', error);
    const errorResponse = NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
    return addCorsHeaders(errorResponse);
  }
} 