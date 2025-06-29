'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoading } from '@/components/layout/Loading';
import { delay, animate, motion } from 'framer-motion';
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

// 더미 데이터 생성을 위한 배열들
const titles = [
  '왜 많은 개발자들이 Rust(러스트)로 이동할까?',
  'Go 언어의 인기가 계속 높아지는 이유',
  '안드로이드 스튜디오, 모바일 시장에 꼭 필요할까?',
  'HTML vs. HTML5 핵심 가이드 – 10년 차 개발자의 필수법',
  '구글 지도 활용 방법 (Feat. 구글 맵 API 사용법)',
  '[AR vs VR] 증강 현실과 가상 현실 무엇이 다를까?',
  'Redis란? 특징부터 사용법까지, 제대로 활용하기!',
  'GraphQL vs REST API: 어떤 것을 선택해야 할까?',
  'Docker 컨테이너 관리의 모든 것',
  'Kubernetes 입문자를 위한 완벽 가이드',
  'Spring Boot 3.0 새로운 기능 총정리',
  'Vue.js vs React: 2025년 프론트엔드 프레임워크 비교',
  'Python 머신러닝 라이브러리 총정리',
  'AWS vs Azure vs GCP: 클라우드 서비스 비교',
  'NoSQL 데이터베이스의 종류와 특징',
  '블록체인 개발: 기초부터 실전까지',
  'WebAssembly로 웹 성능 향상시키기',
  'JWT 인증 구현 완벽 가이드',
  '마이크로서비스 아키텍처의 장단점',
  '프론트엔드 성능 최적화 기법'
];

const excerpts = [
  '소프트웨어 개발 역사에서의 안전성과 성능을 동시에 만족시키는 언어를 만드는 것은 오랜 고민이었습니다. Rust는 현대적이고 실용적인 접근 방식으로 이 문제를 해결하기 위해 설계되었습니다.',
  '구글이 만든 언어 중 화제로, C++와 파이썬과 같은 언어 중간의 접합점에서 빠르면서도 단순함을 제공합니다.',
  '모바일 시장에서 가장 많이 사용되는 운영체제가 안드로이드인가요? 비로이드코딩으로 앱을 만들 수는 없을까요?',
  '웹 페이지의 중요한 골격을 담지만, 이제껏 배워야만 온라인비즈니스를 꿈꿀 수 있는 필수 언어입니다.',
  '구글 맵(Google Maps)은 Google에서 제공하는 지도 서비스로, 전 세계적 지리 정보를 제공합니다.',
  '디지털 시대가 급변하는 가운데, 증강현실(AR)과가상현실(VR)은 IT 기술 혁신의 중심에 자리잡고 있습니다.',
  '워크디지털 트랜스 포메이션이 가속화되면서 실시간데이터 처리와 분석의 중요성이 더욱 커지고 있습니다.',
  'API 설계에 있어서 GraphQL과 REST는 가장 많이 비교되는 두 가지 접근 방식입니다. 각각의 장단점을 알아보고 프로젝트에 맞는 선택을 해보세요.',
  '도커 컨테이너를 효율적으로 관리하는 방법부터 프로덕션 환경에서의 모범 사례까지 상세히 알아봅니다.',
  '쿠버네티스 입문자들이 알아야 할 핵심 개념과 실전 예제를 통해 컨테이너 오케스트레이션의 기초를 다질 수 있습니다.',
  'Spring Boot 3.0에서 추가된 새로운 기능들과 개선 사항들을 자세히 살펴보고 실제 적용 방법을 알아보세요.',
  '현대 프론트엔드 개발에서 가장 인기 있는 두 프레임워크의 최신 버전을 비교하고 각각의 사용 사례를 분석합니다.',
  '파이썬 머신러닝 생태계의 주요 라이브러리들을 소개하고, 다양한 머신러닝 과제에 적합한 도구를 선택하는 방법을 알아봅니다.',
  '주요 클라우드 제공업체들의 서비스를 비교하고, 기업의 요구사항에 맞는 최적의 클라우드 서비스를 선택하는 방법을 안내합니다.',
  'NoSQL 데이터베이스의 다양한 유형과 각각의 강점 및 약점을 분석하고, 적절한 사용 사례를 소개합니다.',
  '블록체인 기술의 기초 개념부터 실제 애플리케이션 개발까지의 과정을 단계별로 설명합니다.',
  'WebAssembly의 기본 원리와 이를 활용하여 웹 애플리케이션의 성능을 크게 향상시키는 방법을 알아봅니다.',
  'JWT를 사용한 안전하고 효율적인 사용자 인증 시스템 구현 방법을 상세히 안내합니다.',
  '마이크로서비스 아키텍처로의 전환 시 고려해야 할 장단점과 실제 구현 시 마주할 수 있는 도전 과제들을 분석합니다.',
  '웹 애플리케이션의 로딩 속도와 사용자 경험을 향상시키기 위한 다양한 최적화 기법을 소개합니다.'
];

