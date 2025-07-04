'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
// Removed framer-motion to fix build errors
import { ProjectDetail, CompanyInfo, ProjectStage, ContactPerson, WorkingConditions } from '@/types/project';
import { useProjectDetail } from '@/hooks/useProjects';
import ApplicationModal from '@/components/project/detail/ApplicationModal';


export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  // useProjectDetail hook 사용
  const { project, loading, error } = useProjectDetail(projectId);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'company' | 'reviews'>('overview');
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'reviews'>('questions');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentViewers, setCurrentViewers] = useState(12);
  const [realtimeStats, setRealtimeStats] = useState({
    applicants: 23,
    views: 456,
    bookmarks: 87
  });

  // 실시간 통계 업데이트 - 성능 최적화를 위해 주석 처리
  // 실제 환경에서는 WebSocket이나 Server-Sent Events를 사용하는 것이 좋습니다
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        ...prev,
        views: prev.views + Math.floor(Math.random() * 3),
        applicants: prev.applicants + (Math.random() > 0.7 ? 1 : 0)
      }));
      setCurrentViewers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 10000); // 10초마다 업데이트

    return () => clearInterval(interval);
  }, []);
  */

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

  // 디버깅 정보 로깅
  useEffect(() => {
    console.log('🔍 ProjectDetailPage - Project ID:', projectId);
    console.log('🔍 ProjectDetailPage - Loading:', loading);
    console.log('🔍 ProjectDetailPage - Error:', error);
    console.log('🔍 ProjectDetailPage - Project:', project);
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
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {project.isUrgent && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    🚨 긴급
                  </span>
                )}
                {project.isRemote && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    🏠 재택가능
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {project.type}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {project.title}
              </h1>
              
              <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-2">
                  <span>🏢</span>
                  <span className="font-medium">{typeof project.company === 'object' ? project.company.name : (project.company || project.companyName || '회사명')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>{project.applicants}명 지원</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>👁</span>
                  <span>{realtimeStats.views}회 조회</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-600">{currentViewers}명 온라인</span>
                </div>
              </div>

              {/* 스킬 매칭 점수 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    🎯 스킬 매칭도
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
                <p className="text-xs text-gray-500 mt-1">
                  {skillMatchScore >= 80 ? '🎉 완벽한 매칭!' :
                   skillMatchScore >= 60 ? '👍 좋은 매칭!' : '💪 도전해보세요!'}
                </p>
              </div>

              {/* 프로젝트 요약 정보 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">💰</div>
                  <div className="text-sm text-gray-500">예산</div>
                  <div className="font-semibold">{project.budget}</div>
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
                  <div className="text-2xl font-bold text-red-600">⏰</div>
                  <div className="text-sm text-gray-500">마감일</div>
                  <div className="font-semibold text-red-600">{project.deadline}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(project.skills || []).map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
            </div>

            {/* 오른쪽 정보 카드 */}
            <div className="lg:w-80">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">프로젝트 예산</span>
                    <span className="font-bold text-xl text-blue-600">{project.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">진행 기간</span>
                    <span className="font-medium">{project.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">마감일</span>
                    <span className="font-medium text-red-600">{project.deadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">지원자 수</span>
                    <span className="font-medium">{realtimeStats.applicants}명</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button 
                      onClick={() => setShowApplicationModal(true)}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-3"
                    >
                      💼 지원하기
                    </button>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          isBookmarked 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isBookmarked ? '⭐' : '☆'} 북마크
                      </button>
                      
                      <button 
                        onClick={() => setShowChatModal(true)}
                        className="py-2 px-3 bg-green-100 text-green-800 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                      >
                        💬 문의
                      </button>
                      
                      <button 
                        onClick={() => navigator.share ? navigator.share({
                          title: project.title,
                          text: project.description,
                          url: window.location.href
                        }) : navigator.clipboard.writeText(window.location.href)}
                        className="py-2 px-3 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                      >
                        📤 공유
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
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

      {/* 탭 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 프로젝트 상세 설명 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">프로젝트 개요</h3>
              <div className="prose max-w-none text-gray-600 dark:text-gray-300">
                {(project.detailedDescription || '').split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* 주요 업무 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">주요 업무</h3>
              <ul className="space-y-3">
                {(project.responsibilities || []).map((responsibility, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-blue-600 text-lg">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 필수 조건 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">필수 조건</h3>
              <ul className="space-y-3">
                {(project.requirements || []).map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-red-500 text-lg">✓</span>
                    <span className="text-gray-600 dark:text-gray-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 우대 조건 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">우대 조건</h3>
              <ul className="space-y-3">
                {(project.preferredSkills || []).map((skill, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-green-500 text-lg">+</span>
                    <span className="text-gray-600 dark:text-gray-300">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 상세 정보 탭 */}
        {activeTab === 'details' && (
          <div className="space-y-8">
            {/* 근무 조건 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-6">근무 조건</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">근무 시간</h4>
                    <p className="text-gray-600 dark:text-gray-300">{project.workingConditions?.workingHours}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">근무 요일</h4>
                    <p className="text-gray-600 dark:text-gray-300">{project.workingConditions?.workingDays}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">야근</h4>
                    <p className="text-gray-600 dark:text-gray-300">{project.workingConditions?.overtime}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">근무 방식</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {project.workingConditions?.remote ? '재택근무 가능' : '사무실 근무'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">복장 규정</h4>
                    <p className="text-gray-600 dark:text-gray-300">{project.workingConditions?.dress_code}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">장비 제공</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {project.workingConditions?.equipment_provided ? '회사에서 제공' : '개인 준비'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 복리후생 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">복리후생</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(project.additionalBenefits || []).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 회사 정보 탭 */}
        {activeTab === 'company' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {project.companyInfo?.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{project.companyInfo?.name}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">업종</span>
                      <p className="font-medium">{project.companyInfo?.industry}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">기업 규모</span>
                      <p className="font-medium">{project.companyInfo?.size}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">설립년도</span>
                      <p className="font-medium">{project.companyInfo?.founded}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">직원 수</span>
                      <p className="font-medium">{project.companyInfo?.employees}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">회사 소개</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {project.companyInfo?.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 질문 및 후기 탭 */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">프로젝트 관련 질문과 후기</h3>
              <p className="text-gray-600 dark:text-gray-300">
                이 프로젝트에 대한 질문이나 참여 후기를 확인해보세요.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 지원하기 모달 */}
      <ApplicationModal 
        showApplicationModal={showApplicationModal}
        setShowApplicationModal={setShowApplicationModal}
      />
    </div>
  );
} 