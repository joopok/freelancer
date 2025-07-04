'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
  preferredWorkingHours: '오전 9시 - 오후 6시 (유연근무 가능)'
};

export default function RemoteProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<RemoteProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'timeline' | 'client'>('overview');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">프로젝트 정보를 불러오는 중...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              프로젝트 목록으로
            </button>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>
          </div>
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
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', label: '프로젝트 개요' },
                    { id: 'requirements', label: '요구사항' },
                    { id: 'timeline', label: '일정 및 조건' },
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
                      {project.requirements.map((requirement, index) => (
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
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Application Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <button 
                onClick={handleApply}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors mb-4"
              >
                프로젝트 지원하기
              </button>
              
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

            {/* Share & Report */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="space-y-3">
                <button className="w-full text-left text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    프로젝트 공유하기
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
                  router.push(`/project/apply/${projectId}`);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                지원하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 