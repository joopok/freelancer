import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// CORS 설정을 위한 헤더 옵션
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // 모든 도메인에서 접근 허용 (프로덕션에서는 특정 도메인으로 제한하세요)
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24시간 (초 단위)
};

/**
 * API 라우트의 CORS 처리를 위한 핸들러
 * OPTIONS 요청에 대해 CORS 헤더를 포함한 빈 응답을 반환합니다.
 */
export function corsOptionsHandler() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * 응답에 CORS 헤더를 추가하는 함수
 */
export function addCorsHeaders(response: NextResponse) {
  // 모든 CORS 헤더를 응답에 추가
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
} 