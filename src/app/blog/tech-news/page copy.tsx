'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoading } from '@/components/layout/Loading';
import { motion } from 'framer-motion';

// 기술 뉴스 타입 정의
interface TechNews {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  thumbnail: string;
  date: string;
  views: number;
  tags: string[];
}

// 예시 기술 뉴스 데이터
const techNewsData: TechNews[] = [
  {
    id: 1,
    slug: 'apple-m4-chip',
    title: '애플 M4 칩 공개, 혁신적인 AI 성능 향상 제공',
    category: '실리콘밸리',
    excerpt: '애플이 새로운 M4 칩을 공개했습니다. 이 새로운 프로세서는 이전 세대보다 최대 40% 더 빠른 CPU와 30% 더 강력한 GPU를 갖추고 있으며 특히 AI 작업에 최적화되었습니다.',
    thumbnail: '/images/blog/tech-news/apple-m4.jpg',
    date: '2025.03.15',
    views: 1250,
    tags: ['애플', '실리콘칩', 'M4', 'AI']
  },
  {
    id: 2,
    slug: 'react-19-release',
    title: 'React 19 정식 출시, 서버 컴포넌트와 새로운 기능 대거 포함',
    category: '개발 테크',
    excerpt: 'Meta가 React 19를 정식 출시했습니다. 이번 버전에는 서버 컴포넌트의 개선과 함께 여러 새로운 기능과 성능 최적화가 포함되어 있습니다.',
    thumbnail: '/images/blog/tech-news/react-19.jpg',
    date: '2025.03.12',
    views: 980,
    tags: ['React', '프론트엔드', '웹개발', '자바스크립트']
  },
  {
    id: 3,
    slug: 'openai-gpt5-announcement',
    title: 'OpenAI, GPT-5 출시 계획 발표... "인간 수준의 추론 능력" 강조',
    category: 'AI 컬럼',
    excerpt: 'OpenAI가 GPT-5의 출시 계획을 발표했습니다. 새 모델은 인간 수준의 추론 능력을 갖추고 있다고 회사 측은 밝혔습니다.',
    thumbnail: '/images/blog/tech-news/gpt5.jpg',
    date: '2025.03.10',
    views: 2340,
    tags: ['OpenAI', 'GPT-5', '인공지능', '머신러닝']
  },
  {
    id: 4,
    slug: 'google-quantum-computer',
    title: '구글, 1000큐비트 양자 컴퓨터 달성... 양자 우위 한계 확장',
    category: '실리콘밸리',
    excerpt: '구글이 1000큐비트 양자 컴퓨터를 개발하는 데 성공했다고 발표했습니다. 이는 기존 양자 컴퓨팅의 한계를 크게 확장한 성과입니다.',
    thumbnail: '/images/blog/tech-news/quantum.jpg',
    date: '2025.03.05',
    views: 875,
    tags: ['구글', '양자컴퓨팅', '기술혁신', '연구개발']
  },
  {
    id: 5,
    slug: 'microsoft-windows-12',
    title: '마이크로소프트, Windows 12 출시... AI 통합 강화',
    category: '개발 테크',
    excerpt: '마이크로소프트가 Windows 12를 정식 출시했습니다. 인공지능 기능이 OS 전반에 통합된 것이 특징입니다.',
    thumbnail: '/images/blog/tech-news/windows12.jpg',
    date: '2025.02.28',
    views: 1540,
    tags: ['마이크로소프트', 'Windows12', '운영체제', 'AI통합']
  },
  {
    id: 6,
    slug: 'nextjs-server-actions',
    title: 'Next.js 새 업데이트로 서버 액션 개선 및 스트리밍 최적화',
    category: '개발 테크',
    excerpt: 'Vercel이 Next.js의 새 업데이트를 발표했습니다. 이번 업데이트에서는 서버 액션이 개선되고 스트리밍 기능이 최적화되었습니다.',
    thumbnail: '/images/blog/tech-news/nextjs.jpg',
    date: '2025.02.25',
    views: 920,
    tags: ['Next.js', 'Vercel', '웹개발', '프레임워크']
  }
];

// 카테고리 목록
const categories = [
  { id: 'all', label: '전체보기' },
  { id: 'dev-tech', label: '개발 테크' },
  { id: 'ai-column', label: 'AI 컬럼' },
  { id: 'silicon-valley', label: '실리콘밸리' }
];

export default function TechNewsPage() {
  const { setLoading } = useLoading();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // 로딩 상태 처리
  useEffect(() => {
    setLoading(true, '기술 뉴스 페이지 로딩 중');
    
    // 데이터 준비 후 로딩 종료
    setLoading(false);
  }, [setLoading]);
  
  // 카테고리별 필터링
  const filteredNews = React.useMemo(() => {
    if (activeCategory === 'all') return techNewsData;
    
    const categoryMapping: Record<string, string> = {
      'dev-tech': '개발 테크',
      'ai-column': 'AI 컬럼',
      'silicon-valley': '실리콘밸리'
    };
    
    return techNewsData.filter(news => 
      news.category === categoryMapping[activeCategory]
    );
  }, [activeCategory]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Tech News</h1>
        <p className="text-gray-600">
          최신 기술 트렌드와 소식을 빠르게 확인하세요. 개발 테크, AI 소식, 실리콘밸리 트렌드를 한 곳에서 만나볼 수 있습니다.
        </p>
      </div>
      
      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      {/* 뉴스 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((news) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <Link href={`/blog/tech-news/${news.category.toLowerCase().replace(' ', '-')}/${news.slug}`}>
              <div className="relative h-48">
                <Image
                  src={news.thumbnail}
                  alt={news.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {news.category}
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2 hover:text-blue-600 transition-colors">
                  {news.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {news.excerpt}
                </p>
                
                {/* 태그 목록 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {news.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{news.date}</span>
                  <span>조회수 {news.views}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* 뉴스가 없을 경우 메시지 */}
      {filteredNews.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">선택한 카테고리에 뉴스가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
