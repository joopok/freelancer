'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import MultiSearchInput from '@/components/common/MultiSearchInput';

// Job 타입 정의
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  experience: string;
  employment: string;
  salary: string;
  description?: string;
  deadline: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 10;
  
  // 모든 기술 스택 목록
  const allSkills = [
    'React', 'Node.js', 'Python', 'Java', 'TypeScript',
    'React Native', 'Flutter', 'AWS', 'Docker', 'Spring',
    'Django', 'PHP', 'JavaScript', 'Vue.js', 'Angular'
  ];
  
  // 채용 정보 데이터 로드
  useEffect(() => {
    setLocalLoading(true);

    const timer = setTimeout(() => {
      const jobsData: Job[] = [
        {
          id: "1",
          title: "Frontend 개발자",
          company: "(주)테크스타트업",
          location: "서울",
          skills: ["React", "TypeScript", "JavaScript"],
          experience: "3년 이상",
          employment: "정규직",
          salary: "3500-5000만원",
          description: "React를 활용한 웹 애플리케이션 개발",
          deadline: "D-5"
        },
        {
          id: "2", 
          title: "Backend 개발자",
          company: "(주)빅테크",
          location: "경기",
          skills: ["Java", "Spring", "MySQL"],
          experience: "5년 이상",
          employment: "정규직",
          salary: "5000-7000만원",
          description: "대용량 트래픽 처리를 위한 백엔드 시스템 개발",
          deadline: "D-3"
        },
        {
          id: "3",
          title: "Full Stack 개발자",
          company: "(주)스타트업코리아",
          location: "서울",
          skills: ["React", "Node.js", "MongoDB"],
          experience: "2년 이상",
          employment: "정규직",
          salary: "4000-6000만원",
          description: "풀스택 웹 애플리케이션 개발 및 운영",
          deadline: "D-7"
        }
      ];

      // 더 많은 더미 데이터 생성
      for (let i = 4; i <= 50; i++) {
        jobsData.push({
          id: i.toString(),
          title: `${['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile'][i % 5]} 개발자`,
          company: `(주)회사${i}`,
          location: ['서울', '경기', '부산', '대구', '광주'][i % 5],
          skills: allSkills.slice(0, 3),
          experience: `${Math.floor(i / 10) + 1}년 이상`,
          employment: ['정규직', '계약직', '인턴'][i % 3],
          salary: `${3000 + (i % 5) * 1000}-${4000 + (i % 5) * 1000}만원`,
          description: "개발자 채용 공고입니다.",
          deadline: `D-${(i % 10) + 1}`
        });
      }
      
      setJobs(jobsData);
      setLocalLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  // 필터링된 채용정보 계산
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // 다중 검색어 필터링 - 모든 검색어가 포함되어야 함 (AND 조건)
      const matchesSearch = searchTerms.length === 0 ||
        searchTerms.every(term => {
          const lowerTerm = term.toLowerCase();
          return job.title.toLowerCase().includes(lowerTerm) ||
            job.company.toLowerCase().includes(lowerTerm) ||
            job.skills.some(skill => skill.toLowerCase().includes(lowerTerm)) ||
            (job.description && job.description.toLowerCase().includes(lowerTerm));
        });

      const matchesSkills = selectedSkills.length === 0 ||
        selectedSkills.every(skill => job.skills.includes(skill));

      const matchesLocation = selectedLocation === '' ||
        job.location === selectedLocation;

      const matchesExperience = selectedExperience === '' ||
        job.experience === selectedExperience;

      return matchesSearch && matchesSkills && matchesLocation && matchesExperience;
    });
  }, [jobs, searchTerms, selectedSkills, selectedLocation, selectedExperience]);

  // 페이지네이션된 채용정보 계산
  const paginatedJobs = useMemo(() => {
    const indexOfLastJob = currentPage * itemsPerPage;
    const indexOfFirstJob = indexOfLastJob - itemsPerPage;
    return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  }, [filteredJobs, currentPage, itemsPerPage]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // 이벤트 핸들러
  const handleSearchTermsChange = (terms: string[]) => {
    setSearchTerms(terms);
    setCurrentPage(1);
  };

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedSkills([]);
    setSelectedLocation('');
    setSelectedExperience('');
    setSearchTerms([]);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">상주 프리랜스 / 채용정보</h1>
          <Link 
            href="/jobs/create" 
            className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200"
          >
            채용공고 등록
          </Link>
        </div>
        
        {/* 다중 검색창 */}
        <div className="mb-8">
          <MultiSearchInput
            searchTerms={searchTerms}
            onSearchTermsChange={handleSearchTermsChange}
            placeholder="기술 스택, 회사명, 직무명으로 검색하고 Enter를 누르세요"
            className=""
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 사이드바 - 필터 */}
          <div className="lg:w-80 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md h-fit border border-gray-100 dark:border-gray-700 sticky top-8">
            <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white border-b pb-4 flex items-center">
              필터
            </h3>

            {/* 기술 스택 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">기술 스택</h4>
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

            {/* 지역 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">지역</h4>
              <select
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">전체</option>
                <option value="서울">서울</option>
                <option value="경기">경기</option>
                <option value="부산">부산</option>
                <option value="대구">대구</option>
                <option value="광주">광주</option>
              </select>
            </div>

            {/* 경력 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">경력</h4>
              <select
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all"
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
              >
                <option value="">전체</option>
                <option value="신입">신입</option>
                <option value="1년 이상">1년 이상</option>
                <option value="2년 이상">2년 이상</option>
                <option value="3년 이상">3년 이상</option>
                <option value="5년 이상">5년 이상</option>
              </select>
            </div>

            {/* 필터 초기화 버튼 */}
            <button
              onClick={resetFilters}
              className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-gray-200 rounded-xl transition-all text-sm font-medium border border-gray-200 dark:border-gray-600 hover:shadow-sm flex items-center justify-center"
            >
              필터 초기화
            </button>
          </div>

          {/* 오른쪽 메인 콘텐츠 - 채용정보 목록 */}
          <div className="flex-1">
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400">총 <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredJobs.length}</span>개의 채용정보가 있습니다</p>
            </div>

            {/* 로딩 인디케이터 */}
            {localLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
              </div>
            ) : (
              filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {paginatedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group relative p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{job.company}</p>
                        </div>
                        <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                          {job.deadline}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">지역:</span> {job.location}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">경력:</span> {job.experience}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">고용형태:</span> {job.employment}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium">연봉:</span> {job.salary}
                        </div>
                      </div>

                      {job.description && (
                        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">{job.description}</p>
                      )}

                      <Link
                        href={`/jobs/${job.id}`}
                        className="block w-full text-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 text-blue-700 dark:text-blue-300 font-medium py-3 rounded-xl transition-all group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white border border-blue-100 dark:border-blue-800 group-hover:border-transparent"
                      >
                        상세보기
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">일치하는 채용정보가 없습니다</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">검색어나 필터 조건을 변경해 보세요.</p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                  >
                    필터 초기화
                  </button>
                </div>
              )
            )}

            {/* 페이지네이션 */}
            {filteredJobs.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-3">
                  <button
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
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
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === pageNumber
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
    </main>
  );
} 