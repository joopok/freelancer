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

// 구매 테크 관련 블로그 게시물 데이터
const generatePurchasePosts = (): BlogPost[] => {
  const titles = [
    '전략적 구매 관리로 비용 30% 절감하는 방법',
    'e-Procurement 시스템 도입 가이드',
    '공급업체 평가 및 관리 전략',
    'MRO 구매 최적화 노하우',
    '구매 계약서 작성 시 주의사항 10가지',
    '글로벌 소싱 전략과 리스크 관리',
    '구매 프로세스 자동화로 효율성 높이기',
    'TCO(총소유비용) 분석 방법론',
    '지속가능한 구매 정책 수립하기',
    '구매 협상 스킬 마스터하기',
    'SRM(공급업체 관계 관리) 구축 가이드',
    '카테고리 매니지먼트 실전 전략',
    '구매 데이터 분석을 통한 인사이트 도출',
    '아웃소싱 vs 인소싱 의사결정 가이드',
    '구매 부서 KPI 설정과 성과 관리',
    '디지털 구매 트랜스포메이션 사례',
    '공급망 리스크 관리 체계 구축',
    '간접재 구매 최적화 전략',
    '구매 컴플라이언스 체크리스트',
    'AI를 활용한 구매 예측 분석'
  ];

  const excerpts = [
    '체계적인 구매 전략 수립과 프로세스 개선을 통해 기업의 구매 비용을 30% 이상 절감한 실제 사례와 방법론을 소개합니다.',
    '디지털 시대의 구매 혁신, e-Procurement 시스템 도입부터 활용까지 단계별 가이드를 제공합니다.',
    '우수한 공급업체 선정과 지속적인 관계 관리를 위한 평가 기준과 관리 전략을 상세히 설명합니다.',
    'MRO(유지보수운영) 자재 구매의 효율성을 높이고 비용을 절감하는 실전 노하우를 공유합니다.',
    '구매 계약서 작성 시 놓치기 쉬운 중요 조항들과 법적 리스크를 최소화하는 방법을 알아봅니다.',
    '글로벌 시장에서의 전략적 소싱 방법과 환율, 무역 규제 등의 리스크 관리 방안을 제시합니다.',
    'RPA와 AI 기술을 활용한 구매 프로세스 자동화로 업무 효율성을 극대화하는 방법을 소개합니다.',
    '단순 구매 가격을 넘어 총소유비용(TCO) 관점에서 구매 의사결정을 내리는 방법론을 설명합니다.',
    'ESG 경영 시대에 맞는 지속가능한 구매 정책 수립 방법과 실행 전략을 제시합니다.',
    '성공적인 구매 협상을 위한 준비 과정부터 협상 테크닉까지 실전 노하우를 공유합니다.',
    '공급업체와의 전략적 파트너십 구축을 위한 SRM 시스템 도입과 운영 방법을 안내합니다.',
    '효과적인 카테고리 관리를 통해 구매 효율성을 높이고 비용을 절감하는 전략을 소개합니다.',
    '구매 데이터를 활용한 지출 분석, 트렌드 파악, 의사결정 지원 방법을 상세히 설명합니다.',
    '핵심 역량에 집중하기 위한 아웃소싱과 인소싱의 장단점 비교 및 의사결정 프레임워크를 제공합니다.',
    '구매 부서의 성과를 측정하고 개선하기 위한 KPI 설정 방법과 관리 체계를 소개합니다.',
    '선진 기업들의 디지털 구매 혁신 사례를 통해 디지털 트랜스포메이션 인사이트를 제공합니다.',
    '불확실성이 높아지는 글로벌 환경에서 공급망 리스크를 효과적으로 관리하는 체계를 설명합니다.',
    '직접재와 다른 간접재 구매의 특성을 이해하고 최적화하는 전략과 방법을 제시합니다.',
    '구매 관련 법규 준수와 내부 통제를 위한 컴플라이언스 체크리스트와 관리 방안을 안내합니다.',
    'AI와 머신러닝을 활용한 수요 예측, 가격 예측, 공급업체 리스크 예측 방법을 소개합니다.'
  ];

  const tagSets = [
    ['구매전략', '비용절감', '프로세스개선', '구매관리'],
    ['e-Procurement', '디지털구매', '시스템도입', '자동화'],
    ['공급업체관리', 'SRM', '평가체계', '파트너십'],
    ['MRO', '간접재구매', '비용최적화', '재고관리'],
    ['구매계약', '법무검토', '리스크관리', '계약관리'],
    ['글로벌소싱', '국제무역', '환리스크', '수입구매'],
    ['자동화', 'RPA', 'AI구매', '프로세스혁신'],
    ['TCO분석', '총소유비용', '구매분석', '의사결정'],
    ['지속가능구매', 'ESG', '친환경구매', '사회적책임'],
    ['협상스킬', '구매협상', '가격협상', '협상전략'],
    ['공급업체관계', 'SRM시스템', '협력관계', '파트너관리'],
    ['카테고리관리', '구매전략', '품목관리', '소싱전략'],
    ['데이터분석', '구매인텔리전스', 'BI', '지출분석'],
    ['아웃소싱', '인소싱', 'Make-or-Buy', '전략결정'],
    ['KPI', '성과관리', '구매성과', '지표관리'],
    ['디지털전환', '구매혁신', '디지털구매', '사례연구'],
    ['공급망리스크', '리스크관리', 'SCM', '위기대응'],
    ['간접재', '서비스구매', 'Tail-spend', '비용관리'],
    ['컴플라이언스', '내부통제', '구매윤리', '규정준수'],
    ['AI활용', '예측분석', '머신러닝', '구매인공지능']
  ];

  const posts: BlogPost[] = [];
  const unsplashImages = [
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = 0; i < 20; i++) {
    const year = 2024 + Math.floor(Math.random() * 2);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const views = Math.floor(Math.random() * 8000) + 300;
    
    posts.push({
      id: i + 1,
      slug: `purchase-tech-post-${i + 1}`,
      title: titles[i % titles.length],
      category: '구매 테크',
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
const blogPosts = generatePurchasePosts();

// HOT 키워드
const hotKeywords = [
  '구매전략', 'e-Procurement', '공급업체관리', 'TCO분석', 
  '비용절감', '글로벌소싱', '구매협상', 'AI구매', 'ESG'
];

export default function PurchaseTechPage() {
  const { setLoading } = useLoading();
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 로딩 상태 처리
  React.useEffect(() => {
    setLoading(true, '구매 테크 페이지 로딩 중');
    
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
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Blog. 구매 테크</h1>
          <p className="text-gray-600 dark:text-gray-300">
            전략적 구매 관리, 공급업체 관리, 구매 프로세스 최적화 등 구매 업무의 전문성을 높이는 인사이트를 제공합니다. 
            비용 절감과 효율성 향상을 위한 실무 노하우를 공유합니다.
          </p>
        </div>
              
        <BlogMenuSearch currentPage="purchase-tech" />
        
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
                  <span className="text-red-500 mr-1">🛒</span> HOT 키워드
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
                    <span className="text-gray-600 dark:text-gray-300">전략적 구매</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">52</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">공급업체 관리</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">41</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">구매 시스템</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">35</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">비용 절감</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">28</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">글로벌 소싱</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">23</span>
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