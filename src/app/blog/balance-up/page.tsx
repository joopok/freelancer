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

// 밸런스 UP 관련 블로그 게시물 데이터
const generateBalancePosts = (): BlogPost[] => {
  const titles = [
    '워라밸 실현을 위한 시간 관리 마스터하기',
    '재택근무 시대의 효과적인 업무 환경 조성',
    '번아웃 예방과 정신 건강 관리법',
    '직장인을 위한 스트레스 관리 전략',
    '업무 효율성을 높이는 생산성 도구 활용',
    '건강한 식습관으로 업무 에너지 충전하기',
    '운동과 업무의 균형 잡기: 직장인 헬스케어',
    '취미 생활로 찾는 일과 삶의 균형',
    '효과적인 휴식과 수면 관리 방법',
    '인간관계와 소통 능력 향상시키기',
    '자기계발과 커리어 성장의 균형',
    '부모 직장인의 육아와 업무 밸런스',
    '디지털 디톡스와 온라인 세상에서 벗어나기',
    '부업과 본업의 조화로운 병행 방법',
    '경제적 안정과 행복의 균형 찾기',
    '원격근무 환경에서의 팀워크 강화',
    '창의성과 업무 효율성 동시에 높이기',
    '장기적 목표와 단기적 성과의 균형',
    '직장 내 갈등 해결과 화합 방법',
    '미래 준비와 현재 만족의 밸런스'
  ];

  const excerpts = [
    '진정한 워라밸을 위한 체계적인 시간 관리 방법과 우선순위 설정, 효율적인 업무 스케줄링 기법을 실전 예시와 함께 소개합니다.',
    '재택근무 환경에서 집중력을 높이고 업무 효율성을 극대화하는 홈 오피스 구성법과 원격 업무 관리 노하우를 제시합니다.',
    '현대 직장인들이 겪는 번아웃 증상을 조기에 발견하고 예방하는 방법, 정신 건강을 지키는 실천 가능한 관리법을 알아봅니다.',
    '업무 스트레스의 원인을 파악하고 효과적으로 관리하는 다양한 기법과 긍정적인 마인드셋 형성 방법을 상세히 설명합니다.',
    '디지털 도구와 앱을 활용한 업무 자동화 방법과 생산성 향상을 위한 효율적인 워크플로우 구축 노하우를 공유합니다.',
    '바쁜 직장 생활 중에도 실천할 수 있는 건강한 식단 관리법과 영양 균형을 맞춘 식습관 형성 가이드를 제공합니다.',
    '직장인도 무리 없이 할 수 있는 운동 루틴과 건강 관리 방법, 운동과 업무의 시너지 효과를 창출하는 방법을 소개합니다.',
    '취미 활동을 통해 업무 스트레스를 해소하고 창의성을 기르는 방법, 개인 만족도를 높이는 여가 활동 선택법을 안내합니다.',
    '질 좋은 수면을 위한 환경 조성과 수면 패턴 개선 방법, 효과적인 휴식을 통한 업무 퍼포먼스 향상 기법을 제시합니다.',
    '직장 내 원활한 소통과 건전한 인간관계 형성을 위한 커뮤니케이션 스킬과 갈등 해결 방법을 실례와 함께 설명합니다.',
    '지속적인 자기계발과 커리어 성장을 추구하면서도 삶의 만족도를 유지하는 균형잡힌 성장 전략을 제시합니다.',
    '육아와 직장 생활을 병행하는 워킹맘/워킹대디를 위한 시간 관리법과 가족과 업무의 조화로운 균형 방법을 안내합니다.',
    '스마트폰과 SNS에 의존적인 현대인을 위한 디지털 디톡스 방법과 오프라인 활동의 중요성을 실천 방안과 함께 소개합니다.',
    '본업에 지장을 주지 않으면서 부업을 성공적으로 운영하는 방법과 시간 배분, 에너지 관리 전략을 상세히 설명합니다.',
    '돈과 행복 사이의 적절한 균형점을 찾고, 경제적 안정을 추구하면서도 삶의 질을 높이는 방법을 다양한 관점에서 제시합니다.',
    '물리적 거리가 있는 원격근무 환경에서도 팀워크를 강화하고 협업 효율성을 높이는 소통 방법과 도구 활용법을 소개합니다.',
    '일상 업무에서 창의적 사고를 발휘하면서도 업무 효율성을 동시에 높이는 방법과 혁신적 문제 해결 기법을 알아봅니다.',
    '장기적인 비전과 목표를 추구하면서도 단기적 성과를 놓치지 않는 균형잡힌 목표 설정과 실행 전략을 제시합니다.',
    '직장 내에서 발생하는 다양한 갈등 상황을 건설적으로 해결하고 조화로운 팀 분위기를 조성하는 실천 방법을 안내합니다.',
    '미래를 위한 준비와 투자를 하면서도 현재의 행복과 만족을 놓치지 않는 균형잡힌 인생 설계 방법을 종합적으로 제시합니다.'
  ];

  const tagSets = [
    ['워라밸', '시간관리', '업무효율', '생활균형'],
    ['재택근무', '홈오피스', '원격업무', '업무환경'],
    ['번아웃', '정신건강', '스트레스관리', '웰빙'],
    ['스트레스관리', '마인드셋', '감정관리', '심리건강'],
    ['생산성', '업무도구', '효율화', '자동화'],
    ['건강관리', '식습관', '영양관리', '에너지관리'],
    ['운동', '헬스케어', '체력관리', '건강한삶'],
    ['취미생활', '여가활동', '개인만족', '스트레스해소'],
    ['수면관리', '휴식', '회복', '컨디션관리'],
    ['인간관계', '소통능력', '커뮤니케이션', '대인관계'],
    ['자기계발', '커리어성장', '평생학습', '성장균형'],
    ['육아', '워킹맘', '가족', '일가정양립'],
    ['디지털디톡스', '온라인중독', '오프라인활동', '디지털웰빙'],
    ['부업', '사이드프로젝트', '다중소득', '시간배분'],
    ['경제관리', '재정계획', '행복', '만족도'],
    ['팀워크', '원격협업', '소통', '협업툴'],
    ['창의성', '혁신', '문제해결', '창의적사고'],
    ['목표설정', '장기계획', '단기성과', '균형'],
    ['갈등해결', '팀하모니', '조화', '화합'],
    ['미래준비', '현재만족', '인생설계', '라이프밸런스']
  ];

  const posts: BlogPost[] = [];
  const unsplashImages = [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = 0; i < 20; i++) {
    const year = 2024 + Math.floor(Math.random() * 2);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const views = Math.floor(Math.random() * 15000) + 800;
    
    posts.push({
      id: i + 1,
      slug: `balance-up-post-${i + 1}`,
      title: titles[i % titles.length],
      category: '밸런스 UP',
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
const blogPosts = generateBalancePosts();

// HOT 키워드
const hotKeywords = [
  '워라밸', '재택근무', '번아웃', '스트레스관리', 
  '생산성', '건강관리', '취미생활', '자기계발', '디지털디톡스'
];

export default function BalanceUpPage() {
  const { setLoading } = useLoading();
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 로딩 상태 처리
  React.useEffect(() => {
    setLoading(true, '밸런스 UP 페이지 로딩 중');
    
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
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Blog. 밸런스 UP</h1>
          <p className="text-gray-600 dark:text-gray-300">
            일과 삶의 균형(워라밸)을 위한 실용적인 팁과 노하우를 공유합니다. 
            시간 관리, 스트레스 해소, 건강 관리, 자기계발 등 더 나은 삶을 위한 밸런스 전략을 제공합니다.
          </p>
        </div>
              
        <BlogMenuSearch currentPage="balance-up" />
        
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
                  <span className="text-red-500 mr-1">⚖️</span> HOT 키워드
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
                    <span className="text-gray-600 dark:text-gray-300">워라밸 & 시간관리</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">72</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">건강 & 웰빙</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">56</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">자기계발 & 성장</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">43</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">관계 & 소통</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">38</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">라이프스타일</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">45</span>
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