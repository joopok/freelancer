"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useLoading } from '@/components/layout/Loading';
import { useAuthStore } from '@/store/auth';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/common/ThemeToggle';

// 통계 데이터
const stats = [
  { id: 1, label: '등록된 프리랜서', value: '14,500+', icon: '👥' },
  { id: 2, label: '진행중인 프로젝트', value: '2,300+', icon: '💼' },
  { id: 3, label: '완료된 프로젝트', value: '32,400+', icon: '🏆' },
  { id: 4, label: '월 평균 계약금액', value: '800만원+', icon: '📊' },
];

// 카테고리 목록
const categories = [
  { id: 1, name: '웹 개발', imageUrl: '/images/category-web.jpg', count: 254 },
  { id: 2, name: '앱 개발', imageUrl: '/images/category-app.jpg', count: 189 },
  { id: 3, name: '디자인', imageUrl: '/images/category-design.jpg', count: 176 },
  { id: 4, name: '마케팅', imageUrl: '/images/category-marketing.jpg', count: 143 },
  { id: 5, name: '콘텐츠 제작', imageUrl: '/images/category-content.jpg', count: 128 },
  { id: 6, name: '기획/PM', imageUrl: '/images/category-planning.jpg', count: 97 },
];

// 추천 프로젝트
const featuredProjects = [
  {
    id: 1,
    title: '블록체인 기반 핀테크 서비스 앱 개발',
    company: '(주)디지털페이',
    budget: '5,000만원',
    duration: '6개월',
    skills: ['React Native', 'Node.js', 'Blockchain'],
    type: '재택',
    deadline: '2025.03.15',
  },
  {
    id: 2,
    title: '대형 커머스 플랫폼 리뉴얼 프로젝트',
    company: '(주)쇼핑몰파트너스',
    budget: '4,000만원',
    duration: '4개월',
    skills: ['React.js', 'TypeScript', 'Next.js'],
    type: '상주',
    deadline: '2025.03.05',
  },
  {
    id: 3,
    title: '글로벌 마케팅 대시보드 구축',
    company: '(주)글로벌마케팅그룹',
    budget: '3,500만원',
    duration: '3개월',
    skills: ['Vue.js', 'D3.js', 'Firebase'],
    type: '재택',
    deadline: '2025.02.28',
  },
];

// 추천 프리랜서
const featuredFreelancers = [
  {
    id: 1,
    name: '김개발',
    position: '풀스택 개발자',
    experience: '10년+',
    skills: ['React', 'Node.js', 'AWS'],
    avatar: '/images/freelancer1.jpg',
    rating: 4.9,
  },
  {
    id: 2,
    name: '이디자인',
    position: 'UX/UI 디자이너',
    experience: '8년+',
    skills: ['Figma', 'Adobe XD', 'Photoshop'],
    avatar: '/images/freelancer2.jpg',
    rating: 4.8,
  },
  {
    id: 3,
    name: '박기획',
    position: '프로젝트 매니저',
    experience: '12년+',
    skills: ['기획', 'JIRA', 'Scrum'],
    avatar: '/images/freelancer3.jpg',
    rating: 4.9,
  },
  {
    id: 4,
    name: '최마케팅',
    position: '디지털 마케터',
    experience: '7년+',
    skills: ['SEO', '소셜미디어', '콘텐츠 마케팅'],
    avatar: '/images/freelancer4.jpg',
    rating: 4.7,
  },
];

// 사용자 후기
const testimonials = [
  {
    id: 1,
    name: '황시현',
    position: '프리랜서 대표이사 CEO',
    quote: '프리랜서로 일하면서 가장 힘든 건 좋은 프로젝트를 찾는 것이었는데, 여기서는 AI가 제 경력과 스킬에 맞는 프로젝트를 추천해줘서 정말 편해요.',
    avatar: '/images/testimonial1.jpg',
  },
  {
    id: 2,
    name: '류대리',
    position: '프리랜서 5개월차',
    quote: '이전에는 단가가 불투명하고 대금 지급도 불안했는데, 이 플랫폼을 통해 안전하게 일할 수 있게 되었습니다. 강력 추천합니다!',
    avatar: '/images/testimonial2.jpg',
  },
  {
    id: 3,
    name: '조스타트',
    position: '스타트업 대표',
    quote: '덕분에 일찾기이 때보다 2배는 더 벌고 있어요. 무엇보다 제 실력을 제대로 인정받는느낌이 좋습니다.',
    avatar: '/images/testimonial3.jpg',
  },
];

