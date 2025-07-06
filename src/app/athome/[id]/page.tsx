'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRemoteProjectDetail } from '@/hooks/useRemoteProjectDetail';
import { remoteProjectService } from '@/services/remoteProject';
import type { RemoteProjectDetail, RemoteProjectApplication } from '@/types/remoteProject';
import { formatDate } from '@/utils/format';
import { useAuthStore } from '@/store/auth';
import BookmarkButton from '@/components/common/BookmarkButton';
import ApplyModal, { ApplyFormData } from '@/components/project/ApplyModal';
import InquiryModal, { InquiryFormData } from '@/components/project/InquiryModal';
import { Share2, MessageCircle, Bookmark, BookmarkCheck, Eye, Users, Calendar, Clock, CheckCircle, Shield, TrendingUp, Award, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useRealtimeStats } from '@/hooks/useRealtimeStats';

// 프로젝트 상태에 따른 색상 정의
const statusColors = {
  open: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  closed: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
};

// 경험 레벨에 따른 표시
const experienceLevelLabels = {
  entry: '초급',
  intermediate: '중급',
  expert: '고급'
};

// 작업 타입에 따른 표시
const workTypeLabels = {
  'full-remote': '완전 재택',
  'hybrid': '하이브리드',
  'flexible': '유연 근무'
};

// 긴급도에 따른 색상과 라벨
const urgencyColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const urgencyLabels = {
  low: '여유',
  medium: '보통',
  high: '급함'
};

// 프로젝트 데이터 변환 함수
const formatBudget = (project: RemoteProjectDetail) => {
  if (project.budgetType === 'hourly') {
    return `시간당 ${project.budget}${project.budgetNegotiable ? ' (협의 가능)' : ''}`;
  }
  return `${project.budget}${project.budgetNegotiable ? ' (협의 가능)' : ''}`;
};

