'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 프리랜서 타입 정의
interface Freelancer {
  id: string;
  name: string;
  experience: string;
  type: '개인' | '팀' | '법인사업자';
  skills: string[];
  description: string;
  rating: number;
  projectCount: number;
  viewCount: number;
  proposalCount: number;
  category: string; // 프리랜서 카테고리
}

export default function FreelancerPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFreelancers, setFilteredFreelancers] = useState<Freelancer[]>([]);
  const [activeTab, setActiveTab] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 탭 슬라이딩 효과를 위한 상태 및 ref
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });
  
  // 현재 인디케이터 위치를 ref로 저장 (렌더링 발생 없이 값 추적)
  const currentIndicatorRef = useRef({
    left: 0,
    width: 0
  });
  
  const tabs = ["전체", "개발자", "기획자", "퍼블리셔", "디자이너", "기타"];
  
const getNameByIndex = (index: number): string => {
  const surnames = ['김', '이', '박', '정', '최'];
  const surnameIndex = index % surnames.length;
  return `${surnames[surnameIndex]}${'*'.repeat(2)}`;
};

  // 카테고리 할당 함수 - 의존성 제거를 위해 함수 분리
  const getCategoryByIndex = (index: number): string => {
    const categories = ["개발자", "기획자", "퍼블리셔", "디자이너", "기타"];
    return categories[index % categories.length];
  };

  // 프리랜서 데이터 생성
  useEffect(() => {
    // 실제 프로덕션에서는 API 요청으로 데이터를 가져오게 됩니다
    const types: ('개인' | '팀' | '법인사업자')[] = ['개인', '팀', '법인사업자'];
    const sampleSkills = [
      ['React', 'TypeScript', 'Node.js'],
      ['Java', 'Spring', 'MySQL'],
      ['Python', 'Django', 'PostgreSQL'],
      ['Flutter', 'Dart', 'Firebase'],
      ['Vue.js', 'JavaScript', 'AWS'],
      ['Angular', 'NestJS', 'MongoDB'],
    ];
  
    const freelancersData = Array.from({ length: 100 }, (_, i) => ({
      id: (i + 1).toString(),
      name: getNameByIndex(i),
      experience: `${i % 15}년 경력`,
      type: types[i % types.length],
      skills: sampleSkills[i % sampleSkills.length],
      description: "안녕하세요. 열정적인 개발자입니다.",
      rating: 4 + (i % 10) / 10,
      projectCount: (i % 50) + 1,
      viewCount: 10 + (i % 90),
      proposalCount: 1 + (i % 19),
      category: getCategoryByIndex(i), // tabs 의존성 제거
    }));
    
    setFreelancers(freelancersData);
    setFilteredFreelancers(freelancersData);
    setLoading(false);
  }, []); // 의존성 배열에서 tabs 제거

  // 검색 및 탭 필터링
  useEffect(() => {
    // 필터링 로직
    const applyFilters = () => {
      if (freelancers.length === 0) return; // 데이터가 없으면 실행하지 않음
      
      let results = [...freelancers];
      
      // 검색어로 필터링
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        results = results.filter(freelancer => 
          freelancer.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          freelancer.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          freelancer.skills.some(skill => skill.toLowerCase().includes(lowerCaseSearchTerm))
        );
      }
      
      // 탭 카테고리로 필터링 (전체 탭은 필터링하지 않음)
      if (activeTab !== "전체") {
        results = results.filter(freelancer => freelancer.category === activeTab);
      }
      
      setFilteredFreelancers(results);
    };
    
    applyFilters();
    
  }, [searchTerm, freelancers, activeTab]); // currentPage 의존성 제거
  
  // 페이지 리셋을 위한 별도 useEffect
  useEffect(() => {
    // 검색어나 활성 탭이 변경되면 페이지를 1로 리셋
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredFreelancers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFreelancers.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      
      // 탭 변경 시 스크롤을 프리랜서 목록 섹션으로 부드럽게 이동 (필요한 경우)
      const listSection = document.getElementById('freelancer-list-section');
      if (listSection) {
        setTimeout(() => {
          listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      
      // 현재 페이지를 1페이지로 리셋
      setCurrentPage(1);
    }
  };

  // 인디케이터 위치 업데이트를 위한 통합된 useEffect
  useEffect(() => {
    // DOM이 준비되었을 때만 실행
    if (!loading) {
      const updateIndicator = () => {
        const activeTabIndex = tabs.indexOf(activeTab);
        if (activeTabIndex !== -1 && tabsRef.current[activeTabIndex]) {
          const tabElement = tabsRef.current[activeTabIndex];
          if (tabElement) {
            // 값이 실제로 변경될 때만 상태 업데이트
            const newLeft = tabElement.offsetLeft;
            const newWidth = tabElement.offsetWidth;
            
            // 현재 Ref 값과 비교하여 실제 변경 시에만 상태 업데이트
            const currentLeft = currentIndicatorRef.current.left;
            const currentWidth = currentIndicatorRef.current.width;
            
            if (Math.abs(currentLeft - newLeft) > 1 || Math.abs(currentWidth - newWidth) > 1) {
              // 먼저 ref 값 업데이트
              currentIndicatorRef.current = {
                left: newLeft,
                width: newWidth
              };
              
              // 그 다음 상태 업데이트 (렌더링 발생)
              setIndicatorStyle({
                left: newLeft,
                width: newWidth,
              });
            }
          }
        }
      };

      // 초기 로드 시 인디케이터 위치 설정
      const timer = setTimeout(updateIndicator, 100);

      // 윈도우 리사이즈 이벤트에 디바운스 적용
      let resizeTimer: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateIndicator, 100);
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(resizeTimer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [activeTab, tabs, loading]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 배너 */}
      <div className="bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white relative overflow-hidden">
        {/* 배경 패턴 요소 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-40 h-40 bg-white rounded-full -top-10 -left-10 opacity-20 animate-pulse"></div>
          <div className="absolute w-56 h-56 bg-white rounded-full top-20 right-10 opacity-10 animate-pulse-slow"></div>
          <div className="absolute w-24 h-24 bg-white rounded-full bottom-10 left-1/4 opacity-15 animate-bounce-slow"></div>
          <svg className="absolute right-0 bottom-0 opacity-20" width="400" height="400" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="mb-4 inline-block">
                <span className="text-xs font-semibold tracking-widest bg-purple-900 bg-opacity-50 px-3 py-1 rounded-full uppercase">
                  프리미엄 매칭
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                  프리랜서
                </span>
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-purple-400 rounded-full md:w-32"></div>
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-purple-100 max-w-xl">
                검증된 IT 전문가들과 함께 프로젝트를 성공적으로 완수하세요
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                  <span>41만명 이상의 IT 인재</span>
                </div>
                <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>평가 및 인증 시스템</span>
                </div>
                <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>다양한 전문 분야</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto md:ml-8 relative">
              <div className="bg-white rounded-xl p-3 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 max-w-xl mx-auto md:mx-0">
                <div className="text-gray-800 text-sm font-medium mb-3 px-2">
                  원하는 전문가를 찾아보세요
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="기술 스택, 이름, 설명으로 검색..."
                    className="w-full pl-12 pr-4 py-3 border-0 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all duration-200 outline-none text-gray-800"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <button className="bg-gray-100 text-gray-600 px-2 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    React
                  </button>
                  <button className="bg-gray-100 text-gray-600 px-2 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    Java
                  </button>
                  <button className="bg-gray-100 text-gray-600 px-2 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    Python
                  </button>
                </div>
                <Link
                  href="/register"
                  className="block w-full mt-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center group"
                >
              <span>프로필 등록하기</span>
              <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
                </Link>
          </div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-purple-500 rounded-full opacity-20 animate-pulse-slow"></div>
        </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex relative">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                ref={(el) => (tabsRef.current[index] = el)}
                onClick={() => handleTabChange(tab)}
                className={`py-4 px-6 relative group ${
                  activeTab === tab
                    ? "text-purple-600 font-medium"
                    : "text-gray-500 hover:text-purple-500"
                } transition-colors duration-300`}
              >
                {tab}
              </button>
            ))}
            {/* 슬라이딩 인디케이터 */}
            <div 
              className="absolute bottom-0 bg-purple-600 transition-all duration-300 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                height: '3px'
              }}
            />
          </nav>
        </div>
      </div>

      {/* 프리랜서 목록 */}
      <div id="freelancer-list-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">프리랜서 목록</h2>
            <p className="text-gray-600 mt-1">총 {filteredFreelancers.length}명의 프리랜서가 있습니다</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              평점 높은순
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              경력 높은순
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              프로젝트 많은순
            </button>
              </div>
            </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {currentItems.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg">
                        {freelancer.name[0]}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-bold mb-1 text-gray-900">{freelancer.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
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
                    <span className="text-xs font-medium px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
                      {freelancer.type}
                    </span>
                </div>
                
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {freelancer.description}
                  </p>
                
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                  {freelancer.skills.map((skill) => (
                    <span
                      key={skill}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">프로젝트 {freelancer.projectCount}건</span>
                      <span className="text-gray-500">열람 {freelancer.viewCount}회</span>
                    </div>
                </div>
                
                  <div className="flex justify-between items-center">
                    <button className="text-sm text-gray-500 hover:text-purple-600 transition-colors">
                      <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      찜하기
                    </button>
                    <Link
                      href={`/freelancer/${freelancer.id}`}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      상세보기 →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

          {/* 페이지네이션 */}
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
              <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50"
              >
                이전
              </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // 페이지 네비게이션 로직 - 현재 페이지 주변 페이지 보여주기
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
              
              return (
                  <button
                  key={pageToShow}
                  onClick={() => handlePageChange(pageToShow)}
                  className={`px-3 py-2 border rounded-md ${
                    currentPage === pageToShow
                      ? 'border-purple-500 bg-purple-500 text-white'
                      : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {pageToShow}
                  </button>
              );
            })}

              <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50"
              >
                다음
              </button>
          </nav>
        </div>
      </div>

      {/* 프리랜서 이용 안내 */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">프리랜서 소개</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <span className="font-medium text-purple-600">프리랜서 매칭 서비스</span>는 검증된 IT 전문가와 프로젝트를 연결해주는 서비스입니다. 전문 심사를 통과한 개발자, 디자이너, 기획자들이 여러분의 프로젝트를 성공으로 이끌어 드립니다.
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
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-gray-900">프리랜서 이용 안내</h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">전문가 프로필 확인</h4>
                    <p className="text-gray-600">각 프리랜서의 경력, 포트폴리오, 평점을 꼼꼼히 확인하세요.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">프로젝트 제안</h4>
                    <p className="text-gray-600">마음에 드는 프리랜서에게 프로젝트를 제안하고 상세 내용을 협의하세요.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">계약 체결</h4>
                    <p className="text-gray-600">표준 계약서를 통해 안전하게 계약을 체결하고 작업을 시작합니다.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">4</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">작업 완료 및 결제</h4>
                    <p className="text-gray-600">작업이 완료되면 검수 후 안전하게 대금을 지급합니다.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/project/register"
                  className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
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
