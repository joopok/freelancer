'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  mockRemoteCompanyInfo, 
  mockRemoteEnvironment,
  colors 
} from '@/data/athomeData';
import { RemoteWorkDetail } from '@/types/athome';
import { formatDate } from '@/utils/format';

interface RemoteProject {
  id: string;
  title: string;
  description: string;
  client: {
    name: string;
    company: string;
    rating: number;
    reviewCount: number;
    projectsCompleted: number;
    verificationStatus: 'verified' | 'unverified';
  };
  budget: {
    type: 'fixed' | 'hourly';
    amount: string;
    negotiable: boolean;
  };
  timeline: {
    duration: string;
    startDate: string;
    deadline: string;
    urgency: 'low' | 'medium' | 'high';
  };
  skills: string[];
  category: string;
  workType: 'full-remote' | 'hybrid' | 'flexible';
  requirements: string[];
  deliverables: string[];
  applicationDeadline: string;
  status: 'open' | 'in-progress' | 'completed' | 'closed';
  applicationsCount: number;
  postedDate: string;
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  communicationMethod: string[];
  timezone: string;
  preferredWorkingHours?: string;
  remoteWorkTools?: string[];
  benefits?: string[];
  teamSize?: string;
  projectStages?: Array<{
    name: string;
    description: string;
    duration: string;
    status: 'upcoming' | 'current' | 'completed';
  }>;
}

const mockProject: RemoteProject = {
  id: '1',
  title: '온라인 쇼핑몰 프론트엔드 개발 프로젝트',
  description: 'React.js 기반의 모던한 온라인 쇼핑몰 프론트엔드를 개발할 경험 있는 개발자를 찾고 있습니다. 반응형 디자인으로 모바일과 데스크톱에 최적화된 사용자 인터페이스를 구축하고, 결제 시스템 연동, 상품 검색 및 필터링, 장바구니 기능, 사용자 리뷰 시스템 등을 포함합니다.',
  client: {
    name: '김철수',
    company: '테크스타트업 (주)',
    rating: 4.8,
    reviewCount: 23,
    projectsCompleted: 15,
    verificationStatus: 'verified'
  },
  budget: {
    type: 'fixed',
    amount: '500-800만원',
    negotiable: true
  },
  timeline: {
    duration: '2-3개월',
    startDate: '2024년 1월 15일',
    deadline: '2024년 4월 15일',
    urgency: 'medium'
  },
  skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML/CSS', 'API 연동', 'Git'],
  category: '웹 개발',
  workType: 'full-remote',
  requirements: [
    'React.js 2년 이상 실무 경험',
    'TypeScript 사용 경험 필수',
    'Git을 이용한 협업 경험',
    '전자상거래 사이트 개발 경험 우대',
    '반응형 웹 개발 능숙',
    '원활한 커뮤니케이션 능력'
  ],
  deliverables: [
    '완성된 쇼핑몰 웹사이트',
    '소스코드 및 문서화',
    '배포 가이드',
    '사용자 매뉴얼',
    '유지보수 가이드'
  ],
  applicationDeadline: '2024년 1월 10일',
  status: 'open',
  applicationsCount: 12,
  postedDate: '2023년 12월 20일',
  experienceLevel: 'intermediate',
  communicationMethod: ['Slack', 'Zoom', '이메일', '카카오톡'],
  timezone: 'KST (한국 표준시)',
  preferredWorkingHours: '오전 9시 - 오후 6시 (유연근무 가능)',
  remoteWorkTools: ['Notion', 'Figma', 'GitHub', 'Slack', 'Linear'],
  benefits: [
    '재택근무 장비 지원',
    '유연한 근무시간',
    '온라인 교육 지원',
    '건강보험 지원',
    '성과 보너스'
  ],
  teamSize: '5-10명',
  projectStages: [
    {
      name: '요구사항 분석',
      description: '상세 기능 명세 및 디자인 확정',
      duration: '2주',
      status: 'upcoming'
    },
    {
      name: '프론트엔드 개발',
      description: 'React 컴포넌트 개발 및 API 연동',
      duration: '6주',
      status: 'upcoming'
    },
    {
      name: '테스트 및 배포',
      description: 'QA 테스트 및 프로덕션 배포',
      duration: '2주',
      status: 'upcoming'
    }
  ]
};

