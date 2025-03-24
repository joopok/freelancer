'use client';

import { useEffect } from 'react';
import { useLoading } from '@/components/layout/Loading';
import TechNewsList from '@/components/tech-news/TechNewsList';
import { getTechNewsByCategory } from '@/services/techNewsService';

export default function DevTechPage() {
  const { setLoading } = useLoading();
  const devTechNews = getTechNewsByCategory('개발 테크');

  // 페이지 로딩 효과
  useEffect(() => {
    // 데이터를 먼저 로드
    setLoading(true, '개발 테크 뉴스를 불러오는 중...');
    
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">개발 테크</h1>
        <p className="text-gray-600">
          최신 개발 기술과 프로그래밍 트렌드에 대한 인사이트를 제공합니다.
        </p>
      </div>
      
      <TechNewsList 
        items={devTechNews} 
        categories={['전체', '개발 테크']}
      />
    </div>
  );
} 