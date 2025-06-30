import { NextResponse } from 'next/server';
import { deleteSession } from '@/utils/session';
import { corsOptionsHandler, addCorsHeaders } from '../../cors';

// OPTIONS 요청 처리 - CORS 프리플라이트 요청 대응
export async function OPTIONS() {
  return corsOptionsHandler();
}

export async function POST() {
  // 클라이언트 측에서 토큰을 삭제하므로, 서버에서는 세션만 삭제
  await deleteSession();
  const response = NextResponse.json({ success: true, message: '로그아웃 되었습니다.' });
  return addCorsHeaders(response);
} 