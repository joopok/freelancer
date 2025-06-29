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

// 물류 테크 관련 블로그 게시물 데이터
const generateLogisticsPosts = (): BlogPost[] => {
  const titles = [
    '스마트 물류 시스템 구축으로 효율성 극대화',
    'WMS(창고관리시스템) 도입 완전 가이드',
    '라스트마일 배송 최적화 전략',
    '물류 자동화 기술의 현재와 미래',
    '공급망 가시성 확보와 실시간 추적',
    '크로스도킹 시스템 도입과 운영',
    '물류 IoT 센서 활용한 스마트 모니터링',
    '배송 루트 최적화 알고리즘 이해하기',
    '물류센터 레이아웃 설계 최적화',
    '재고 관리와 수요 예측 시스템',
    '콜드체인 물류 관리의 모든 것',
    '물류 로봇과 자동화 장비 도입',
    '물류 데이터 분석과 KPI 관리',
    '운송관리시스템(TMS) 선택과 운영',
    '물류 비용 관리와 최적화 방법',
    '국제물류와 관세청 시스템 연동',
    '물류 보안과 위험 관리 체계',
    '지속가능한 그린 물류 전략',
    '물류 파트너십과 3PL 관리',
    'AI와 빅데이터를 활용한 물류 혁신'
  ];

  const excerpts = [
    '디지털 기술을 활용한 스마트 물류 시스템 구축 방법과 도입 효과, 투자 대비 성과를 실제 사례를 통해 상세히 분석합니다.',
    '창고 운영의 효율성을 극대화하는 WMS 시스템 선택부터 구축, 운영까지의 전 과정을 단계별로 안내합니다.',
    '고객 만족도를 높이고 배송비용을 절감하는 라스트마일 배송 전략과 혁신적인 배송 모델을 소개합니다.',
    '물류센터 자동화를 위한 AGV, 로봇 피킹, 자동 분류 시스템 등 최신 기술 동향과 도입 사례를 살펴봅니다.',
    '공급망 전체의 투명성을 확보하고 실시간 추적이 가능한 시스템 구축 방법과 기술을 소개합니다.',
    '재고 없는 물류센터 운영을 위한 크로스도킹 시스템의 설계, 구축, 운영 노하우를 공유합니다.',
    'IoT 센서와 스마트 디바이스를 활용한 물류 프로세스 모니터링과 데이터 수집 방법을 알아봅니다.',
    '배송 시간과 비용을 최소화하는 최적 경로 탐색 알고리즘의 원리와 적용 방법을 설명합니다.',
    '물류센터의 생산성을 극대화하는 레이아웃 설계 원칙과 공간 활용 최적화 방법을 제시합니다.',
    '정확한 수요 예측을 통한 재고 최적화와 비용 절감을 위한 시스템 구축 방법을 안내합니다.',
    '온도에 민감한 상품의 품질 보전을 위한 콜드체인 물류 시스템 설계와 관리 방법을 소개합니다.',
    '물류센터 내 작업 자동화를 위한 로봇 기술과 도입 시 고려사항, 투자 효과를 분석합니다.',
    '물류 성과를 측정하고 개선하기 위한 핵심 지표 설정과 데이터 기반 의사결정 방법을 제시합니다.',
    '운송 계획부터 실행, 모니터링까지 통합 관리하는 TMS 시스템 선택과 활용 가이드를 제공합니다.',
    '물류 전 과정의 비용 구조를 분석하고 최적화를 통한 비용 절감 방안을 상세히 설명합니다.',
    '수출입 물류의 효율성을 높이는 관세청 시스템 연동과 국제물류 최적화 방법을 안내합니다.',
    '물류 과정에서 발생할 수 있는 다양한 위험 요소와 예방, 대응 방안을 체계적으로 정리합니다.',
    '환경 친화적인 물류 운영을 위한 그린 물류 전략과 실천 방안, 효과 측정 방법을 소개합니다.',
    '3PL 업체 선정부터 관리, 성과 평가까지 효과적인 물류 파트너십 구축 방법을 제시합니다.',
    'AI와 빅데이터 기술을 활용한 물류 최적화 사례와 미래 물류 기술 트렌드를 분석합니다.'
  ];

  const tagSets = [
    ['스마트물류', '물류시스템', '디지털물류', '물류효율화'],
    ['WMS', '창고관리', '재고관리', '물류시스템'],
    ['라스트마일', '배송최적화', '물류배송', '고객서비스'],
    ['물류자동화', 'AGV', '로봇물류', '자동화시스템'],
    ['공급망관리', 'SCM', '실시간추적', '물류가시성'],
    ['크로스도킹', '물류센터', '재고없는물류', '효율운영'],
    ['IoT물류', '스마트센서', '물류모니터링', '데이터수집'],
    ['배송루트', '경로최적화', '물류알고리즘', '배송효율'],
    ['물류센터설계', '레이아웃최적화', '공간활용', '생산성향상'],
    ['재고관리', '수요예측', '재고최적화', '비용절감'],
    ['콜드체인', '온도관리', '물류품질', '신선물류'],
    ['물류로봇', '자동화장비', 'AGV', '무인화'],
    ['물류분석', 'KPI관리', '데이터분석', '성과측정'],
    ['TMS', '운송관리', '배송계획', '운송최적화'],
    ['물류비용', '비용최적화', '물류경영', '수익성관리'],
    ['국제물류', '수출입', '관세청연동', '무역물류'],
    ['물류보안', '위험관리', '물류안전', '리스크관리'],
    ['그린물류', '친환경물류', '지속가능물류', '탄소절감'],
    ['3PL', '물류파트너', '아웃소싱', '파트너십'],
    ['AI물류', '빅데이터', '물류혁신', '스마트기술']
  ];

  const posts: BlogPost[] = [];
  const unsplashImages = [
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601598851547-4302969d0f2b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = 0; i < 20; i++) {
    const year = 2024 + Math.floor(Math.random() * 2);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const views = Math.floor(Math.random() * 7500) + 350;
    
    posts.push({
      id: i + 1,
      slug: `logistics-tech-post-${i + 1}`,
      title: titles[i % titles.length],
      category: '물류 테크',
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
const blogPosts = generateLogisticsPosts();

// HOT 키워드
const hotKeywords = [
  '스마트물류', 'WMS', '라스트마일', '물류자동화', 
  'IoT물류', '배송최적화', '재고관리', 'AI물류', '그린물류'
];

export default function LogisticsTechPage() {
  const { setLoading } = useLoading();
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 로딩 상태 처리
  React.useEffect(() => {
    setLoading(true, '물류 테크 페이지 로딩 중');
    
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
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Blog. 물류 테크</h1>
          <p className="text-gray-600 dark:text-gray-300">
            스마트 물류 시스템, 창고 관리, 배송 최적화, 물류 자동화 등 현대 물류 산업의 혁신 기술과 실무 노하우를 공유합니다. 
            물류 효율성 향상과 비용 절감을 위한 전문 정보를 제공합니다.
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
                  <span className="text-red-500 mr-1">🚚</span> HOT 키워드
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
                    <span className="text-gray-600 dark:text-gray-300">창고 관리</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">39</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">배송 최적화</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">물류 자동화</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">33</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">공급망 관리</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">28</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">국제 물류</span>
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