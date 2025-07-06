'use client';

import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectDetail, CompanyInfo, ProjectStage, ContactPerson, WorkingConditions, Project } from '@/types/project';
import { useProjectDetail } from '@/hooks/useProjects';
import { projectService } from '@/services/project';
import ApplicationModal from '@/components/project/detail/ApplicationModal';
import { formatDate, formatCurrency, formatCurrencyRange } from '@/utils/format';

// 동적 import로 코드 스플리팅
const ProjectOverview = lazy(() => import('@/components/project/detail/ProjectOverview'));
const ProjectDetails = lazy(() => import('@/components/project/detail/ProjectDetails'));
const ProjectCompany = lazy(() => import('@/components/project/detail/ProjectCompany'));
const ProjectQnA = lazy(() => import('@/components/project/detail/ProjectQnA'));
const ProjectSidebar = lazy(() => import('@/components/project/detail/ProjectSidebar'));
const SimilarProjects = lazy(() => import('@/components/project/detail/SimilarProjects'));
const ProjectModals = lazy(() => import('@/components/project/detail/ProjectModals'));


export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  // useProjectDetail hook 사용
  const { project, loading, error } = useProjectDetail(projectId);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'company' | 'reviews'>('overview');
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'reviews'>('questions');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentViewers, setCurrentViewers] = useState(12);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [realtimeStats, setRealtimeStats] = useState({
    applicants: 23,
    views: 456,
    bookmarks: 87
  });
  
  // 탭별 데이터를 위한 추가 상태
  const [questions, setQuestions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [similarProjects, setSimilarProjects] = useState<Project[]>([]);
  const [tabDataLoading, setTabDataLoading] = useState(false);
  const [tabDataError, setTabDataError] = useState<string | null>(null);

  // 탭 데이터 가져오기
  useEffect(() => {
    const fetchTabData = async () => {
      if (!project || !projectId) {
        return;
      }
      
      setTabDataLoading(true);
      setTabDataError(null);
      
      try {
        // 병렬로 데이터 가져오기 - 각각 개별적으로 에러 처리
        const [questionsResponse, reviewsResponse, similarProjectsResponse] = await Promise.all([
          projectService.getProjectQuestions(projectId),
          projectService.getProjectReviews(projectId),
          projectService.getSimilarProjects(projectId, 10)
        ]);
        
        // 각 API 응답을 개별적으로 처리 (하나 실패해도 다른 것들은 표시)
        
        setQuestions(questionsResponse.data || []);
        setReviews(reviewsResponse.data || []);
        setSimilarProjects(similarProjectsResponse.data || []);
      } catch (error) {
        // 전체적인 에러는 거의 발생하지 않을 것 (각 service에서 fallback 처리됨)
        // 에러 상태를 설정하지 않음 - 각 service에서 빈 배열로 fallback됨
      } finally {
        setTabDataLoading(false);
      }
    };
    
    fetchTabData();
  }, [project, projectId]);
  
  // 실시간 통계 업데이트 - 개발 환경에서만 사용
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // 개발 환경에서만 임시 데이터 업데이트
      const interval = setInterval(() => {
        setRealtimeStats(prev => ({
          ...prev,
          views: prev.views + Math.floor(Math.random() * 3),
          applicants: prev.applicants + (Math.random() > 0.8 ? 1 : 0),
          bookmarks: prev.bookmarks + (Math.random() > 0.9 ? 1 : 0)
        }));
        setCurrentViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
      }, 30000); // 30초로 변경 (부하 감소)

      return () => clearInterval(interval);
    }
    // 프로덕션에서는 실제 API를 통해 업데이트해야 함
  }, []);
  
  // 조회수 증가 API 호출 (비필수 기능)
  useEffect(() => {
    if (projectId) {
      projectService.incrementProjectView(projectId)
        .then(response => {
          if (response.success) {
          } else {
          }
        })
        .catch(error => {
          // 조회수 증가 실패는 치명적이지 않으므로 조용히 처리
        });
    }
  }, [projectId]);

  // 이미지 모달 키보드 네비게이션
  useEffect(() => {
    if (!showImageModal) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowImageModal(false);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = selectedImageIndex > 1 ? selectedImageIndex - 1 : 3;
        setSelectedImageIndex(prevIndex);
      } else if (e.key === 'ArrowRight') {
        const nextIndex = selectedImageIndex < 3 ? selectedImageIndex + 1 : 1;
        setSelectedImageIndex(nextIndex);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [showImageModal, selectedImageIndex]);

  // 스킬 매칭 점수 계산 - useMemo로 최적화
  const skillMatchScore = useMemo(() => {
    if (!project) return 0;
    
    // 사용자의 보유 스킬 (실제로는 로그인한 사용자의 프로필에서 가져옴)
    const userSkills = ['React', 'TypeScript', 'Node.js', 'AWS', 'Git']; 
    
    const matchingSkills = (project.skills || []).filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    const totalSkills = (project.skills || []).length;
    if (totalSkills === 0) return 0;
    
    return Math.round((matchingSkills.length / totalSkills) * 100);
  }, [project]);

  // 경쟁률 계산 - useMemo로 최적화
  const competitionRate = useMemo(() => {
    return Math.round(realtimeStats.applicants / 5);
  }, [realtimeStats.applicants]);

  // 디버깅 정보 로깅 - 개발 환경에서만
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 ProjectDetailPage - Project ID:', projectId);
      console.log('🔍 ProjectDetailPage - Loading:', loading);
      console.log('🔍 ProjectDetailPage - Error:', error);
      console.log('🔍 ProjectDetailPage - Project:', project);
    }
  }, [projectId, loading, error, project]);

  

  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-opacity duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">프로젝트 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 에러가 발생했거나 프로젝트를 찾을 수 없는 경우
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">프로젝트를 찾을 수 없습니다</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || '존재하지 않거나 삭제된 프로젝트입니다.'}
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-red-600 dark:text-red-400">
                개발 모드 정보: Next.js 서버를 재시작해주세요. 환경 변수가 변경되었습니다.
              </p>
            </div>
          )}
          <Link 
            href="/project"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fadeIn">
      {/* 상단 브레드크럼 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600">홈</Link>
            <span>›</span>
            <Link href="/project" className="hover:text-blue-600">프로젝트</Link>
            <span>›</span>
            <span className="hover:text-blue-600">상세보기</span>
            <span>›</span>
            <span className="text-gray-900 dark:text-white">{project.title}</span>
          </nav>
        </div>
      </div>

      {/* 메인 헤더 섹션 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 왼쪽: 프로젝트 정보 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {project.isUrgent && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm font-medium rounded-full">
                    🚨 긴급
                  </span>
                )}
                {project.isRemote && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium rounded-full">
                    🏠 재택가능
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                  {project.type}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {project.title}
              </h1>
              
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🏢</span>
                  <span className="text-gray-600 dark:text-gray-400">{typeof project.company === 'object' ? project.company.name : (project.company || project.companyName || '회사명')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📍</span>
                  <span className="text-gray-600 dark:text-gray-400">{project.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">⏰</span>
                  <span className="text-gray-600 dark:text-gray-400">{formatDate(project.deadline)} 마감</span>
                </div>
              </div>

              {/* 조회 및 지원 통계 */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span>👥</span>
                  <span>{realtimeStats.applicants}명 지원</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span>👁</span>
                  <span>{realtimeStats.views}회 조회</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span>⭐</span>
                  <span>{realtimeStats.bookmarks}명 북마크</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-600">{currentViewers}명 온라인</span>
                </div>
              </div>

              {/* 스킬 태그 */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(Array.isArray(project.skills) ? project.skills : []).map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* 프로젝트 요약 정보 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">💰</div>
                  <div className="text-sm text-gray-500">예산</div>
                  <div className="font-semibold">
                    {project.budgetMin && project.budgetMax 
                      ? `${(project.budgetMin / 10000).toFixed(0)}~${(project.budgetMax / 10000).toFixed(0)}만원`
                      : project.budget || '협의'}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">⏱️</div>
                  <div className="text-sm text-gray-500">기간</div>
                  <div className="font-semibold">{project.duration}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">👥</div>
                  <div className="text-sm text-gray-500">팀 규모</div>
                  <div className="font-semibold">{project.teamSize}명</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600">📊</div>
                  <div className="text-sm text-gray-500">경력 수준</div>
                  <div className="font-semibold">{project.level}</div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.description}
              </p>

              {/* 프로젝트 진행 단계 */}
              <div className="mt-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">프로젝트 진행 상태</h3>
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {[
                      { step: 1, label: '모집중', status: 'completed' },
                      { step: 2, label: '진행중', status: 'current' },
                      { step: 3, label: '검수중', status: 'upcoming' },
                      { step: 4, label: '완료', status: 'upcoming' }
                    ].map((stage, index) => (
                      <div key={stage.step} className="flex-1 flex items-center">
                        <div className="relative flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                            ${stage.status === 'completed' ? 'bg-green-500 text-white' : 
                              stage.status === 'current' ? 'bg-blue-500 text-white animate-pulse' : 
                              'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                            {stage.status === 'completed' ? '✓' : stage.step}
                          </div>
                          <span className={`absolute -bottom-6 text-xs whitespace-nowrap
                            ${stage.status === 'current' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 
                              'text-gray-500 dark:text-gray-400'}`}>
                            {stage.label}
                          </span>
                        </div>
                        {index < 3 && (
                          <div className={`flex-1 h-1 mx-2 
                            ${stage.status === 'completed' ? 'bg-green-500' : 
                              'bg-gray-200 dark:bg-gray-700'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 프로젝트 스크린샷 */}
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">프로젝트 이미지</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((index) => (
                    <div 
                      key={index}
                      className="relative group cursor-pointer"
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setShowImageModal(true);
                      }}
                    >
                      <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                        <Image
                          src={`/images/project-${index}.jpg`}
                          alt={`프로젝트 이미지 ${index}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate">프로젝트 화면 ${index}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 오른쪽: 매칭 분석 및 실시간 통계 */}
            <div className="lg:w-80">
              {/* 매칭 분석 카드 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">매칭 분석</h3>
                
                <div className="space-y-4">
                  {/* 스킬 매칭도 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        스킬 매칭도
                      </span>
                      <span className={`text-sm font-bold ${
                        skillMatchScore >= 80 ? 'text-green-600' :
                        skillMatchScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {skillMatchScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          skillMatchScore >= 80 ? 'bg-green-500' :
                          skillMatchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${skillMatchScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* 프로젝트 난이도 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        프로젝트 난이도
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        중급
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                  </div>

                  {/* 경쟁률 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        경쟁률
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        {competitionRate}:1
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(realtimeStats.applicants * 5, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 text-center">
                    {skillMatchScore >= 80 ? '🎉 프로젝트에 매우 적합합니다!' :
                     skillMatchScore >= 60 ? '👍 좋은 매칭입니다!' : '💪 도전해볼 만합니다!'}
                  </p>
                </div>
              </div>

              {/* 실시간 통계 */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">실시간 현황</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentViewers}</div>
                    <div className="text-gray-500">현재 조회자</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{realtimeStats.views}</div>
                    <div className="text-gray-500">오늘 조회수</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{realtimeStats.applicants}</div>
                    <div className="text-gray-500">총 지원자</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{realtimeStats.bookmarks}</div>
                    <div className="text-gray-500">북마크</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 text-center">
                  마지막 업데이트: 1분 전
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowApplicationModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                지원하기
              </button>
              
              <button
                onClick={() => setShowChatModal(true)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                채팅하기
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors flex items-center gap-2 ${
                  isBookmarked 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <svg className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                {isBookmarked ? '저장됨' : '저장하기'}
              </button>
              
              <button
                onClick={() => navigator.share ? navigator.share({
                  title: project.title,
                  text: project.description,
                  url: window.location.href
                }) : navigator.clipboard.writeText(window.location.href)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.684C18.114 15.938 18 15.482 18 15c0-.482.114-.938.316-1.342m0 2.684a3 3 0 110-2.684M5.684 15.342C5.886 14.938 6 14.482 6 14c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684" />
                </svg>
                공유하기
              </button>
            </div>

            {/* 가격 정보 */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-xl text-gray-500 mb-1">예산</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.budgetMin && project.budgetMax 
                    ? `${(project.budgetMin / 10000).toFixed(0)}~${(project.budgetMax / 10000).toFixed(0)}만원`
                    : project.budget || '협의'}
                </div>
              </div>
              <div className="w-px h-12 bg-gray-300 dark:bg-gray-600"></div>
              <div className="text-center">
                <div className="text-xl text-gray-500 mb-1">마감일</div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {formatDate(project.deadline)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: '개요', icon: '📋' },
              { id: 'details', name: '상세정보', icon: '📝' },
              { id: 'company', name: '회사정보', icon: '🏢' },
              { id: 'reviews', name: '질문&후기', icon: '💬' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 메인 콘텐츠 */}
          <div className="lg:col-span-2">
            {/* 개요 탭 */}
            {activeTab === 'overview' && (
              <Suspense fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
              }>
                <ProjectOverview 
                  project={project}
                  realtimeStats={realtimeStats}
                  skillMatchScore={skillMatchScore}
                  competitionRate={competitionRate}
                />
              </Suspense>
            )}

        {/* 상세 정보 탭 */}
        {activeTab === 'details' && (
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          }>
            <ProjectDetails project={project} />
          </Suspense>
        )}

        {/* 회사 정보 탭 */}
        {activeTab === 'company' && (
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          }>
            <ProjectCompany 
              project={project} 
              onShowCompanyModal={() => setShowCompanyModal(true)}
            />
          </Suspense>
        )}

        {/* 질문 및 후기 탭 */}
        {activeTab === 'reviews' && (
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          }>
            <ProjectQnA 
              questions={questions}
              reviews={reviews}
              loading={tabDataLoading}
              onShowQuestionModal={() => setShowQuestionModal(true)}
              onShowReviewModal={() => setShowReviewModal(true)}
            />
          </Suspense>
        )}
          </div>

          {/* 오른쪽: 사이드바 */}
          <div className="lg:col-span-1">
            <Suspense fallback={
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            }>
              <ProjectSidebar 
                project={project}
                realtimeStats={realtimeStats}
                isBookmarked={isBookmarked}
                onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
                onShowApplicationModal={() => setShowApplicationModal(true)}
                onShowChatModal={() => setShowChatModal(true)}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* 관련 프로젝트 추천 */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          }>
            <SimilarProjects 
              projectId={projectId}
              projects={similarProjects}
              loading={tabDataLoading}
            />
          </Suspense>
        </div>
      </div>

      {/* 지원하기 모달 */}
      <ApplicationModal 
        showApplicationModal={showApplicationModal}
        setShowApplicationModal={setShowApplicationModal}
      />

      {/* 질문하기 모달 */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full m-4">
            <h3 className="text-xl font-bold mb-4">프로젝트 질문하기</h3>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="프로젝트에 대해 궁금한 점을 질문해주세요."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowQuestionModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  if (!questionText.trim()) return;
                  
                  try {
                    const response = await projectService.createProjectQuestion(projectId, {
                      content: questionText
                    });
                    
                    if (response.success) {
                      // 질문 목록 새로고침
                      const updatedQuestions = await projectService.getProjectQuestions(projectId);
                      if (updatedQuestions.success) {
                        setQuestions(updatedQuestions.data || []);
                      }
                      setShowQuestionModal(false);
                      setQuestionText('');
                    } else {
                      alert(response.message || '질문 기능이 아직 구현되지 않았습니다.');
                    }
                  } catch (error) {
                    alert('질문 등록에 실패했습니다. 나중에 다시 시도해주세요.');
                  }
                }}
                disabled={!questionText.trim()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  questionText.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                질문하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 후기 작성 모달 */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-lg w-full m-4">
            <h3 className="text-xl font-bold mb-4">프로젝트 후기 작성</h3>
            
            {/* 별점 선택 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">평점</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="프로젝트 경험에 대한 후기를 남겨주세요."
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            />
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewText('');
                  setReviewRating(5);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                후기 등록
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 모달들 */}
      <Suspense fallback={null}>
        <ProjectModals
          showImageModal={showImageModal}
          selectedImageIndex={selectedImageIndex}
          onCloseImageModal={() => setShowImageModal(false)}
          onNavigateImage={(index) => setSelectedImageIndex(index)}
          showCompanyModal={showCompanyModal}
          onCloseCompanyModal={() => setShowCompanyModal(false)}
          project={project}
          showChatModal={showChatModal}
          onCloseChatModal={() => setShowChatModal(false)}
        />
      </Suspense>
    </div>
  );
} 