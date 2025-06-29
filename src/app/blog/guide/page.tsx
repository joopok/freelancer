'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  thumbnail: string;
  date: string;
  author: string;
  views: number;
  likes: number;
}

// 숫자 포맷팅 함수 추가
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export default function FreelancerGuidePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // 임시 데이터 생성 - useMemo를 사용하여 한 번만 생성
  const generatePosts = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => ({
      id: `guide-${i + 1}`,
      title: `[프리랜서 가이드] ${i + 1}번째 가이드 포스트`,
      excerpt: '프리랜서로 성공하기 위한 핵심 가이드라인과 실전 팁을 소개합니다.',
      category: '프리랜서 가이드',
      thumbnail: `/images/blog/post-${(i % 4) + 1}.jpg`,
      date: new Date(2024, 2, i + 1).toLocaleDateString(),
      author: ['김프리', '이랜서', '박개발'][i % 3],
      views: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 1000) + 100,
    }));
  }, []);

  // 초기 데이터 설정
  useEffect(() => {
    setPosts(generatePosts);
    setLoading(false);
  }, [generatePosts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 카테고리 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white dark:text-white">프리랜서 가이드</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 dark:text-gray-300">
            프리랜서로 성공하기 위한 실용적인 가이드와 조언을 제공합니다.
          </p>
        </div>
      </div>

      {/* 블로그 포스트 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href={`/blog/posts/${post.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/50 hover:shadow-md dark:hover:shadow-gray-900/70 transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700 block transition-colors duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {post.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>{post.author}</span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center group">
                          <svg 
                            className="w-4 h-4 mr-1 transition-colors group-hover:text-blue-500" 
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
                          <span className="group-hover:text-blue-500 transition-colors">
                            {formatNumber(post.views)}
                          </span>
                        </span>
                        <span className="flex items-center group">
                          <svg 
                            className="w-4 h-4 mr-1 transition-colors group-hover:text-red-500" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          <span className="group-hover:text-red-500 transition-colors">
                            {formatNumber(post.likes)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 