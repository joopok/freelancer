'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 프로젝트 타입 정의
interface Project {
  id: string;
  title: string;
  company: string;
  skills: string[];
  duration: string;
  budget: string;
  deadline: string;
  type: '상주' | '외주';
  category: string; // 프로젝트 카테고리
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
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

  const tabs = ["전체","개발","기획","퍼블","디자인","아케텍트","DBA","기타"];
  
  // 상주 프로젝트 데이터
  useEffect(() => {
    // 실제 프로덕션에서는 API 요청으로 데이터를 가져오게 됩니다
    const projectsData: Project[] = [
      {
        id: "2", 
        title: "모바일 앱 프론트엔드 개발",
        company: "(주)앱스튜디오",
        skills: ["React Native", "TypeScript", "Redux"],
        duration: "3개월",
        budget: "3,200만원",
        deadline: "D-5",
        type: "상주",
        category: "앱 개발",
      },
      {
        id: "4",
        title: "데이터 분석 대시보드 개발",
        company: "(주)데이터랩스",
        skills: ["React", "D3.js", "Python"],
        duration: "2개월",
        budget: "2,800만원",
        deadline: "D-4",
        type: "상주",
        category: "데이터 분석",
      },
      {
        id: "5",
        title: "전사 ERP 시스템 고도화",
        company: "(주)시스템솔루션",
        skills: ["Java", "Spring", "Oracle"],
        duration: "5개월",
        budget: "6,500만원",
        deadline: "D-10",
        type: "상주",
        category: "ERP 시스템",
      },
      {
        id: "7",
        title: "클라우드 마이그레이션 프로젝트",
        company: "(주)클라우드웨이",
        skills: ["AWS", "Docker", "Kubernetes"],
        duration: "3개월",
        budget: "5,500만원",
        deadline: "D-8",
        type: "상주",
        category: "클라우드 마이그레이션",
      },
      {
        id: "9",
        title: "핀테크 보안 시스템 구축",
        company: "(주)세이프텍",
        skills: ["Java", "Spring Security", "OAuth"],
        duration: "5개월",
        budget: "6,000만원",
        deadline: "D-9",
        type: "상주",
        category: "보안 시스템",
      },
      {
        id: "12", 
        title: "전자상거래 플랫폼 리뉴얼",
        company: "(주)이마켓",
        skills: ["React", "Node.js", "AWS"],
        duration: "6개월",
        budget: "7,500만원",
        deadline: "D-4",
        type: "상주",
        category: "전자상거래 플랫폼",
      },
      {
        id: "14",
        title: "빅데이터 분석 플랫폼 구축",
        company: "(주)빅데이터랩",
        skills: ["Hadoop", "Spark", "Python"],
        duration: "7개월",
        budget: "8,000만원",
        deadline: "D-3",
        type: "상주",
        category: "빅데이터 분석",
      },
      {
        id: "16",
        title: "핀테크 모바일 앱 리뉴얼",
        company: "(주)파이낸셜테크",
        skills: ["Flutter", "Firebase", "RESTful API"],
        duration: "4개월",
        budget: "5,500만원",
        deadline: "D-7",
        type: "상주",
        category: "모바일 앱",
      },
      {
        id: "17",
        title: "클라우드 기반 ERP 시스템 구축",
        company: "(주)클라우드ERP",
        skills: ["AWS", "Java", "Spring Boot"],
        duration: "8개월",
        budget: "9,000만원",
        deadline: "D-2",
        type: "상주",
        category: "클라우드 ERP",
      },
      {
        id: "18", 
        title: "대규모 데이터 분석 플랫폼 개발",
        company: "(주)빅데이터솔루션",
        skills: ["Python", "Hadoop", "Spark"],
        duration: "6개월",
        budget: "7,800만원",
        deadline: "D-6",
        type: "상주",
        category: "데이터 분석",
      },
      {
        id: "19", 
        title: "금융권 보안 솔루션 개발",
        company: "(주)금융보안",
        skills: ["Java", "Spring Security", "Oracle"],
        duration: "7개월",
        budget: "8,500만원",
        deadline: "D-5",
        type: "상주",
        category: "보안 솔루션",
      },
      {
        id: "20", 
        title: "헬스케어 모바일 앱 개발",
        company: "(주)메디테크",
        skills: ["React Native", "Firebase", "GraphQL"],
        duration: "5개월",
        budget: "6,200만원",
        deadline: "D-3",
        type: "상주",
        category: "모바일 앱",
      }
    ];
    
    setProjects(projectsData);
    setFilteredProjects(projectsData);
    setLoading(false);
  }, []);