// 히어로 섹션 캐러셀용 프로젝트 데이터
const heroProjects = [
  {
    id: 1,
    title: '블록체인 기반 핀테크 앱 개발',
    company: '(주)디지털페이',
    budget: '5,000만원',
    duration: '6개월',
    skills: ['React Native', 'Blockchain', 'Node.js'],
    bgColor: 'from-purple-600 to-indigo-700',
  },
  {
    id: 2,
    title: '대형 커머스 플랫폼 리뉴얼',
    company: '(주)쇼핑몰파트너스',
    budget: '4,000만원',
    duration: '4개월',
    skills: ['React.js', 'TypeScript', 'Next.js'],
    bgColor: 'from-blue-600 to-indigo-700',
  },
  {
    id: 3,
    title: '글로벌 마케팅 대시보드 구축',
    company: '(주)글로벌마케팅그룹',
    budget: '3,500만원',
    duration: '3개월',
    skills: ['Vue.js', 'D3.js', 'Firebase'],
    bgColor: 'from-cyan-600 to-blue-700',
  },
  {
    id: 4,
    title: 'AI 기반 추천 시스템 개발',
    company: '(주)테크인사이트',
    budget: '4,500만원',
    duration: '5개월',
    skills: ['Python', 'TensorFlow', 'AWS'],
    bgColor: 'from-pink-600 to-purple-700',
  },
  {
    id: 5,
    title: '메타버스 플랫폼 개발',
    company: '(주)메타랩스',
    budget: '8,000만원',
    duration: '6개월',
    skills: ['Unity', 'WebGL', 'Three.js'],
    bgColor: 'from-indigo-600 to-violet-700',
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { setLoading } = useLoading();
  const [isVisible, setIsVisible] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0); // 현재 활성화된 카드 인덱스
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn); // 로그인 상태 관리
  const router = useRouter();

  // 스크롤 애니메이션 훅들
  const statsAnimation = useScrollAnimation();
  const categoriesAnimation = useStaggeredAnimation(categories.length, 150);
  const projectsAnimation = useStaggeredAnimation(featuredProjects.length, 200);
  const freelancersAnimation = useStaggeredAnimation(featuredFreelancers.length, 100);

  // 스크롤 위치에 따라 애니메이션 활성화
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 캐러셀 자동 회전
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCardIndex((prevIndex) => (prevIndex + 1) % heroProjects.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // 이전 카드로 이동
  const prevCard = () => {
    setActiveCardIndex((prevIndex) => 
      prevIndex === 0 ? heroProjects.length - 1 : prevIndex - 1
    );
  };
  
  // 다음 카드로 이동
  const nextCard = () => {
    setActiveCardIndex((prevIndex) => 
      (prevIndex + 1) % heroProjects.length
    );
  };

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      setLoading(true);
      // 검색 페이지로 이동
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      
      // 로딩 상태 1초 후 해제 (페이지 전환 효과를 위해)
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  // 페이지 이동 함수
  const navigateTo = (href: string) => {
    setLoading(true);
    router.push(href);
    
    // 로딩 상태 1초 후 해제 (페이지 전환 효과를 위해)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <main>
        {/* 히어로 섹션 */}
        <section className="relative overflow-hidden">

          {/* 배경 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 dark:from-gray-900 dark:via-purple-900 dark:to-black transition-colors duration-300"></div>
          
          {/* 배경 패턴 */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '60px 60px'
            }}></div>
            {/* 빛나는 원형 요소 */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-30 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                {/* 서브헤딩 */}
                <div className="flex items-center mb-5">
                  <span className="inline-block h-1 w-14 bg-pink-500 rounded mr-3"></span>
                  <span className="text-pink-500 font-semibold tracking-wider uppercase text-sm">국내 1위 프리랜서 플랫폼</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight text-white">
                  최고의 프리랜서와<br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-400">가치 있는 프로젝트</span>의<br />
                  만남
                </h1>
                
                <p className="text-xl md:text-2xl mb-10 text-blue-100 font-light">
                    잡코리아 빌보드에서 당신의 !!< br />커리어를 새롭게 디자인하세요.
                    <br />프리랜서 일하면서 겪는 모든 불편함을 해결합니다.
                    <br />단가부터 일정까지, 모든 것이 투명하고 공정합니다.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/freelancer')}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-5 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl text-white group relative overflow-hidden"
                  >
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                    <div className="relative flex items-center justify-center gap-2">
                      <span>프리랜서 찾기</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateTo('/project')}
                    className="bg-transparent backdrop-blur-sm border-2 border-white/30 hover:border-white text-white px-8 py-5 rounded-lg font-bold text-lg transition-all"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>프로젝트 보기</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                  </div>
                  </motion.button>
                </div>
                
                {/* 통계 배지 */}
                <div className="flex flex-wrap gap-4 mt-14">
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm flex items-center">
                    <span className="text-pink-400 mr-2">✓</span>
                    14,500+ 검증된 프리랜서
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm flex items-center">
                    <span className="text-pink-400 mr-2">✓</span>
                    32,400+ 완료된 프로젝트
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block relative"
              >
                {/* 3D 회전 캐러셀 */}
                <div className="relative h-[550px] w-full perspective-1000">
                  {/* 5개의 카드 */}
                  <div className="relative h-[450px] w-full">
                    {heroProjects.map((project, index) => {
                      // 각 카드의 위치와 회전을 계산
                      const isActive = index === activeCardIndex;
                      const isPrev = 
                        index === (activeCardIndex === 0 ? heroProjects.length - 1 : activeCardIndex - 1);
                      const isNext = 
                        index === (activeCardIndex === heroProjects.length - 1 ? 0 : activeCardIndex + 1);
                      const isFarPrev = 
                        index === (activeCardIndex <= 1 ? heroProjects.length - (2 - activeCardIndex) : activeCardIndex - 2);
                      const isFarNext = 
                        index === (activeCardIndex >= heroProjects.length - 2 ? (activeCardIndex + 2) - heroProjects.length : activeCardIndex + 2);
                      
                      let position = '';
                      let transform = '';
                      let zIndex = 0;
                      let opacity = 0;
                      
                      if (isActive) {
                        position = 'top-0 right-[calc(50%-225px)]';
                        transform = 'rotateY(0deg) scale(1)';
                        zIndex = 50;
                        opacity = 1;
                      } else if (isPrev) {
                        position = 'top-10 right-[calc(75%-225px)]';
                        transform = 'rotateY(25deg) scale(0.9)';
                        zIndex = 40;
                        opacity = 0.7;
                      } else if (isNext) {
                        position = 'top-10 right-[calc(25%-225px)]';
                        transform = 'rotateY(-25deg) scale(0.9)';
                        zIndex = 40;
                        opacity = 0.7;
                      } else if (isFarPrev) {
                        position = 'top-20 right-[calc(90%-225px)]';
                        transform = 'rotateY(45deg) scale(0.8)';
                        zIndex = 30;
                        opacity = 0.4;
                      } else if (isFarNext) {
                        position = 'top-20 right-[calc(10%-225px)]';
                        transform = 'rotateY(-45deg) scale(0.8)';
                        zIndex = 30;
                        opacity = 0.4;
                      } else {
                        position = 'top-0 right-[calc(50%-225px)]';
                        transform = 'rotateY(0deg) scale(0.7)';
                        zIndex = 10;
                        opacity = 0;
                      }
                      
                      return (
                        <motion.div
                          key={project.id}
                          initial={false}
                          animate={{
                            x: 0,
                            opacity: opacity,
                          }}
                          transition={{
                            duration: 0.7,
                            ease: "easeInOut"
                          }}
                          onClick={() => navigateTo(`/project/${project.id}`)}
                          className={`absolute ${position} w-[450px] h-[450px] rounded-3xl shadow-2xl overflow-hidden preserve-3d cursor-pointer group`}
                          style={{
                            transform: transform,
                            transformStyle: 'preserve-3d',
                            zIndex: zIndex,
                            opacity: opacity,
                            transition: 'all 0.7s ease-in-out',
                          }}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${project.bgColor} p-8 flex flex-col justify-end group-hover:brightness-110 transition-all duration-300`}>
                            <div className="flex justify-between items-center mb-6">
                              <div className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm">프리미엄 프로젝트</div>
                              <div className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm">D-{10 + index}</div>
                      </div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-2xl font-bold text-white flex-1">{project.title}</h3>
                              <motion.button
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  navigateTo(`/project/${project.id}`);
                                }}
                                whileHover={{ scale: 1.1, x: 3 }}
                                whileTap={{ scale: 0.95 }}
                                className="ml-3 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200 group"
                                aria-label={`${project.title} 프로젝트 상세보기`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </motion.button>
                            </div>
                            <p className="text-blue-100 mb-4">{project.company}</p>
                            <div className="flex gap-2 mb-6">
                              {project.skills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                                  {skill}
                        </span>
                      ))}
                    </div>
                            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-lg p-4">
                              <div className="flex justify-between text-white mb-2">
                                <span>예산</span>
                                <span className="font-bold">{project.budget}</span>
                              </div>
                              <div className="flex justify-between text-white">
                                <span>기간</span>
                                <span className="font-bold">{project.duration}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
              </div>

                  {/* 캐러셀 컨트롤 */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 mt-8">
                    <button 
                      onClick={prevCard}
                      className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors focus:outline-none"
                      aria-label="이전 프로젝트"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="flex gap-2 items-center">
                      {heroProjects.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveCardIndex(index)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            index === activeCardIndex 
                              ? 'bg-white scale-125' 
                              : 'bg-white/40 hover:bg-white/60'
                          }`}
                          aria-label={`프로젝트 ${index + 1}로 이동`}
                        />
                      ))}
                    </div>
                    
                    <button 
                      onClick={nextCard}
                      className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-colors focus:outline-none"
                      aria-label="다음 프로젝트"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* 부유하는 3D 오브젝트들은 유지 */}
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4,
                      ease: "easeInOut" 
                    }}
                    className="absolute top-[15%] left-[10%] w-16 h-16 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 rotate-12 shadow-lg z-10"
                  />
                  <motion.div
                    animate={{ 
                      y: [0, 15, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 5,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute bottom-[25%] right-[15%] w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg z-10"
                  />
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 20,
                      ease: "linear"
                    }}
                    className="absolute top-[40%] left-[22%] w-20 h-20 rounded-full border-4 border-dashed border-pink-400/30 z-10"
                      />
                    </div>
              </motion.div>
                  </div>
                </div>
          
          {/* 하단 웨이브 효과 */}
          <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
            <svg className="absolute bottom-0 w-full h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#f9fafb" className="dark:fill-gray-900" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
              </div>
        </section>

        {/* 검색 섹션 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-10 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transition-colors duration-300">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="기술, 직무, 프로젝트 등을 검색해보세요"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-colors duration-200"
                />
            </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg font-bold text-lg transition-colors"
              >
                검색하기
              </button>
            </form>
          </div>
        </section>

        {/* 주요 카테고리 섹션 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16 relative">
            {/* 배경 장식 요소 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-10 w-40 h-40 bg-gradient-to-r from-blue-300 to-pink-300 rounded-full filter blur-[100px] opacity-50"></div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">인기 카테고리</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-5 transition-colors duration-300">
                다양한 분야의 프로젝트와 재능 있는 프리랜서들을 만나보세요
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-2"></div>
            </motion.div>
                </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: category.id * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.03,
                    transition: { duration: 0.3 } 
                  }}
                  className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer h-80"
                  onClick={() => navigateTo(`/category/${category.id}`)}
                >
                  {/* 배경 효과 */}
                  <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-900/40 group-hover:bg-gray-900/50 dark:group-hover:bg-gray-900/30 transition-all duration-300 z-10"></div>
                  <div className="absolute inset-0">
                    <div className={`w-full h-full bg-gradient-to-br from-${category.id % 2 === 0 ? 'blue' : 'indigo'}-500 to-${category.id % 3 === 0 ? 'purple' : category.id % 2 === 0 ? 'indigo' : 'blue'}-700 dark:from-${category.id % 2 === 0 ? 'blue' : 'indigo'}-400 dark:to-${category.id % 3 === 0 ? 'purple' : category.id % 2 === 0 ? 'indigo' : 'blue'}-600 group-hover:scale-110 transition-all duration-700`}></div>
                    {/* 패턴 오버레이 효과 */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10 mix-blend-overlay"></div>
            </div>

                  {/* 빛나는 테두리 효과 */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 group-hover:glow-white-sm rounded-2xl z-20 transition-all duration-500"></div>
                  
                  {/* 3D hover 효과를 위한 요소들 */}
                  <motion.div 
                    whileHover={{ rotateY: 5, rotateX: -5 }}
                    className="absolute inset-0 z-30 preserve-3d"
                  >
                    <div className="absolute inset-0 flex flex-col justify-end p-8 z-30">
                      {/* 카테고리 아이콘 */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-white/20 dark:bg-white/30 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 border border-white/20 dark:border-white/40">
                          <span className="text-white text-3xl drop-shadow-lg">
                            {category.id === 1 && '💻'}
                            {category.id === 2 && '📱'}
                            {category.id === 3 && '🎨'}
                            {category.id === 4 && '📊'}
                            {category.id === 5 && '📝'}
                            {category.id === 6 && '📋'}
                          </span>
                        </div>
                    </div>

                    <motion.h3 
                      className="text-white text-2xl lg:text-3xl font-bold mb-3 transform origin-left group-hover:translate-x-2 transition-transform duration-300 drop-shadow-lg"
                    >
                      {category.name}
                    </motion.h3>
                    
                    <div className="flex justify-between items-center">
                      <div className="bg-white/20 dark:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20 dark:border-white/40 shadow-lg">
                        {category.count}+ 프로젝트
                      </div>
                      <div className="w-10 h-10 bg-white/20 dark:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transform translate-x-0 group-hover:translate-x-2 transition-all duration-300 border border-white/20 dark:border-white/40 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  </motion.div>
                </motion.div>
              ))}
                </div>

            {/* 하단 전체보기 버튼 */}
            <div className="mt-14 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateTo('/categories')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-400/30 hover:shadow-xl group"
              >
                모든 카테고리 보기
                <span className="transform group-hover:translate-x-1 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </motion.button>
                </div>
        </section>

        {/* 통계 섹션 */}
        <motion.section 
          ref={statsAnimation.elementRef}
          className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 relative overflow-hidden transition-colors duration-300"
          initial={{ opacity: 0, y: 50 }}
          animate={statsAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {/* 배경 애니메이션 요소들 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-float"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={statsAnimation.isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                숫자로 보는 잡코리아 빌보드
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                우리는 신뢰할 수 있는 플랫폼을 통해 최고의 매칭을 제공합니다
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={statsAnimation.isVisible ? { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { delay: index * 0.1 + 0.3 }
                  } : { opacity: 0, y: 50, scale: 0.8 }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div 
                      className="mb-6 text-4xl group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.p 
                      className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2"
                      initial={{ scale: 0 }}
                      animate={statsAnimation.isVisible ? { 
                        scale: 1,
                        transition: { delay: index * 0.1 + 0.5, type: "spring", stiffness: 200 }
                      } : { scale: 0 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 추천 프로젝트 섹션 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 dark:bg-gray-900 transition-colors duration-300">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white transition-colors duration-300">추천 프로젝트</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  검증된 클라이언트의 맞춤형 프로젝트를 만나보세요. <br />
              </p>
            </div>
              <button
              onClick={() => navigateTo('/project')}
              className="hidden md:block text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              모든 프로젝트 보기 →
              </button>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <motion.div
                  key={project.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300"
                onClick={() => navigateTo(`/project/${project.id}`)}
              >
                <div className="p-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    project.type === '재택' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                  }`}>
                          {project.type}
                      </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2 dark:text-white transition-colors duration-300">{project.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">{project.company}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                        {project.skills.map((skill, index) => (
                          <span
                            key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm transition-colors duration-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4 transition-colors duration-300">
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">예산</p>
                        <p className="font-semibold dark:text-white transition-colors duration-300">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">기간</p>
                        <p className="font-semibold dark:text-white transition-colors duration-300">{project.duration}</p>
                    </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">마감일</p>
                        <p className="font-semibold dark:text-white transition-colors duration-300">{project.deadline}</p>
                  </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          
          <div className="mt-8 text-center md:hidden">
            <button 
              onClick={() => navigateTo('/project')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              모든 프로젝트 보기 →
            </button>
          </div>
        </section>

        {/* 추천 프리랜서 섹션 */}
        <section className="bg-gray-50 dark:bg-gray-800 py-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white transition-colors duration-300">추천 프리랜서</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  검증된 실력의 맞춤형 프리랜서를 만나보세요
                </p>
              </div>
              <button 
                onClick={() => navigateTo('/freelancer')}
                className="hidden md:block text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                모든 프리랜서 보기 →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredFreelancers.map((freelancer) => (
                <motion.div
                  key={freelancer.id}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-600 transition-all duration-300"
                  onClick={() => navigateTo(`/freelancer/${freelancer.id}`)}
                >
                  <div className="relative h-48 bg-blue-50 dark:bg-blue-900/30 transition-colors duration-300">
                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
                      <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 overflow-hidden bg-gray-200 dark:bg-gray-600 transition-colors duration-300">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-600 dark:to-blue-800">
                          <span className="text-white text-2xl font-bold">{freelancer.name.charAt(0)}</span>
                      </div>
                      </div>
                    </div>
                        </div>
                    <div className="pt-16 p-6 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-medium dark:text-white transition-colors duration-300">{freelancer.rating}</span>
                          </div>
                      <h3 className="text-xl font-bold mb-1 dark:text-white transition-colors duration-300">{freelancer.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-300">{freelancer.position}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">경력 {freelancer.experience}</p>
                      
                      <div className="flex flex-wrap justify-center gap-2">
                        {freelancer.skills.map((skill, index) => (
                              <span
                                key={index}
                            className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm transition-colors duration-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                  </motion.div>
                ))}
              </div>
              
                          <div className="mt-8 text-center md:hidden">
              <button 
                onClick={() => navigateTo('/freelancer')}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                모든 프리랜서 보기 →
              </button>
            </div>
            </div>
          </section>

        {/* 플랫폼 특징 섹션 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">왜 잡코리아 빌보드를 선택해야 할까요?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              우리는 프리랜서와 기업 모두에게 최고의 경험을 제공합니다
            </p>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-blue-600 text-3xl">👥</span>
                </div>
                <h3 className="text-xl font-bold mb-4">검증된 프리랜서</h3>
                  <p className="text-gray-700">
              까다롭고 엄격한 스크리닝을 통과한<br />전문 프리랜서만 활동합니다.
              </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-blue-600 text-3xl">💼</span>
                </div>
                <h3 className="text-xl font-bold mb-4">안전한 대금계약 시스템</h3>
                  <p className="text-gray-600">
                  표준 계약서와 에스크로 결제로<br />
                  프로젝트 완료 후 7일 내<br />
                  100% 안전하게 정산됩니다.
              </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center"
              >
                <div className="bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-blue-600 text-3xl">🏠</span>
                </div>
                <h3 className="text-xl font-bold mb-4">다양한 근무 방식</h3>
                  <p className="text-gray-600">
  상주, 재택, 부분 출근 등 다양한 < br /> 근무 방식으로 유연하게 일할 수 있으며, <br />
                  상위 1% 를 위한 특별한 프리미엄 프로젝트를 만나보세요.
                </p>
              </motion.div>
            </div>
          </section>

          {/* 후기 섹션 */}
          <section className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">사용자 후기</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
                  실제 사용자들의 생생한 경험을 들어보세요
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  >
                    {/* 별점 */}
                    <div className="flex items-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">★</span>
                      ))}
                    </div>
                    
                    {/* 후기 내용 */}
                    <blockquote className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-8 transition-colors duration-300">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    {/* 사용자 정보 */}
                    <div className="flex items-center">
                      <div className="w-14 h-14 rounded-full overflow-hidden mr-4 flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
                          <span className="text-white font-bold text-lg">{testimonial.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-base transition-colors duration-300">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{testimonial.position}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA 섹션 */}
          {!isLoggedIn && (
            <section className="bg-gradient-to-r from-purple-600 to-purple-800 dark:from-gray-800 dark:to-gray-900 text-white py-20 transition-all duration-300">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white transition-colors duration-300 leading-tight">
                  지금 시작하세요<br />
                  더 나은 내일이 기다립니다
                </h2>
                <p className="text-xl text-purple-100 dark:text-gray-300 max-w-4xl mx-auto mb-10 transition-colors duration-300 leading-relaxed">
                  프리랜서로 시작해서 성공적인 사업가가 된 수만 명의 전문가들이<br />
                  이미 프리랜스 프로와 함께하고 있습니다
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={() => navigateTo('/register')}
                    className="bg-white dark:bg-gray-200 text-purple-700 dark:text-gray-800 hover:bg-purple-50 dark:hover:bg-gray-100 px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    회원가입
                  </button>
                  <button 
                    onClick={() => navigateTo('/login')}
                    className="bg-transparent border-2 border-white dark:border-gray-300 text-white dark:text-gray-300 hover:bg-white dark:hover:bg-gray-300 hover:text-purple-700 dark:hover:text-gray-800 px-10 py-5 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
                  >
                    로그인
                </button>
              </div>
        </div>
          </section>
        )}
      </main>
    </div>
  );
} 