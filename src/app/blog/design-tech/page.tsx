'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoading } from '@/components/layout/Loading';
import { motion } from 'framer-motion';
import BlogMenuSearch from '@/components/blog/BlogMenuSearch';

// 블로그 게시물 타입 정의
interface BlogPost {
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

// 숫자 포맷팅 함수
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// 디자인 테크 관련 블로그 게시물 데이터
const generateDesignPosts = (): BlogPost[] => {
  const titles = [
    '2025년 UI/UX 디자인 트렌드 총정리',
    'Figma vs Sketch: 디자인 툴 완벽 비교',
    '다크모드 디자인 시 고려해야 할 10가지',
    '모바일 퍼스트 디자인의 핵심 원칙',
    '디자인 시스템 구축하기: 실전 가이드',
    '색상 이론과 웹 디자인에서의 활용법',
    '타이포그래피 기초: 가독성 높이는 방법',
    '인터랙션 디자인의 모든 것',
    '디자인 포트폴리오 제작 완벽 가이드',
    '사용자 경험(UX) 리서치 방법론',
    'Adobe XD를 활용한 프로토타이핑',
    '반응형 웹 디자인의 베스트 프랙티스',
    '디자인 협업 도구 활용 전략',
    '미니멀리즘 디자인의 힘',
    '애니메이션과 마이크로 인터랙션',
    '디자인 시스템과 컴포넌트 라이브러리',
    'AI 시대의 디자인 도구 활용법',
    '접근성을 고려한 인클루시브 디자인',
    '브랜딩과 비주얼 아이덴티티',
    '디자인 비평과 피드백 문화'
  ];

  const excerpts = [
    '2025년에 주목해야 할 UI/UX 디자인 트렌드를 총정리했습니다. 뉴모피즘, 글래스모피즘을 넘어 새로운 디자인 패러다임을 소개합니다.',
    '디자인 협업 도구의 양대 산맥, Figma와 Sketch를 상세히 비교합니다. 각 도구의 장단점과 적합한 사용 케이스를 알아보세요.',
    '다크모드는 이제 선택이 아닌 필수입니다. 효과적인 다크모드 디자인을 위한 색상 선택, 대비, 가독성 등 핵심 고려사항을 정리했습니다.',
    '모바일 기기가 주요 접점이 된 시대, 모바일 퍼스트 디자인의 중요성과 실전 적용 방법을 상세히 설명합니다.',
    '일관성 있는 제품 경험을 위한 디자인 시스템 구축 방법을 단계별로 안내합니다. 실제 사례와 함께 배워보세요.',
    '색상은 디자인의 핵심 요소입니다. 색상 이론의 기초부터 웹 디자인에서의 실제 활용 방법까지 깊이 있게 다룹니다.',
    '좋은 타이포그래피는 좋은 디자인의 시작입니다. 가독성을 높이고 사용자 경험을 개선하는 타이포그래피 원칙을 소개합니다.',
    '정적인 디자인을 넘어 사용자와 상호작용하는 인터랙션 디자인의 원리와 구현 방법을 알아봅니다.',
    '취업과 이직을 위한 완벽한 디자인 포트폴리오 제작 가이드. 포트폴리오 구성부터 프레젠테이션까지 모든 것을 다룹니다.',
    'UX 디자인의 핵심은 사용자 이해입니다. 효과적인 사용자 리서치 방법론과 인사이트 도출 방법을 소개합니다.',
    'Adobe XD를 활용한 효율적인 프로토타이핑 방법을 소개합니다. 기초부터 고급 기능까지 단계별로 학습해보세요.',
    '다양한 디바이스에서 최적의 경험을 제공하는 반응형 웹 디자인의 핵심 원칙과 구현 방법을 알아봅니다.',
    '원격 근무 시대의 효율적인 디자인 협업을 위한 도구 활용 전략과 팁을 공유합니다.',
    '적은 것이 더 많은 것이다. 미니멀리즘 디자인의 철학과 실제 적용 방법을 살펴봅니다.',
    '사용자 경험을 풍부하게 만드는 애니메이션과 마이크로 인터랙션 디자인 기법을 소개합니다.',
    '확장 가능하고 유지보수가 쉬운 디자인 시스템과 컴포넌트 라이브러리 구축 방법을 알아봅니다.',
    'AI 도구를 활용한 디자인 워크플로우 개선 방법과 창의적인 활용 사례를 소개합니다.',
    '모든 사용자를 위한 디자인. 접근성을 고려한 인클루시브 디자인의 원칙과 실천 방법을 다룹니다.',
    '강력한 브랜드 아이덴티티 구축을 위한 비주얼 디자인 전략과 일관성 유지 방법을 소개합니다.',
    '건설적인 디자인 비평 문화 만들기. 효과적인 피드백 주고받기와 디자인 개선 프로세스를 알아봅니다.'
  ];

  const tagSets = [
    ['UI/UX', '디자인트렌드', '2025트렌드', '사용자경험'],
    ['Figma', 'Sketch', '디자인툴', '협업도구'],
    ['다크모드', 'UI디자인', '색상이론', '가독성'],
    ['모바일디자인', '반응형', 'UX', '모바일퍼스트'],
    ['디자인시스템', '컴포넌트', '일관성', 'UI패턴'],
    ['색상이론', '색채학', '웹디자인', '시각디자인'],
    ['타이포그래피', '폰트', '가독성', 'UI디자인'],
    ['인터랙션', '애니메이션', 'UX', '마이크로인터랙션'],
    ['포트폴리오', '취업준비', '이직', '디자이너'],
    ['UX리서치', '사용자조사', '인사이트', '디자인프로세스'],
    ['AdobeXD', '프로토타이핑', '와이어프레임', 'UI디자인'],
    ['반응형디자인', '미디어쿼리', 'CSS', '웹디자인'],
    ['협업', '디자인도구', '팀워크', '커뮤니케이션'],
    ['미니멀리즘', '심플디자인', 'UI', '사용성'],
    ['애니메이션', '모션디자인', '인터랙션', 'CSS애니메이션'],
    ['디자인시스템', '컴포넌트라이브러리', 'UI킷', '재사용성'],
    ['AI디자인', '자동화', '효율성', '디자인도구'],
    ['접근성', '인클루시브', 'a11y', '웹표준'],
    ['브랜딩', '비주얼아이덴티티', 'CI/BI', '브랜드디자인'],
    ['디자인비평', '피드백', '커뮤니케이션', '성장']
  ];

  const posts: BlogPost[] = [];
  const unsplashImages = [
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1561069934-eee225952461?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = 0; i < 20; i++) {
    const year = 2024 + Math.floor(Math.random() * 2);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const views = Math.floor(Math.random() * 10000) + 500;
    
    posts.push({
      id: i + 1,
      slug: `design-tech-post-${i + 1}`,
      title: titles[i % titles.length],
      category: '디자인 테크',
      excerpt: excerpts[i % excerpts.length],
      thumbnail: unsplashImages[i % unsplashImages.length],
      date: `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`,
      views: views,
      tags: tagSets[i % tagSets.length]
    });
  }
  
  return posts;
};

// 블로그 게시물 데이터 생성
const blogPosts = generateDesignPosts();

// HOT 키워드
const hotKeywords = [
  'UI/UX', '다크모드', 'Figma', '디자인시스템', '포트폴리오', 
  '타이포그래피', '반응형디자인', '색상이론', 'AI디자인'
];

export default function DesignTechPage() {
  const { setLoading } = useLoading();
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 로딩 상태 처리
  React.useEffect(() => {
    setLoading(true, '디자인 테크 페이지 로딩 중');
    
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [setLoading]);
  
  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = () => {
    setVisiblePosts(prev => Math.min(prev + 10, blogPosts.length));
  };
  
  // 최적화를 위해 데이터 메모이제이션
  const currentPosts = useMemo(() => blogPosts.slice(0, visiblePosts), [visiblePosts]);
  const popularPost = useMemo(() => blogPosts.find(post => post.id === 3), []);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Blog. 디자인 테크</h1>
          <p className="text-gray-600 dark:text-gray-300">
            UI/UX 디자인, 비주얼 디자인, 프로덕트 디자인 등 디자인 분야의 최신 트렌드와 실무 노하우를 공유합니다. 
            디자인 도구 활용법부터 포트폴리오 제작까지 디자이너를 위한 실용적인 정보를 제공합니다.
          </p>
        </div>
              
        <BlogMenuSearch />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 콘텐츠 영역 */}
          <div className="lg:col-span-2 space-y-6">
            {currentPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative">
                    <Link href={`/blog/${post.slug}`} className="block aspect-video md:aspect-auto md:h-full relative">
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-600 animate-pulse absolute"></div>
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        width={400}
                        height={225}
                        className="object-cover w-full h-full relative z-10"
                        unoptimized={false}
                        loading="eager"
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
                        priority={index < 3}
                      />
                    </Link>
                  </div>
                  <div className="md:w-2/3 p-5">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-2">{post.category}</div>
                    <Link href={`/blog/${post.slug}`} className="block">
                      <h2 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-900 dark:text-white">{post.title}</h2>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    
                    {/* 태그 목록 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, idx) => (
                        <Link href={`/blog/tag/${tag}`} key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          #{tag}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{post.date}</span>
                      <span>조회수 {post.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* 더보기 버튼 */}
            {visiblePosts < blogPosts.length && (
              <div className="flex justify-center mt-8">
                <button 
                  onClick={handleLoadMore}
                  className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium flex items-center gap-2"
                >
                  더 보기
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* 모든 게시물을 다 표시했을 때 메시지 */}
            {visiblePosts >= blogPosts.length && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                모든 게시물을 확인하셨습니다.
              </div>
            )}
          </div>
          
          {/* 사이드바 영역 */}
          <div className="space-y-6">
            {/* 인기 포스트 */}
            {popularPost && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">1</div>
                  <Link href={`/blog/${popularPost.slug}`} className="block aspect-video relative">
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-600 animate-pulse absolute"></div>
                    <Image
                      src={popularPost.thumbnail}
                      alt={popularPost.title}
                      width={400}
                      height={225}
                      className="object-cover w-full h-full relative z-10"
                      unoptimized={false}
                      loading="eager"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
                      priority={true}
                    />
                  </Link>
                </div>
                <div className="p-4">
                  <Link href={`/blog/${popularPost.slug}`} className="block">
                    <h3 className="font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-2 text-gray-900 dark:text-white">{popularPost.title}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{popularPost.excerpt}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{popularPost.date}</span>
                    <Link href={`/blog/${popularPost.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      자세히 보기
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* HOT 키워드 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-bold flex items-center text-gray-900 dark:text-white">
                  <span className="text-red-500 mr-1">🎨</span> HOT 키워드
                </h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {hotKeywords.map((keyword, index) => (
                    <Link 
                      href={`/blog/tag/${keyword}`}
                      key={index}
                      className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                        index % 4 === 0 ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                        index % 4 === 1 ? 'bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300' :
                        index % 4 === 2 ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' :
                        'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                      }`}
                    >
                      #{keyword}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 카테고리별 게시물 */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-bold text-gray-900 dark:text-white">카테고리별 게시물</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">UI/UX 디자인</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">그래픽 디자인</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">38</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">브랜딩</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">27</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">디자인 도구</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">32</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">포트폴리오</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">19</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}