import { NextResponse } from 'next/server';
import { deleteSession } from '@/utils/session';
import { corsOptionsHandler, addCorsHeaders } from '../../cors';

// OPTIONS 요청 처리 - CORS 프리플라이트 요청 대응
export async function OPTIONS() {
  return corsOptionsHandler();
}

export async function POST() {
  await deleteSession();
  const response = NextResponse.json({ success: true });
  return addCorsHeaders(response);
} 