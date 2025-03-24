'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLoading } from '@/components/layout/Loading';
import TechNewsList from '@/components/tech-news/TechNewsList';
import { getAllTechNews, getLatestTechNews, getPopularTechNews } from '@/services/techNewsService';

export default function TechNewsPage() {
  const { setLoading } = useLoading();
  const allNews = getAllTechNews();
  const latestNews = getLatestTechNews(3);
  const popularNews = getPopularTechNews(3);

  // 페이지 로딩 효과
  useEffect(() => {
    // 데이터를 먼저 로드
    setLoading(true, '기술 뉴스를 불러오는 중...');
    
    // 데이터가 준비되면 즉시 로딩 상태 해제
    setLoading(false);
    
    return () => {
      // 컴포넌트 언마운트 시 로딩 상태 확실히 해제
      setLoading(false);
    };
  }, [setLoading]);

  return (
    <div className="space-y-12">
      {/* 헤드라인 섹션 */}
      <section className="relative rounded-xl overflow-hidden">
        <div className="aspect-[21/9] relative">
          <Image
            src="/images/tech-news/headline-bg.jpg"
            alt="최신 기술 트렌드"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white z-10 max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              최신 기술 트렌드와 소식을 한눈에
            </h2>
            <p className="text-sm md:text-base text-gray-200 mb-4">
              개발 테크부터 실리콘벨리 소식, AI 컬럼까지 전문가들의 인사이트를 만나보세요.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/tech-news/dev-tech"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
              >
                개발 테크 보기
              </Link>
              <Link
                href="/tech-news/ai-column"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition-colors"
              >
                AI 컬럼 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 최신 뉴스 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">최신 뉴스</h2>
          <Link
            href="/tech-news"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            전체보기
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((news) => (
            <Link
              key={news.id}
              href={`/tech-news/${news.category === '개발 테크' ? 'dev-tech' : news.category === '실리콘밸리' ? 'silicon-valley' : 'ai-column'}/${news.id}`}
              className="group"
            >
              <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                <Image
                  src={news.thumbnail || '/images/tech-news/default-thumbnail.jpg'}
                  alt={news.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {news.category}
                </div>
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {news.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{news.date}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 인기 뉴스 섹션 */}
      <section className="bg-gray-50 py-8 px-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">인기 뉴스</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularNews.map((news, index) => (
            <Link
              key={news.id}
              href={`/tech-news/${news.category === '개발 테크' ? 'dev-tech' : news.category === '실리콘밸리' ? 'silicon-valley' : 'ai-column'}/${news.id}`}
              className="flex items-center gap-4 group"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-full border border-gray-200 text-blue-600 font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">조회수 {news.views}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 전체 뉴스 목록 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">전체 뉴스</h2>
        <TechNewsList items={allNews} />
      </section>
    </div>
  );
} 