'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 커뮤니티 메뉴 타입 정의
interface CommunityMenu {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  count: number;
}

export default function CommunityPage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  // 스크롤 위치 추적
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 커뮤니티 메뉴 데이터
  const communityMenus: CommunityMenu[] = [
    {
      id: "board",
      name: "자유게시판",
      description: "다양한 주제에 대해 자유롭게 의견을 나누는 공간입니다.",
      icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
      path: "/community/board",
      count: 128
    },
    {
      id: "qna",
      name: "질문과 답변",
      description: "취업, 이직, 커리어 관련 질문을 하고 전문가의 답변을 받아보세요.",
      icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      path: "/community/qna",
      count: 85
    },
    {
      id: "gallery",
      name: "갤러리",
      description: "포트폴리오, 작업물, 취업 성공 스토리 등 다양한 이미지를 공유해보세요.",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      path: "/community/gallery",
      count: 64
    },
    {
      id: "events",
      name: "이벤트",
      description: "채용설명회, 네트워킹 모임, 온라인 세미나 등 다양한 이벤트 정보를 확인하세요.",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      path: "/community/events",
      count: 42
    },
    {
      id: "free",
      name: "자유주제",
      description: "커리어, 직장생활, 일상 등 어떤 주제든 자유롭게 이야기해보세요.",
      icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z",
      path: "/community/free",
      count: 156
    },
    {
      id: "study",
      name: "스터디/모임",
      description: "함께 공부하고 성장할 수 있는 스터디와 모임을 찾거나 개설해보세요.",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      path: "/community/study",
      count: 73
    },
    {
      id: "project-review",
      name: "프로젝트 후기",
      description: "완성된 프로젝트에 대한 경험과 후기를 공유하고 피드백을 받아보세요.",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      path: "/community/project-review",
      count: 58
    }
  ];

  // 최근 인기 게시글 데이터
  const popularPosts = [
    {
      id: 1,
      title: "신입 개발자가 알아야 할 5가지 팁",
      author: "김개발",
      likes: 128,
      comments: 32,
      category: "board"
    },
    {
      id: 2,
      title: "프리랜서 첫 계약 시 주의사항",
      author: "이프리",
      likes: 96,
      comments: 24,
      category: "qna"
    },
    {
      id: 3,
      title: "포트폴리오 리뷰 부탁드립니다!",
      author: "박디자인",
      likes: 85,
      comments: 41,
      category: "gallery"
    },
    {
      id: 4,
      title: "다음 주 개발자 채용설명회 정보",
      author: "최인사",
      likes: 74,
      comments: 18,
      category: "events"
    },
    {
      id: 5,
      title: "재택근무 1년 후기 (장단점 총정리)",
      author: "정재택",
      likes: 112,
      comments: 56,
      category: "free"
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 인터랙티브한 헤더 섹션 */}
      <div 
        ref={headerRef}
        className="relative min-h-[90vh] overflow-hidden"
      >
        {/* 그라데이션 배경 */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 z-0 transition-colors duration-300"
          style={{
            opacity: Math.max(0.85, 1 - scrollY * 0.001)
          }}
        />
        
        {/* 배경 패턴 */}
        <div 
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        />
        
        {/* 움직이는 그래픽 요소들 */}
        <motion.div 
          className="absolute w-72 h-72 rounded-full bg-white opacity-5" 
          style={{ 
            top: '10%', 
            left: '5%',
            x: scrollY * 0.1,
            y: scrollY * -0.1
          }}
        />
        <motion.div 
          className="absolute w-96 h-96 rounded-full bg-blue-300 opacity-10" 
          style={{ 
            bottom: '-10%', 
            right: '-5%',
            x: scrollY * -0.15,
            y: scrollY * 0.05 
          }}
        />
        
        {/* 3D 도형 요소 - 현대적인 느낌을 더함 */}
        <motion.div
          className="absolute w-40 h-40 bg-gradient-to-br from-violet-300 to-indigo-400 rounded-xl opacity-20"
          style={{
            top: '25%',
            left: '22%',
            rotate: scrollY * 0.02,
            y: scrollY * 0.08,
            transformStyle: 'preserve-3d',
            transform: `perspective(1000px) rotateX(${scrollY * 0.02}deg) rotateY(${scrollY * 0.01}deg)`
          }}
        />
        <motion.div
          className="absolute w-36 h-36 bg-gradient-to-tr from-blue-300 to-violet-400 rounded-full opacity-20"
          style={{
            top: '15%',
            right: '15%',
            rotate: scrollY * -0.02,
            y: scrollY * -0.05,
            transformStyle: 'preserve-3d',
            transform: `perspective(1000px) rotateX(${scrollY * -0.01}deg) rotateY(${scrollY * -0.02}deg)`
          }}
        />
        
        {/* 내용 컨테이너 - 글래스모피즘 효과 */}
        <div className="relative h-full flex items-center z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 왼쪽 텍스트 영역 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="block">커뮤니티와 함께</span>
                <span className="block mt-2 text-blue-200 dark:text-blue-300">성장하는 경험</span>
              </h1>
              <p className="mt-6 text-xl sm:text-2xl text-blue-50 dark:text-gray-300 max-w-2xl">
                다양한 개발자, 디자이너, 기획자들과 함께 소통하고 지식을 공유하며 
                당신의 커리어를 한 단계 더 발전시키세요.
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 rounded-full shadow-lg bg-white text-violet-700 font-medium text-lg transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  커뮤니티 탐색하기
                </motion.button>
                <motion.a
                  href="#community-explore"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-6 py-3 rounded-full border-2 border-white text-white font-medium text-lg transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  더 알아보기
                </motion.a>
              </div>
            </motion.div>
            
            {/* 오른쪽 인터랙티브 비주얼 영역 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              {/* 글래스모피즘 카드 효과 */}
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
                
                {/* 메인 카드 컨테이너 */}
                <div className="relative bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20 dark:border-gray-600/30 shadow-xl">
                  <h3 className="text-2xl font-bold text-white dark:text-gray-100 mb-6">인기 커뮤니티</h3>
                  
                  <div className="space-y-4">
                    {communityMenus.slice(0, 3).map((menu) => (
                      <motion.div
                        key={menu.id}
                        whileHover={{ 
                          x: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.15)'
                        }}
                        className="flex items-center p-3 rounded-xl cursor-pointer transition-all"
                        onMouseEnter={() => setActiveMenu(menu.id)}
                        onMouseLeave={() => setActiveMenu(null)}
                      >
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-white/15 dark:bg-gray-600/30">
                          <svg className="w-6 h-6 text-white dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={menu.icon} />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-white dark:text-gray-100">{menu.name}</h4>
                          <p className="text-blue-200 dark:text-gray-300 text-sm">{menu.count}개의 게시글</p>
                        </div>
                        <div className="ml-auto">
                          <svg className="w-5 h-5 text-white/70 dark:text-gray-300/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-white/15 dark:bg-gray-600/20 text-white dark:text-gray-100 text-sm font-medium hover:bg-white/25 dark:hover:bg-gray-600/30 transition-all"
                    >
                      모든 커뮤니티 보기
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* 스크롤 다운 인디케이터 */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <a href="#community-explore">
            <svg className="w-10 h-10 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </motion.div>
        
        {/* 물결 모양 디바이더 */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-gray-50 dark:text-gray-900"></path>
          </svg>
        </div>
      </div>
      
      {/* 여기서부터 기존 콘텐츠 영역 */}
      <div id="community-explore" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 커뮤니티 카테고리 그리드 */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">커뮤니티 둘러보기</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              다양한 주제의 커뮤니티에서 소통하고, 지식을 공유하며, 함께 성장해보세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {communityMenus.map((menu, index) => (
              <motion.div
                key={menu.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-105 border border-gray-200 dark:border-gray-700"
              >
                <Link href={menu.path} className="block p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={menu.icon} />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {menu.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{menu.count}개 게시글</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {menu.description}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
                    바로가기
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* 인기 게시글 섹션 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">인기 게시글</h3>
              <Link href="/community/board" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors">
                더보기 →
              </Link>
            </div>
            <div className="space-y-4">
              {popularPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer border border-gray-100 dark:border-gray-600"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>👍 {post.likes}</span>
                      <span className="mx-2">•</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 