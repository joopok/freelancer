'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoading } from '@/components/layout/Loading';
import { motion } from 'framer-motion';

// AI 컬럼 뉴스 타입 정의
interface AIColumnNews {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  date: string;
  views: number;
  tags: string[];
  author?: string;
}

// 예시 AI 컬럼 뉴스 데이터
const aiColumnNewsData: AIColumnNews[] = [
  {
    id: 1,
    slug: 'openai-gpt5-announcement',
    title: 'OpenAI, GPT-5 출시 계획 발표... "인간 수준의 추론 능력" 강조',
    excerpt: 'OpenAI가 GPT-5의 출시 계획을 발표했습니다. 새 모델은 인간 수준의 추론 능력을 갖추고 있다고 회사 측은 밝혔습니다.',
    thumbnail: '/images/blog/tech-news/gpt5.jpg',
    date: '2025.03.10',
    views: 2340,
    tags: ['OpenAI', 'GPT-5', '인공지능', '머신러닝'],
    author: '김인공'
  },
  {
    id: 2,
    slug: 'anthropic-claude-3-5',
    title: 'Anthropic의 새로운 AI 모델 Claude 3.5, 멀티모달 능력 대폭 향상',
    excerpt: 'Anthropic이 차세대 AI 모델 Claude 3.5를 공개했습니다. 텍스트를 넘어 이미지, 오디오, 비디오 처리 능력이 크게 향상되었습니다.',
    thumbnail: '/images/blog/tech-news/claude-3-5.jpg',
    date: '2025.03.08',
    views: 1890,
    tags: ['Anthropic', 'Claude', '멀티모달AI', '생성형AI'],
    author: '이생성'
  },
  {
    id: 3,
    slug: 'ai-code-generation',
    title: '코드 생성 AI의 발전과 한계: 개발자는 교체될 것인가?',
    excerpt: '코드 생성 AI 도구들이 발전하면서 개발자의 역할에 대한 질문이 제기되고 있습니다. 이 기술의 현재 상태와 미래 전망을 살펴봅니다.',
    thumbnail: '/images/blog/tech-news/ai-coding.jpg',
    date: '2025.03.05',
    views: 1560,
    tags: ['코드생성', 'AI개발', '자동화', '개발자커리어'],
    author: '박코딩'
  },
  {
    id: 4,
    slug: 'ai-regulation-update',
    title: '인공지능 규제 최신 동향: 글로벌 정책 변화와 영향',
    excerpt: '전 세계적으로 AI 규제 프레임워크가 발전하고 있습니다. 주요 국가의 정책 변화와 기업들에 미치는 영향을 분석합니다.',
    thumbnail: '/images/blog/tech-news/ai-regulation.jpg',
    date: '2025.03.01',
    views: 1290,
    tags: ['AI규제', '정책동향', '글로벌AI', '데이터윤리'],
    author: '최정책'
  },
  {
    id: 5,
    slug: 'multimodal-ai-healthcare',
    title: '멀티모달 AI가 의료 진단의 정확도를 높이는 방법',
    excerpt: '여러 유형의 데이터를 통합하여 분석하는 멀티모달 AI 시스템이 의료 진단의 정확도를 높이고 있습니다. 최신 연구와 적용 사례를 소개합니다.',
    thumbnail: '/images/blog/tech-news/ai-healthcare.jpg',
    date: '2025.02.25',
    views: 1120,
    tags: ['헬스케어AI', '의료진단', '멀티모달AI', '의료혁신'],
    author: '정의료'
  },
  {
    id: 6,
    slug: 'llm-reasoning-advances',
    title: 'LLM의 추론 능력이 한 단계 발전: 새로운 훈련 방법론의 성과',
    excerpt: '대규모 언어 모델(LLM)의 추론 능력을 향상시키는 새로운 훈련 방법론이 개발되었습니다. 이 접근법의 기술적 세부사항과 의미를 살펴봅니다.',
    thumbnail: '/images/blog/tech-news/llm-reasoning.jpg',
    date: '2025.02.20',
    views: 980,
    tags: ['LLM', '기계학습', 'AI추론', '딥러닝'],
    author: '한딥러닝'
  }
];

