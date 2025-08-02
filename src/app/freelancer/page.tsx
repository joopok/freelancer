'use client';

import { useState, useEffect, useRef, useCallback, Suspense, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import MultiSearchInput from '@/components/common/MultiSearchInput';
import { freelancerService, type FreelancerSearchParams } from '@/services/freelancer';
import type { Freelancer } from '@/types/freelancer';

export default function FreelancerPageWrapper() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <FreelancerPage />
    </Suspense>
  );
}

function FreelancerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL 파라미터에서 값들 가져오기
  const tabFromUrl = searchParams.get('tab');
  const skillsFromUrl = searchParams.get('skills');
  const experienceFromUrl = searchParams.get('experience');
  const typeFromUrl = searchParams.get('type');
  const sortFromUrl = searchParams.get('sort');
  const searchFromUrl = searchParams.get('search');
  const ratingFromUrl = searchParams.get('rating');
  const hourlyRateMinFromUrl = searchParams.get('hourlyRateMin');
  const hourlyRateMaxFromUrl = searchParams.get('hourlyRateMax');
  const projectCountFromUrl = searchParams.get('projectCount');
  const availabilityFromUrl = searchParams.get('availability');
  
  // 상태 관리
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false); // 필터링 중 상태 (깜박임 방지)
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 더보기 로딩 상태
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState(tabFromUrl || "전체");
  const [sortBy, setSortBy] = useState<string>(''); // 정렬 기준 상태
  const [allSkills, setAllSkills] = useState<string[]>([]); // API에서 로드할 기술 스택
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 더 로드할 데이터가 있는지
  
  // 추가 필터 상태
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [hourlyRateMin, setHourlyRateMin] = useState<string>('');
  const [hourlyRateMax, setHourlyRateMax] = useState<string>('');
  const [selectedProjectCount, setSelectedProjectCount] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  
  // 이전 프리랜서 수 추적
  const prevFreelancerCount = useRef(0);
  
  // 디바운싱용 ref
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRequestRef = useRef<number>(0);
  const apiCallCountRef = useRef<number>(0);
  const renderCompleteRef = useRef<boolean>(false);

  const itemsPerPage = 10;
  
  
  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    const currentLoadingTimeoutRef = loadingTimeoutRef.current;
    return () => {
      if (currentLoadingTimeoutRef) {
        clearTimeout(currentLoadingTimeoutRef);
      }
    };
  }, []);


  const tabs = ["전체","PM/PL","PMO", "개발자", "기획자", "퍼블리셔", "디자이너", "기타"];
  
  // URL 파라미터에서 초기값 설정
  useEffect(() => {
    if (skillsFromUrl) setSelectedSkills(skillsFromUrl.split(','));
    if (experienceFromUrl) setSelectedExperience(experienceFromUrl);
    if (typeFromUrl) setSelectedType(typeFromUrl);
    if (sortFromUrl) setSortBy(sortFromUrl);
    if (searchFromUrl) setSearchTerms(searchFromUrl.split(' '));
    if (ratingFromUrl) setSelectedRating(ratingFromUrl);
    if (hourlyRateMinFromUrl) setHourlyRateMin(hourlyRateMinFromUrl);
    if (hourlyRateMaxFromUrl) setHourlyRateMax(hourlyRateMaxFromUrl);
    if (projectCountFromUrl) setSelectedProjectCount(projectCountFromUrl);
    if (availabilityFromUrl) setSelectedAvailability(availabilityFromUrl);
  }, [skillsFromUrl, experienceFromUrl, typeFromUrl, sortFromUrl, searchFromUrl,
      ratingFromUrl, hourlyRateMinFromUrl, hourlyRateMaxFromUrl, projectCountFromUrl, availabilityFromUrl]);

  // 기술 스택 목록 로드
  const loadSkills = async () => {
    try {
      setSkillsLoading(true);
      const result = await freelancerService.getSkills();
      
      if (result.success && result.data) {
        setAllSkills(result.data);
        if (result.error) {
          console.warn(result.error);
        }
      } else {
        console.warn('Skills API returned no data, using default skills');
        // 기본 스킬 목록 사용 (이미 서비스에서 처리됨)
        setAllSkills([
          'React', 'Node.js', 'Python', 'Java', 'TypeScript',
          'React Native', 'Flutter', 'AWS', 'Docker', 'Spring',
          'Django', 'PHP', 'JavaScript', 'Vue.js', 'Angular',
          'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL'
        ]);
      }
    } catch (error) {
      console.error('Error loading skills:', error);  // TONE: OK - Console logging
      // 에러 시 기본 스킬 목록 사용
      setAllSkills([
        'React', 'Node.js', 'Python', 'Java', 'TypeScript',
        'React Native', 'Flutter', 'AWS', 'Docker', 'Spring',
        'Django', 'PHP', 'JavaScript', 'Vue.js', 'Angular',
        'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL'
      ]);
    } finally {
      setSkillsLoading(false);
    }
  };

  // 프리랜서 데이터 로드
  const loadFreelancers = useCallback(async (isInitialLoad = false, isLoadMore = false) => {
    const requestId = Date.now();
    lastRequestRef.current = requestId;
    
    try {
      // 로딩 상태 설정 - 더 명확하게 처리
      if (isInitialLoad) {
        setLocalLoading(true);
        setCurrentPage(1);
      } else if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setCurrentPage(1); // 필터 변경 시 첫 페이지로 리셋
        
        // 즉시 로딩 상태 표시 (필터링 중 표시 대신 로딩 표시)
        setLocalLoading(true);
        setIsFiltering(false);
      }
      
      setError(null);

      // 페이지 계산을 명확하게
      let pageToLoad = 1;
      if (isLoadMore) {
        pageToLoad = currentPage + 1;
      } else if (isInitialLoad) {
        pageToLoad = 1;
      } else {
        // 필터 변경
        pageToLoad = 1;
      }
      
      const searchParams: FreelancerSearchParams = {
        page: pageToLoad,
        pageSize: itemsPerPage,
        category: activeTab === "전체" ? undefined : activeTab,
        type: selectedType || undefined,
        experience: selectedExperience || undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        search: searchTerms.length > 0 ? searchTerms.join(' ') : undefined,
        sortBy: sortBy ? (sortBy as any) : undefined,
        sortOrder: sortBy === 'hourlyRateLow' ? 'asc' : 'desc',
        rating: selectedRating ? parseFloat(selectedRating) : undefined,
        hourlyRateMin: hourlyRateMin ? parseInt(hourlyRateMin) : undefined,
        hourlyRateMax: hourlyRateMax ? parseInt(hourlyRateMax) : undefined,
        projectCount: selectedProjectCount ? parseInt(selectedProjectCount) : undefined,
        availability: selectedAvailability || undefined
      };

      const response = await freelancerService.getFreelancers(searchParams);
      
      // 최신 요청이 아니면 무시 (race condition 방지)
      if (lastRequestRef.current !== requestId) {
        return;
      }
      
      if (response.success && response.data) {
        
        const newFreelancers = response.data.freelancers || [];
        const newTotalCount = response.data.totalCount || 0;
        
        if (isLoadMore) {
          // 더보기의 경우 기존 데이터에 추가
          setFreelancers(prev => [...prev, ...newFreelancers]);
          setCurrentPage(pageToLoad);
        } else {
          // 초기 로드나 필터 변경의 경우 새로 설정
          setFreelancers(newFreelancers);
          setCurrentPage(1);
        }
        
        setTotalCount(newTotalCount);
        
        // 더 로드할 데이터가 있는지 확인
        const totalLoaded = isLoadMore ? freelancers.length + newFreelancers.length : newFreelancers.length;
        setHasMore(totalLoaded < newTotalCount);
        
        // 로딩 상태 해제
        if (lastRequestRef.current === requestId) {
          setLocalLoading(false);
          setIsFiltering(false);
          setIsLoadingMore(false);
        }
      } else {
        setError(response.error || '프리랜서 목록을 불러오는 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.');
        setFreelancers([]);
        setTotalCount(0);
        
        // 에러 상태에서도 로딩 해제
        if (lastRequestRef.current === requestId) {
          setLocalLoading(false);
          setIsFiltering(false);
          setIsLoadingMore(false);
        }
      }
    } catch (err) {
      console.error('Error loading freelancers:', err);  // TONE: OK - Console logging
      setError('프리랜서 목록을 가져오는 중 문제가 있었어요. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.');
      setFreelancers([]);
      setTotalCount(0);
      
      // 에러 발생 시에도 로딩 해제
      if (lastRequestRef.current === requestId) {
        setLocalLoading(false);
        setIsFiltering(false);
        setIsLoadingMore(false);
      }
    }
  }, [currentPage, itemsPerPage, activeTab, selectedType, selectedExperience, selectedSkills, searchTerms, sortBy, freelancers.length, selectedRating, hourlyRateMin, hourlyRateMax, selectedProjectCount, selectedAvailability]);

  // URL 파라미터 업데이트 함수
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (activeTab !== "전체") params.set('tab', activeTab);
    if (selectedSkills.length > 0) params.set('skills', selectedSkills.join(','));
    if (selectedExperience) params.set('experience', selectedExperience);
    if (selectedType) params.set('type', selectedType);
    if (sortBy) params.set('sort', sortBy);
    if (searchTerms.length > 0) params.set('search', searchTerms.join(' '));
    if (selectedRating) params.set('rating', selectedRating);
    if (hourlyRateMin) params.set('hourlyRateMin', hourlyRateMin);
    if (hourlyRateMax) params.set('hourlyRateMax', hourlyRateMax);
    if (selectedProjectCount) params.set('projectCount', selectedProjectCount);
    if (selectedAvailability) params.set('availability', selectedAvailability);
    
    const queryString = params.toString();
    router.push(`/freelancer${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [activeTab, selectedSkills, selectedExperience, selectedType, sortBy, searchTerms, 
    selectedRating, hourlyRateMin, hourlyRateMax, selectedProjectCount, selectedAvailability, router]);
  

  // 이벤트 핸들러
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      loadFreelancers(false, true);
    }
  }, [hasMore, isLoadingMore, loadFreelancers]);

  const handleSearchTermsChange = useCallback((terms: string[]) => {
    setSearchTerms(terms);
  }, []);

  const toggleSkillFilter = useCallback((skill: string) => {
    setSelectedSkills(prev => {
      const newSkills = prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill];
      return newSkills;
    });
  }, []);

  const handleExperienceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedExperience(e.target.value);
  }, []);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  }, []);

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  }, []);

  

  // 필터 초기화 함수
  const resetFilters = useCallback(() => {
    setSelectedSkills([]);
    setSelectedExperience('');
    setSelectedType('');
    setSearchTerms([]);
    setSortBy('');
    setActiveTab("전체");
    setSelectedRating('');
    setHourlyRateMin('');
    setHourlyRateMax('');
    setSelectedProjectCount('');
    setSelectedAvailability('');
    router.push('/freelancer');
  }, [router]);

  // 탭 변경 핸들러
  const handleTabChange = useCallback((tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [activeTab]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 컴포넌트 마운트 시 스킬 목록 로드
  useEffect(() => {
    loadSkills();
  }, []);

  // URL 파라미터 변경 감지
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, activeTab]);

  // 초기 로드 (한 번만)
  useEffect(() => {
    setLocalLoading(true); // Set loading to true immediately
    loadFreelancers(true); // Fetch data immediately
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // 필터/정렬 변경 시 로드 (디바운싱 적용)
  useEffect(() => {
    // 초기 렌더링에서는 실행하지 않음
    const isInitialRender = selectedSkills.length === 0 && 
                           searchTerms.length === 0 && 
                           selectedExperience === '' && 
                           selectedType === '' && 
                           sortBy === '' && 
                           activeTab === '전체' &&
                           selectedRating === '' &&
                           hourlyRateMin === '' &&
                           hourlyRateMax === '' &&
                           selectedProjectCount === '' &&
                           selectedAvailability === '';
    
    if (isInitialRender) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      loadFreelancers(false, false); // 필터 변경 시 첫 페이지부터 새로 로드
    }, 150); // 150ms 디바운싱
    
    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedType, selectedExperience, selectedSkills, searchTerms, sortBy,
      selectedRating, hourlyRateMin, hourlyRateMax, selectedProjectCount, selectedAvailability]);

  // URL 파라미터 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      updateUrlParams();
    }, 500); // 500ms 디바운싱
    
    return () => clearTimeout(timer);
  }, [updateUrlParams]);

  // freelancers.length가 변경될 때마다 이전 카운트 업데이트
  useLayoutEffect(() => {
    prevFreelancerCount.current = freelancers.length;
  }, [freelancers.length]);

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

            {/* 적용된 필터 표시 */}
            {(selectedSkills.length > 0 || selectedExperience || selectedType || selectedRating || 
              hourlyRateMin || hourlyRateMax || selectedProjectCount || selectedAvailability || 
              searchTerms.length > 0) && (
              <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300">적용된 필터</h5>
                  <button
                    onClick={resetFilters}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    모두 제거
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchTerms.map((term, index) => (
                    <span key={`search-${index}`} className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {term}
                      <button
                        onClick={() => setSearchTerms(searchTerms.filter((_, i) => i !== index))}
                        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedSkills.map(skill => (
                    <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                      {skill}
                      <button
                        onClick={() => toggleSkillFilter(skill)}
                        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {selectedExperience && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                      경력: {selectedExperience === '1' ? '1년 미만' : 
                             selectedExperience === '3' ? '1-3년' :
                             selectedExperience === '5' ? '3-5년' :
                             selectedExperience === '7' ? '5-7년' :
                             selectedExperience === '10' ? '7-10년' : '10년 이상'}
                      <button
                        onClick={() => setSelectedExperience('')}
                        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedType && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                      타입: {selectedType}
                      <button
                        onClick={() => setSelectedType('')}
                        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedRating && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                      평점: {selectedRating}점 이상
                      <button
                        onClick={() => setSelectedRating('')}
                        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {(hourlyRateMin || hourlyRateMax) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                      시급: {hourlyRateMin || '0'}~{hourlyRateMax || '∞'}만원
                      <button
                        onClick={() => { setHourlyRateMin(''); setHourlyRateMax(''); }}
                        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedProjectCount && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                      프로젝트: {selectedProjectCount}건 이상
                      <button
                        onClick={() => setSelectedProjectCount('')}
                        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {selectedAvailability && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                      시간대: {selectedAvailability === 'fulltime' ? '풀타임' : 
                              selectedAvailability === 'parttime' ? '파트타임' :
                              selectedAvailability === 'weekend' ? '주말 가능' : '저녁 가능'}
                      <button
                        onClick={() => setSelectedAvailability('')}
                        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 기술 스택 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                기술 스택
                {skillsLoading && (
                  <div className="ml-2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillsLoading ? (
                  <div className="w-full text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                    기술 스택 로딩 중...
                  </div>
                ) : allSkills.length > 0 ? (
                  allSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkillFilter(skill)}
                      disabled={isFiltering}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedSkills.includes(skill)
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))
                ) : (
                  <div className="w-full text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                    기술 스택을 불러올 수 없습니다.
                  </div>
                )}
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
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={selectedExperience}
                onChange={handleExperienceChange}
                disabled={isFiltering}
              >
                <option value=""> 전체 </option>
                <option value="1"> 1년 미만 </option>
                <option value="3"> 1-3년 </option>
                <option value="5"> 3-5년 </option>
                <option value="7"> 5-7년 </option>
                <option value="10"> 7-10년 </option>
                <option value="11"> 10년 이상 </option>
              </select>
            </div>

            {/* 평점 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                평점
              </h4>
              <select
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                disabled={isFiltering}
              >
                <option value="">전체</option>
                <option value="4.5">4.5점 이상</option>
                <option value="4.0">4.0점 이상</option>
                <option value="3.5">3.5점 이상</option>
                <option value="3.0">3.0점 이상</option>
              </select>
            </div>

            {/* 프로젝트 완료 수 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                프로젝트 완료 수
              </h4>
              <select
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={selectedProjectCount}
                onChange={(e) => setSelectedProjectCount(e.target.value)}
                disabled={isFiltering}
              >
                <option value="">전체</option>
                <option value="5">5건 이상</option>
                <option value="10">10건 이상</option>
                <option value="20">20건 이상</option>
                <option value="50">50건 이상</option>
              </select>
            </div>

            {/* 가능한 작업 시간대 필터 */}
            <div className="mb-8">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
                <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                작업 시간대
              </h4>
              <select
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                disabled={isFiltering}
              >
                <option value="">전체</option>
                <option value="fulltime">풀타임 가능</option>
                <option value="parttime">파트타임</option>
                <option value="weekend">주말 가능</option>
                <option value="evening">저녁 가능</option>
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
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={selectedType}
                onChange={handleTypeChange}
                disabled={isFiltering}
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
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                value={sortBy}
                onChange={handleSortChange}
                disabled={isFiltering}
              >
                <option value="">기본 정렬</option>
                <option value="viewCount">인기순 (조회수)</option>
                <option value="rating">평점 높은순</option>
                <option value="hourlyRateHigh">시급 높은순</option>
                <option value="hourlyRateLow">시급 낮은순</option>
                <option value="experience">경력순</option>
                <option value="recentActivity">최근 활동순</option>
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
                <p className="text-gray-600 dark:text-gray-300"> 
                  총 <span className="font-semibold text-blue-600 dark:text-blue-400">{totalCount.toLocaleString()}</span>명의 프리랜서가 있습니다 
                  {freelancers.length > 0 && freelancers.length < totalCount && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      (현재 {freelancers.length}명 표시)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'viewCount', label: '인기순', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
                  { value: 'rating', label: '평점순', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                  { value: 'hourlyRateHigh', label: '시급↑', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { value: 'hourlyRateLow', label: '시급↓', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { value: 'experience', label: '경력순', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { value: 'recentActivity', label: '최근활동', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
                ].map(sort => (
                  <button
                    key={sort.value}
                    onClick={() => setSortBy(sortBy === sort.value ? '' : sort.value)}
                    disabled={isFiltering}
                    className={`px-3 py-2 border rounded-xl transition-all flex items-center gap-1 text-sm shadow-sm disabled:opacity-50 ${
                      sortBy === sort.value
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sort.icon} />
                    </svg>
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 로딩 인디케이터 */}
            {localLoading ? (
              <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">프리랜서 목록을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
                <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">데이터 로드 실패</h3>
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => loadFreelancers()}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            ) : (
              freelancers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {freelancers.map((freelancer, index) => {
                    const isNew = index >= prevFreelancerCount.current;
                    
                    const animationClass = isNew 
                      ? 'animate-fadeInUp will-change-transform' 
                      : '';

                    const delay = isNew ? (index - prevFreelancerCount.current) * 100 : 0;

                    return (
                      <div
                        key={freelancer.id}
                        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group relative ${animationClass}`}
                        style={{
                          animationDelay: `${delay}ms`,
                          opacity: isNew ? 0 : 1
                        }}
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
                          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-600 mb-4">
                            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 overflow-hidden text-ellipsis">
                              {freelancer.description}
                            </p>
                          </div>
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {Array.isArray(freelancer.skills) && freelancer.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                              <div className="flex flex-col">
                                <span className="text-gray-600 dark:text-gray-300 flex items-center mb-1">
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
                              <div className="flex flex-col">
                                {freelancer.hourlyRate && (
                                  <span className="text-green-600 dark:text-green-400 font-bold flex items-center mb-1">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {typeof freelancer.hourlyRate === 'number'
                                      ? `${freelancer.hourlyRate.toLocaleString()}만원/시간`
                                      : `${freelancer.hourlyRate}`
                                    }
                                  </span>
                                )}
                                {freelancer.responseTime && (
                                  <span className="text-gray-600 dark:text-gray-300 flex items-center text-xs">
                                    <svg className="w-3 h-3 mr-1 text-blue-400 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    응답시간: {freelancer.responseTime}
                                  </span>
                                )}
                              </div>
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
                    )
                  })}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3"> 조회된 데이터가 없습니다 </h3>
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

          {/* 더보기 버튼 */}
          {freelancers.length > 0 && hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                {isLoadingMore ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    로딩 중...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    더보기 ({freelancers.length}/{totalCount})
                  </>
                )}
              </button>
            </div>
          )}

          {/* 모든 데이터 로드 완료 메시지 */}
          {freelancers.length > 0 && !hasMore && (
            <div className="flex justify-center mt-12">
              <div className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                모든 프리랜서를 확인했습니다 ({freelancers.length}명)
              </div>
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