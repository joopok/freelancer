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

// 전략 테크 관련 블로그 게시물 데이터
const generateStrategyPosts = (): BlogPost[] => {
  const titles = [
    '디지털 트랜스포메이션 전략 수립 가이드',
    '데이터 기반 의사결정 체계 구축하기',
    '비즈니스 모델 혁신과 전략적 접근',
    'OKR(목표 및 핵심 결과) 도입 실전 가이드',
    '경쟁 분석과 시장 포지셔닝 전략',
    '플랫폼 비즈니스 전략과 생태계 구축',
    '고객 중심 전략 설계와 실행',
    '성장 전략과 확장 계획 수립',
    '디지털 마케팅 통합 전략',
    '조직 혁신과 변화 관리 전략',
    '수익 모델 다각화 전략',
    '파트너십과 전략적 제휴 관리',
    '리스크 관리와 위기 대응 전략',
    '브랜드 포지셔닝과 차별화 전략',
    '글로벌 진출 전략과 현지화',
    '지속가능성과 ESG 전략',
    '혁신 관리와 R&D 전략',
    '인수합병(M&A) 전략과 실행',
    '스타트업 투자와 벤처 전략',
    'AI 시대의 경영 전략과 미래 준비'
  ];

  const excerpts = [
    '기업의 디지털 전환을 위한 체계적인 전략 수립 방법과 성공적인 실행을 위한 단계별 로드맵을 제시합니다.',
    '빅데이터와 분석 도구를 활용한 과학적 의사결정 체계 구축 방법과 조직 내 데이터 문화 정착 전략을 소개합니다.',
    '기존 비즈니스 모델의 한계를 뛰어넘는 혁신적 접근법과 새로운 가치 창출 방법을 실제 사례를 통해 분석합니다.',
    '목표 달성을 위한 효과적인 OKR 시스템 도입부터 운영, 성과 관리까지의 실전 노하우를 상세히 안내합니다.',
    '시장 내 경쟁사 분석 방법론과 자사의 차별적 포지셔닝을 위한 전략적 접근 방법을 체계적으로 설명합니다.',
    '플랫폼 중심의 비즈니스 모델 설계와 건강한 생태계 구축을 위한 전략과 운영 방법을 제시합니다.',
    '고객 니즈를 중심으로 한 전략 설계 방법과 고객 가치 창출을 극대화하는 실행 방안을 알아봅니다.',
    '지속가능한 성장을 위한 전략 수립부터 시장 확장, 신사업 진출까지의 체계적 접근 방법을 소개합니다.',
    '온라인과 오프라인을 아우르는 통합 마케팅 전략과 디지털 채널 최적화 방법을 상세히 다룹니다.',
    '급변하는 비즈니스 환경에서 조직의 혁신 역량을 강화하고 변화를 성공적으로 관리하는 전략을 제시합니다.',
    '단일 수익원에 의존하지 않는 다양한 수익 모델 개발과 포트폴리오 관리 전략을 실례와 함께 설명합니다.',
    '전략적 파트너십 구축부터 제휴 관리, 성과 평가까지 win-win 관계 구축을 위한 실무 가이드를 제공합니다.',
    '불확실한 경영 환경에서 리스크를 사전에 식별하고 관리하는 체계적인 위험 관리 전략을 안내합니다.',
    '경쟁사와의 차별화를 위한 브랜드 포지셔닝 전략과 고유한 브랜드 가치 구축 방법을 소개합니다.',
    '해외 시장 진출을 위한 전략 수립부터 현지화, 글로벌 운영 관리까지의 체계적 접근 방법을 제시합니다.',
    'ESG 경영의 중요성과 지속가능한 비즈니스 모델 구축을 위한 전략적 접근 방법을 실제 사례로 설명합니다.',
    '지속적인 혁신을 위한 R&D 전략 수립과 혁신 문화 조성, 아이디어 관리 시스템 구축 방법을 안내합니다.',
    '성공적인 M&A를 위한 전략 수립부터 대상 기업 선정, 통합 과정 관리까지의 실무 노하우를 공유합니다.',
    '스타트업 투자 판단 기준과 벤처 캐피털 전략, 포트폴리오 관리 방법을 투자 전문가 관점에서 분석합니다.',
    'AI 기술이 가져올 경영 환경 변화를 예측하고 미래를 준비하는 전략적 사고와 실행 방안을 제시합니다.'
  ];

  const tagSets = [
    ['디지털전환', 'DX전략', '디지털혁신', '전략수립'],
    ['데이터분석', '의사결정', 'BI', '데이터전략'],
    ['비즈니스모델', '혁신전략', '가치창출', '모델혁신'],
    ['OKR', '목표관리', '성과관리', '전략실행'],
    ['경쟁분석', '시장분석', '포지셔닝', '경쟁전략'],
    ['플랫폼전략', '생태계', '플랫폼비즈니스', '네트워크효과'],
    ['고객전략', '고객중심', 'CX전략', '가치제안'],
    ['성장전략', '확장전략', '신사업', '시장진출'],
    ['마케팅전략', '통합마케팅', '디지털마케팅', '브랜딩'],
    ['조직혁신', '변화관리', '조직개발', '혁신경영'],
    ['수익모델', '비즈니스모델', '수익다각화', '포트폴리오'],
    ['파트너십', '전략제휴', '협력전략', '네트워킹'],
    ['리스크관리', '위기관리', '리스크전략', '불확실성'],
    ['브랜드전략', '차별화', '포지셔닝', '브랜드가치'],
    ['글로벌전략', '해외진출', '현지화', '국제경영'],
    ['ESG경영', '지속가능성', '사회적책임', '친환경'],
    ['혁신관리', 'R&D전략', '기술혁신', '혁신문화'],
    ['M&A전략', '인수합병', '기업매수', '통합관리'],
    ['벤처투자', '스타트업', '투자전략', 'VC'],
    ['AI전략', '미래전략', '기술전략', '디지털미래']
  ];

  const posts: BlogPost[] = [];
  const unsplashImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1553484771-371a605b060b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = 0; i < 20; i++) {
    const year = 2024 + Math.floor(Math.random() * 2);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const views = Math.floor(Math.random() * 11000) + 600;
    
    posts.push({
      id: i + 1,
      slug: `strategy-tech-post-${i + 1}`,
      title: titles[i % titles.length],
      category: '전략 테크',
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
const blogPosts = generateStrategyPosts();

// HOT 키워드
const hotKeywords = [
  '디지털전환', '데이터전략', 'OKR', '플랫폼전략', 
  '고객중심', '성장전략', 'ESG경영', 'AI전략', '혁신관리'
];

export default function StrategyTechPage() {
  const { setLoading } = useLoading();
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 로딩 상태 처리
  React.useEffect(() => {
    setLoading(true, '전략 테크 페이지 로딩 중');
    
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
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Blog. 전략 테크</h1>
          <p className="text-gray-600 dark:text-gray-300">
            기업 경영 전략, 디지털 트랜스포메이션, 비즈니스 모델 혁신 등 전략적 사고와 실행 방법론을 공유합니다. 
            CEO와 전략 기획자를 위한 실무 중심의 전략 인사이트를 제공합니다.
          </p>
        </div>
              
        <BlogMenuSearch currentPage="strategy-tech" />
        
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
                  <span className="text-red-500 mr-1">🎯</span> HOT 키워드
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
                    <span className="text-gray-600 dark:text-gray-300">디지털 전략</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">58</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">비즈니스 모델</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">44</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">조직 전략</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">36</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">글로벌 전략</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">29</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">혁신 관리</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">33</span>
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