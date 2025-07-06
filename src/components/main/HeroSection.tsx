'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';

import { HeroProject } from '@/types/project';

export function HeroSection({ heroProjects }: { heroProjects: HeroProject[] }) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCardIndex((prevIndex) => (prevIndex + 1) % heroProjects.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroProjects.length]);

  const navigateTo = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  const prevCard = () => {
    setActiveCardIndex((prevIndex) =>
      prevIndex === 0 ? heroProjects.length - 1 : prevIndex - 1
    );
  };

  const nextCard = () => {
    setActiveCardIndex((prevIndex) => (prevIndex + 1) % heroProjects.length);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 dark:from-gray-900 dark:via-purple-900 dark:to-black transition-colors duration-300"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500 opacity-25 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500 opacity-25 blur-3xl" />
      </div>
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-30 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 lg:col-span-2 -mt-[3.75rem]"
          >
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
                잡코리아 빌보드에서 당신의 커리어를 새롭게 디자인하세요.
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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="hidden lg:block relative lg:col-span-3"
          >
            <div className="relative h-[550px] w-full overflow-visible" style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}>
              <div className="relative h-[450px] w-full overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
                {heroProjects.map((project, index) => {
                  const isActive = index === activeCardIndex;
                  const isPrev = index === (activeCardIndex === 0 ? heroProjects.length - 1 : activeCardIndex - 1);
                  const isNext = index === (activeCardIndex === heroProjects.length - 1 ? 0 : activeCardIndex + 1);
                  const isFarPrev = index === (activeCardIndex <= 1 ? heroProjects.length - (2 - activeCardIndex) : activeCardIndex - 2);
                  const isFarNext = index === (activeCardIndex >= heroProjects.length - 2 ? (activeCardIndex + 2) - heroProjects.length : activeCardIndex + 2);
                  
                  let position = '';
                  let zIndex = 0;
                  let opacity = 0;
                  
                  if (isActive) {
                    position = 'top-0 left-[40%]';
                    zIndex = 100;
                    opacity = 1;
                  } else if (isPrev) {
                    position = 'top-20 left-[0%]';
                    zIndex = 80;
                    opacity = 0.8;
                  } else if (isNext) {
                    position = 'top-20 left-[80%]';
                    zIndex = 80;
                    opacity = 0.8;
                  } else if (isFarPrev) {
                    position = 'top-32 left-[-15%]';
                    zIndex = 60;
                    opacity = 0.4;
                  } else if (isFarNext) {
                    position = 'top-32 left-[95%]';
                    zIndex = 60;
                    opacity = 0.4;
                  } else {
                    position = 'top-40 left-[40%]';
                    zIndex = 40;
                    opacity = 0;
                  }
                  
                  return (
                    <motion.div
                      key={project.id}
                      initial={false}
                      animate={{
                        opacity: opacity,
                        scale: isActive ? 1.05 : isPrev || isNext ? 0.85 : isFarPrev || isFarNext ? 0.7 : 0.5,
                        rotateY: isActive ? 0 : isPrev ? 15 : isNext ? -15 : isFarPrev ? 25 : isFarNext ? -25 : 0,
                        x: 0,
                        y: isActive ? -10 : 0,
                        z: isActive ? 30 : isPrev || isNext ? -50 : -100,
                      }}
                      transition={{
                        opacity: { duration: 0.4 },
                        scale: { type: "spring", stiffness: 100, damping: 30 },
                        rotateY: { type: "spring", stiffness: 60, damping: 20 },
                        y: { type: "spring", stiffness: 100, damping: 25 },
                        z: { duration: 0.4 },
                      }}
                      onClick={() => navigateTo(`/project/${project.id}`)}
                      className={`absolute ${position} w-[400px] h-[380px] rounded-2xl shadow-2xl overflow-hidden cursor-pointer group will-change-transform`}
                      style={{
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'center center',
                        backfaceVisibility: 'hidden',
                        perspective: 1200,
                        zIndex: zIndex,
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${project.bgColor} p-8 flex flex-col justify-end group-hover:brightness-110 transition-all duration-500 ease-out`}>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
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

              <div className="absolute bottom-20 left-[35%] right-[5%] flex justify-center gap-4 z-[110]">
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
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: 20, y: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                onClick={() => navigateTo('/freelancer')}
                className="absolute top-[5%] left-[0%] w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg z-10 cursor-pointer hover:shadow-xl transition-all duration-300 transform rotate-12 will-change-transform"
              />
              <motion.div
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                onClick={() => navigateTo('/project')}
                className="absolute bottom-[15%] right-[5%] w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg z-10 cursor-pointer hover:shadow-xl transition-all duration-300 will-change-transform"
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                onClick={() => navigateTo('/categories')}
                className="absolute top-[50%] left-[8%] w-20 h-20 rounded-full border-4 border-dashed border-purple-400/30 z-10 cursor-pointer hover:border-purple-400/50 transition-all duration-300 will-change-transform"
                  />
                </div>
          </motion.div>
              </div>
            </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg className="absolute bottom-0 w-full h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#f9fafb" className="dark:fill-gray-900" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
          </div>
    </section>
  );
}