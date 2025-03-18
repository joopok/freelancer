'use client';

import { useEffect } from 'react';
import { useLoading } from '@/components/layout/Loading';

export default function BlogPostsSlot() {
  const { setLoading } = useLoading();
  
  // 페이지 로드 시 로딩 상태 해제
  useEffect(() => {
    // 로딩 상태 해제
    setLoading(false);
  }, [setLoading]);

  return null; // 병렬 라우트용 슬롯이므로 UI는 렌더링하지 않음
} 