export default function RemoteProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<RemoteProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'timeline' | 'client' | 'environment' | 'benefits'>('overview');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentViewers, setCurrentViewers] = useState(5);
  const [realtimeStats, setRealtimeStats] = useState({
    applicants: 12,
    views: 234,
    bookmarks: 45
  });
  const [showChatModal, setShowChatModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [skillMatchScore, setSkillMatchScore] = useState(0);
  const [showTimeZoneModal, setShowTimeZoneModal] = useState(false);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState(0);

  useEffect(() => {
    const loadProjectDetail = async () => {
      setLoading(true);
      setTimeout(() => {
        setProject(mockProject);
        setLoading(false);
      }, 1000);
    };

    if (projectId) {
      loadProjectDetail();
    }
  }, [projectId]);

  // 실시간 통계 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        ...prev,
        views: prev.views + Math.floor(Math.random() * 3),
        applicants: prev.applicants + (Math.random() > 0.8 ? 1 : 0),
        bookmarks: prev.bookmarks + (Math.random() > 0.9 ? 1 : 0)
      }));
      setCurrentViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 스킬 매칭 점수 계산
  useEffect(() => {
    if (project) {
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
  }, [project]);

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-opacity duration-300">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">프로젝트 정보를 불러오는 중...</p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.title,
        text: `${project?.title} - 재택 프로젝트`,
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  };

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
            <span className="text-gray-900 dark:text-white">{project?.title}</span>
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
                        {project.timeline.duration}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[project.timeline.urgency]}`}>
                        {urgencyLabels[project.timeline.urgency]}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {project.budget.amount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {project.budget.type === 'fixed' ? '고정 금액' : '시간당'}
                      {project.budget.negotiable && ' · 협의 가능'}
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
                    <span>{project.applicationsCount}명 지원</span>
                    <span>·</span>
                    <span>{project.postedDate} 게시</span>
                  </div>
                  <div>
                    마감: {project.applicationDeadline}
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
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">프로젝트 상세 설명</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="text-gray-700 dark:text-gray-300">
                        {project.description}
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">산출물</h4>
                      <ul className="space-y-2">
                        {project.deliverables.map((deliverable, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'requirements' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">필수 요구사항</h3>
                    <ul className="space-y-3">
                      {(Array.isArray(project.requirements) ? project.requirements : []).map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">경력 수준</h4>
                      <div className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300">
                          {project.experienceLevel === 'entry' && '신입/주니어'}
                          {project.experienceLevel === 'intermediate' && '중급'}
                          {project.experienceLevel === 'expert' && '시니어/전문가'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">프로젝트 일정</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">시작 예정일</h4>
                          <p className="text-gray-700 dark:text-gray-300">{project.timeline.startDate}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">완료 예정일</h4>
                          <p className="text-gray-700 dark:text-gray-300">{project.timeline.deadline}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">예상 기간</h4>
                          <p className="text-gray-700 dark:text-gray-300">{project.timeline.duration}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">지원 마감일</h4>
                          <p className="text-gray-700 dark:text-gray-300">{project.applicationDeadline}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">근무 조건</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <span className="font-medium text-gray-900 dark:text-white w-32 flex-shrink-0">근무 형태:</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {project.workType === 'full-remote' && '100% 원격근무'}
                            {project.workType === 'hybrid' && '하이브리드 근무'}
                            {project.workType === 'flexible' && '유연근무'}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium text-gray-900 dark:text-white w-32 flex-shrink-0">시간대:</span>
                          <span className="text-gray-700 dark:text-gray-300">{project.timezone}</span>
                        </div>
                        {project.preferredWorkingHours && (
                          <div className="flex items-start">
                            <span className="font-medium text-gray-900 dark:text-white w-32 flex-shrink-0">선호 시간:</span>
                            <span className="text-gray-700 dark:text-gray-300">{project.preferredWorkingHours}</span>
                          </div>
                        )}
                        <div className="flex items-start">
                          <span className="font-medium text-gray-900 dark:text-white w-32 flex-shrink-0">소통 방식:</span>
                          <div className="flex flex-wrap gap-2">
                            {project.communicationMethod.map((method, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded dark:bg-blue-900 dark:text-blue-200"
                              >
                                {method}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'client' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">발주자 정보</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xl font-semibold">
                            {project.client.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{project.client.name}</h4>
                            {project.client.verificationStatus === 'verified' && (
                              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{project.client.company}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="flex items-center mb-1">
                                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-gray-900 dark:text-white font-medium">{project.client.rating}</span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300">({project.client.reviewCount}개 리뷰)</p>
                            </div>
                            <div>
                              <div className="text-gray-900 dark:text-white font-medium mb-1">{project.client.projectsCompleted}건</div>
                              <p className="text-gray-600 dark:text-gray-300">완료 프로젝트</p>
                            </div>
                            <div>
                              <div className="text-green-600 dark:text-green-400 font-medium mb-1">
                                {project.client.verificationStatus === 'verified' ? '인증 완료' : '미인증'}
                              </div>
                              <p className="text-gray-600 dark:text-gray-300">신원 확인</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'environment' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">원격근무 환경</h3>
                    
                    {/* 협업 도구 */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">협업 도구</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {project.remoteWorkTools?.map((tool, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center">
                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 시간대 및 근무 유연성 */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">시간대 및 근무 유연성</h4>
                      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">현지 시간대</p>
                            <p className="font-medium text-gray-900 dark:text-white">{project.timezone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">선호 근무 시간</p>
                            <p className="font-medium text-gray-900 dark:text-white">{project.preferredWorkingHours || '자유'}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowTimeZoneModal(true)}
                          className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                        >
                          시간대 변환기 보기 →
                        </button>
                      </div>
                    </div>

                    {/* 원격근무 정책 */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">원격근무 정책</h4>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">100% 원격근무</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">전 세계 어디서든 근무 가능</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">비동기 커뮤니케이션</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">시간대에 구애받지 않는 협업</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">성과 중심 평가</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">근무 시간이 아닌 결과물로 평가</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 커뮤니케이션 가이드 */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">커뮤니케이션 가이드</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-700 dark:text-gray-300">정기 화상 미팅</span>
                          <span className="text-gray-900 dark:text-white font-medium">주 2회</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-700 dark:text-gray-300">일일 스탠드업</span>
                          <span className="text-gray-900 dark:text-white font-medium">Slack 채널</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="text-gray-700 dark:text-gray-300">응답 시간</span>
                          <span className="text-gray-900 dark:text-white font-medium">24시간 이내</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'benefits' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">프로젝트 지원 혜택</h3>
                    
                    {/* 장비 지원 */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                        <span className="inline-flex items-center">
                          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                          </svg>
                          장비 지원
                        </span>
                      </h4>
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">노트북 대여 가능</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">모니터, 키보드, 마우스 지원</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">인터넷 비용 월 8만원 지원</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* 복지 혜택 */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                        <span className="inline-flex items-center">
                          <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                          </svg>
                          복지 혜택
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {project.benefits?.map((benefit, index) => (
                          <div key={index} className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 추가 혜택 */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                        <span className="inline-flex items-center">
                          <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                          </svg>
                          추가 혜택
                        </span>
                      </h4>
                      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          프로젝트 성공적 완료 시 다음 혜택이 제공됩니다:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center">
                            <span className="text-orange-600 dark:text-orange-400 mr-2">•</span>
                            <span className="text-gray-700 dark:text-gray-300">우수 수행자 보너스 지급</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-orange-600 dark:text-orange-400 mr-2">•</span>
                            <span className="text-gray-700 dark:text-gray-300">후속 프로젝트 우선 제안</span>
                          </li>
                          <li className="flex items-center">
                            <span className="text-orange-600 dark:text-orange-400 mr-2">•</span>
                            <span className="text-gray-700 dark:text-gray-300">추천서 발급 가능</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Real-time Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">실시간 현황</h3>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{currentViewers}명 조회중</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{realtimeStats.views}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">조회수</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{realtimeStats.applicants}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">지원자</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{realtimeStats.bookmarks}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">북마크</div>
                </div>
              </div>
            </div>

            {/* Skill Match Score */}
            {skillMatchScore > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">스킬 매칭도</h3>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{skillMatchScore}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${skillMatchScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {skillMatchScore >= 80 ? '매우 적합' : skillMatchScore >= 60 ? '적합' : '부분 적합'}
                </p>
              </div>
            )}

            {/* Application Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <button 
                onClick={handleApply}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors mb-4"
              >
                프로젝트 지원하기
              </button>
              
              {/* Quick Actions */}
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={handleBookmark}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    isBookmarked 
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-1" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {isBookmarked ? '저장됨' : '저장'}
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 py-2 px-3 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  공유
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">지원 마감일</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.applicationDeadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">현재 지원자</span>
                  <span className="font-medium text-gray-900 dark:text-white">{project.applicationsCount}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">프로젝트 상태</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {project.status === 'open' && '지원 받는 중'}
                    {project.status === 'in-progress' && '진행 중'}
                    {project.status === 'completed' && '완료'}
                    {project.status === 'closed' && '마감'}
                  </span>
                </div>
              </div>
            </div>

            {/* Project Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">프로젝트 요약</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">카테고리</div>
                  <div className="font-medium text-gray-900 dark:text-white">{project.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">예산</div>
                  <div className="font-medium text-gray-900 dark:text-white">{project.budget.amount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">기간</div>
                  <div className="font-medium text-gray-900 dark:text-white">{project.timeline.duration}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">근무 형태</div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {project.workType === 'full-remote' && '100% 원격'}
                    {project.workType === 'hybrid' && '하이브리드'}
                    {project.workType === 'flexible' && '유연근무'}
                  </div>
                </div>
              </div>
            </div>

            {/* Work Style Compatibility */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">원격근무 지원 체크리스트</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">자체 작업 공간</span>
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">안정적인 인터넷 환경</span>
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">독립적 업무 수행 가능</span>
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">비동기 커뮤니케이션 경험</span>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">해외 고객과 소통 가능</span>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                </div>
              </div>
            </div>

            {/* Estimated Work Time Calculator */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">예상 작업 시간 계산기</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400">주간 투입 시간</label>
                  <select 
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onChange={(e) => setEstimatedDeliveryTime(parseInt(e.target.value))}
                  >
                    <option value="20">20시간/주</option>
                    <option value="30">30시간/주</option>
                    <option value="40">40시간/주 (풀타임)</option>
                  </select>
                </div>
                {estimatedDeliveryTime > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      예상 완료일: <span className="font-semibold">약 {Math.ceil((parseInt(project.timeline.duration.split('-')[0]) * 40) / estimatedDeliveryTime)}주 ~ {Math.ceil((parseInt(project.timeline.duration.split('-')[1]?.split('개월')[0] || project.timeline.duration.split('-')[0]) * 40) / estimatedDeliveryTime)}주</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Project Stages */}
            {project.projectStages && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">프로젝트 진행 단계</h3>
                <div className="space-y-3">
                  {project.projectStages.map((stage, index) => (
                    <div key={index} className="relative">
                      <div className={`flex items-start ${
                        stage.status === 'current' ? 'opacity-100' : 
                        stage.status === 'completed' ? 'opacity-60' : 'opacity-40'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          stage.status === 'completed' ? 'bg-green-500' :
                          stage.status === 'current' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}>
                          {stage.status === 'completed' ? (
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <span className="text-white text-sm">{index + 1}</span>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{stage.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{stage.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stage.duration}</p>
                        </div>
                      </div>
                      {index < (project.projectStages?.length ?? 0) - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">자주 묻는 질문</h3>
              <div className="space-y-3">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Q. 해외 거주자도 지원 가능한가요?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pl-4">
                    네, 전 세계 어디서든 지원 가능합니다. 단, 시간대 차이로 인한 커뮤니케이션 방법을 협의해야 합니다.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Q. 장비 지원은 어떻게 받나요?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pl-4">
                    프로젝트 시작 후 1주일 이내에 필요한 장비 목록을 제출하면, 검토 후 지원됩니다.
                  </p>
                </details>
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Q. 업무 시간은 어떻게 체크하나요?
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 pl-4">
                    성과 중심으로 평가하므로 별도의 시간 추적 도구는 사용하지 않습니다. 대신 정기적인 진행 상황 공유가 필요합니다.
                  </p>
                </details>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-3">
                <button 
                  onClick={() => setShowChatModal(true)}
                  className="w-full text-left text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>문의하기</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                <button 
                  className="w-full text-left text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors group"
                  onClick={() => window.open('https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(project.title + ' - 프로젝트 상담') + '&details=' + encodeURIComponent('프로젝트: ' + project.title + '\n예산: ' + project.budget.amount + '\n기간: ' + project.timeline.duration), '_blank')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>상담 일정 잡기</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </button>
                <button className="w-full text-left text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    부적절한 내용 신고
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Remote Work Tips */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💡 원격근무 성공 팁</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">커뮤니케이션</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                명확하고 자주 소통하세요. 비동기 커뮤니케이션에서는 글로 생각을 정리하는 것이 중요합니다.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">시간 관리</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                작업 시간을 기록하고, 정기적인 휴식을 취하세요. 포모도로 기법을 활용해보세요.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">업무 공간</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                전용 작업 공간을 만들고, 업무와 개인 생활을 분리하세요. 적절한 조명과 의자는 필수입니다.
              </p>
            </div>
          </div>
        </div>

        {/* Similar Projects */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">유사한 재택 프로젝트</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Link 
                key={item} 
                href={`/athome/${item + 1}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">모바일 앱 개발 프로젝트</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">React Native 기반 크로스플랫폼 앱 개발</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">300-500만원</span>
                  <span className="text-gray-500 dark:text-gray-500">3개월</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
             onClick={() => setShowApplicationModal(false)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
               onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">프로젝트 지원</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              이 프로젝트에 지원하시겠습니까? 지원서 작성 페이지로 이동합니다.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  router.push(`/athome/apply/${projectId}`);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                지원하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
             onClick={() => setShowChatModal(false)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg"
               onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">프로젝트 문의</h3>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                발주자에게 프로젝트에 대해 문의할 수 있습니다. 정중하고 전문적인 태도로 소통해주세요.
              </p>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="문의 내용을 입력하세요..."
            ></textarea>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowChatModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                취소
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                문의 보내기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
             onClick={() => setShowShareModal(false)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
               onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">프로젝트 공유</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  <span className="text-gray-900 dark:text-white">Twitter에 공유</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                  <span className="text-gray-900 dark:text-white">Facebook에 공유</span>
                </div>
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('링크가 복사되었습니다!');
                }}
                className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-900 dark:text-white">링크 복사</span>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* TimeZone Modal */}
      {showTimeZoneModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
             onClick={() => setShowTimeZoneModal(false)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl"
               onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">시간대 변환기</h3>
              <button
                onClick={() => setShowTimeZoneModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">한국 (KST)</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">UTC+9</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">미국 동부 (EST)</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">UTC-5</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">영국 (GMT)</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">UTC+0</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
} 