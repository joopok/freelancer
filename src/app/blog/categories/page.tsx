'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLoading } from '@/components/layout/Loading';
import { motion } from 'framer-motion';

// 카테고리 타입 정의
interface Category {
  id: string;
  name: string;
  count: number;
  description: string;
  icon: string;
}

export default function BlogCategoriesPage() {
  const { setLoading } = useLoading();
  
  // 페이지 로드 시 로딩 효과 표시 추가
  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000); // 1초 로딩 효과로 줄임
    
    return () => clearTimeout(timer);
  }, [setLoading]);
  
  // 카테고리 데이터
  const categories: Category[] = [
    {
      id: "freelancer",
      name: "프리랜서",
      count: 12,
      description: "프리랜서 생활, 프로젝트 찾기, 성공 전략에 관한 글",
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    },
    {
      id: "job-info",
      name: "취업정보",
      count: 18,
      description: "취업 시장 동향, 면접 준비, 이력서 작성 팁",
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    },
    {
      id: "remote-work",
      name: "재택근무",
      count: 15,
      description: "원격 근무 팁, 생산성 향상, 재택근무 장단점",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    },
    {
      id: "portfolio",
      name: "포트폴리오",
      count: 8,
      description: "포트폴리오 제작 가이드, 우수 사례, 포트폴리오 준비 팁",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    },
    {
      id: "lifestyle",
      name: "라이프스타일",
      count: 10,
      description: "개발자/프리랜서의 건강, 워라밸, 자기계발 관련 글",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    },
    {
      id: "tech-trends",
      name: "기술 트렌드",
      count: 21,
      description: "최신 기술 동향, 새로운 프로그래밍 언어, 개발 패러다임",
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    },
    {
      id: "career",
      name: "커리어",
      count: 14,
      description: "경력 개발, 전문성 향상, 이직 준비, 커리어 패스 설계",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    },
    {
      id: "interviews",
      name: "인터뷰",
      count: 7,
      description: "현업 개발자, 프리랜서, 스타트업 창업자들과의 인터뷰",
      icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 인터랙티브 블로그 헤더 */}
      <div className="relative overflow-hidden">
        {/* 배경 그래디언트 및 패턴 */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 z-0" />
        
        {/* 배경 패턴 */}
        <div 
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* 움직이는 그래픽 요소들 */}
        <motion.div 
          className="absolute -right-16 -top-16 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 z-0"
          animate={{ 
            scale: [1, 1.2, 1.1, 1, 0.9, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.5, 0.6, 0.5, 0.7, 0.5]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <motion.div 
          className="absolute -left-16 -bottom-16 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 z-0"
          animate={{ 
            scale: [1, 1.1, 1.2, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.6, 0.5, 0.7, 0.5, 0.6]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        {/* 콘텐츠 */}
        <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-8 md:mb-0">
                  <motion.h1 
                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <span className="block">블로그 카테고리</span>
                    <span className="block text-blue-100 mt-2 text-3xl md:text-4xl">관심 분야를 탐색하세요</span>
                  </motion.h1>
                  
                  <motion.p 
                    className="text-lg md:text-xl opacity-90 max-w-lg mb-6"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    전문성과 경험을 공유하는 다양한 주제의 블로그 카테고리를 둘러보고
                    필요한 정보를 찾아보세요.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <Link 
                      href="/blog"
                      className="inline-flex items-center px-6 py-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all text-white font-medium backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      블로그 홈으로 돌아가기
                    </Link>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="grid grid-cols-2 gap-3 w-full max-w-xs"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      className="aspect-square bg-white bg-opacity-10 backdrop-blur-sm rounded-xl flex items-center justify-center"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    >
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={categories[i].icon} />
                      </svg>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* 흘러내리는 그래디언트 효과 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      </div>
      
      {/* 카테고리 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(category => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href={`/blog?category=${category.id}`}
                className="block group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full p-8 flex flex-col">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-colors">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 flex items-center">
                    {category.name}
                    <span className="ml-2 text-sm text-gray-500 font-normal">({category.count})</span>
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="mt-auto">
                    <span className="text-indigo-600 flex items-center group-hover:text-indigo-800">
                      더 보기
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 