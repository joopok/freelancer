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
  // 로컬 상태만 사용
  const [projects, setProjects] = useState<Project[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState<number>(1);
  const projectsPerPage = 10;

  // 모든 기술 스택 목록
  const allSkills = [
    'React', 'Node.js', 'Python', 'Java', 'TypeScript',
    'React Native', 'Flutter', 'AWS', 'Docker', 'Spring',
    'Django', 'PHP', 'JavaScript', 'Vue.js', 'Angular'
  ];

  // 재택 프로젝트 데이터 로드 - 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    setLocalLoading(true);

    const timer = setTimeout(() => {
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
      setLocalLoading(false);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // 필터링된 프로젝트 계산
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSkills = selectedSkills.length === 0 ||
        selectedSkills.every(skill => project.skills.includes(skill));

      const matchesDuration = selectedDuration === '' ||
        (selectedDuration === '3' && parseInt(project.duration) <= 3) ||
        (selectedDuration === '6' && parseInt(project.duration) <= 6) ||
        (selectedDuration === '12' && parseInt(project.duration) <= 12);

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

  // 이벤트 핸들러
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDuration(e.target.value);
    setCurrentPage(1);
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBudget(e.target.value);
    setCurrentPage(1);
  };

  // 필터 초기화 함수
  const resetFilters = () => {
    setSelectedSkills([]);
    setSelectedDuration('');
    setSelectedBudget('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 상단 배너 */}
      <div className="bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-600 text-white relative overflow-hidden">
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
            
            {/* 애니메이션 요소들 */}
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
                        M0,0 L100,0 L90,100 L10,90 Z; 
                        M0,0 L100,0 L100,100 L0,100 Z" 
                dur="20s" 
                repeatCount="indefinite" />
            </path>
            
            {/* 입체 요소와 추가 효과 */}
            <ellipse cx="20" cy="20" rx="30" ry="10" fill="white" opacity="0.05" />
            <ellipse cx="80" cy="80" rx="20" ry="30" fill="white" opacity="0.05" />
            
            {/* 부유하는 다각형 요소 */}
            <polygon points="85,25 90,35 80,35" fill="white" opacity="0.15">
              <animateTransform attributeName="transform" type="rotate" from="0 85 30" to="360 85 30" dur="24s" repeatCount="indefinite" />
            </polygon>
            <polygon points="15,75 25,85 20,70" fill="white" opacity="0.1">
              <animateTransform attributeName="transform" type="rotate" from="0 20 75" to="360 20 75" dur="30s" repeatCount="indefinite" />
            </polygon>
          </svg>
        </div>

        

        {/* 배너 콘텐츠 */}
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

              {/* 검색창 */}
              <div className="bg-white/10 backdrop-blur-md p-2 flex items-center max-w-3xl rounded-2xl shadow-lg border border-white/20 hover:border-white/30 transition-all group">
                <input
                  type="text"
                  placeholder="기술 스택, 프로젝트명, 회사명으로 검색..."
                  className="flex-1 px-6 py-4 outline-none text-gray-800 text-lg bg-white rounded-xl shadow-inner"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-md ml-2 group-hover:shadow-lg transform group-hover:scale-[1.02] duration-200">
                  검색
                </button>
              </div>
              
              {/* 배지 */}
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
            
            {/* 우측 이미지 영역 - 모바일에서는 숨김 */}
            <div className="hidden md:block md:w-1/3 relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
              
              {/* 빛을 내는 모형 추가 */}
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
                    
                    {/* 첫 번째 빔 */}
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
                    
                    {/* 두 번째 빔 */}
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
                    
                    {/* 세 번째 빔 */}
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
                    
                    {/* 중앙 원 */}
                    <circle cx="100" cy="100" r="15" fill="#4f46e5">
                      <animate attributeName="r" values="12;15;12" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="fillOpacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
              </div>
              
              <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      R
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-bold text-white">
                        원격 프로젝트
                        <div className="relative inline-block">
                          <span className="absolute -right-5 top-0 w-6 h-6 bg-white rounded-full opacity-70 animate-pulse-scale"></span>
                        </div>
                      </h3>
                      <div className="flex items-center text-sm text-purple-200">
                        <span>오늘 업데이트 <span className="font-semibold">15건</span></span>
                      </div>
                    </div>
                  </div>
                  {/* 강조 태그 추가 */}
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-lg animate-pulse">
                    인기
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl flex items-center group hover:bg-white/20 transition-all cursor-pointer">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-white text-sm">AI 추천 시스템</span>
                      <div className="text-xs text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity">월 평균 4,500만원</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl flex items-center group hover:bg-white/20 transition-all cursor-pointer">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-white text-sm">블록체인 결제</span>
                      <div className="text-xs text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity">월 평균 7,000만원</div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl flex items-center group hover:bg-white/20 transition-all cursor-pointer">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3 group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-white text-sm">IoT 모니터링</span>
                      <div className="text-xs text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity">월 평균 4,000만원</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 relative">
                  <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 rounded-xl hover:bg-white/20 transition-colors text-sm font-medium relative z-10 group">
                    <span className="group-hover:scale-105 transition-transform inline-block">프로젝트 더보기</span>
                  </button>
                  {/* 강조 효과 */}
                  <div className="absolute -bottom-1 -right-1 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl -z-0 opacity-50 animate-pulse"></div>
                </div>
                
                {/* 프로젝트 통계 뱃지 */}
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

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 사이드바 - 필터 */}
          <div className="lg:w-80 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md h-fit border border-gray-100 dark:border-gray-700 sticky top-8 transition-colors duration-300">
            <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-4 flex items-center transition-colors duration-300">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              프로젝트 필터
            </h3>

            {/* 기술 스택 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* 개발 기간 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                개발 기간
              </h4>
              <select
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all appearance-none bg-no-repeat bg-right pr-10"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={selectedDuration}
                onChange={handleDurationChange}
              >
                <option value=""> 전체 </option>
                <option value="3"> 3개월 이내 </option>
                <option value="6"> 6개월 이내 </option>
                <option value="12"> 12개월 이내 </option>
              </select>
            </div>

            {/* 예산 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                예산
              </h4>
              <select
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all appearance-none bg-no-repeat bg-right pr-10"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={selectedBudget}
                onChange={handleBudgetChange}
              >
                <option value=""> 전체 </option>
                <option value="3000000"> 300만원 이상 </option>
                <option value="5000000"> 500만원 이상 </option>
                <option value="10000000"> 1,000만원 이상 </option>
                <option value="30000000"> 3,000만원 이상 </option>
                <option value="50000000"> 5,000만원 이상 </option>
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

          {/* 오른쪽 메인 콘텐츠 - 프로젝트 목록 */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center transition-colors duration-300">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"> 재택 프로젝트 </span>
                  <span className="ml-2 text-sm font-normal bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full transition-colors duration-300"> NEW </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300"> 총 <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filteredProjects.length}</span>개의 프로젝트가 있습니다</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-300 flex items-center gap-1 shadow-sm">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  최신순
                </button>
                <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-300 flex items-center gap-1 shadow-sm">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  마감임박순
                </button>
                <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all duration-300 flex items-center gap-1 shadow-sm">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  금액순
                </button>
              </div>
            </div>

            {/* 로딩 인디케이터 - 로컬 로딩만 사용하고 전역 로딩은 StateProvider에서 처리 */}
            {localLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
              </div>
            ) : (
              filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group relative"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                            {project.deadline}
                          </span>
                          <span className="text-sm font-medium text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                            {project.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 flex items-center transition-colors duration-300">
                          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {project.company}
                        </p>

                        {project.description && (
                          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm line-clamp-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600 transition-colors duration-300"> {project.description} </p>
                        )}

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.skills.map((skill) => (
                              <span
                                key={skill}
                                className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full border border-indigo-100"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600 transition-colors duration-300">
                            <span className="text-gray-600 dark:text-gray-300 flex items-center transition-colors duration-300">
                              <svg className="w-4 h-4 mr-1 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM9 9h6v6H9V9z" />
                              </svg>
                              {project.duration}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white flex items-center transition-colors duration-300">
                              <svg className="w-4 h-4 mr-1 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {project.budget}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/project/${project.id}`}
                          className="block w-full text-center bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 font-medium py-3 rounded-xl transition-all mt-4 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white border border-indigo-100 group-hover:border-transparent"
                        >
                          상세보기
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                  <svg className="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 transition-colors duration-300"> 일치하는 프로젝트가 없습니다 </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300"> 검색어나 필터 조건을 변경해 보세요.</p>
                  <button
                    onClick={() => {
                      setSelectedSkills([]);
                      setSelectedDuration('');
                      setSelectedBudget('');
                      setSearchTerm('');
                    }}
                    className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors inline-flex items-center"
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
            {filteredProjects.length > 0 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-3">
                  <button
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm hover:border-indigo-300 hover:text-indigo-600"
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
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm hover:border-indigo-300 hover:text-indigo-600"
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

      {/* 재택 프로젝트 정보 */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-24 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-20 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center transition-colors duration-300">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"> 재택 프로젝트란? </span>
                <div className="ml-4 h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <p className="text-lg leading-relaxed">
                  <span className="font-medium text-indigo-600"> 재택 프로젝트 </span>는 장소에 구애받지 않고 온라인으로 진행하는 프로젝트입니다. AI 개발, 웹/앱 개발, 블록체인, IoT 등 다양한 IT 분야의 전문 프로젝트를 재택근무로 수행할 수 있습니다.
                </p>
                <ul className="list-none space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span> 자유로운 근무 환경과 시간 관리 </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span> 월 평균 3,000만원 ~ 8,000만원 고수익 </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span> Slack, Zoom, Git 등 협업 도구 활용 </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span> 주간 진행상황 보고 및 정기 미팅 </span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span> 대기업부터 스타트업까지 다양한 클라이언트 </span>
                  </li>
                </ul>
                <p className="text-lg leading-relaxed">
                  현재 <span className="font-semibold text-indigo-600">12개의 재택 프로젝트</span>가 진행 중이며, Python, React, Node.js, TensorFlow 등 다양한 기술 스택을 요구합니다. 자기주도적 업무 능력과 원격 협업 경험이 있는 프리랜서에게 최적화된 프로젝트들입니다.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-indigo-100 to-purple-100 rounded-bl-full opacity-50 -z-10"></div>
              <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white pb-4 border-b border-gray-200 dark:border-gray-600 flex items-center transition-colors duration-300">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"> 재택 프로젝트 시작하기 </span>
              </h3>
              <div className="space-y-10">
                <div className="flex">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-indigo-600 font-bold text-2xl"> 1 </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300"> 프로젝트 탐색 </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300"> AI, 블록체인, IoT 등 내 전문 분야의 재택 프로젝트를 검색하고 상세 정보를 확인합니다.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-indigo-600 font-bold text-2xl"> 2 </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300"> 포트폴리오 제출 </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300"> 관련 경험과 포트폴리오를 포함한 제안서를 작성하여 클라이언트에게 지원합니다.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-indigo-600 font-bold text-2xl"> 3 </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300"> 화상 면접 및 계약 </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300"> 온라인 면접을 통해 프로젝트 세부사항을 논의하고 안전한 계약을 체결합니다.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-indigo-600 font-bold text-2xl"> 4 </span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300"> 원격 개발 및 납품 </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300"> 정해진 일정에 따라 원격으로 개발하고, 정기 보고를 통해 프로젝트를 완성합니다.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <Link
                  href="/register"
                  className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-4 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                >
                  프리랜서 가입하기
                </Link>
                <Link
                  href="/jobs"
                  className="block w-full bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-center py-4 rounded-xl font-medium transition-all border border-gray-200 dark:border-gray-500 hover:border-gray-300 dark:hover:border-gray-400"
                >
                  모든 프로젝트 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 장점 및 통계 */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"> 이랜서 재택 프로젝트의 장점 </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              이랜서는 다양한 산업 분야의 재택 프로젝트를 제공하며, 믿을 수 있는 플랫폼을 통해 안전한 거래를 보장합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors"> 유연한 근무 환경 </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300"> 장소와 시간에 구애받지 않고 자신에게 가장 효율적인 환경에서 업무를 수행할 수 있습니다.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors"> 안전한 계약과 대금 </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300"> 이랜서의 안전한 계약 시스템과 대금보호 서비스로 안심하고 프로젝트를 진행할 수 있습니다.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors"> 검증된 고객사 </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300"> 이랜서에 등록된 모든 프로젝트와 고객사는 검증 과정을 거쳐 신뢰할 수 있는 파트너입니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-10 rounded-2xl shadow-lg transition-colors duration-300">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3"> 94 % </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300"> 프로젝트 완료율 </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3"> 15,000 + </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300"> 등록된 프리랜서 </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3"> 3,500 + </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300"> 완료된 원격 프로젝트 </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3"> 4.8 / 5 </p>
              <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300"> 고객 만족도 </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}