const getDeadlineDays = (deadline: string) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export default function RemoteProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { isLoggedIn, user } = useAuthStore();
  
  // API 호출을 위한 커스텀 훅 사용
  const { project, loading, error, toggleBookmark, isBookmarked } = useRemoteProjectDetail(projectId);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'timeline' | 'client' | 'environment' | 'benefits'>('overview');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  // WebSocket을 통한 실시간 통계
  const { stats: realtimeStats, connected: wsConnected, updateStats, connectionStatus, retry } = useRealtimeStats({
    projectId,
    initialStats: {
      viewCount: project?.viewCount || 0,
      applicationsCount: project?.applicationsCount || 0,
      bookmarkCount: project?.bookmarkCount || 0,
      currentViewers: 1
    },
    enableWebSocket: true
  });
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [skillMatchScore, setSkillMatchScore] = useState(0);
  const [showTimeZoneModal, setShowTimeZoneModal] = useState(false);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(0);
  const [previousStats, setPreviousStats] = useState<typeof realtimeStats | null>(null);

  // 프로젝트 정보가 업데이트되면 실시간 통계도 업데이트
  useEffect(() => {
    if (project) {
      updateStats({
        viewCount: project.viewCount || 0,
        applicationsCount: project.applicationsCount || 0,
        bookmarkCount: project.bookmarkCount || 0
      });
    }
  }, [project, updateStats]);

  // 통계 변경 시 애니메이션 효과를 위한 이전 값 저장
  useEffect(() => {
    if (previousStats && 
        (previousStats.viewCount !== realtimeStats.viewCount ||
         previousStats.applicationsCount !== realtimeStats.applicationsCount ||
         previousStats.bookmarkCount !== realtimeStats.bookmarkCount)) {
      // 숫자가 변경되면 애니메이션 효과 트리거
      const statElements = document.querySelectorAll('.stat-value');
      statElements.forEach(el => {
        el.classList.add('stat-update-animation');
        setTimeout(() => {
          el.classList.remove('stat-update-animation');
        }, 600);
      });
    }
    setPreviousStats(realtimeStats);
  }, [realtimeStats, previousStats]);

  // 스킬 매칭 점수 계산
  useEffect(() => {
    if (project && user) {
      // 사용자의 보유 스킬 (실제로는 로그인한 사용자의 프로필에서 가져옴)
      const userSkills = ['React.js', 'TypeScript', 'JavaScript', 'Git'];
      const matchingSkills = project.skills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      const score = Math.round((matchingSkills.length / project.skills.length) * 100);
      setSkillMatchScore(score);
    }
  }, [project, user]);

  // 지원하기 핸들러
  const handleApplication = async (data: ApplyFormData) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    
    try {
      const result = await remoteProjectService.applyProject(projectId, {
        coverLetter: data.coverLetter,
        portfolioUrls: data.portfolio ? [data.portfolio] : [],
        proposedRate: data.expectedRate,
        availableStartDate: data.availableDate,
        freelancerId: user?.id || '',
        status: 'pending'
      });
      
      if (result.success) {
        alert('프로젝트에 성공적으로 지원했습니다.');
        setShowApplicationModal(false);
        // 지원자 수 업데이트
        updateStats({ applicationsCount: realtimeStats.applicationsCount + 1 });
      } else {
        alert(result.error || '지원에 실패했습니다.');
      }
    } catch (error) {
      console.error('Application error:', error);
      alert('지원 중 오류가 발생했습니다.');
    }
  };
  
  // 문의하기 핸들러  
  const handleInquiry = async (data: InquiryFormData) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    
    try {
      const result = await remoteProjectService.inquireProject(projectId, {
        subject: data.subject,
        message: data.message,
        
        userId: user?.id || ''
      });
      
      if (result.success) {
        alert('문의가 성공적으로 전송되었습니다.');
        setShowInquiryModal(false);
      } else {
        alert(result.error || '문의 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Inquiry error:', error);
      alert('문의 전송 중 오류가 발생했습니다.');
    }
  };

  const handleShare = () => {
    if (navigator.share && project) {
      navigator.share({
        title: project.title,
        text: `${project.title} - 재택 프로젝트`,
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">오류가 발생했습니다</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link 
            href="/athome" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            재택 프로젝트 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 프로젝트가 없는 경우
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">프로젝트를 찾을 수 없습니다</h1>
          <Link 
            href="/athome" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            재택 프로젝트 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600">홈</Link>
            <span>›</span>
            <Link href="/athome" className="hover:text-blue-600">재택 프로젝트</Link>
            <span>›</span>
            <span className="hover:text-blue-600">상세보기</span>
            <span>›</span>
            <span className="text-gray-900 dark:text-white">{project.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* Project Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {project.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {project.category}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {project.duration}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[project.urgency]}`}>
                        {urgencyLabels[project.urgency]}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {formatBudget(project)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {project.budgetType === 'fixed' ? '고정 금액' : '시간당'}
                      {project.budgetNegotiable && ' · 협의 가능'}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900 dark:text-blue-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-4">
                    <span>{realtimeStats.applicationsCount}명 지원</span>
                    <span>·</span>
                    <span>{formatDate(project.postedDate)} 게시</span>
                  </div>
                  <div>
                    마감: {formatDate(project.applicationDeadline)} (D-{getDeadlineDays(project.applicationDeadline)})
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex flex-wrap space-x-6 overflow-x-auto">
                  {[
                    { id: 'overview', label: '프로젝트 개요' },
                    { id: 'requirements', label: '요구사항' },
                    { id: 'timeline', label: '일정 및 조건' },
                    { id: 'environment', label: '원격근무 환경' },
                    { id: 'benefits', label: '지원 혜택' },
                    { id: 'client', label: '발주자 정보' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4">프로젝트 설명</h3>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{project.description}</p>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4">필수 요구사항</h3>
                    <ul className="space-y-2">
                      {project.requirements?.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{req}</span>
                        </li>
                      ))}
                    </ul>

                    <h3 className="text-lg font-semibold mt-6 mb-4">산출물</h3>
                    <ul className="space-y-2">
                      {project.deliverables?.map((del, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4">프로젝트 일정</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">프로젝트 기간</p>
                            <p className="font-semibold">{project.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">시작일</p>
                            <p className="font-semibold">{formatDate(project.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">마감일</p>
                            <p className="font-semibold">{formatDate(project.deadline)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">경험 레벨</p>
                            <p className="font-semibold">{experienceLevelLabels[project.experienceLevel]}</p>
                          </div>
                        </div>
                      </div>

                      {project.projectStages && project.projectStages.length > 0 && (
                        <>
                          <h3 className="text-lg font-semibold mt-6 mb-4">프로젝트 단계</h3>
                          <div className="space-y-3">
                            {project.projectStages.map((stage, index) => (
                              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold">{stage.name}</h4>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    stage.status === 'current' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {stage.status === 'completed' ? '완료' :
                                     stage.status === 'current' ? '진행중' : '예정'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stage.description}</p>
                                <p className="text-sm font-medium">기간: {stage.duration}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'environment' && (
                  <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4">원격근무 환경</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">근무 형태</p>
                        <p className="font-semibold">{workTypeLabels[project.workType]}</p>
                      </div>
                      
                      {project.timezone && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">시간대</p>
                          <p className="font-semibold">{project.timezone}</p>
                        </div>
                      )}

                      {project.preferredWorkingHours && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">선호 근무시간</p>
                          <p className="font-semibold">{project.preferredWorkingHours}</p>
                        </div>
                      )}

                      {project.communicationMethod && project.communicationMethod.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">소통 방식</p>
                          <div className="flex flex-wrap gap-2">
                            {project.communicationMethod.map((method, index) => (
                              <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                                {method}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.remoteWorkTools && project.remoteWorkTools.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">협업 도구</p>
                          <div className="flex flex-wrap gap-2">
                            {project.remoteWorkTools.map((tool, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'benefits' && project.benefits && project.benefits.length > 0 && (
                  <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4">지원 혜택</h3>
                    <ul className="space-y-2">
                      {project.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'client' && project.client && (
                  <div className="animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4">발주자 정보</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {project.client.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h4 className="font-semibold text-lg">{project.client.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400">{project.client.company}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-yellow-500">
                            {'★'.repeat(Math.floor(project.client.rating))}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">평점 {project.client.rating}</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{project.client.reviewCount}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">리뷰</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{project.client.projectsCompleted}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">완료 프로젝트</p>
                        </div>
                      </div>
                      
                      {project.client.verificationStatus === 'verified' && (
                        <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          인증된 발주자
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      alert('로그인이 필요합니다.');
                      router.push('/login');
                      return;
                    }
                    setShowApplicationModal(true);
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  disabled={project.status !== 'open'}
                >
                  {project.status === 'open' ? '지원하기' : '마감된 프로젝트'}
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <BookmarkButton
                    isBookmarked={isBookmarked}
                    onToggle={toggleBookmark}
                    size="md"
                    className="py-2 px-4 rounded-lg border border-gray-300"
                  />
                  
                  <button
                    onClick={handleShare}
                    className="py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  문의하기
                </button>
              </div>

              {/* Real-time Stats */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">실시간 현황</h3>
                  <div className="flex items-center gap-2">
                    {connectionStatus === 'connected' && (
                      <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                        <Wifi className="w-3 h-3 mr-1" />
                        <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></span>
                      </span>
                    )}
                    {connectionStatus === 'connecting' && (
                      <span className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                        연결중
                      </span>
                    )}
                    {connectionStatus === 'disconnected' && (
                      <button
                        onClick={retry}
                        className="flex items-center text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <WifiOff className="w-3 h-3 mr-1" />
                        재연결
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Eye className="w-4 h-4 mr-1.5" />
                      조회수
                    </span>
                    <span className="stat-value font-semibold transition-all duration-300 group-hover:scale-110">
                      {realtimeStats.viewCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Users className="w-4 h-4 mr-1.5" />
                      지원자
                    </span>
                    <span className="stat-value font-semibold transition-all duration-300 group-hover:scale-110">
                      {realtimeStats.applicationsCount}명
                    </span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Bookmark className="w-4 h-4 mr-1.5" />
                      북마크
                    </span>
                    <span className="stat-value font-semibold transition-all duration-300 group-hover:scale-110">
                      {realtimeStats.bookmarkCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-600 dark:text-gray-400">현재 보는 사람</span>
                    <div className="flex items-center">
                      <span className="font-semibold text-green-600 dark:text-green-400 transition-all duration-300 group-hover:scale-110">
                        {realtimeStats.currentViewers}명
                      </span>
                      {connectionStatus === 'connected' && realtimeStats.currentViewers > 1 && (
                        <div className="ml-2 flex -space-x-1">
                          {[...Array(Math.min(3, realtimeStats.currentViewers - 1))].map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                              style={{ animationDelay: `${i * 200}ms` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Connection Status Message */}
                {connectionStatus === 'disconnected' && (
                  <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                      실시간 업데이트가 일시적으로 중단되었습니다
                    </p>
                  </div>
                )}
              </div>

              {/* Skill Match Score */}
              {isLoggedIn && skillMatchScore > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h3 className="font-semibold mb-3">스킬 매칭도</h3>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${skillMatchScore}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      />
                    </div>
                    <p className="text-center text-lg font-bold text-blue-600">{skillMatchScore}%</p>
                  </div>
                </div>
              )}
            </div>

            {/* Similar Projects */}
            {project.similarProjects && project.similarProjects.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-4">
                <h3 className="font-semibold mb-4">비슷한 프로젝트</h3>
                <div className="space-y-3">
                  {project.similarProjects.slice(0, 3).map((similar) => (
                    <Link
                      key={similar.id}
                      href={`/athome/${similar.id}`}
                      className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">{similar.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{similar.companyName}</p>
                      <p className="text-sm font-semibold text-blue-600 mt-1">{similar.budget}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplyModal
        project={project}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onApply={handleApplication}
      />
      
      {/* Inquiry Modal */}
      <InquiryModal
        projectTitle={project.title}
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        onInquire={handleInquiry}
      />
    </div>
  );
}