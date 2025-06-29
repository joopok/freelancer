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

// 인사 테크 관련 블로그 게시물 데이터
const generateHRPosts = (): BlogPost[] => {
  const titles = [
    'HRM과 HRD의 차이점과 효과적인 활용법',
    '성과관리 시스템(PMS) 구축 실전 가이드',
    '직무기술서(JD) 작성의 모든 것',
    '채용 프로세스 최적화로 인재 유치하기',
    '온보딩 프로그램 설계와 실행 전략',
    '직원 몰입도 향상을 위한 10가지 방법',
    'HR Analytics: 데이터 기반 인사 의사결정',
    '리더십 개발 프로그램 구축하기',
    '조직문화 진단과 개선 방법론',
    '보상체계 설계의 핵심 원칙',
    '성과평가 시스템 혁신 사례',
    '인재 유지(Retention) 전략 수립하기',
    '다양성과 포용성(D&I) 실천 가이드',
    '원격 근무 시대의 인사 관리',
    '경력개발 프로그램 설계와 운영',
    'HR Tech 트렌드와 도입 전략',
    '퇴직자 관리와 Alumni 네트워크',
    '노무 리스크 관리 체크리스트',
    '인사 정책 수립과 커뮤니케이션',
    'AI를 활용한 채용 프로세스 혁신'
  ];

  const excerpts = [
    '인적자원관리(HRM)와 인적자원개발(HRD)의 개념을 명확히 이해하고, 조직의 성장 단계에 맞는 효과적인 활용 전략을 제시합니다.',
    '목표 설정부터 평가, 피드백까지 체계적인 성과관리 시스템을 구축하는 단계별 가이드를 제공합니다.',
    '효과적인 직무기술서 작성법과 함께 직무분석, 역량 모델링까지 상세하게 다룹니다.',
    '최고의 인재를 찾고 유치하기 위한 채용 프로세스 최적화 방법과 실전 팁을 공유합니다.',
    '신입사원의 빠른 적응과 생산성 향상을 위한 체계적인 온보딩 프로그램 설계 방법을 소개합니다.',
    '직원들의 업무 몰입도를 높이고 조직 성과를 향상시키는 검증된 방법론을 제시합니다.',
    '데이터 분석을 통한 인사 의사결정의 과학화, HR Analytics 도입과 활용 방법을 상세히 설명합니다.',
    '차세대 리더 육성을 위한 체계적인 리더십 개발 프로그램 설계와 운영 노하우를 공유합니다.',
    '건강한 조직문화 구축을 위한 진단 도구와 개선 방법론, 실제 사례를 소개합니다.',
    '공정하고 경쟁력 있는 보상체계 설계의 원칙과 실행 방안을 단계별로 안내합니다.',
    '전통적인 성과평가의 한계를 극복하고 새로운 평가 시스템을 도입한 기업들의 사례를 분석합니다.',
    '핵심 인재 이탈 방지와 장기 근속을 유도하는 효과적인 인재 유지 전략을 제시합니다.',
    '다양성과 포용성이 조직 성과에 미치는 영향과 실천 방안을 구체적으로 설명합니다.',
    '원격 근무 환경에서의 효과적인 인사 관리 방법과 도구, 정책 수립 가이드를 제공합니다.',
    '직원들의 경력 성장을 지원하는 체계적인 경력개발 프로그램 설계와 운영 방법을 소개합니다.',
    '최신 HR Tech 솔루션의 종류와 특징, 도입 시 고려사항과 성공 전략을 분석합니다.',
    '퇴직자와의 긍정적인 관계 유지와 Alumni 네트워크 구축을 통한 가치 창출 방법을 제시합니다.',
    '노동법 준수와 노무 리스크 예방을 위한 실무 체크리스트와 대응 방안을 안내합니다.',
    '효과적인 인사 정책 수립 프로세스와 조직 내 커뮤니케이션 전략을 상세히 설명합니다.',
    'AI 기술을 활용한 채용 프로세스 자동화와 효율화, 공정성 확보 방안을 소개합니다.'
  ];

  const tagSets = [
    ['HRM', 'HRD', '인사관리', '인재개발'],
    ['성과관리', 'PMS', 'KPI', '목표관리'],
    ['직무분석', 'JD작성', '채용준비', '역량모델'],
    ['채용전략', '인재확보', 'ATS', '면접프로세스'],
    ['온보딩', '신입사원', '적응프로그램', '조기정착'],
    ['직원몰입', '동기부여', '조직몰입', '업무만족도'],
    ['HR분석', '데이터분석', 'People Analytics', '인사통계'],
    ['리더십', '리더육성', '승계계획', '핵심인재'],
    ['조직문화', '문화진단', '조직개발', '변화관리'],
    ['보상관리', '급여체계', '성과급', '복리후생'],
    ['성과평가', '평가제도', '피드백', '다면평가'],
    ['인재유지', 'Retention', '이직방지', '근속관리'],
    ['다양성', '포용성', 'D&I', '조직다양성'],
    ['원격근무', '재택근무', '하이브리드', '유연근무'],
    ['경력개발', 'CDP', '교육훈련', '역량개발'],
    ['HRTech', 'HRIS', '디지털HR', 'HR자동화'],
    ['퇴직관리', 'Alumni', '관계관리', '네트워킹'],
    ['노무관리', '노동법', '컴플라이언스', '리스크관리'],
    ['인사정책', '규정관리', '내부커뮤니케이션', '정책수립'],
    ['AI채용', '채용자동화', 'ATS', '채용혁신']
  ];

  const posts: BlogPost[] = [];
  const unsplashImages = [
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = 0; i < 20; i++) {
    const year = 2024 + Math.floor(Math.random() * 2);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const views = Math.floor(Math.random() * 9000) + 400;
    
    posts.push({
      id: i + 1,
      slug: `hr-tech-post-${i + 1}`,
      title: titles[i % titles.length],
      category: '인사 테크',
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
const blogPosts = generateHRPosts();

// HOT 키워드
const hotKeywords = [
  'HRM', '성과관리', '채용전략', 'HR Analytics', 
  '조직문화', '리더십개발', '원격근무', 'HRTech', 'D&I'
];

export default function HRTechPage() {
  const { setLoading } = useLoading();
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 로딩 상태 처리
  React.useEffect(() => {
    setLoading(true, '인사 테크 페이지 로딩 중');
    
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
  const popularPost = useMemo(() => blogPosts.find(post => post.id === 2), []);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Blog. 인사 테크</h1>
          <p className="text-gray-600 dark:text-gray-300">
            인적자원관리(HRM)와 인적자원개발(HRD)의 최신 트렌드와 실무 노하우를 공유합니다. 
            채용, 평가, 보상, 조직문화, HR Tech 등 인사 담당자를 위한 전문 정보를 제공합니다.
          </p>
        </div>
              
        <BlogMenuSearch currentPage="hr-tech" />
        
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
                  <span className="text-red-500 mr-1">👥</span> HOT 키워드
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
                    <span className="text-gray-600 dark:text-gray-300">채용 & 선발</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">48</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">성과 관리</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">35</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">조직 문화</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">교육 & 개발</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">29</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">HR Tech</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">21</span>
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