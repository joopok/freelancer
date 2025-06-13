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
  role?: string;
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

export default function FreelancerInterviewPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const roles = useMemo(() => [
    '프론트엔드 개발자',
    '백엔드 개발자',
    'UI/UX 디자이너',
    '프로젝트 매니저',
    '모바일 앱 개발자',
    '데이터 엔지니어'
  ], []);

  // 임시 데이터 생성 - useMemo를 사용하여 한 번만 생성
  const generatePosts = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => ({
      id: `interview-${i + 1}`,
      title: `[프리랜서 인터뷰] ${roles[i % roles.length]}의 성공 스토리`,
      excerpt: '다양한 프로젝트 경험과 노하우를 가진 프리랜서와의 인터뷰를 통해 실제 현장의 이야기를 들어봅니다.',
      category: '프리랜서 인터뷰',
      thumbnail: `/images/blog/post-${(i % 4) + 1}.jpg`,
      date: new Date(2024, 2, i + 1).toLocaleDateString(),
      author: ['김프리', '이랜서', '박개발'][i % 3],
      views: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 1000) + 100,
      role: roles[i % roles.length]
    }));
  }, [roles]);

  // 초기 데이터 설정
  useEffect(() => {
    setPosts(generatePosts);
    setLoading(false);
  }, [generatePosts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 카테고리 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900">프리랜서 인터뷰</h1>
          <p className="mt-2 text-lg text-gray-600">
            성공적인 프리랜서들의 생생한 경험과 인사이트를 만나보세요.
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
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 block"
                >
                  <div className="relative h-48">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    {post.role && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                        {post.role}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-600">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {post.date}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
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