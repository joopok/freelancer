'use client';

import { useState, useEffect } from 'react';
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
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

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
      }
    ];
    
    setProjects(projectsData);
    setFilteredProjects(projectsData);
    setLoading(false);
  }, []);

  // 검색 필터링
  useEffect(() => {
    const results = projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredProjects(results);
  }, [searchTerm, projects]);

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 배너 */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">상주 프로젝트</h1>
          <p className="text-xl md:text-2xl mb-6 text-blue-100">
            고객사 사무실에서 진행하는 상주 개발 프로젝트를 찾아보세요
          </p>
          <div className="bg-white rounded-lg p-2 flex items-center max-w-3xl">
            <input
              type="text"
              placeholder="기술 스택, 프로젝트명, 회사명으로 검색..."
              className="flex-1 px-4 py-2 outline-none text-gray-800"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
              검색
            </button>
          </div>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            {filteredProjects.map((project) => (
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
            <button className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              이전
            </button>
            <button className="px-3 py-2 border border-blue-500 rounded-md bg-blue-500 text-white">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              2
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              3
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              4
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
              5
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-700">
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
