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

// 실리콘밸리 AI 컬럼 관련 블로그 게시물 데이터
const generateSiliconValleyAIPosts = (): BlogPost[] => {
  const titles = [
    'OpenAI ChatGPT-5 출시가 가져올 혁신과 변화',
    '구글 Gemini AI의 멀티모달 기능과 미래 전망',
    'Meta의 LLaMA 3.0: 오픈소스 AI의 새로운 표준',
    '실리콘밸리 스타트업들의 AI 비즈니스 모델 분석',
    'NVIDIA H200 GPU와 AI 컴퓨팅의 미래',
    'Anthropic Claude 4: 인간 중심 AI의 진화',
    '실리콘밸리 AI 인재 영입 전쟁과 연봉 동향',
    'AI 에이전트 시대: 자율형 AI의 현실과 가능성',
    '테슬라 FSD와 자율주행 AI의 최신 발전',
    '실리콘밸리 VC들의 AI 투자 트렌드 2025',
    'AI 칩 전쟁: 인텔 vs AMD vs NVIDIA',
    '실리콘밸리 AI 윤리 논쟁과 규제 동향',
    'AGI(인공일반지능) 개발 경쟁의 현황',
    '실리콘밸리 AI 스타트업 성공 사례 분석',
    '생성형 AI가 바꾸는 콘텐츠 산업의 미래',
    'AI 로봇틱스 융합: Boston Dynamics의 혁신',
    '실리콘밸리 AI 기업들의 특허 전쟁',
    'AI와 바이오테크의 만남: 신약 개발 혁신',
    '실리콘밸리 AI 교육 혁명과 온라인 학습',
    'AI 보안과 사이버 위협 대응의 최전선'
  ];

  const excerpts = [
    'OpenAI의 차세대 모델 ChatGPT-5가 가져올 기술적 혁신과 산업 전반에 미칠 파급효과를 실리콘밸리 내부 전문가 의견과 함께 심층 분석합니다.',
    '구글의 멀티모달 AI 모델 Gemini의 최신 업데이트와 텍스트, 이미지, 음성을 통합한 차세대 AI 인터페이스의 가능성을 탐구합니다.',
    'Meta가 공개한 LLaMA 3.0의 기술적 특징과 오픈소스 AI 생태계에 미치는 영향을 실리콘밸리 개발자 커뮤니티 반응과 함께 분석합니다.',
    '실리콘밸리 AI 스타트업들이 구축하고 있는 혁신적인 비즈니스 모델과 수익 창출 전략을 최신 펀딩 라운드 데이터를 바탕으로 소개합니다.',
    'NVIDIA의 차세대 AI 가속기 H200 GPU의 성능 개선 사항과 AI 컴퓨팅 인프라 발전이 가져올 변화를 기술적 관점에서 상세히 분석합니다.',
    'Anthropic의 Claude 4 모델이 추구하는 인간 중심 AI 철학과 안전한 AI 개발을 위한 혁신적 접근 방식을 실제 사용 사례와 함께 소개합니다.',
    '실리콘밸리 테크 기업들의 AI 전문가 채용 경쟁과 급등하는 연봉 수준, ML 엔지니어와 AI 연구자의 시장 가치 변화를 데이터로 분석합니다.',
    '자율적으로 작업을 수행하는 AI 에이전트 기술의 현재 수준과 실리콘밸리 기업들이 개발 중인 에이전트 시스템의 실제 활용 사례를 소개합니다.',
    '테슬라의 완전 자율주행(FSD) 기술 최신 업데이트와 실리콘밸리 자율주행 업계의 기술 경쟁 현황을 실제 도로 테스트 결과와 함께 분석합니다.',
    '실리콘밸리 벤처캐피털들의 2025년 AI 투자 동향과 주목받는 AI 분야, 투자 규모 변화를 주요 VC 파트너들의 인터뷰와 함께 제시합니다.',
    'AI 칩 시장을 놓고 벌어지는 글로벌 기업들의 경쟁 구도와 실리콘밸리 반도체 업계의 최신 기술 개발 동향을 심층 분석합니다.',
    '실리콘밸리 AI 기업들이 직면한 윤리적 딜레마와 규제 대응 전략, AI 안전성 확보를 위한 업계 자율 규제 노력을 구체적 사례로 살펴봅니다.',
    '인공일반지능(AGI) 달성을 목표로 하는 실리콘밸리 AI 연구소들의 개발 경쟁과 현재까지의 기술적 성과를 전문가 평가와 함께 정리합니다.',
    '실리콘밸리에서 성공한 AI 스타트업들의 창업 스토리와 성공 요인, 초기 투자부터 IPO까지의 여정을 상세한 케이스 스터디로 분석합니다.',
    '생성형 AI 기술이 미디어, 게임, 광고 등 콘텐츠 산업에 미치는 혁신적 변화와 실리콘밸리 크리에이티브 테크 기업들의 대응 전략을 소개합니다.',
    'Boston Dynamics를 비롯한 실리콘밸리 로봇틱스 기업들의 AI 통합 로봇 개발 현황과 상용화 전망을 최신 데모 영상과 함께 분석합니다.',
    '실리콘밸리 AI 기업들 간의 특허 분쟁과 지적재산권 보호 전략, AI 기술의 특허 출원 동향을 법률 전문가 의견과 함께 정리합니다.',
    'AI 기술과 바이오테크놀로지의 융합이 가져오는 신약 개발 혁신과 실리콘밸리 바이오 AI 스타트업들의 연구 성과를 실제 사례로 소개합니다.',
    '실리콘밸리 에듀테크 기업들이 AI를 활용한 개인화 학습 시스템과 온라인 교육 플랫폼 혁신으로 만들어가는 교육의 미래를 탐구합니다.',
    'AI 기반 사이버 보안 솔루션과 AI를 활용한 해킹 기법 사이의 대결, 실리콘밸리 보안 업계의 최신 동향을 보안 전문가 관점에서 분석합니다.'
  ];

  const tagSets = [
    ['OpenAI', 'ChatGPT', 'GPT-5', 'LLM'],
    ['Google', 'Gemini', '멀티모달AI', 'AI통합'],
    ['Meta', 'LLaMA', '오픈소스AI', 'AI생태계'],
    ['AI스타트업', '비즈니스모델', '실리콘밸리', 'AI투자'],
    ['NVIDIA', 'H200', 'AI칩', 'GPU컴퓨팅'],
    ['Anthropic', 'Claude', '안전한AI', 'AI윤리'],
    ['AI인재', '연봉', '채용', '실리콘밸리구인'],
    ['AI에이전트', '자율AI', 'AGI', '인공지능'],
    ['Tesla', '자율주행', 'FSD', 'AI자동차'],
    ['VC투자', 'AI펀딩', '벤처투자', '스타트업'],
    ['AI칩전쟁', 'Intel', 'AMD', 'NVIDIA'],
    ['AI윤리', 'AI규제', '안전성', '책임AI'],
    ['AGI', '인공일반지능', 'AI연구', '실리콘밸리AI'],
    ['AI성공사례', '스타트업', 'IPO', 'AI기업'],
    ['생성형AI', '콘텐츠AI', 'AI크리에이티브', '미디어AI'],
    ['로봇틱스', 'BostonDynamics', 'AI로봇', '로봇AI'],
    ['AI특허', '지적재산권', 'AI법률', '특허전쟁'],
    ['바이오AI', '신약개발', 'AI의료', '바이오테크'],
    ['에듀테크', 'AI교육', '온라인학습', 'AI러닝'],
    ['AI보안', '사이버보안', 'AI해킹', '보안AI']
  ];

  const posts: BlogPost[] = [];
  const unsplashImages = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600&auto=format&fit=crop'
  ];

  for (let i = 0; i < 20; i++) {
    const year = 2024 + Math.floor(Math.random() * 2);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const views = Math.floor(Math.random() * 25000) + 1200;
    
    posts.push({
      id: i + 1,
      slug: `silicon-valley-ai-post-${i + 1}`,
      title: titles[i % titles.length],
      category: '실리콘밸리 AI 컬럼',
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
const blogPosts = generateSiliconValleyAIPosts();

// HOT 키워드
const hotKeywords = [
  'OpenAI', 'ChatGPT', 'Google', 'AI스타트업', 
  'NVIDIA', 'AGI', '자율주행', 'AI투자', 'AI윤리'
];

export default function SiliconValleyAIPage() {
  const { setLoading } = useLoading();
  const [visiblePosts, setVisiblePosts] = useState(10);
  
  // 로딩 상태 처리
  React.useEffect(() => {
    setLoading(true, '실리콘밸리 AI 컬럼 페이지 로딩 중');
    
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
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Blog. 실리콘밸리 AI 컬럼</h1>
          <p className="text-gray-600 dark:text-gray-300">
            실리콘밸리 현지에서 전하는 AI 기술 동향과 혁신 소식을 전문가 시각으로 분석합니다. 
            OpenAI, Google, Meta 등 글로벌 AI 리더들의 최신 기술과 투자 동향을 심층 보도합니다.
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
                  <span className="text-red-500 mr-1">🤖</span> HOT 키워드
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
                    <span className="text-gray-600 dark:text-gray-300">AI 기업 동향</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">투자 & 펀딩</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">67</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">기술 혁신</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">74</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">AI 윤리 & 규제</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">인재 & 채용</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">32</span>
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