  // 검색 필터링
  useEffect(() => {
    // 필터링 로직
    const applyFilters = () => {
      if (projects.length === 0) return; // 데이터가 없으면 실행하지 않음
      
      let results = [...projects];
      
      // 검색어로 필터링
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        results = results.filter(project => 
          project.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          project.company.toLowerCase().includes(lowerCaseSearchTerm) ||
          project.skills.some(skill => skill.toLowerCase().includes(lowerCaseSearchTerm))
        );
      }
      
      // 탭 카테고리로 필터링 (전체 탭은 필터링하지 않음)
      if (activeTab !== "전체") {
        // 카테고리와 탭 이름을 매칭시키기 위한 간단한 로직
        // 실제 구현에서는 더 정교한 매핑이 필요할 수 있습니다
        let categoryFilter = activeTab.toLowerCase();
        results = results.filter(project => 
          project.category.toLowerCase().includes(categoryFilter) || 
          project.skills.some(skill => skill.toLowerCase().includes(categoryFilter))
        );
      }
      
      setFilteredProjects(results);
    };
    
    applyFilters();
    
  }, [searchTerm, projects, activeTab]);
  
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
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);
  
  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      
      // 탭 변경 시 스크롤을 프로젝트 목록 섹션으로 부드럽게 이동 (필요한 경우)
      const listSection = document.getElementById('project-list-section');
      if (listSection) {
        setTimeout(() => {
          listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  };

  // 인디케이터 위치 업데이트를 위한 useEffect
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
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
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
                <span className="text-xs font-semibold tracking-widest bg-blue-900 bg-opacity-50 px-3 py-1 rounded-full uppercase">
                  프리미엄 매칭
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  상주 프로젝트
                </span>
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-blue-400 rounded-full md:w-32"></div>
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-blue-100 max-w-xl">
                고객사 사무실에서 진행하는 검증된 상주 개발 프로젝트를 찾아보세요
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                  </svg>
                  <span>평균 3-6개월</span>
                </div>
                <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>평균 5,000만원</span>
                </div>
                <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>빠른 매칭 가능</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto md:ml-8 relative">
              <div className="bg-white rounded-xl p-3 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 max-w-xl mx-auto md:mx-0">
                <div className="text-gray-800 text-sm font-medium mb-3 px-2">
                  원하는 프로젝트를 찾아보세요
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="기술 스택, 프로젝트명, 회사명..."
                    className="w-full pl-12 pr-4 py-3 border-0 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200 outline-none text-gray-800"
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
                <button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center group">
                  <span>프로젝트 검색</span>
                  <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-blue-500 rounded-full opacity-20 animate-pulse-slow"></div>
            </div>
          </div>
        </div>

        {/* 애니메이션을 위한 스타일 */}
        <style jsx>{`
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 0.1;
            }
            50% {
              opacity: 0.3;
            }
          }
          
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 4s infinite;
          }
        `}</style>
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

      {/* 프로젝트 목록 */}
      <div id="project-list-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">상주 프로젝트 목록</h2>
            <p className="text-gray-600 mt-1">총 {filteredProjects.length}개의 프로젝트가 있습니다</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              최신순
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              마감임박순
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              금액순
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((project) => (
              <div 
                key={project.id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {project.deadline}
                    </span>
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {project.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.company}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">기간: {project.duration}</span>
                      <span className="font-medium text-gray-900">예산: {project.budget}</span>
                    </div>
                  </div>
                  
                  <Link
                    href={`/project/${project.id}`}
                    className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 rounded-md transition-colors mt-4"
                  >
                    상세보기
                  </Link>
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
                      ? 'border-blue-500 bg-blue-500 text-white'
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

      {/* 상주 프로젝트 정보 */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">상주 프로젝트란?</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <span className="font-medium text-blue-600">상주 프로젝트</span>는 고객사 사무실에서 직접 프로젝트를 수행하는 근무 형태를 말합니다. 이랜서는 검증된 IT 프리랜서 전문가들을 고객사에 매칭해드립니다.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>고객사 내부 개발팀과 긴밀한 협업 가능</li>
                  <li>프로젝트 진행 상황 실시간 모니터링 및 피드백</li>
                  <li>보안이 중요한 프로젝트에 적합</li>
                  <li>안정적인 프로젝트 관리 및 진행</li>
                  <li>초기 단계부터 참여하여 프로젝트 방향성 수립</li>
                </ul>
                <p>
                  상주 프로젝트는 일반적으로 3개월 이상의 장기 프로젝트에 적합하며, 풀타임 근무 형태로 진행됩니다. 고객사의 업무 환경 및 문화에 적응할 수 있는 전문가와의 매칭을 중요시합니다.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-gray-900">상주 프로젝트 이용 안내</h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">프로젝트 등록</h4>
                    <p className="text-gray-600">필요한 기술 스택과 프로젝트 내용을 상세히 기재하여 등록합니다.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">전문가 매칭</h4>
                    <p className="text-gray-600">프로젝트에 적합한 전문가를 매칭해드립니다. 여러 전문가의 이력서를 검토할 수 있습니다.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">인터뷰 및 계약</h4>
                    <p className="text-gray-600">최종 후보자와 인터뷰 후, 이랜서 플랫폼을 통해 안전한 계약을 체결합니다.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">4</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">프로젝트 진행</h4>
                    <p className="text-gray-600">프로젝트 완료 후 검수를 거쳐 대금을 지급합니다. 필요시 계약 연장도 가능합니다.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/projects/register"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  상주 프로젝트 등록하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
