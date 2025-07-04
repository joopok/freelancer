'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjects, type ProjectSearchParams } from '@/hooks/useProjects';
import type { Project } from '@/types/project';
import ProjectBanner from '@/components/project/ProjectBanner';
import ProjectFilters from '@/components/project/ProjectFilters';
import ProjectCard from '@/components/project/ProjectCard';
import ProjectTabs from '@/components/project/ProjectTabs';

export default function ProjectPage() {
  // 초기 로딩 상태
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedWorkType, setSelectedWorkType] = useState<string>('');
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [minBudget, setMinBudget] = useState<number | undefined>();
  const [maxBudget, setMaxBudget] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("전체");
  const [sortBy, setSortBy] = useState<string>('latest');
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const itemsPerPage = 10;
  
  // 상수들을 useMemo로 최적화
  const tabs = useMemo(() => ["전체", "웹개발", "앱개발", "시스템", "데이터", "AI/ML", "기타"], []);
  
  // 모든 기술 스택 목록도 메모이제이션
  const allSkills = useMemo(() => [
    'AWS', 'Figma', 'Node.js',
    'Python', 'React', 'Kubernetes',
    'Adobe XD', 'Docker', 'Terraform',
    'TensorFlow', 'MongoDB', 'Sketch',
    'Prototyping', 'Vue.js', 'Java',
    'Flutter', 'Swift', 'User Research',
    'Redux', 'Nuxt.js'
  ], []);
  
  // API 파라미터 구성
  const searchParams: ProjectSearchParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    projectType: activeTab === "전체" ? undefined : activeTab,
    workType: selectedWorkType || undefined,
    location: selectedLocation || undefined,
    experienceLevel: selectedExperienceLevel || undefined,
    skills: selectedSkills.length > 0 ? selectedSkills : undefined,
    minBudget: minBudget,
    maxBudget: maxBudget,
    sortBy: sortBy || 'latest',
    fastMode: true
  }), [currentPage, itemsPerPage, searchTerm, activeTab, selectedWorkType, selectedLocation, 
      selectedExperienceLevel, selectedSkills, minBudget, maxBudget, sortBy]);

  // useProjects hook 사용
  const { 
    projects: fetchedProjects, 
    loading, 
    error, 
    totalCount, 
    hasMore,
    refetch 
  } = useProjects(searchParams);

  // 초기 로딩 처리 (2초)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // 프로젝트 데이터 업데이트
  useEffect(() => {
    console.log('📊 Project Page Data Update:', {
      loading,
      fetchedProjectsLength: fetchedProjects?.length || 0,
      currentPage,
      error,
      totalCount,
      isInitialLoading,
      fetchedProjects: fetchedProjects
    });
    
    // 에러가 있으면 로그
    if (error) {
      console.error('❌ Project Page Error:', error);
    }
    
    // 데이터가 로드되었을 때만 업데이트
    if (!loading && fetchedProjects !== undefined) {
      console.log('✅ Setting projects:', fetchedProjects.length, 'items');
      if (currentPage === 1) {
        setAllProjects(fetchedProjects);
      } else if (fetchedProjects.length > 0) {
        // 중복 방지를 위해 비교 후 추가
        setAllProjects(prev => {
          const newProjects = fetchedProjects.filter(newProject => 
            !prev.some(existingProject => existingProject.id === newProject.id)
          );
          return [...prev, ...newProjects];
        });
      }
    } else if (!loading && !error && (!fetchedProjects || fetchedProjects.length === 0)) {
      console.warn('⚠️ No projects returned from API');
    }
  }, [fetchedProjects, currentPage, loading, error]);

  // 더보기 버튼 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  // 필터 변경 시 페이지 리셋 - 디바운싱 추가
  const isFirstRender = useRef(true);
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    const resetTimeout = setTimeout(() => {
      setCurrentPage(1);
    }, 300); // 300ms 디바운싱

    return () => clearTimeout(resetTimeout);
  }, [activeTab, selectedSkills, selectedWorkType, selectedLocation, 
      selectedExperienceLevel, minBudget, maxBudget, searchTerm, sortBy]);

  // 검색 디바운싱을 위한 ref
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // 이벤트 핸들러 - 검색 디바운싱 추가
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 기존 타임아웃 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // 500ms 디바운싱
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
    }, 500);
  }, []);

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const toggleSkillFilter = useCallback((skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  }, []);


  const handleWorkTypeChange = useCallback((value: string) => {
    setSelectedWorkType(value);
  }, []);

  const handleExperienceLevelChange = useCallback((value: string) => {
    setSelectedExperienceLevel(value);
  }, []);

  const handleLocationChange = useCallback((value: string) => {
    setSelectedLocation(value);
  }, []);

  const handleBudgetRangeChange = useCallback((min?: number, max?: number) => {
    setMinBudget(min);
    setMaxBudget(max);
  }, []);

  const handleSortByChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // 필터 초기화 함수
  const resetFilters = useCallback(() => {
    setSelectedSkills([]);
    setSelectedWorkType('');
    setSelectedExperienceLevel('');
    setSelectedLocation('');
    setMinBudget(undefined);
    setMaxBudget(undefined);
    setSearchTerm('');
    setSortBy('latest');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 상단 배너 - 컴포넌트로 분리 */}
      <ProjectBanner searchTerm={searchTerm} onSearchChange={handleSearchChange} />

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 사이드바 - 필터 영역 */}
          <div className="lg:w-80">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md h-fit border border-gray-100 dark:border-gray-700 sticky top-8 transition-colors duration-300">
              <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-4 flex items-center transition-colors duration-300">
                <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                프로젝트 필터
              </h3>
              <ProjectFilters
                selectedSkills={selectedSkills}
                selectedWorkType={selectedWorkType}
                selectedExperienceLevel={selectedExperienceLevel}
                selectedLocation={selectedLocation}
                minBudget={minBudget}
                maxBudget={maxBudget}
                sortBy={sortBy}
                onSkillToggle={toggleSkillFilter}
                onWorkTypeChange={handleWorkTypeChange}
                onExperienceLevelChange={handleExperienceLevelChange}
                onLocationChange={handleLocationChange}
                onBudgetRangeChange={handleBudgetRangeChange}
                onSortByChange={handleSortByChange}
                onResetFilters={resetFilters}
              />
            </div>
          </div>

          {/* 오른쪽 메인 콘텐츠 - 프로젝트 목록 */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">상주 프로젝트</span>
                  <span className="ml-2 text-sm font-normal bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">NEW</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300">총 <span className="font-semibold text-blue-600 dark:text-blue-400 transition-all duration-300">{totalCount}</span>개의 프로젝트가 있습니다</p>
              </div>
              {/* 탭 컴포넌트 사용 */}
              <ProjectTabs
                tabs={['latest', 'deadline', 'budget']}
                activeTab={sortBy}
                onTabChange={(tab) => {
                  setSortBy(tab);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* 메인 콘텐츠 영역 */}
            {isInitialLoading ? (
              // 초기 2초 로딩
              <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">프로젝트 목록을 불러오는 중...</p>
              </div>
            ) : error ? (
              // 에러 상태
              <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-12 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            ) : loading && allProjects.length === 0 ? (
              // 데이터 로딩 중 (초기 로딩 이후)
              <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">프로젝트 목록을 불러오는 중...</p>
              </div>
            ) : allProjects.length > 0 ? (
              // 프로젝트 목록
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
                
                {/* 더보기 버튼 */}
                {hasMore && !loading && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      더보기 ({allProjects.length}/{totalCount})
                    </button>
                  </div>
                )}

                {/* 로딩 중 표시 (더보기 중) */}
                {loading && allProjects.length > 0 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                      <div className="w-5 h-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600 dark:text-gray-300">프로젝트를 불러오는 중...</span>
                    </div>
                  </div>
                )}

                {/* 모든 데이터 로드 완료 메시지 */}
                {!hasMore && (
                  <div className="flex justify-center mt-12">
                    <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      모든 프로젝트를 확인했습니다 ({allProjects.length}개)
                    </div>
                  </div>
                )}
              </>
            ) : !loading && allProjects.length === 0 ? (
              // 빈 상태 (로딩 중이 아닐 때만 표시)
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">일치하는 프로젝트가 없습니다</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">검색어나 필터 조건을 변경해 보세요.</p>
                <button
                  onClick={() => {
                    setSelectedSkills([]);
                    setSelectedWorkType('');
                    setSelectedExperienceLevel('');
                    setSelectedLocation('');
                    setMinBudget(undefined);
                    setMaxBudget(undefined);
                    setSearchTerm('');
                  }}
                  className="px-6 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  필터 초기햗
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 상주 프로젝트 정보 */}
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 dark:bg-indigo-600 rounded-full filter blur-3xl opacity-20 -z-10"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-300 dark:bg-purple-600 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">상주 프로젝트란?</span>
                <div className="ml-4 h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 rounded-full"></div>
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300">
                <p className="text-lg leading-relaxed">
                  <span className="font-medium text-blue-600 dark:text-blue-400">상주 프로젝트</span>는 고객사 사무실에서 직접 프로젝트를 수행하는 근무 형태를 말합니다. 이랜서는 검증된 IT 프리랜서 전문가들을 고객사에 매칭해드립니다.
                </p>
                <ul className="list-none space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-blue-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4 4-4" />
                      </svg>
                    </div>
                    <span>고객사 내부 개발팀과 긴밀한 협업 가능</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-blue-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4 4-4" />
                      </svg>
                    </div>
                    <span>프로젝트 진행 상황 실시간 모니터링 및 피드백</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-blue-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4 4-4" />
                      </svg>
                    </div>
                    <span>보안이 중요한 프로젝트에 적합</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-blue-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4 4-4" />
                      </svg>
                    </div>
                    <span>안정적인 프로젝트 관리 및 진행</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 bg-blue-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-blue-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4 4-4" />
                      </svg>
                    </div>
                    <span>초기 단계부터 참여하여 프로젝트 방향성 수립</span>
                  </li>
                </ul>
                <p className="text-lg leading-relaxed">
                  상주 프로젝트는 일반적으로 3개월 이상의 장기 프로젝트에 적합하며, 풀타임 근무 형태로 진행됩니다. 고객사의 업무 환경 및 문화에 적응할 수 있는 전문가와의 매칭을 중요시합니다.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-blue-100 to-indigo-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-bl-full opacity-50 -z-10"></div>
              <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white pb-4 border-b dark:border-gray-600 flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">상주 프로젝트 이용 안내</span>
              </h3>
              <div className="space-y-10">
                <div className="flex">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-blue-600 dark:text-indigo-400 font-bold text-2xl">1</span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">프로젝트 등록</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">필요한 기술 스택과 프로젝트 내용을 상세히 기재하여 등록합니다.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-blue-600 dark:text-indigo-400 font-bold text-2xl">2</span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">전문가 매칭</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">프로젝트에 적합한 전문가를 매칭해드립니다. 여러 전문가의 이력서를 검토할 수 있습니다.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-blue-600 dark:text-indigo-400 font-bold text-2xl">3</span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">인터뷰 및 계약</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">최종 후보자와 인터뷰 후, 이랜서 플랫폼을 통해 안전한 계약을 체결합니다.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center shadow-sm">
                    <span className="text-blue-600 dark:text-indigo-400 font-bold text-2xl">4</span>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2">프로젝트 진행</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">프로젝트 완료 후 검수를 거쳐 대금을 지급합니다. 필요시 계약 연장도 가능합니다.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Link
                  href="/projects/register"
                  className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-500 dark:to-purple-500 text-white text-center py-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all shadow-md hover:shadow-lg"
                >
                  상주 프로젝트 등록하기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 장점 및 통계 */}
      <div className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-200 dark:bg-indigo-600 rounded-full filter blur-3xl opacity-20 -z-10"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-200 dark:bg-purple-600 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">이랜서 상주 프로젝트의 장점</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              이랜서는 다양한 산업 분야의 상주 프로젝트를 제공하며, 믿을 수 있는 플랫폼을 통해 안전한 거래를 보장합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">긴밀한 협업</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">고객사 내부 개발팀과 직접 소통하며 프로젝트의 모든 과정에 참여할 수 있습니다.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">안전한 계약과 대금</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">이랜서의 안전한 계약 시스템과 대금보호 서비스로 안심하고 프로젝트를 진행할 수 있습니다.</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">검증된 고객사</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">이랜서에 등록된 모든 프로젝트와 고객사는 검증 과정을 거쳐 신뢰할 수 있는 파트너입니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-10 rounded-2xl shadow-lg">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text mb-3">97%</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">프로젝트 완료율</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text mb-3">12,000+</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">등록된 프리랜서</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text mb-3">2,800+</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">완료된 상주 프로젝트</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text mb-3">4.9/5</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium">고객 만족도</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}