const tagSets = [
  ['러스트TIP', '프로그래밍언어', '개발트렌드'],
  ['러스트TIP', '프로그래밍언어', '개발트렌드', '백엔드'],
  ['러스트TIP', '앱개발', '프로그래밍언어', '아이디어'],
  ['러스트TIP', '웹개발', '프론트엔드', '기초웹'],
  ['러스트TIP', 'API활용', '지도활용', '서비스적용'],
  ['러스트TIP', 'ARVR', '트렌드', '개발팁'],
  ['러스트TIP', '트래픽', '데이터', '캐시구축'],
  ['API', '백엔드개발', '웹서비스', '개발자경험'],
  ['DevOps', '컨테이너', '인프라', '개발환경'],
  ['DevOps', '쿠버네티스', '클라우드', '컨테이너오케스트레이션'],
  ['Java', '스프링부트', '백엔드', '웹개발'],
  ['프론트엔드', '자바스크립트', '프레임워크비교', 'UI개발'],
  ['머신러닝', '파이썬', '데이터사이언스', 'AI개발'],
  ['클라우드', '인프라', '서버관리', '비용최적화'],
  ['데이터베이스', 'NoSQL', '데이터관리', '성능최적화'],
  ['블록체인', '암호화폐', '스마트계약', '분산시스템'],
  ['웹성능', 'WebAssembly', '브라우저기술', '최적화'],
  ['보안', '인증', '웹개발', '백엔드'],
  ['시스템설계', '아키텍처', 'MSA', '시스템통합'],
  ['프론트엔드', '웹성능', '사용자경험', '최적화기법']
];

// 대량의 블로그 게시물 데이터 생성 (100개)
const generateBlogPosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];
  const categories = ['개발 테크', '프론트엔드', '백엔드', '모바일', '데브옵스', '인공지능'];
  
  // Unsplash의 이미지 (Next.js에서 허용된 도메인)
  // 실제 검증된 이미지 URL만 사용
  const unsplashImages = [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1623282033815-40b05d96c903?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = 1; i <= 100; i++) {
    const titleIndex = (i - 1) % titles.length;
    const excerptIndex = (i - 1) % excerpts.length;
    const tagsIndex = (i - 1) % tagSets.length;
    const categoryIndex = (i - 1) % categories.length;
    const imageIndex = (i - 1) % unsplashImages.length;
    
    // 날짜와 조회수는 랜덤으로 생성
    const year = 2024 + Math.floor(Math.random() * 2); // 2024 또는 2025
    const month = Math.floor(Math.random() * 12) + 1; // 1-12
    const day = Math.floor(Math.random() * 28) + 1; // 1-28
    const views = Math.floor(Math.random() * 5000) + 100; // 100-5099
    
    posts.push({
      id: i,
      slug: `tech-post-${i}`,
      title: `${i}. ${titles[titleIndex]}`,
      category: categories[categoryIndex],
      excerpt: excerpts[excerptIndex],
      thumbnail: unsplashImages[imageIndex],
      date: `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`,
      views: views,
      tags: tagSets[tagsIndex]
    });
  }
  
  return posts;
};

