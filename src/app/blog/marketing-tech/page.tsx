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

// 홍보&마케팅 테크 관련 블로그 게시물 데이터
const generateMarketingPosts = (): BlogPost[] => {
  const titles = [
    '디지털 마케팅의 핵심 지표와 분석 방법',
    'SEO 최적화로 웹사이트 트래픽 10배 늘리기',
    '콘텐츠 마케팅 전략 수립과 실행 가이드',
    '소셜미디어 마케팅 완전 정복하기',
    '이메일 마케팅 자동화 시스템 구축',
    '마케팅 오토메이션 도구 비교 및 선택법',
    '구글 애즈(Google Ads) 효과적 운영 전략',
    '인플루언서 마케팅의 모든 것',
    '브랜드 스토리텔링과 콘텐츠 기획',
    '고객 여정 맵핑과 퍼널 최적화',
    '리타겟팅 광고로 전환율 높이기',
    'ABM(Account-Based Marketing) 실전 가이드',
    '마케팅 ROI 측정과 성과 분석',
    '퍼포먼스 마케팅 전략과 실행',
    '브랜딩과 퍼포먼스의 균형 맞추기',
    '옴니채널 마케팅 전략 수립',
    '고객 데이터 플랫폼(CDP) 활용법',
    '마케팅 기술 스택 구축하기',
    '개인정보보호법과 마케팅 컴플라이언스',
    'AI를 활용한 개인화 마케팅'
  ];

  const excerpts = [
    '디지털 마케팅의 성공을 위한 핵심 지표(KPI) 선정부터 데이터 분석과 인사이트 도출까지 체계적인 접근 방법을 제시합니다.',
    '검색엔진 최적화의 기본 원리부터 고급 기법까지, 웹사이트 가시성을 극대화하는 실전 SEO 전략을 소개합니다.',
    '타겟 고객의 니즈를 파악하고 가치 있는 콘텐츠를 기획하여 브랜드 인지도와 고객 참여를 높이는 방법을 알아봅니다.',
    '페이스북, 인스타그램, 링크드인 등 주요 플랫폼별 특성을 이해하고 효과적인 소셜미디어 마케팅 전략을 수립해보세요.',
    '고객 세분화부터 개인화된 메시지 전송까지, 이메일 마케팅의 자동화를 통해 효율성과 효과를 동시에 높이는 방법을 제시합니다.',
    'HubSpot, Marketo, Pardot 등 주요 마케팅 오토메이션 툴의 특징과 장단점을 비교하고 적합한 솔루션 선택 가이드를 제공합니다.',
    '구글 애즈를 활용한 효과적인 광고 캠페인 기획부터 최적화까지, ROI를 극대화하는 실전 운영 노하우를 공유합니다.',
    '인플루언서 발굴부터 협업 관리, 성과 측정까지 인플루언서 마케팅의 전 과정을 체계적으로 다룹니다.',
    '브랜드의 고유한 가치와 메시지를 전달하는 스토리텔링 기법과 콘텐츠 기획 방법론을 소개합니다.',
    '고객의 구매 여정을 분석하고 각 단계별 최적화 포인트를 찾아 전환율을 향상시키는 방법을 알아봅니다.',
    '한 번 방문한 고객을 다시 유치하는 리타겟팅 광고의 전략과 실행 방법, 효과 측정 노하우를 제시합니다.',
    'B2B 기업을 위한 계정 기반 마케팅(ABM) 전략 수립부터 실행까지의 단계별 가이드를 제공합니다.',
    '마케팅 투자 대비 효과를 정확히 측정하고 분석하는 방법론과 도구 활용법을 상세히 설명합니다.',
    '데이터 기반의 퍼포먼스 마케팅 전략 수립과 지속적인 최적화를 통한 성과 향상 방법을 소개합니다.',
    '브랜드 인지도 구축과 단기 성과 창출의 균형을 맞추는 통합 마케팅 전략을 제시합니다.',
    '온라인과 오프라인을 아우르는 일관된 고객 경험 제공을 위한 옴니채널 마케팅 전략을 설명합니다.',
    '고객 데이터를 통합 관리하고 활용하는 CDP 구축과 운영 방법, 개인화 마케팅 실행 전략을 안내합니다.',
    '효율적인 마케팅 운영을 위한 기술 스택 구성 원칙과 주요 도구들의 연동 방법을 소개합니다.',
    '개인정보보호법 준수와 마케팅 효과성을 동시에 확보하는 컴플라이언스 마케팅 가이드를 제공합니다.',
    'AI 기술을 활용한 고객 개인화, 예측 분석, 자동화된 캠페인 최적화 방법을 실제 사례와 함께 소개합니다.'
  ];

  const tagSets = [
    ['디지털마케팅', 'KPI', '데이터분석', '성과측정'],
    ['SEO', '검색최적화', '웹트래픽', '구글랭킹'],
    ['콘텐츠마케팅', '콘텐츠기획', '브랜딩', '스토리텔링'],
    ['소셜미디어', 'SNS마케팅', '페이스북', '인스타그램'],
    ['이메일마케팅', '마케팅자동화', '고객세분화', '개인화'],
    ['마케팅오토메이션', 'HubSpot', 'Marketo', '마케팅툴'],
    ['구글애즈', '검색광고', 'PPC', '광고최적화'],
    ['인플루언서', '인플루언서마케팅', '협업', '영향력마케팅'],
    ['브랜드스토리', '스토리텔링', '콘텐츠전략', '브랜딩'],
    ['고객여정', '퍼널분석', '전환최적화', 'CRO'],
    ['리타겟팅', '재방문광고', '전환율', '광고효율'],
    ['ABM', 'B2B마케팅', '계정마케팅', '세일즈마케팅'],
    ['ROI측정', '마케팅분석', '성과분석', 'Attribution'],
    ['퍼포먼스마케팅', '성과마케팅', '데이터마케팅', '최적화'],
    ['브랜드마케팅', '통합마케팅', '마케팅전략', '브랜딩'],
    ['옴니채널', '통합마케팅', '고객경험', 'CX'],
    ['CDP', '고객데이터', '개인화', '데이터통합'],
    ['마케팅기술', 'MarTech', '마케팅스택', '도구연동'],
    ['개인정보보호', '컴플라이언스', 'GDPR', '마케팅법규'],
    ['AI마케팅', '개인화', '예측분석', '마케팅AI']
  ];

  const posts: BlogPost[] = [];
  const unsplashImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590649804407-e7e7f5e9e4c0?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1553895501-af9e282e7fc1?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = 0; i < 20; i++) {
    const year = 2024 + Math.floor(Math.random() * 2);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const views = Math.floor(Math.random() * 12000) + 500;
    
    posts.push({
      id: i + 1,
      slug: `marketing-tech-post-${i + 1}`,
      title: titles[i % titles.length],
      category: '홍보&마케팅 테크',
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
const blogPosts = generateMarketingPosts();

// HOT 키워드
const hotKeywords = [
  '디지털마케팅', 'SEO', '콘텐츠마케팅', '구글애즈', 
  '마케팅자동화', '소셜미디어', 'ROI', 'AI마케팅', '개인화'
];

export default function MarketingTechPage() {
  const { setLoading } = useLoading();
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 로딩 상태 처리
  React.useEffect(() => {
    setLoading(true, '홍보&마케팅 테크 페이지 로딩 중');
    
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
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Blog. 홍보&마케팅 테크</h1>
          <p className="text-gray-600 dark:text-gray-300">
            디지털 마케팅의 최신 트렌드와 실무 노하우를 공유합니다. 
            SEO, 콘텐츠 마케팅, 광고 운영, 마케팅 자동화 등 마케터를 위한 전문 정보를 제공합니다.
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
                  <span className="text-red-500 mr-1">📈</span> HOT 키워드
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
                    <span className="text-gray-600 dark:text-gray-300">디지털 광고</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">콘텐츠 마케팅</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">54</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">마케팅 분석</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">38</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">브랜딩</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">마케팅 자동화</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">31</span>
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