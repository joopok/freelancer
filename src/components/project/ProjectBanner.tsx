'use client';

import React, { memo } from 'react';

interface ProjectBannerProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// SVG 애니메이션을 별도 컴포넌트로 분리하여 메모이제이션
const BannerAnimation = memo(() => (
  <div className="absolute inset-0 opacity-20">
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bannerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#4338ca" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bannerGradient)" />
    </svg>
  </div>
));

BannerAnimation.displayName = 'BannerAnimation';

// 우측 프로젝트 카드 컴포넌트
const ProjectCard = memo(() => (
  <div className="hidden md:block md:w-1/3 relative">
    <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
    
    <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            S
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold text-white">상주 프로젝트</h3>
            <div className="flex items-center text-sm text-blue-200">
              <span>오늘 업데이트 <span className="font-semibold">12건</span></span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-lg">
          인기
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        <ProjectCardItem 
          icon="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
          title="ERP 시스템 고도화"
          subtitle="월 평균 6,500만원"
        />
        <ProjectCardItem 
          icon="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
          title="클라우드 마이그레이션"
          subtitle="월 평균 5,500만원"
        />
        <ProjectCardItem 
          icon="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
          title="모바일 앱 개발"
          subtitle="월 평균 3,200만원"
        />
      </div>
      
      <div className="mt-6 relative">
        <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium relative z-10 group">
          <span className="group-hover:scale-105 transition-transform inline-block">프로젝트 더보기</span>
        </button>
      </div>
    </div>
  </div>
));

ProjectCard.displayName = 'ProjectCard';

// 프로젝트 카드 아이템 컴포넌트
const ProjectCardItem = memo(({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) => (
  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl flex items-center group hover:bg-white/20 transition-all cursor-pointer">
    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 group-hover:scale-110 transition-transform">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d={icon} />
      </svg>
    </div>
    <div>
      <span className="text-white text-sm">{title}</span>
      <div className="text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity">{subtitle}</div>
    </div>
  </div>
));

ProjectCardItem.displayName = 'ProjectCardItem';

// 메인 배너 컴포넌트
const ProjectBanner = memo(({ searchTerm, onSearchChange }: ProjectBannerProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-600 dark:from-gray-900 dark:via-purple-900 dark:to-black text-white relative overflow-hidden">
      <BannerAnimation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-2/3 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
              상주 <span className="text-blue-300 inline-block relative">
                프로젝트
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-300 opacity-50 rounded"></div>
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl font-light">
              고객사 사무실에서 직접 진행하는 검증된 상주 개발 프로젝트를 찾아보세요
            </p>

            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md p-2 flex items-center max-w-3xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-600/30 hover:border-white/30 dark:hover:border-gray-500/50 transition-all group">
              <input
                type="text"
                placeholder="기술 스택, 프로젝트명, 회사명으로 검색..."
                className="flex-1 px-6 py-4 outline-none text-gray-800 dark:text-white text-lg bg-white dark:bg-gray-700 rounded-xl shadow-inner dark:border-gray-600 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={onSearchChange}
              />
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-500 dark:to-purple-500 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all font-medium shadow-md ml-2 group-hover:shadow-lg transform group-hover:scale-[1.02] duration-200">
                검색
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-8">
              <Badge icon="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" text="검증된 프로젝트" />
              <Badge icon="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" text="200+ 클라이언트" />
              <Badge icon="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" text="안정적인 장기 프로젝트" />
            </div>
          </div>
          
          <ProjectCard />
        </div>
      </div>
    </div>
  );
});

ProjectBanner.displayName = 'ProjectBanner';

// 배지 컴포넌트
const Badge = memo(({ icon, text }: { icon: string; text: string }) => (
  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center">
    <svg className="w-5 h-5 mr-2 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d={icon} clipRule="evenodd" />
    </svg>
    <span>{text}</span>
  </div>
));

Badge.displayName = 'Badge';

export default ProjectBanner;