export default function AIColumnPage() {
  const { setLoading } = useLoading();

  // 로딩 상태 처리
  useEffect(() => {
    setLoading(true, 'AI 컬럼 페이지 로딩 중');
    
    // 데이터 준비 후 로딩 종료
      setLoading(false);
  }, [setLoading]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">AI 컬럼</h1>
        <p className="text-gray-600">
          인공지능 분야의 최신 동향, 연구 결과, 그리고 현업에서의 적용 사례를 소개하는 컬럼입니다.
          전문가의 통찰과 함께 AI 기술의 미래를 전망해 봅니다.
        </p>
      </div>
      
      {/* 주요 컬럼 */}
      <div className="mb-12">
        {aiColumnNewsData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="lg:col-span-2 bg-blue-50 rounded-xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 relative h-64 md:h-auto">
                  <Image
                    src={aiColumnNewsData[0].thumbnail}
                    alt={aiColumnNewsData[0].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6 md:p-8">
                  <div className="flex items-center text-sm text-blue-600 mb-2">
                    <span className="mr-2">주목할 만한 소식</span>
                    <span>•</span>
                    <span className="ml-2">{aiColumnNewsData[0].date}</span>
                  </div>
                  <Link href={`/blog/tech-news/ai-column/${aiColumnNewsData[0].slug}`}>
                    <h2 className="text-2xl font-bold mb-3 hover:text-blue-600 transition-colors">
                      {aiColumnNewsData[0].title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mb-4">
                    {aiColumnNewsData[0].excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {aiColumnNewsData[0].tags.map((tag, index) => (
                      <Link href={`/blog/tag/${tag.toLowerCase()}`} key={index} className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-700 hover:bg-blue-200 transition-colors">
                        #{tag}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                        {aiColumnNewsData[0].author ? aiColumnNewsData[0].author.charAt(0) : 'A'}
                      </div>
                      <span className="text-sm text-gray-600">
                        {aiColumnNewsData[0].author || '익명'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">조회수 {aiColumnNewsData[0].views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* AI 컬럼 목록 */}
        <h2 className="text-xl font-bold mb-4">최신 AI 컬럼</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiColumnNewsData.slice(1).map((news) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/tech-news/ai-column/${news.slug}`}>
                <div className="relative h-48">
                  <Image
                    src={news.thumbnail}
                    alt={news.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2 hover:text-blue-600 transition-colors">
                    {news.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {news.excerpt}
                  </p>
                  
                  {/* 태그 목록 */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {news.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <span>{news.date}</span>
                      {news.author && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{news.author}</span>
                        </>
                      )}
                    </div>
                    <span>조회수 {news.views}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* AI 트렌드 */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">주목할 AI 트렌드</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                1
              </div>
              <div>
                <h3 className="font-medium">멀티모달 AI의 부상</h3>
                <p className="text-sm text-gray-600">텍스트, 이미지, 오디오, 비디오를 통합 처리하는 AI 모델이 표준화되고 있습니다.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                2
              </div>
              <div>
                <h3 className="font-medium">인공지능 규제 강화</h3>
                <p className="text-sm text-gray-600">각국 정부와 국제기구가 AI 규제 프레임워크를 발전시키고 있습니다.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                3
              </div>
              <div>
                <h3 className="font-medium">AI 모델의 경량화</h3>
                <p className="text-sm text-gray-600">엣지 디바이스에서도 고성능 AI를 구현할 수 있는 경량 모델이 발전하고 있습니다.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                4
              </div>
              <div>
                <h3 className="font-medium">AI 개인화 서비스</h3>
                <p className="text-sm text-gray-600">개인 맞춤형 AI 어시스턴트와 서비스가 일상 생활에 통합되고 있습니다.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* 구독 섹션 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">AI 전문가의 통찰력을 정기적으로 받아보세요</h2>
        <p className="mb-4 text-blue-50">최신 AI 기술과 동향에 대한 심층 분석을 이메일로 받아보세요.</p>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            type="email" 
            placeholder="이메일 주소" 
            className="flex-1 px-4 py-2 border border-transparent rounded-lg text-gray-800 focus:outline-none"
          />
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium">
            구독하기
          </button>
        </div>
      </div>
    </div>
  );
} 