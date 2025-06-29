'use client';

import { useEffect } from 'react';
import { useLoading } from '@/components/layout/Loading';
import TechNewsList from '@/components/tech-news/TechNewsList';
import { getTechNewsByCategory } from '@/services/techNewsService';

export default function SiliconValleyPage() {
  const { setLoading } = useLoading();
  const siliconValleyNews = getTechNewsByCategory('실리콘밸리');

  // 페이지 로딩 효과
  useEffect(() => {
    // 데이터를 먼저 로드
    setLoading(true, '실리콘밸리 뉴스를 불러오는 중...');
    
    // 데이터가 준비되면 즉시 로딩 상태 해제
    setLoading(false);
    
    return () => {
      // 컴포넌트 언마운트 시 로딩 상태 확실히 해제
      setLoading(false);
    };
  }, [setLoading]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">실리콘밸리</h1>
        <p className="text-gray-600 dark:text-gray-300">
          실리콘밸리의 최신 소식과 트렌드, 스타트업 동향을 소개합니다.
        </p>
      </div>
      
      <TechNewsList 
        items={siliconValleyNews} 
        categories={['전체', '실리콘밸리']}
      />
    </div>
  );
} 