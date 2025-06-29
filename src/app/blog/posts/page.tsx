'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLoading } from '@/components/layout/Loading';

export default function BlogPostsPage() {
  const { setLoading } = useLoading();
  
  // 페이지 로드 시 로딩 효과 표시
  useEffect(() => {
    // 3초 후에 로딩 상태 해제
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">모든 블로그 포스트</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          다양한 주제의 포스트를 확인하세요.
        </p>
        
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              setLoading(true);
              window.location.href = '/blog';
            }}
          >
            블로그 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 