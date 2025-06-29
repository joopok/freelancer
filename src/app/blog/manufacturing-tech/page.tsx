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

// 제조 테크 관련 블로그 게시물 데이터
const generateManufacturingPosts = (): BlogPost[] => {
  const titles = [
    '스마트 팩토리 구축과 Industry 4.0 전략',
    'IoT 센서를 활용한 제조 공정 모니터링',
    '제조업 디지털 트윈 기술과 활용 사례',
    '예측 정비(Predictive Maintenance) 시스템 구축',
    '제조 실행 시스템(MES) 도입 가이드',
    'AI를 활용한 품질 관리 시스템',
    '제조업 로봇 자동화와 협동 로봇',
    '린 제조(Lean Manufacturing) 실전 적용',
    '제조 데이터 분석과 공정 최적화',
    '공급망 관리와 제조업 SCM',
    '제조업 클라우드 시스템 도입',
    '3D 프린팅과 적층 제조 기술',
    '제조업 사이버 보안과 위험 관리',
    '지속가능한 제조와 그린 팩토리',
    '제조업 인력 관리와 스킬 개발',
    '제조 원가 관리와 비용 최적화',
    '제조업 품질 인증과 규정 준수',
    '글로벌 제조와 현지화 전략',
    '스마트 제조를 위한 ERP 통합',
    '제조업 미래 기술과 혁신 트렌드'
  ];

  const excerpts = [
    '제조업의 디지털 혁신을 위한 스마트 팩토리 구축 방법과 Industry 4.0 기술 도입 전략을 실제 사례를 통해 상세히 안내합니다.',
    'IoT 센서와 스마트 디바이스를 활용한 실시간 제조 공정 모니터링 시스템 구축과 데이터 활용 방법을 소개합니다.',
    '가상과 현실을 연결하는 디지털 트윈 기술의 개념부터 제조업 적용 사례, 구축 방법까지 상세히 설명합니다.',
    '장비 고장을 사전에 예측하고 예방하는 예측 정비 시스템의 구축 방법과 AI 기술 활용 사례를 제시합니다.',
    '제조 현장의 효율성을 극대화하는 MES 시스템 선택부터 도입, 운영까지의 전 과정을 단계별로 안내합니다.',
    '인공지능 기술을 활용한 자동화된 품질 검사와 불량품 예측, 품질 개선 방법론을 실제 사례와 함께 소개합니다.',
    '제조 공정 자동화를 위한 산업용 로봇과 협동 로봇의 활용 방법, 도입 시 고려사항과 투자 효과를 분석합니다.',
    '낭비 제거와 효율성 극대화를 위한 린 제조 원칙의 실제 적용 방법과 지속적 개선 활동을 상세히 설명합니다.',
    '제조 현장에서 생성되는 대량의 데이터를 분석하여 공정을 최적화하고 생산성을 향상시키는 방법을 제시합니다.',
    '원자재 조달부터 완제품 출하까지의 공급망을 효율적으로 관리하는 SCM 시스템 구축과 운영 방법을 안내합니다.',
    '제조업 클라우드 도입의 장점과 고려사항, 성공적인 마이그레이션을 위한 전략과 실행 방법을 소개합니다.',
    '3D 프린팅과 적층 제조 기술의 원리부터 제조업 활용 사례, 미래 전망까지 포괄적으로 다룹니다.',
    '제조업 특성에 맞는 사이버 보안 체계 구축과 산업 제어 시스템 보안, 위험 관리 방법을 상세히 설명합니다.',
    '환경 친화적인 제조 공정 구축과 에너지 효율 향상, 탄소 중립을 위한 그린 팩토리 전략을 제시합니다.',
    '제조업 인력의 스킬 개발과 교육 훈련, 차세대 제조 인재 육성을 위한 체계적인 접근 방법을 안내합니다.',
    '제조 원가의 정확한 산정과 관리, 비용 절감을 위한 최적화 방법과 수익성 개선 전략을 소개합니다.',
    '제조업 품질 표준 준수와 각종 인증 취득, 글로벌 시장 진출을 위한 품질 관리 체계를 설명합니다.',
    '글로벌 제조 네트워크 구축과 현지화 전략, 다국적 제조 운영 관리 방법을 실제 사례로 분석합니다.',
    '스마트 제조를 위한 ERP 시스템 통합과 데이터 연동, 통합 관리 플랫폼 구축 방법을 상세히 안내합니다.',
    '제조업 미래를 이끌 혁신 기술들과 새로운 제조 패러다임, 기업이 준비해야 할 전략을 종합적으로 제시합니다.'
  ];

  const tagSets = [
    ['스마트팩토리', 'Industry4.0', '제조혁신', '디지털제조'],
    ['IoT제조', '센서모니터링', '실시간제조', '스마트센서'],
    ['디지털트윈', '가상제조', '시뮬레이션', '디지털복제'],
    ['예측정비', 'AI정비', '장비관리', '고장예측'],
    ['MES시스템', '제조실행', '생산관리', '공정관리'],
    ['AI품질', '품질관리', '자동검사', '불량예측'],
    ['제조로봇', '협동로봇', '자동화', 'AGV'],
    ['린제조', '낭비제거', '지속개선', '효율화'],
    ['제조분석', '데이터분석', '공정최적화', '생산성'],
    ['제조SCM', '공급망', '자재관리', '생산계획'],
    ['제조클라우드', '클라우드제조', '디지털인프라', 'SaaS'],
    ['3D프린팅', '적층제조', 'AM', '디지털제조'],
    ['제조보안', '산업보안', '사이버보안', 'OT보안'],
    ['그린제조', '친환경제조', '지속가능제조', '탄소중립'],
    ['제조인력', '스킬개발', '제조교육', '인재육성'],
    ['제조원가', '원가관리', '비용최적화', '수익성'],
    ['품질인증', '품질표준', 'ISO', '규정준수'],
    ['글로벌제조', '해외제조', '현지화', '다국적제조'],
    ['제조ERP', '시스템통합', '데이터통합', '통합플랫폼'],
    ['제조미래', '혁신기술', '제조트렌드', '차세대제조']
  ];

  const posts: BlogPost[] = [];
  const unsplashImages = [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581092918484-8313de49c40e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581093458791-9f3c3250e6b8?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581092446936-5ae17d6cdf7b?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = 0; i < 20; i++) {
    const year = 2024 + Math.floor(Math.random() * 2);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const views = Math.floor(Math.random() * 6500) + 450;
    
    posts.push({
      id: i + 1,
      slug: `manufacturing-tech-post-${i + 1}`,
      title: titles[i % titles.length],
      category: '제조 테크',
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
const blogPosts = generateManufacturingPosts();

// HOT 키워드
const hotKeywords = [
  '스마트팩토리', 'IoT제조', '디지털트윈', 'AI품질', 
  '제조로봇', '예측정비', 'MES', '그린제조', '제조분석'
];

export default function ManufacturingTechPage() {
  const { setLoading } = useLoading();
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 로딩 상태 처리
  React.useEffect(() => {
    setLoading(true, '제조 테크 페이지 로딩 중');
    
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
  const popularPost = useMemo(() => blogPosts.find(post => post.id === 1), []);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Blog. 제조 테크</h1>
          <p className="text-gray-600 dark:text-gray-300">
            스마트 팩토리, 제조 자동화, IoT, AI 등 첨단 기술을 활용한 제조업 혁신 사례와 실무 노하우를 공유합니다. 
            Industry 4.0 시대의 제조업 디지털 트랜스포메이션을 위한 전문 정보를 제공합니다.
          </p>
        </div>
              
        <BlogMenuSearch currentPage="manufacturing-tech" />
        
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
                  <span className="text-red-500 mr-1">🏭</span> HOT 키워드
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
                    <span className="text-gray-600 dark:text-gray-300">스마트 팩토리</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">41</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">제조 자동화</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">36</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">품질 관리</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">29</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">공정 최적화</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">33</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">지속가능 제조</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">22</span>
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