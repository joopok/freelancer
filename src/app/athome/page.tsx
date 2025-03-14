'use client';

import { useState, useEffect, useMemo } from 'react';
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
  type: '재택' | '외주';
  description?: string;
  level?: string;
}

export default function RemoteProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  
  // 페이지네이션을 위한 상태 추가
  const [currentPage, setCurrentPage] = useState<number>(1);
  const projectsPerPage = 10; // 페이지당 10개 항목으로 설정

  // 모든 기술 스택 목록
  const allSkills = [
    'React', 'Node.js', 'Python', 'Java', 'TypeScript', 
    'React Native', 'Flutter', 'AWS', 'Docker', 'Spring', 
    'Django', 'PHP', 'JavaScript', 'Vue.js', 'Angular'
  ];

  // 재택 프로젝트 데이터
  useEffect(() => {
    // 실제 프로덕션에서는 API 요청으로 데이터를 가져오게 됩니다
    const projectsData: Project[] = [
      {
        id: "1",
        title: "AI 기반 추천 시스템 개발",
        company: "(주)테크인사이트",
        skills: ["Python", "TensorFlow", "AWS"],
        duration: "4개월",
        budget: "4,500만원", 
        deadline: "D-3",
        type: "재택",
        description: "사용자 행동 패턴 분석을 통한 맞춤형 상품 추천 시스템 개발 프로젝트입니다.",
        level: "중급"
      },
      {
        id: "3",
        title: "블록체인 기반 결제 시스템 구축",
        company: "(주)블록테크",
        skills: ["Solidity", "Web3.js", "Node.js"],
        duration: "6개월", 
        budget: "7,000만원",
        deadline: "D-7",
        type: "재택",
        description: "블록체인 기술을 활용한 안전한 결제 시스템 개발 프로젝트입니다.",
        level: "고급"
      },
      {
        id: "6",
        title: "IoT 디바이스 모니터링 앱 개발",
        company: "(주)스마트테크",
        skills: ["Flutter", "Firebase", "MQTT"],
        duration: "4개월",
        budget: "4,000만원",
        deadline: "D-6",
        type: "재택",
        description: "다양한 IoT 디바이스 상태를 실시간으로 모니터링하는 모바일 앱 개발 프로젝트입니다.",
        level: "중급"
      },
      {
        id: "8",
        title: "SNS 플랫폼 API 개발",
        company: "(주)소셜미디어",
        skills: ["Node.js", "GraphQL", "MongoDB"],
        duration: "4개월",
        budget: "4,200만원",
        deadline: "D-2",
        type: "재택",
        description: "소셜 미디어 플랫폼의 효율적인 데이터 처리를 위한 API 개발 프로젝트입니다.",
        level: "중급"
      },
      {
        id: "10",
        title: "메타버스 플랫폼 개발",
        company: "(주)메타랩스",
        skills: ["Unity", "WebGL", "Three.js"],
        duration: "6개월",
        budget: "8,000만원",
        deadline: "D-1",
        type: "재택",
        description: "가상 현실 기반의 메타버스 플랫폼 프론트엔드 개발 프로젝트입니다.",
        level: "고급"
      },
      {
        id: "11",
        title: "AI 챗봇 시스템 개발",
        company: "(주)인텔리봇",
        skills: ["NLP", "Python", "TensorFlow"],
        duration: "5개월",
        budget: "5,800만원", 
        deadline: "D-2",
        type: "재택",
        description: "자연어 처리 기술을 활용한 고객 응대용 AI 챗봇 시스템 개발 프로젝트입니다.",
        level: "중급"
      },
      {
        id: "13",
        title: "보안 시스템 강화 프로젝트",
        company: "(주)시큐리티솔루션",
        skills: ["Java", "Spring Security", "Penetration Testing"],
        duration: "3개월", 
        budget: "4,200만원",
        deadline: "D-6",
        type: "재택",
        description: "기업 보안 시스템 취약점 분석 및 보안 강화 솔루션 개발 프로젝트입니다.",
        level: "고급"
      },
      {
        id: "15",
        title: "CRM 시스템 개발",
        company: "(주)고객관리시스템",
        skills: ["React", "GraphQL", "PostgreSQL"],
        duration: "5개월",
        budget: "6,000만원",
        deadline: "D-5",
        type: "재택",
        description: "기업 고객 관리를 위한 대시보드 및 관리 시스템 개발 프로젝트입니다.",
        level: "중급"
      },
      {
        id: "21",
        title: "온라인 교육 플랫폼 개발",
        company: "(주)에듀테크",
        skills: ["React", "Node.js", "MongoDB"],
        duration: "4개월",
        budget: "5,000만원",
        deadline: "D-8",
        type: "재택",
        description: "실시간 강의 및 학습 관리 기능을 제공하는 온라인 교육 플랫폼 개발 프로젝트입니다.",
        level: "중급"
      },
      {
        id: "22",
        title: "디지털 헬스케어 앱 개발",
        company: "(주)헬스케어솔루션",
        skills: ["React Native", "Firebase", "Node.js"],
        duration: "5개월",
        budget: "6,500만원",
        deadline: "D-4",
        type: "재택",
        description: "사용자 건강 데이터 분석 및 맞춤형 건강 관리 서비스를 제공하는 모바일 앱 개발 프로젝트입니다.",
        level: "중급"
      },
      {
        id: "23",
        title: "실시간 협업 툴 개발",
        company: "(주)팀워크솔루션",
        skills: ["Vue.js", "WebSocket", "Node.js"],
        duration: "6개월",
        budget: "7,200만원",
        deadline: "D-3",
        type: "재택",
        description: "실시간 문서 공유 및 협업 기능을 제공하는 웹 애플리케이션 개발 프로젝트입니다.",
        level: "중급"
      },
      {
        id: "24",
        title: "AI 이미지 처리 서비스 개발",
        company: "(주)비전테크",
        skills: ["Python", "TensorFlow", "OpenCV"],
        duration: "5개월",
        budget: "6,800만원",
        deadline: "D-9",
        type: "재택",
        description: "인공지능 기술을 활용한 이미지 분석 및 처리 서비스 개발 프로젝트입니다.",
        level: "고급"
      }
    ];
    
    setProjects(projectsData);
    setLoading(false);
  }, []);

  // 필터링된 프로젝트 계산
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // 검색어 필터링
      const matchesSearch = searchTerm === '' || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // 스킬 필터링
      const matchesSkills = selectedSkills.length === 0 ||
        selectedSkills.every(skill => project.skills.includes(skill));
      
      // 기간 필터링
      const matchesDuration = selectedDuration === '' || 
        (selectedDuration === '3' && parseInt(project.duration) <= 3) ||
        (selectedDuration === '6' && parseInt(project.duration) <= 6) ||
        (selectedDuration === '12' && parseInt(project.duration) <= 12);
      
      // 예산 필터링
      const projectBudget = parseInt(project.budget.replace(/[^0-9]/g, ''));
      const matchesBudget = selectedBudget === '' || 
        (selectedBudget === '3000000' && projectBudget >= 3000000) ||
        (selectedBudget === '5000000' && projectBudget >= 5000000) ||
        (selectedBudget === '10000000' && projectBudget >= 10000000) ||
        (selectedBudget === '30000000' && projectBudget >= 30000000) ||
        (selectedBudget === '50000000' && projectBudget >= 50000000);
      
      return matchesSearch && matchesSkills && matchesDuration && matchesBudget;
    });
  }, [projects, searchTerm, selectedSkills, selectedDuration, selectedBudget]);

  // 페이지네이션된 프로젝트 계산
  const paginatedProjects = useMemo(() => {
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    return filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  }, [filteredProjects, currentPage, projectsPerPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // 검색어를 변경하면 첫 페이지로 돌아가기
    setCurrentPage(1);
  };

  // 기술 스택 필터 토글 핸들러
  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
    // 필터 변경 시 첫 페이지로 돌아가기
    setCurrentPage(1);
  };

  // 개발 기간 필터 핸들러
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDuration(e.target.value);
    // 필터 변경 시 첫 페이지로 돌아가기
    setCurrentPage(1);
  };

  // 예산 필터 핸들러
  const handleBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBudget(e.target.value);
    // 필터 변경 시 첫 페이지로 돌아가기
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 배너 */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">재택/원격 프로젝트</h1>
          <p className="text-xl md:text-2xl mb-6 text-indigo-100">
            장소에 구애받지 않고 자유롭게 진행할 수 있는 원격 프로젝트를 찾아보세요
          </p>
          <div className="bg-white rounded-lg p-2 flex items-center max-w-3xl">
            <input
              type="text"
              placeholder="기술 스택, 프로젝트명, 회사명으로 검색..."
              className="flex-1 px-4 py-2 outline-none text-gray-800"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
              검색
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 사이드바 - 필터 */}
          <div className="lg:w-72 bg-white p-6 rounded-lg shadow-sm h-fit">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">프로젝트 필터</h3>
            
            {/* 기술 스택 필터 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">기술 스택</h4>
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkillFilter(skill)}
                    className={`text-xs px-2 py-1 rounded-md transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 개발 기간 필터 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">개발 기간</h4>
              <select
                className="w-full p-2 border rounded text-gray-800"
                value={selectedDuration}
                onChange={handleDurationChange}
              >
                <option value="">전체</option>
                <option value="3">3개월 이내</option>
                <option value="6">6개월 이내</option>
                <option value="12">12개월 이내</option>
              </select>
            </div>
            
            {/* 예산 필터 */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">예산</h4>
              <select
                className="w-full p-2 border rounded text-gray-800"
                value={selectedBudget}
                onChange={handleBudgetChange}
              >
                <option value="">전체</option>
                <option value="3000000">300만원 이상</option>
                <option value="5000000">500만원 이상</option>
                <option value="10000000">1,000만원 이상</option>
                <option value="30000000">3,000만원 이상</option>
                <option value="50000000">5,000만원 이상</option>
              </select>
            </div>
            
            <button
              onClick={() => {
                setSelectedSkills([]);
                setSelectedDuration('');
                setSelectedBudget('');
                setSearchTerm('');
              }}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition-colors text-sm font-medium"
            >
              필터 초기화
            </button>
          </div>

          {/* 오른쪽 메인 콘텐츠 - 프로젝트 목록 */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">재택/원격 프로젝트 목록</h2>
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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">
                            {project.deadline}
                          </span>
                          <span className="text-sm font-medium text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                            {project.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 hover:text-indigo-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{project.company}</p>
                        
                        {project.description && (
                          <p className="text-gray-700 mb-4 text-sm line-clamp-2">{project.description}</p>
                        )}
                        
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {project.skills.map((skill) => (
                              <span 
                                key={skill} 
                                className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-md"
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
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">일치하는 프로젝트가 없습니다</h3>
                  <p className="text-gray-600">검색어나 필터 조건을 변경해 보세요.</p>
                </div>
              )
            )}

            {/* 페이지네이션 */}
            {filteredProjects.length > 0 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button 
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    이전
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    // 현재 페이지 주변의 페이지 번호만 표시
                    let pageNumber;
                    if (totalPages <= 5) {
                      // 전체 페이지가 5개 이하면 모든 페이지 번호 표시
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      // 현재 페이지가 3 이하면 1~5 표시
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // 현재 페이지가 마지막에 가까우면 마지막 5개 표시
                      pageNumber = totalPages - 4 + index;
                    } else {
                      // 그 외의 경우, 현재 페이지를 중심으로 앞뒤로 2개씩 표시
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-2 border rounded-md ${
                          currentPage === pageNumber
                            ? 'bg-indigo-500 text-white border-indigo-500'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button 
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    다음
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 재택 프로젝트 정보 */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">재택/원격 프로젝트란?</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <span className="font-medium text-indigo-600">재택/원격 프로젝트</span>는 장소에 구애받지 않고 자유롭게 작업할 수 있는 프로젝트 형태입니다. 이랜서는 검증된 IT 프리랜서 전문가들이 원격으로 진행할 수 있는 다양한 프로젝트를 제공합니다.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>자유로운 시간과 장소에서 업무 진행 가능</li>
                  <li>개인의 효율적인 작업 환경에서 높은 생산성 발휘</li>
                  <li>통근 시간 절약 및 워라밸 향상</li>
                  <li>클라우드 기반 협업 도구를 통한 원활한 소통</li>
                  <li>정기적인 화상 미팅과 결과물 보고로 프로젝트 관리</li>
                </ul>
                <p>
                  재택/원격 프로젝트는 자기주도적인 업무 역량이 뛰어난 전문가에게 적합하며, 프로젝트 관리와 소통 능력이 중요합니다. 시간과 공간의 제약 없이 효율적으로 프로젝트를 진행하고 싶은 프리랜서에게 추천합니다.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-gray-900">재택/원격 프로젝트 이용 안내</h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">1</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">프로젝트 찾기</h4>
                    <p className="text-gray-600">다양한 재택/원격 프로젝트 중 나의 기술 스택과 관심 분야에 맞는 프로젝트를 찾습니다.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">2</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">지원 및 제안</h4>
                    <p className="text-gray-600">프로젝트에 지원하거나, 견적과 포트폴리오를 포함한 제안서를 제출합니다.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">3</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">미팅 및 계약</h4>
                    <p className="text-gray-600">화상 미팅을 통해 클라이언트와 소통한 후, 이랜서 플랫폼을 통해 안전하게 계약을 체결합니다.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">4</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">작업 및 협업</h4>
                    <p className="text-gray-600">협업 도구를 활용하여 정기적으로 진행 상황을 공유하고, 원격으로 프로젝트를 완성합니다.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/freelancers/profile"
                  className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  프리랜서 프로필 등록하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 장점 및 통계 */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">이랜서 재택/원격 프로젝트의 장점</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              이랜서는 다양한 산업 분야의 재택/원격 프로젝트를 제공하며, 믿을 수 있는 플랫폼을 통해 안전한 거래를 보장합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">유연한 근무 환경</h3>
              <p className="text-gray-600">장소와 시간에 구애받지 않고 자신에게 가장 효율적인 환경에서 업무를 수행할 수 있습니다.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">안전한 계약과 대금</h3>
              <p className="text-gray-600">이랜서의 안전한 계약 시스템과 대금보호 서비스로 안심하고 프로젝트를 진행할 수 있습니다.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">검증된 고객사</h3>
              <p className="text-gray-600">이랜서에 등록된 모든 프로젝트와 고객사는 검증 과정을 거쳐 신뢰할 수 있는 파트너입니다.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600 mb-2">94%</p>
              <p className="text-gray-600">프로젝트 완료율</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600 mb-2">15,000+</p>
              <p className="text-gray-600">등록된 프리랜서</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600 mb-2">3,500+</p>
              <p className="text-gray-600">완료된 원격 프로젝트</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600 mb-2">4.8/5</p>
              <p className="text-gray-600">고객 만족도</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
