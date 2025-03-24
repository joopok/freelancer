'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLoading } from '@/components/layout/Loading';
import { getTechNewsById } from '@/services/techNewsService';

export default function TechNewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { setLoading } = useLoading();
  
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const newsItem = getTechNewsById(id);
  
  useEffect(() => {
    // 데이터를 먼저 로드
    setLoading(true, '뉴스를 불러오는 중...');
    
    // 데이터가 준비되면 즉시 로딩 상태 해제
    setLoading(false);
    
    return () => {
      // 컴포넌트 언마운트 시 로딩 상태 확실히 해제
      setLoading(false);
    };
  }, [setLoading]);
  
  // 뉴스 아이템이 없으면 404 페이지로 리다이렉트
  useEffect(() => {
    if (!newsItem) {
      router.push('/404');
    }
  }, [newsItem, router]);
  
  if (!newsItem) {
    return null;
  }
  
  // 카테고리 URL 변환
  const getCategoryPath = (category: string) => {
    switch (category) {
      case '개발 테크':
        return 'dev-tech';
      case '실리콘밸리':
        return 'silicon-valley';
      case 'AI 컬럼':
        return 'ai-column';
      default:
        return '';
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* 뒤로가기 링크 */}
      <Link
        href={`/tech-news/${getCategoryPath(newsItem.category)}`}
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6"
      >
        <svg 
          className="w-4 h-4 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {newsItem.category} 목록으로 돌아가기
      </Link>
      
      {/* 헤더 */}
      <header className="mb-8">
        <div className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full mb-3">
          {newsItem.category}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {newsItem.title}
        </h1>
        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {newsItem.date}
          </div>
          <div>
            작성자: {newsItem.author || '관리자'}
          </div>
          <div className="flex items-center">
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            조회 {newsItem.views || 0}
          </div>
        </div>
      </header>
      
      {/* 썸네일 이미지 */}
      <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
        <Image
          src={newsItem.thumbnail || '/images/tech-news/default-thumbnail.jpg'}
          alt={newsItem.title}
          fill
          className="object-cover"
        />
      </div>
      
      {/* 뉴스 내용 */}
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          {newsItem.excerpt}
        </p>
        <div 
          dangerouslySetInnerHTML={{ __html: newsItem.content }} 
          className="text-gray-800"
        />
      </div>
      
      {/* 태그 */}
      {newsItem.tags && newsItem.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 mb-3">태그</h2>
          <div className="flex flex-wrap gap-2">
            {newsItem.tags.map(tag => (
              <span 
                key={tag} 
                className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* 공유 버튼 */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-sm font-medium text-gray-500 mb-3">공유하기</h2>
        <div className="flex gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 