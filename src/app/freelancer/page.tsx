'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MultiSearchInput from '@/components/common/MultiSearchInput';
import { freelancerService, type FreelancerSearchParams } from '@/services/freelancer';
import type { Freelancer } from '@/types/freelancer';

export default function FreelancerPage() {
  // 상태 관리
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("전체");
  const [sortBy, setSortBy] = useState<string>(''); // 정렬 기준 상태

  const itemsPerPage = 10;
  const tabs = ["전체","PM/PL","PMO", "개발자", "기획자", "퍼블리셔", "디자이너", "기타"];
  
  // 모든 기술 스택 목록
  const allSkills = [
    'React', 'Node.js', 'Python', 'Java', 'TypeScript',
    'React Native', 'Flutter', 'AWS', 'Docker', 'Spring',
    'Django', 'PHP', 'JavaScript', 'Vue.js', 'Angular'
  ];

  // 프리랜서 데이터 로드
  const loadFreelancers = async () => {
    try {
      setLocalLoading(true);
      setError(null);

      const searchParams: FreelancerSearchParams = {
        page: currentPage,
        pageSize: itemsPerPage,
        category: activeTab === "전체" ? undefined : activeTab,
        type: selectedType || undefined,
        experience: selectedExperience || undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        search: searchTerms.length > 0 ? searchTerms.join(' ') : undefined,
        sortBy: sortBy ? (sortBy as any) : undefined,
        sortOrder: 'desc'
      };

      console.log('Loading freelancers with params:', searchParams);
      const response = await freelancerService.getFreelancers(searchParams);
      
      if (response.success && response.data) {
        setFreelancers(response.data.freelancers);
        setTotalCount(response.data.totalCount);
      } else {
        setError(response.error || 'Failed to load freelancers');
        setFreelancers([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error loading freelancers:', err);
      setError('프리랜서 목록을 불러오는데 실패했습니다.');
      setFreelancers([]);
      setTotalCount(0);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    loadFreelancers();
  }, [currentPage, activeTab, selectedType, selectedExperience, selectedSkills, searchTerms, sortBy]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 이벤트 핸들러
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchTermsChange = (terms: string[]) => {
    setSearchTerms(terms);
    setCurrentPage(1); // 검색어 변경 시 첫 페이지로
  };

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExperience(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  // 필터 초기화 함수
  const resetFilters = () => {
    setSelectedSkills([]);
    setSelectedExperience('');
    setSelectedType('');
    setSearchTerms([]);
    setSortBy('');
    setCurrentPage(1);
    setActiveTab("전체");
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setCurrentPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 상단 배너 */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="bannerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#bannerGradient)" />
            
            {/* 애니메이션 요소들 */}
            <g filter="url(#glow)">
              <circle cx="75" cy="25" r="5" fill="white" opacity="0.3">
                <animate attributeName="r" values="5;7;5" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="25" cy="70" r="3" fill="white" opacity="0.2">
                <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
              </circle>
            </g>
            
            {/* 움직이는 그라데이션 원형 */}
            <circle cx="0" cy="0" r="20" fill="url(#radialGradient)">
              <animateMotion path="M 50 50 L 90 30 L 50 70 L 10 50 Z" dur="15s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="15" fill="url(#radialGradient)">
              <animateMotion path="M 50 50 L 10 30 L 50 10 L 90 50 Z" dur="12s" repeatCount="indefinite" />
            </circle>
            
            {/* 웨이브 애니메이션 */}
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#bannerGradient)" opacity="0.5">
              <animate attributeName="d" 
                values="M0,0 L100,0 L100,100 L0,100 Z; 
                        M0,0 L100,0 L90,100 L0,90 Z; 
                        M0,0 L100,0 L100,100 L0,100 Z" 
                dur="20s" 
                repeatCount="indefinite" />
            </path>
            
            {/* 추가 조명 효과 */}
            <ellipse cx="20" cy="20" rx="30" ry="10" fill="white" opacity="0.03" />
            <ellipse cx="80" cy="80" rx="20" ry="30" fill="white" opacity="0.04" />
          </svg>
        </div>
        
        {/* 배너 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-2/3 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                프리랜서 <span className="text-blue-300 inline-block relative">
                  전문가
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-300 opacity-50 rounded"></div>
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl font-light">
                검증된 IT 전문가들과 함께 프로젝트를 성공적으로 완수하세요
              </p>

              {/* 다중 검색창 */}
              <div className="max-w-3xl">
                <MultiSearchInput
                  searchTerms={searchTerms}
                  onSearchTermsChange={handleSearchTermsChange}
                  placeholder="기술 스택, 이름으로 검색 (여러 검색어 지원)..."
                  className="bg-white/10 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white/20 hover:border-white/30 transition-all"
                />
              </div>
              
              {/* 배지 */}
              <div className="flex flex-wrap gap-3 mt-8">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white dark:text-slate-100">검증된 전문가</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-white dark:text-slate-100">100+ 프리랜서</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white dark:text-slate-100">다양한 기술 스택</span>
                </div>
              </div>
            </div>
            
            {/* 우측 이미지 영역 - 모바일에서는 숨김 */}
            <div className="hidden md:block md:w-1/3 relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      P
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-bold text-white">프리랜서 모집중</h3>
                      <div className="flex items-center text-sm text-blue-200">
                        <span>최고의 전문가 팀</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white text-sm">웹 개발자</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm">UI/UX 디자이너</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white text-sm">프로젝트 매니저</span>
                  </div>
                </div>
                
                <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 mt-6 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium">
                  지금 가입하기
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 인터랙티브 애니메이션 요소 */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <div className="relative h-16">
            {/* 웨이브 애니메이션 */}
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
                    M0, 0 C150, 90 350, 0 500, 80 C650, 160 750, 40 900, 100 C1050, 160 1150, 60 1200, 80 L1200, 120 L0, 120 Z;
                    M0, 0 C150, 40 350, 80 500, 20 C650, 60 750, 120 900, 40 C1050, 20 1150, 80 1200, 60 L1200, 120 L0, 120 Z;
                    M0, 0 C150, 90 350, 0 500, 80 C650, 160 750, 40 900, 100 C1050, 160 1150, 60 1200, 80 L1200, 120 L0, 120 Z"
                  />
                </path>
              </svg>
            </div>

            {/* 부유하는 아이콘들 */}
            <div className="absolute bottom-4 left-1/4 animate-bounce-slow opacity-80">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 animate-float opacity-80">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-6 left-3/4 animate-pulse opacity-80">
              <div className="bg-white p-2 rounded-full shadow-lg">
                <svg className="w-6 h-6 text-blue-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 애니메이션 스타일 */}
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
          
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite;
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b bg-white dark:bg-gray-800 sticky top-0 md:top-0 bottom-0 z-50 shadow-sm border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* 모바일에서는 스크롤 가능한 탭 */}
          <div className="block sm:hidden">
            <nav className="flex overflow-x-auto scrollbar-hide relative">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-shrink-0 py-3 px-4 text-sm text-center relative whitespace-nowrap ${
                    activeTab === tab
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  } transition-colors duration-300`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          {/* 태블릿 이상에서는 그리드 레이아웃 */}
          <div className="hidden sm:block">
            <nav className="grid grid-cols-4 sm:grid-cols-8 relative">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`py-3 md:py-4 px-2 lg:px-4 text-xs sm:text-sm lg:text-base text-center relative group ${
                    activeTab === tab
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-500 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  } transition-colors duration-300`}
                >
                  <span className="block truncate">{tab}</span>
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 사이드바 - 필터 */}
          <div className="lg:w-80 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md h-fit border border-gray-100 dark:border-gray-700 sticky top-8 transition-colors duration-300">
            <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-4 flex items-center transition-colors duration-300">
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              프리랜서 필터
            </h3>

            {/* 기술 스택 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                기술 스택
              </h4>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkillFilter(skill)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all ${selectedSkills.includes(skill)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* 경력 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                경력
              </h4>
              <select
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={selectedExperience}
                onChange={handleExperienceChange}
              >
                <option value=""> 전체 </option>
                <option value="3"> 3년 이하 </option>
                <option value="6"> 6년 이하 </option>
                <option value="10"> 10년 이하 </option>
                <option value="11"> 10년 초과 </option>
              </select>
            </div>

            {/* 타입 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                타입
              </h4>
              <select
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={selectedType}
                onChange={handleTypeChange}
              >
                <option value=""> 전체 </option>
                <option value="개인"> 개인 </option>
                <option value="팀"> 팀 </option>
                <option value="법인사업자"> 법인사업자 </option>
              </select>
            </div>

            {/* 정렬 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                정렬
              </h4>
              <select
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">기본 정렬</option>
                <option value="rating">평점 높은순</option>
                <option value="experience">경력 높은순</option>
                <option value="viewCount">조회수 많은순</option>
              </select>
            </div>

            {/* 필터 초기화 버튼 */}
            <button
              onClick={resetFilters}
              className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-gray-200 rounded-xl transition-all text-sm font-medium border border-gray-200 dark:border-gray-600 hover:shadow-sm flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              필터 초기화
            </button>
          </div>

          {/* 오른쪽 메인 콘텐츠 - 프리랜서 목록 */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center transition-colors duration-300">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text"> 프리랜서 </span>
                  <span className="ml-2 text-sm font-normal bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"> NEW </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300"> 총 <span className="font-semibold text-blue-600 dark:text-blue-400">{totalCount}</span>명의 프리랜서가 있습니다</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    setSortBy('rating');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 border rounded-xl transition-all flex items-center gap-1 shadow-sm ${
                    sortBy === 'rating' 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  평점 높은순
                </button>
                <button 
                  onClick={() => {
                    setSortBy('experience');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 border rounded-xl transition-all flex items-center gap-1 shadow-sm ${
                    sortBy === 'experience' 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  경력 높은순
                </button>
                <button 
                  onClick={() => {
                    setSortBy('viewCount');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 border rounded-xl transition-all flex items-center gap-1 shadow-sm ${
                    sortBy === 'viewCount' 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  조회수 많은순
                </button>
              </div>
            </div>

            {/* 로딩 인디케이터 */}
            {localLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">데이터 로드 실패</h3>
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={loadFreelancers}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              freelancers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {freelancers.map((freelancer) => (
              <div
                key={freelancer.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group relative"
              >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {freelancer.name?.[0] || 'F'}
                      </div>
                      <div className="ml-3">
                              <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{freelancer.name || '이름 없음'}</h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <span>{freelancer.experience}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {freelancer.rating.toFixed(1)}
                        </span>
                        </div>
                      </div>
                    </div>
                          <span className="text-xs font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800">
                      {freelancer.type}
                    </span>
                </div>
                
                        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm line-clamp-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                    {freelancer.description}
                  </p>
                
                  <div className="mb-4">
                          <div className="flex flex-wrap gap-2 mb-4">
                  {freelancer.skills.map((skill) => (
                    <span
                      key={skill}
                                className="bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                    </div>
                          <div className="flex justify-between text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                            <span className="text-gray-600 dark:text-gray-300 flex items-center">
                              <svg className="w-4 h-4 mr-1 text-blue-400 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              조회 {freelancer.viewCount}회
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white flex items-center">
                              <svg className="w-4 h-4 mr-1 text-blue-400 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              프로젝트 {freelancer.projectCount}건
                            </span>
                    </div>
                </div>
                
                    <Link
                      href={`/freelancer/${freelancer.id}`}
                          className="block w-full text-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 text-blue-700 dark:text-blue-300 font-medium py-3 rounded-xl transition-all mt-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white border border-blue-100 dark:border-blue-800 group-hover:border-transparent"
                    >
                          상세보기
                    </Link>
                </div>
              </div>
            ))}
          </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3"> 일치하는 프리랜서가 없습니다 </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6"> 검색어나 필터 조건을 변경해 보세요.</p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    필터 초기화
                  </button>
                </div>
              )
        )}

          {/* 페이지네이션 */}
            {freelancers.length > 0 && (
        <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-3">
              <button
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                이전
              </button>

                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                      let pageNumber: number;
              if (totalPages <= 5) {
                        pageNumber = index + 1;
              } else if (currentPage <= 3) {
                        pageNumber = index + 1;
              } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + index;
              } else {
                        pageNumber = currentPage - 2 + index;
              }
              
              return (
                  <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === pageNumber
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400'
                          }`}
                        >
                          {pageNumber}
                  </button>
              );
            })}
                  </div>

              <button
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
              </button>
          </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 프리랜서 이용 안내 */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">프리랜서 소개</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  <span className="font-medium text-blue-600 dark:text-blue-400">프리랜서 매칭 서비스</span>는 검증된 IT 전문가와 프로젝트를 연결해주는 서비스입니다. 전문 심사를 통과한 개발자, 디자이너, 기획자들이 여러분의 프로젝트를 성공으로 이끌어 드립니다.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>까다로운 포트폴리오 검수 및 실력 검증 시스템</li>
                  <li>다양한 경력과 전문성을 갖춘 인재 풀</li>
                  <li>프로젝트 규모와 특성에 맞는 최적의 매칭</li>
                  <li>안전한 계약 및 대금 지급 시스템</li>
                  <li>프로젝트 완료 후 철저한 사후 관리</li>
                </ul>
                <p>
                  IT 아웃소싱, 프로젝트 개발, 기술 자문 등 다양한 분야에서 최고의 프리랜서를 만나보세요.
                </p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm transition-colors duration-300">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">프리랜서 이용 안내</h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">전문가 프로필 확인</h4>
                    <p className="text-gray-600 dark:text-gray-300">각 프리랜서의 경력, 포트폴리오, 평점을 꼼꼼히 확인하세요.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">프로젝트 제안</h4>
                    <p className="text-gray-600 dark:text-gray-300">마음에 드는 프리랜서에게 프로젝트를 제안하고 상세 내용을 협의하세요.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">계약 체결</h4>
                    <p className="text-gray-600 dark:text-gray-300">표준 계약서를 통해 안전하게 계약을 체결하고 작업을 시작합니다.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">4</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">작업 완료 및 결제</h4>
                    <p className="text-gray-600 dark:text-gray-300">작업이 완료되면 검수 후 안전하게 대금을 지급합니다.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/project/register"
                  className="block w-full bg-blue-600 dark:bg-blue-700 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                >
                  프로젝트 등록하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}