'use client';

import { useEffect } from 'react';
import { useLoading } from '@/components/layout/Loading';
import TechNewsList from '@/components/tech-news/TechNewsList';
import { getTechNewsByCategory } from '@/services/techNewsService';

export default function AiColumnPage() {
  const { setLoading } = useLoading();
  const aiColumnNews = getTechNewsByCategory('AI 컬럼');

  // 페이지 로딩 효과
  useEffect(() => {
    // 데이터를 먼저 로드
    setLoading(true, 'AI 컬럼을 불러오는 중...');
    
    // 데이터가 준비되면 즉시 로딩 상태 해제
    setLoading(false);
    
    return () => {
      // 컴포넌트 언마운트 시 로딩 상태 확실히 해제
      setLoading(false);
    };
  }, [setLoading]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI 컬럼</h1>
        <p className="text-gray-600">
          인공지능 기술과 트렌드에 대한 전문가들의 인사이트를 제공합니다.
        </p>
      </div>
      
      <TechNewsList 
        items={aiColumnNews} 
        categories={['전체', 'AI 컬럼']}
      />
    </div>
  );
} 