// HOT 키워드
const hotKeywords = [
  '노코딩', '러스트TIP', '아이디어식스', '프로그래밍', '웹', '아이디어', '인공지능', '트렌드', '생성형AI'
];

// 블로그 게시물 데이터 생성
const blogPosts = generateBlogPosts();

// 기본 이미지 (이미지가 없거나 로드되지 않을 때 사용)
const fallbackImage = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop';

// 이미지 오류 핸들러
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (target.src !== fallbackImage) {
    target.src = fallbackImage;
  }
};

export default function DevTechPage() {
  const { setLoading } = useLoading();
  const [visiblePosts, setVisiblePosts] = useState(10); // 초기에 10개 게시물만 표시
  
  // 로딩 상태 처리
  React.useEffect(() => {
    setLoading(true, '개발 테크 페이지 로딩 중');
    
    // 데이터 준비 후 로딩 종료
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
  const popularPost = useMemo(() => blogPosts.find(post => post.id === 6), []);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white dark:text-white">Blog. 개발 테크</h1>
        <p className="text-gray-600 dark:text-gray-300 dark:text-gray-300">
          소프트웨어 개발의 기본 개념, 프로그래밍 언어, 시스템 설계, 애플리케이션 개발, 그리고 데이터베이스 관리 등의 노하우를 통해 IT 기술의 최신 트렌드와 프로젝트 개발에 도움이 되는 정보를 제공합니다.
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
              className="border border-gray-200 dark:border-gray-700 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-300"
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
                      onError={handleImageError}
                      loading="eager"
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
                      priority={index < 3}
                    />
                  </Link>
                </div>
                <div className="md:w-2/3 p-5">
                  <div className="text-sm text-blue-600 dark:text-blue-400 dark:text-blue-400 mb-2">{post.category}</div>
                  <Link href={`/blog/${post.slug}`} className="block">
                    <h2 className="text-xl font-bold mb-2 hover:text-blue-600 dark:text-blue-400 transition-colors">{post.title}</h2>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  
                  {/* 태그 목록 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag, idx) => (
                      <Link href={`/blog/tag/${tag}`} key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:bg-gray-600 transition-colors">
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
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
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
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
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
                    onError={handleImageError}
                    loading="eager"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
                    priority={true}
                  />
                </Link>
              </div>
              <div className="p-4">
                <Link href={`/blog/${popularPost.slug}`} className="block">
                  <h3 className="font-bold hover:text-blue-600 dark:text-blue-400 transition-colors mb-2">{popularPost.title}</h3>
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
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold flex items-center">
                <span className="text-red-500 mr-1">❤️</span> HOT 키워드
              </h3>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {hotKeywords.map((keyword, index) => (
                  <Link 
                    href={`/blog/tag/${keyword}`}
                    key={index}
                    className={`text-sm px-3 py-1.5 rounded-full ${
                      index % 4 === 0 ? 'bg-blue-100 text-blue-700 dark:text-blue-300' :
                      index % 4 === 1 ? 'bg-pink-100 text-pink-700' :
                      index % 4 === 2 ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    #{keyword}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          {/* 이전/다음 내비게이션 */}
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <button className="text-gray-400 disabled:opacity-50" disabled>
              &lt;
            </button>
            <span className="text-sm">
              <span className="text-red-500">😍</span> 인기 게시물 1/5
            </span>
            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-white transition-colors">
              &gt;
            </button>
          </div>
          
          {/* 통계 위젯 추가 */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-bold">카테고리별 게시물</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>개발 테크</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">56</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>프론트엔드</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>백엔드</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>데브옵스</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>모바일</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">8</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 추천 포스트 내비게이션 */}
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <button className="text-gray-400 disabled:opacity-50" disabled>
              &lt;
            </button>
            <span className="text-sm">
              <span className="text-yellow-500">👍</span> 추천 주제 게시물 1/5
            </span>
            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-white transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
} 