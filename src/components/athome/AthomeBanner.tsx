'use client';

import React from 'react';

interface AthomeBannerProps {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AthomeBanner({ searchTerm, handleSearchChange }: AthomeBannerProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600 dark:from-gray-900 dark:via-purple-900 dark:to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bannerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#7e22ce" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#db2777" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#bannerGradient)" />
          <g filter="url(#glow)">
            <circle cx="70" cy="30" r="6" fill="white" opacity="0.4">
              <animate attributeName="r" values="6;8;6" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="30" cy="70" r="4" fill="white" opacity="0.3">
              <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
          <circle cx="0" cy="0" r="20" fill="url(#radialGradient)">
            <animateMotion path="M 50 50 L 90 30 L 50 70 L 10 50 Z" dur="15s" repeatCount="indefinite" />
          </circle>
          <circle cx="0" cy="0" r="15" fill="url(#radialGradient)">
            <animateMotion path="M 50 50 L 10 30 L 50 10 L 90 50 Z" dur="12s" repeatCount="indefinite" />
          </circle>
          <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#bannerGradient)" opacity="0.5">
            <animate attributeName="d"
              values="M0,0 L100,0 L100,100 L0,100 Z; M0, 0 L100, 0 L90, 100 L10, 90 Z; M0, 0 L100, 0 L100, 100 L0, 100 Z"
              dur="20s"
              repeatCount="indefinite" />
          </path>
          <ellipse cx="20" cy="20" rx="30" ry="10" fill="white" opacity="0.05" />
          <ellipse cx="80" cy="80" rx="20" ry="30" fill="white" opacity="0.05" />
          <polygon points="85,25 90,35 80,35" fill="white" opacity="0.15">
            <animateTransform attributeName="transform" type="rotate" from="0 85 30" to="360 85 30" dur="24s" repeatCount="indefinite" />
          </polygon>
          <polygon points="15,75 25,85 20,70" fill="white" opacity="0.1">
            <animateTransform attributeName="transform" type="rotate" from="0 20 75" to="360 20 75" dur="30s" repeatCount="indefinite" />
          </polygon>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-2/3 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              재택 <span className="text-pink-300 inline-block relative">
                프로젝트
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-pink-300 opacity-50 rounded"></div>
                <div className="relative inline-block">
                  <span className="absolute -right-5 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full opacity-70 animate-pulse-scale"></span>
                </div>
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-indigo-100 max-w-3xl font-light">
              장소에 구애받지 않고 자유롭게 진행할 수 있는 원격 프로젝트를 찾아보세요
            </p>

            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md p-2 flex items-center max-w-3xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-600/30 hover:border-white/30 dark:hover:border-gray-500/50 transition-all group">
              <input
                type="text"
                placeholder="기술 스택, 프로젝트명, 회사명으로 검색..."
                className="flex-1 px-6 py-4 outline-none text-gray-800 dark:text-white text-lg bg-white dark:bg-gray-700 rounded-xl shadow-inner dark:border-gray-600 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all font-medium shadow-md ml-2 group-hover:shadow-lg transform group-hover:scale-[1.02] duration-200">
                검색
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>검증된 프로젝트</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span>100+ 클라이언트</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>다양한 프로젝트</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block md:w-1/3 relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -top-10 -right-10 w-80 h-80 z-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  <defs>
                    <filter id="beam-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <g filter="url(#beam-glow)" className="beam-group">
                    <path d="M 100,100 L 180,40" stroke="url(#beam-gradient)" strokeWidth="3" fill="none">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="strokeWidth" values="2;4;2" dur="3s" repeatCount="indefinite" />
                    </path>
                    <circle cx="180" cy="40" r="5" fill="#a855f7">
                      <animate attributeName="r" values="4;7;4" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </g>
                  <g filter="url(#beam-glow)" className="beam-group">
                    <path d="M 100,100 L 170,100" stroke="url(#beam-gradient)" strokeWidth="3" fill="none">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
                      <animate attributeName="strokeWidth" values="2;4;2" dur="4s" repeatCount="indefinite" />
                    </path>
                    <circle cx="170" cy="100" r="5" fill="#a855f7">
                      <animate attributeName="r" values="4;7;4" dur="4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />
                    </circle>
                  </g>
                  <g filter="url(#beam-glow)" className="beam-group">
                    <path d="M 100,100 L 160,160" stroke="url(#beam-gradient)" strokeWidth="3" fill="none">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="5s" repeatCount="indefinite" />
                      <animate attributeName="strokeWidth" values="2;4;2" dur="5s" repeatCount="indefinite" />
                    </path>
                    <circle cx="160" cy="160" r="5" fill="#a855f7">
                      <animate attributeName="r" values="4;7;4" dur="5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="5s" repeatCount="indefinite" />
                    </circle>
                  </g>
                  <circle cx="100" cy="100" r="15" fill="#4f46e5">
                    <animate attributeName="r" values="12;15;12" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="fillOpacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
            </div>

            <div className="relative z-10 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 dark:border-gray-600/30 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    R
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-bold text-white">
                      재택 프로젝트
                      <div className="relative inline-block">
                        <span className="absolute -right-5 top-0 w-6 h-6 bg-white rounded-full opacity-70 animate-pulse-scale"></span>
                      </div>
                    </h3>
                    <div className="flex items-center text-sm text-purple-200">
                      <span>오늘 업데이트 <span className="font-semibold">15건</span></span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-lg animate-pulse">
                  인기
                </div>
              </div>

              <div className="space-y-3 mt-4">
                <div className="bg-white/10 dark:bg-gray-700/50 backdrop-blur-md p-3 rounded-xl flex items-center group hover:bg-white/20 dark:hover:bg-gray-600/50 transition-all cursor-pointer">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white text-sm">AI 추천 시스템</span>
                    <div className="text-xs text-indigo-200 dark:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">월 평균 4,500만원</div>
                  </div>
                </div>
                <div className="bg-white/10 dark:bg-gray-700/50 backdrop-blur-md p-3 rounded-xl flex items-center group hover:bg-white/20 dark:hover:bg-gray-600/50 transition-all cursor-pointer">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white text-sm">블록체인 결제</span>
                    <div className="text-xs text-indigo-200 dark:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">월 평균 7,000만원</div>
                  </div>
                </div>
                <div className="bg-white/10 dark:bg-gray-700/50 backdrop-blur-md p-3 rounded-xl flex items-center group hover:bg-white/20 dark:hover:bg-gray-600/50 transition-all cursor-pointer">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3 group-hover:scale-110 transition-transform">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white text-sm">IoT 모니터링</span>
                    <div className="text-xs text-indigo-200 dark:text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">월 평균 4,000만원</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 relative">
                <button className="w-full bg-white/10 dark:bg-gray-700/50 backdrop-blur-md border border-white/20 dark:border-gray-600/30 text-white py-3 rounded-xl hover:bg-white/20 dark:hover:bg-gray-600/50 transition-colors text-sm font-medium relative z-10 group">
                  <span className="group-hover:scale-105 transition-transform inline-block">프로젝트 더보기</span>
                </button>
                <div className="absolute -bottom-1 -right-1 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-xl -z-0 opacity-50 animate-pulse"></div>
              </div>

              <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 rounded-lg text-white text-xs shadow-lg flex items-center space-x-1 transform rotate-3">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>230% 성장률</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="relative h-16">
          <div className="absolute bottom-0 left-0 w-full">
            <svg className="w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path
                d="M0,0 C150,90 350,0 500,80 C650,160 750,40 900,100 C1050,160 1150,60 1200,80 L1200,120 L0,120 Z"
                className="fill-white opacity-70"
              >
                <animate
                  attributeName="d"
                  dur="10s"
                  repeatCount="indefinite"
                  values="
                    M0,0 C150,90 350,0 500,80 C650,160 750,40 900,100 C1050,160 1150,60 1200,80 L1200,120 L0,120 Z;
                    M0,0 C150,40 350,80 500,20 C650,60 750,120 900,40 C1050,20 1150,80 1200,60 L1200,120 L0,120 Z;
                    M0,0 C150,90 350,0 500,80 C650,160 750,40 900,100 C1050,160 1150,60 1200,80 L1200,120 L0,120 Z"
                />
              </path>
            </svg>
          </div>

          <div className="absolute bottom-4 left-1/4 animate-bounce-slow opacity-80">
            <div className="bg-white p-2 rounded-full shadow-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 animate-float opacity-80">
            <div className="bg-white p-2 rounded-full shadow-lg">
              <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-6 left-3/4 animate-pulse opacity-80">
            <div className="bg-white p-2 rounded-full shadow-lg">
              <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-8px) translateX(5px);
          }
          50% {
            transform: translateY(0) translateX(10px);
          }
          75% {
            transform: translateY(8px) translateX(5px);
          }
        }
        
        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
