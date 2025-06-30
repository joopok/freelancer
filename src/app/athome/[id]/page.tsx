'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { RemoteWorkDetail } from '@/types/athome';
import { colors, mockRemoteWorkReviews, mockRemoteWorkQuestions } from '@/data/athomeData';
import { ProjectService } from '@/services/database';



export default function RemoteWorkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const remoteWorkId = params.id as string;
  
  const [remoteWork, setRemoteWork] = useState<RemoteWorkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'environment' | 'culture' | 'tools' | 'company' | 'reviews'>('overview');
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'reviews'>('questions');
  
  // 모달 상태들
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showVirtualOfficeModal, setShowVirtualOfficeModal] = useState(false);
  const [showEnvironmentSetupModal, setShowEnvironmentSetupModal] = useState(false);
  const [showProductivityModal, setShowProductivityModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  
  // 인터랙티브 상태들
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [skillMatchScore, setSkillMatchScore] = useState(0);
  const [remoteWorkScore, setRemoteWorkScore] = useState(0);
  const [currentOnlineWorkers, setCurrentOnlineWorkers] = useState(24);
  const [currentActiveTeams, setCurrentActiveTeams] = useState(8);
  
  // 실시간 통계
  const [realtimeStats, setRealtimeStats] = useState(mockRealtimeStats);

  // 가상 오피스 투어 상태
  const [virtualTourStep, setVirtualTourStep] = useState(0);
  const [isVirtualTourActive, setIsVirtualTourActive] = useState(false);

  // 환경 설정 도우미 상태
  const [environmentSetupStep, setEnvironmentSetupStep] = useState(0);
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Seoul');
  const [workingHoursPreference, setWorkingHoursPreference] = useState('flexible');

  // 실시간 통계 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        ...prev,
        views: prev.views + Math.floor(Math.random() * 5) + 1,
        applicants: prev.applicants + (Math.random() > 0.8 ? 1 : 0),
        onlineInterviews: Math.max(5, prev.onlineInterviews + Math.floor(Math.random() * 3) - 1)
      }));
      setCurrentOnlineWorkers(prev => Math.max(15, prev + Math.floor(Math.random() * 6) - 2));
      setCurrentActiveTeams(prev => Math.max(3, prev + Math.floor(Math.random() * 4) - 1));
    }, 8000); // 8초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 스킬 매칭 점수 계산
  useEffect(() => {
    if (remoteWork) {
      // 사용자의 보유 스킬 (실제로는 로그인한 사용자의 프로필에서 가져옴)
      const userSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Git']; 
      
      const matchingSkills = remoteWork.skills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      
      const score = Math.round((matchingSkills.length / remoteWork.skills.length) * 100);
      setSkillMatchScore(score);
      
      // 원격근무 적합도 점수 계산
      let remoteScore = 0;
      if (remoteWork.isFullyRemote) remoteScore += 30;
      if (remoteWork.remoteWorkEnvironment?.officeSetupSupport) remoteScore += 20;
      if (remoteWork.workingConditions?.timeZoneFlexibility === 'High') remoteScore += 25;
      if (remoteWork.virtualOffice?.digitalWhiteboards) remoteScore += 15;
      if (remoteWork.teamCulture?.communicationStyle === 'Asynchronous-first') remoteScore += 10;
      
      setRemoteWorkScore(Math.min(100, remoteScore));
    }
  }, [remoteWork]);

  // 재택근무 상세 데이터 로드
  useEffect(() => {
    const loadRemoteWorkDetail = async () => {
      setLoading(true);
      
      // 임시 데이터 생성 (실제로는 API에서 가져옴)
      setTimeout(() => {
        import { RemoteWorkDetail } from '@/types/athome';
import { 
  colors,
  mockRemoteWork,
  mockSimilarRemoteWorks,
  mockRemoteWorkReviews,
  mockRemoteWorkQuestions,
  mockRealtimeStats
} from '@/data/athomeData';

export default function RemoteWorkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const remoteWorkId = params.id as string;
  
  const [remoteWork, setRemoteWork] = useState<RemoteWorkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'environment' | 'culture' | 'tools' | 'company' | 'reviews'>('overview');
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'reviews'>('questions');
  
  // 모달 상태들
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showVirtualOfficeModal, setShowVirtualOfficeModal] = useState(false);
  const [showEnvironmentSetupModal, setShowEnvironmentSetupModal] = useState(false);
  const [showProductivityModal, setShowProductivityModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showToolsModal, setShowToolsModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  
  // 인터랙티브 상태들
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [skillMatchScore, setSkillMatchScore] = useState(0);
  const [remoteWorkScore, setRemoteWorkScore] = useState(0);
  const [currentOnlineWorkers, setCurrentOnlineWorkers] = useState(24);
  const [currentActiveTeams, setCurrentActiveTeams] = useState(8);
  
  // 실시간 통계
  const [realtimeStats, setRealtimeStats] = useState(mockRealtimeStats);

  // 가상 오피스 투어 상태
  const [virtualTourStep, setVirtualTourStep] = useState(0);
  const [isVirtualTourActive, setIsVirtualTourActive] = useState(false);

  // 환경 설정 도우미 상태
  const [environmentSetupStep, setEnvironmentSetupStep] = useState(0);
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Seoul');
  const [workingHoursPreference, setWorkingHoursPreference] = useState('flexible');

  // 실시간 통계 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        ...prev,
        views: prev.views + Math.floor(Math.random() * 5) + 1,
        applicants: prev.applicants + (Math.random() > 0.8 ? 1 : 0),
        onlineInterviews: Math.max(5, prev.onlineInterviews + Math.floor(Math.random() * 3) - 1)
      }));
      setCurrentOnlineWorkers(prev => Math.max(15, prev + Math.floor(Math.random() * 6) - 2));
      setCurrentActiveTeams(prev => Math.max(3, prev + Math.floor(Math.random() * 4) - 1));
    }, 8000); // 8초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  // 스킬 매칭 점수 계산
  useEffect(() => {
    if (remoteWork) {
      // 사용자의 보유 스킬 (실제로는 로그인한 사용자의 프로필에서 가져옴)
      const userSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Git']; 
      
      const matchingSkills = remoteWork.skills.filter(skill => 
        userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      
      const score = Math.round((matchingSkills.length / remoteWork.skills.length) * 100);
      setSkillMatchScore(score);
      
      // 원격근무 적합도 점수 계산
      let remoteScore = 0;
      if (remoteWork.isFullyRemote) remoteScore += 30;
      if (remoteWork.remoteWorkEnvironment?.officeSetupSupport) remoteScore += 20;
      if (remoteWork.workingConditions?.timeZoneFlexibility === 'High') remoteScore += 25;
      if (remoteWork.virtualOffice?.digitalWhiteboards) remoteScore += 15;
      if (remoteWork.teamCulture?.communicationStyle === 'Asynchronous-first') remoteScore += 10;
      
      setRemoteWorkScore(Math.min(100, remoteScore));
    }
  }, [remoteWork]);

  // 재택근무 상세 데이터 로드
  useEffect(() => {
    const loadRemoteWorkDetail = async () => {
      setLoading(true);
      
      // 임시 데이터 생성 (실제로는 API에서 가져옴)
      setTimeout(() => {
        setRemoteWork(mockRemoteWork(remoteWorkId));
        setLoading(false);
      }, 900);
    };

    if (remoteWorkId) {
      loadRemoteWorkDetail();
    }
  }, [remoteWorkId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">원격근무 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!remoteWork) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">원격근무 정보를 찾을 수 없습니다</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">존재하지 않거나 삭제된 원격근무 공고입니다.</p>
          <Link 
            href="/athome"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 상단 브레드크럼 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">홈</Link>
            <span>›</span>
            <Link href="/athome" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">재택 프로젝트</Link>
            <span>›</span>
            <span className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">상세보기</span>
            <span>›</span>
            <span className="text-gray-900 dark:text-white font-medium">{remoteWork.title}</span>
          </nav>
        </div>
      </div>

      {/* 메인 헤더 영역 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* 상단 태그 및 실시간 정보 */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex flex-wrap items-center gap-3">
              {remoteWork.isFullyRemote && (
                <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg">
                  💻 100% 원격근무
                </span>
              )}
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
                🌍 글로벌 팀
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold rounded-full shadow-lg">
                ⚡ {remoteWork.level}
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
                🎯 {remoteWork.category}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* 실시간 온라인 팀원 */}
              <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-xl">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 dark:text-green-300 text-sm font-medium">
                  {currentOnlineWorkers}명 온라인
                </span>
              </div>
              {/* 활성 팀 수 */}
              <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                  {currentActiveTeams}개 팀 활성
                </span>
              </div>
            </div>
          </div>

          {/* 제목 및 회사 정보 */}
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {remoteWork.title}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {remoteWork.companyInfo.name.charAt(1)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{remoteWork.company}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{remoteWork.companyInfo.industry} • {remoteWork.companyInfo.size}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 스킬 매칭 점수 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 스킬 매칭 점수 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 p-6 rounded-xl border border-blue-200/50 dark:border-blue-700/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🎯 스킬 매칭도</h3>
                <span className={`text-2xl font-bold ${
                  skillMatchScore >= 80 ? 'text-green-600 dark:text-green-400' :
                  skillMatchScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {skillMatchScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                    skillMatchScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    skillMatchScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${skillMatchScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {skillMatchScore >= 80 ? '매우 적합한 포지션입니다!' :
                 skillMatchScore >= 60 ? '적합한 포지션입니다' :
                 '일부 스킬 개발이 필요합니다'}
              </p>
            </div>

            {/* 원격근무 적합도 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-xl border border-purple-200/50 dark:border-purple-700/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🏠 원격근무 점수</h3>
                <span className={`text-2xl font-bold ${
                  remoteWorkScore >= 80 ? 'text-green-600 dark:text-green-400' :
                  remoteWorkScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {remoteWorkScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                    remoteWorkScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    remoteWorkScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                    'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}
                  style={{ width: `${remoteWorkScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {remoteWorkScore >= 80 ? '원격근무에 최적화된 환경!' :
                 remoteWorkScore >= 60 ? '원격근무에 적합한 환경' :
                 '원격근무 환경 개선 필요'}
              </p>
            </div>
          </div>

          {/* 주요 메트릭 카드들 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">{remoteWork.budget}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">💰 프로젝트 예산</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{remoteWork.duration}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">⏱️ 프로젝트 기간</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{remoteWork.teamSize}명</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">👥 팀 규모</div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
              <div className="text-center">
                <div className={`text-2xl font-bold mb-1 ${
                  remoteWork.deadline.includes('D-') ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {remoteWork.deadline}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">🗓️ 마감일</div>
              </div>
            </div>
          </div>

          {/* 필수 스킬 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🛠️ 필수 기술 스택</h3>
            <div className="flex flex-wrap gap-2">
              {remoteWork.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium border border-gray-300 dark:border-gray-500 hover:shadow-md transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 액션 버튼 섹션 */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-4 sm:p-6 mb-8">
          {/* 메인 액션 버튼들 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            
            {/* 지원하기 버튼 */}
            <button
              onClick={() => setShowApplicationModal(true)}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 min-h-[60px]"
            >
              <span className="text-xl">📝</span>
              <span className="text-base">지원하기</span>
            </button>

            {/* 북마크 버튼 */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center justify-center space-x-3 font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 min-h-[60px] ${
                isBookmarked 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                  : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
              }`}
            >
              <span className="text-xl">{isBookmarked ? '⭐' : '☆'}</span>
              <span className="text-base">{isBookmarked ? '찜됨' : '찜하기'}</span>
            </button>

            {/* 실시간 채팅 */}
            <button
              onClick={() => setShowChatModal(true)}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 min-h-[60px]"
            >
              <span className="text-xl">💬</span>
              <span className="text-base">실시간 채팅</span>
            </button>

            {/* 화상 미팅 예약 */}
            <button
              onClick={() => setShowVideoCallModal(true)}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 min-h-[60px]"
            >
              <span className="text-xl">📹</span>
              <span className="text-base">화상 미팅</span>
            </button>
          </div>

          {/* 추가 액션 버튼들 */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            
            {/* 가상 오피스 투어 */}
            <button
              onClick={() => setShowVirtualOfficeModal(true)}
              className="flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 hover:from-cyan-100 hover:to-blue-150 dark:hover:from-cyan-900/50 dark:hover:to-blue-900/50 text-cyan-700 dark:text-cyan-300 py-3 px-1 rounded-xl border border-cyan-200 dark:border-cyan-700 transition-all duration-200 hover:shadow-md min-h-[70px]"
            >
              <span className="text-lg sm:text-xl">🏢</span>
              <span className="text-xs font-medium text-center leading-tight">가상 오피스</span>
            </button>

            {/* 환경 설정 도우미 */}
            <button
              onClick={() => setShowEnvironmentSetupModal(true)}
              className="flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 hover:from-green-100 hover:to-emerald-150 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 text-green-700 dark:text-green-300 py-3 px-1 rounded-xl border border-green-200 dark:border-green-700 transition-all duration-200 hover:shadow-md min-h-[70px]"
            >
              <span className="text-lg sm:text-xl">⚙️</span>
              <span className="text-xs font-medium text-center leading-tight">환경 설정</span>
            </button>

            {/* 협업 도구 */}
            <button
              onClick={() => setShowToolsModal(true)}
              className="flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 hover:from-purple-100 hover:to-indigo-150 dark:hover:from-purple-900/50 dark:hover:to-indigo-900/50 text-purple-700 dark:text-purple-300 py-3 px-1 rounded-xl border border-purple-200 dark:border-purple-700 transition-all duration-200 hover:shadow-md min-h-[70px]"
            >
              <span className="text-lg sm:text-xl">🛠️</span>
              <span className="text-xs font-medium text-center leading-tight">협업 도구</span>
            </button>

            {/* 생산성 분석 */}
            <button
              onClick={() => setShowProductivityModal(true)}
              className="flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 hover:from-orange-100 hover:to-red-150 dark:hover:from-orange-900/50 dark:hover:to-red-900/50 text-orange-700 dark:text-orange-300 py-3 px-1 rounded-xl border border-orange-200 dark:border-orange-700 transition-all duration-200 hover:shadow-md min-h-[70px]"
            >
              <span className="text-lg sm:text-xl">📊</span>
              <span className="text-xs font-medium text-center leading-tight">생산성 분석</span>
            </button>

            {/* 온보딩 시뮬레이션 */}
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 hover:from-yellow-100 hover:to-amber-150 dark:hover:from-yellow-900/50 dark:hover:to-amber-900/50 text-yellow-700 dark:text-yellow-300 py-3 px-1 rounded-xl border border-yellow-200 dark:border-yellow-700 transition-all duration-200 hover:shadow-md min-h-[70px]"
            >
              <span className="text-lg sm:text-xl">🎯</span>
              <span className="text-xs font-medium text-center leading-tight">온보딩</span>
            </button>

            {/* 정책 상세 */}
            <button
              onClick={() => setShowPolicyModal(true)}
              className="flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30 hover:from-gray-100 hover:to-slate-150 dark:hover:from-gray-900/50 dark:hover:to-slate-900/50 text-gray-700 dark:text-gray-300 py-3 px-1 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md min-h-[70px]"
            >
              <span className="text-lg sm:text-xl">📋</span>
              <span className="text-xs font-medium text-center leading-tight">정책 상세</span>
            </button>
          </div>

          {/* 공유하기 및 실시간 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            
            {/* 공유하기 */}
            <div className="w-full">
              <button
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: remoteWork.title,
                        text: `${remoteWork.company}의 원격근무 기회를 확인해보세요!`,
                        url: window.location.href,
                      });
                    } catch (error) {
                      // Fallback to clipboard
                      navigator.clipboard.writeText(window.location.href);
                      alert('링크가 클립보드에 복사되었습니다!');
                    }
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('링크가 클립보드에 복사되었습니다!');
                  }
                }}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 min-h-[60px]"
              >
                <span className="text-xl">🔗</span>
                <span>공유하기</span>
              </button>
            </div>

            {/* 실시간 통계 카드 */}
            <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{realtimeStats.applicants}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">지원자</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{realtimeStats.views}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">조회수</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{realtimeStats.onlineInterviews}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">진행 중</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 relative">
            {[
              { id: 'overview', label: '📋 개요', icon: '📋' },
              { id: 'environment', label: '🏠 원격환경', icon: '🏠' },
              { id: 'culture', label: '👥 팀문화', icon: '👥' },
              { id: 'tools', label: '🛠️ 협업도구', icon: '🛠️' },
              { id: 'company', label: '🏢 회사정보', icon: '🏢' },
              { id: 'reviews', label: '💬 리뷰&Q&A', icon: '💬' }
            ].map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative py-4 px-4 font-medium text-sm transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
                <span className="relative z-20">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 개요 탭 */}
        {activeTab === 'overview' && (
          <div>
              <div className="space-y-8">
                
                {/* 프로젝트 상세 설명 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📝 프로젝트 상세</h3>
                  <div className={`${colors.primary.bg} p-6 rounded-xl ${colors.primary.border}`}>
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
                        {remoteWork.detailedDescription}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 주요 업무 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🎯 주요 업무</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {remoteWork.responsibilities.map((responsibility, index) => (
                      <div key={index} className={`flex items-start space-x-3 ${colors.card} p-4 rounded-xl shadow-sm`}>
                        <div className={`flex-shrink-0 w-8 h-8 ${colors.success.accent} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                          {index + 1}
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">{responsibility}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 필수 조건 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">✅ 필수 조건</h3>
                  <div className="space-y-3">
                    {remoteWork.requirements.map((requirement, index) => (
                      <div key={index} className={`flex items-center space-x-3 ${colors.card} p-4 rounded-xl shadow-sm`}>
                        <div className={`flex-shrink-0 w-6 h-6 ${colors.danger.accent} rounded-full flex items-center justify-center text-white text-sm`}>
                          ✓
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">{requirement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 우대 조건 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">⭐ 우대 조건</h3>
                  <div className="space-y-3">
                    {remoteWork.preferredSkills.map((skill, index) => (
                      <div key={index} className={`flex items-center space-x-3 ${colors.card} p-4 rounded-xl shadow-sm`}>
                        <div className={`flex-shrink-0 w-6 h-6 ${colors.warning.accent} rounded-full flex items-center justify-center text-white text-sm`}>
                          ⭐
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">{skill}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 진행 단계 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🚀 진행 단계</h3>
                  <div className="space-y-4">
                    {remoteWork.workStages.map((stage, index) => (
                      <div key={stage.id} className={`${colors.card} p-6 rounded-xl shadow-sm`}>
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-12 h-12 ${colors.primary.accent} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{stage.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">{stage.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <span className={`${colors.primary.bg} ${colors.primary.text} px-3 py-1 rounded-full`}>
                                ⏱️ {stage.duration}
                              </span>
                              <span className={`${colors.success.bg} ${colors.success.text} px-3 py-1 rounded-full`}>
                                🤝 협업도: {stage.collaborationLevel}
                              </span>
                            </div>
                            <div className="mt-3">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">산출물:</h5>
                              <div className="flex flex-wrap gap-2">
                                {stage.deliverables.map((deliverable, idx) => (
                                  <span key={idx} className={`${colors.neutral.bg} ${colors.neutral.text} px-3 py-1 rounded-lg text-sm`}>
                                    {deliverable}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 유사 원격근무 추천 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🔍 유사 원격근무 추천</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {[
                      {
                        id: '1',
                        title: 'React 개발자 (100% 리모트)',
                        company: '(주)디지털노마드',
                        budget: '6,000만원',
                        duration: '4개월',
                        skills: ['React', 'TypeScript', 'Node.js'],
                        applicants: 23,
                        matchScore: 94,
                        remoteScore: 98,
                        benefits: ['장비지원', '무제한휴가', '글로벌팀']
                      },
                      {
                        id: '2',
                        title: 'AI 엔지니어 (하이브리드)',
                        company: '(주)스마트워크',
                        budget: '7,500만원',
                        duration: '5개월',
                        skills: ['Python', 'TensorFlow', 'AWS'],
                        applicants: 31,
                        matchScore: 87,
                        remoteScore: 85,
                        benefits: ['교육지원', '홈오피스', '성과급']
                      },
                      {
                        id: '3',
                        title: '풀스택 개발자 (원격우선)',
                        company: '(주)원격테크',
                        budget: '5,500만원',
                        duration: '6개월',
                        skills: ['React', 'Python', 'Docker'],
                        applicants: 18,
                        matchScore: 82,
                        remoteScore: 92,
                        benefits: ['장비지원', '시차적응', '워케이션']
                      },
                      {
                        id: '4',
                        title: '클라우드 아키텍트 (글로벌)',
                        company: '(주)클라우드퍼스트',
                        budget: '9,000만원',
                        duration: '8개월',
                        skills: ['AWS', 'Docker', 'Kubernetes'],
                        applicants: 42,
                        matchScore: 78,
                        remoteScore: 96,
                        benefits: ['글로벌팀', '무제한휴가', '컨퍼런스']
                      }
                    ].map((similar) => (
                      <div key={similar.id} className={`${colors.card} p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{similar.title}</h4>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              similar.matchScore >= 90 ? `${colors.success.bg} ${colors.success.text}` :
                              similar.matchScore >= 80 ? `${colors.warning.bg} ${colors.warning.text}` :
                              `${colors.danger.bg} ${colors.danger.text}`
                            }`}>
                              {similar.matchScore}%
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{similar.company}</p>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                          <div>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">💰 {similar.budget}</span>
                          </div>
                          <div>
                            <span className="text-green-600 dark:text-green-400 font-medium">⏱️ {similar.duration}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {similar.skills.slice(0, 3).map((skill, idx) => (
                              <span key={idx} className={`${colors.neutral.bg} ${colors.neutral.text} px-2 py-1 rounded text-xs`}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            👥 {similar.applicants}명 지원
                          </div>
                          <Link 
                            href={`/athome/${similar.id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
                          >
                            자세히 보기 →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 원격환경 탭 */}
          {activeTab === 'environment' && (
            <div>
              <div className="space-y-8">
                
                {/* 장비 및 지원 사항 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">💻 제공 장비 및 지원</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {remoteWork.remoteWorkEnvironment.equipmentProvided.map((equipment, index) => (
                      <div key={index} className={`${colors.primary.bg} p-4 rounded-xl ${colors.primary.border}`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${colors.primary.accent} rounded-full flex items-center justify-center text-white text-xl`}>
                            💻
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 font-medium">{equipment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 홈오피스 지원금 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`${colors.success.bg} p-6 rounded-xl ${colors.success.border}`}>
                    <div className="text-center">
                      <div className={`w-16 h-16 ${colors.success.accent} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                        💰
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">워크스페이스 지원금</h4>
                      <p className={`text-3xl font-bold ${colors.success.text} mb-1`}>
                        {remoteWork.remoteWorkEnvironment.workspaceStipend.toLocaleString()}원
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">일회성 지급</p>
                    </div>
                  </div>

                  <div className={`${colors.primary.bg} p-6 rounded-xl ${colors.primary.border}`}>
                    <div className="text-center">
                      <div className={`w-16 h-16 ${colors.primary.accent} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                        🌐
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">인터넷 지원금</h4>
                      <p className={`text-3xl font-bold ${colors.primary.text} mb-1`}>
                        {remoteWork.remoteWorkEnvironment.internetAllowance.toLocaleString()}원
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">월 지급</p>
                    </div>
                  </div>

                  <div className={`${colors.neutral.bg} p-6 rounded-xl ${colors.neutral.border}`}>
                    <div className="text-center">
                      <div className={`w-16 h-16 ${colors.neutral.accent} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-3`}>
                        🛠️
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">기술 지원</h4>
                      <p className={`text-lg font-bold ${colors.neutral.text} mb-1`}>
                        {remoteWork.remoteWorkEnvironment.techSupport}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">전담 팀 운영</p>
                    </div>
                  </div>
                </div>

                {/* 보안 요구사항 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🔒 보안 요구사항</h3>
                  <div className="space-y-3">
                    {remoteWork.remoteWorkEnvironment.securityRequirements.map((requirement, index) => (
                      <div key={index} className={`flex items-center space-x-3 ${colors.danger.bg} p-4 rounded-xl ${colors.danger.border}`}>
                        <div className={`flex-shrink-0 w-8 h-8 ${colors.danger.accent} rounded-full flex items-center justify-center text-white text-sm`}>
                          🔒
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">{requirement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 작업 공간 권장사항 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">💡 작업공간 권장사항</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {remoteWork.remoteWorkEnvironment.workingSpaceRecommendations.map((recommendation, index) => (
                      <div key={index} className={`flex items-start space-x-3 ${colors.warning.bg} p-4 rounded-xl ${colors.warning.border}`}>
                        <div className={`flex-shrink-0 w-8 h-8 ${colors.warning.accent} rounded-full flex items-center justify-center text-white text-sm`}>
                          💡
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 원격근무 혜택 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🎁 원격근무 특별 혜택</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {remoteWork.remoteBenefits.map((benefit, index) => (
                      <div key={index} className={`flex items-center space-x-3 ${colors.success.bg} p-4 rounded-xl ${colors.success.border}`}>
                        <div className={`flex-shrink-0 w-8 h-8 ${colors.success.accent} rounded-full flex items-center justify-center text-white text-sm`}>
                          🎁
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 font-medium">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 팀문화 탭 */}
          {activeTab === 'culture' && (
            <div>
              <div className="space-y-8">
                
                {/* 근무 조건 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">⏰ 근무 조건</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">근무 시간</h4>
                      <div className="space-y-2 text-gray-800 dark:text-gray-200">
                        <p><strong>근무 시간:</strong> {remoteWork.workingConditions.workingHours}</p>
                        <p><strong>근무일:</strong> {remoteWork.workingConditions.workingDays}</p>
                        <p><strong>코어 시간:</strong> {remoteWork.workingConditions.coreHours}</p>
                        <p><strong>시간대 유연성:</strong> {remoteWork.workingConditions.timeZoneFlexibility}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">휴가 및 정책</h4>
                      <div className="space-y-2 text-gray-800 dark:text-gray-200">
                        <p><strong>휴가 정책:</strong> {remoteWork.workingConditions.vacationPolicy}</p>
                        <p><strong>병가 정책:</strong> {remoteWork.workingConditions.sickLeavePolicy}</p>
                        <p><strong>초과근무:</strong> {remoteWork.workingConditions.overtimePolicy}</p>
                        <p><strong>성과 평가:</strong> {remoteWork.workingConditions.performanceTracking}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 커뮤니케이션 기대사항 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">💬 커뮤니케이션 가이드</h3>
                  <div className="space-y-3">
                    {remoteWork.workingConditions.communicationExpectations.map((expectation, index) => (
                      <div key={index} className={`flex items-start space-x-3 ${colors.card} p-4 rounded-xl shadow-sm`}>
                        <div className={`flex-shrink-0 w-8 h-8 ${colors.primary.accent} rounded-full flex items-center justify-center text-white text-sm`}>
                          💬
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">{expectation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 시간대별 팀 활동 현황 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🌍 글로벌 팀 활동 현황</h3>
                  <div className={`${colors.card} p-6 rounded-xl shadow-sm`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { timezone: 'Asia/Seoul (UTC+9)', team: '개발팀', members: 8, status: 'active' },
                        { timezone: 'America/New_York (UTC-5)', team: '디자인팀', members: 4, status: 'active' },
                        { timezone: 'Europe/London (UTC+0)', team: 'PM팀', members: 3, status: 'sleeping' }
                      ].map((zone, index) => (
                        <div key={index} className="text-center">
                          <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl ${
                            zone.status === 'active' ? `${colors.success.accent} animate-pulse` : `${colors.neutral.accent}`
                          }`}>
                            🌍
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{zone.team}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{zone.timezone}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{zone.members}명 팀원</p>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${
                            zone.status === 'active' 
                              ? `${colors.success.bg} ${colors.success.text}`
                              : `${colors.neutral.bg} ${colors.neutral.text}`
                          }`}>
                            {zone.status === 'active' ? '🟢 활동 중' : '😴 휴식 중'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 협업도구 탭 */}
          {activeTab === 'tools' && (
            <div>
              <div className="space-y-8">
                
                {/* 주요 협업 도구 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🛠️ 주요 협업 도구</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {remoteWork.collaborationTools.map((tool) => (
                      <div key={tool.id} className={`${colors.card} p-6 rounded-xl shadow-sm`}>
                        <div className="flex items-start space-x-4">
                          <div className={`w-16 h-16 ${colors.primary.accent} rounded-xl flex items-center justify-center text-white text-2xl`}>
                            🛠️
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tool.name}</h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">{tool.description}</p>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">카테고리: </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{tool.category}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">학습 난이도: </span>
                                <span className={`text-sm ${
                                  tool.learningCurve === '쉬움' ? colors.success.text :
                                  tool.learningCurve === '중간' ? colors.warning.text :
                                  colors.danger.text
                                }`}>
                                  {tool.learningCurve}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">지원 수준: </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{tool.supportLevel}</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">주요 기능:</h5>
                              <div className="flex flex-wrap gap-2">
                                {tool.features.slice(0, 4).map((feature, idx) => (
                                  <span key={idx} className={`${colors.primary.bg} ${colors.primary.text} px-2 py-1 rounded text-xs`}>
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 가상 오피스 정보 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🏢 가상 오피스</h3>
                  <div className={`${colors.primary.bg} p-6 rounded-xl ${colors.primary.border}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">플랫폼 정보</h4>
                        <p className={`text-xl font-bold ${colors.primary.text} mb-2`}>{remoteWork.virtualOffice.platform}</p>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">화상 품질: {remoteWork.virtualOffice.screenSharingQuality}</p>
                        <div className="space-y-2">
                          {remoteWork.virtualOffice.features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <div className={`w-2 h-2 ${colors.primary.accent} rounded-full`}></div>
                              <span className="text-gray-800 dark:text-gray-200 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">이용 가능한 공간</h4>
                        <div className="space-y-3">
                          {remoteWork.virtualOffice.virtualRooms.map((room) => (
                            <div key={room.id} className={`${colors.card} p-4 rounded-lg`}>
                              <h5 className="font-medium text-gray-900 dark:text-white">{room.name}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{room.purpose} • 최대 {room.capacity}명</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">이용시간: {room.availability}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 회사정보 탭 */}
          {activeTab === 'company' && (
            <div>
              <div className="space-y-8">
                
                {/* 회사 개요 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🏢 회사 개요</h3>
                  <div className={`${colors.card} p-6 rounded-xl shadow-sm`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">회사명</span>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{remoteWork.companyInfo.name}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">업종</span>
                            <p className="text-lg text-gray-900 dark:text-white">{remoteWork.companyInfo.industry}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">회사 규모</span>
                            <p className="text-lg text-gray-900 dark:text-white">{remoteWork.companyInfo.size}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">설립년도</span>
                            <p className="text-lg text-gray-900 dark:text-white">{remoteWork.companyInfo.founded}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">원격근무 비율</span>
                            <p className={`text-lg font-semibold ${colors.success.text} mb-1`}>{remoteWork.companyInfo.remoteWorkPercentage}%</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">원격근무 역사</span>
                            <p className="text-lg text-gray-900 dark:text-white">{remoteWork.companyInfo.remoteWorkHistory}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">글로벌 팀</span>
                            <p className="text-lg text-gray-900 dark:text-white">{remoteWork.companyInfo.globalTeams ? '예' : '아니오'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">웹사이트</span>
                            <a href={remoteWork.companyInfo.website} target="_blank" rel="noopener noreferrer" 
                               className={`text-lg ${colors.primary.text} hover:underline`}>
                              {remoteWork.companyInfo.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">회사 소개</span>
                      <p className="text-gray-800 dark:text-gray-200 mt-2 leading-relaxed">{remoteWork.companyInfo.description}</p>
                    </div>
                  </div>
                </div>

                {/* 다양성 및 포용성 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🌈 다양성 및 포용성</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {remoteWork.companyInfo.diversityAndInclusion.map((item, index) => (
                      <div key={index} className={`${colors.neutral.bg} p-4 rounded-xl ${colors.neutral.border}`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${colors.neutral.accent} rounded-full flex items-center justify-center text-white text-lg`}>
                            🌈
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 font-medium">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 담당자 정보 */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">👤 담당자 정보</h3>
                  <div className={`${colors.card} p-6 rounded-xl shadow-sm`}>
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 ${colors.primary.accent} rounded-full flex items-center justify-center text-white text-2xl`}>
                        👤
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{remoteWork.contactPerson.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{remoteWork.contactPerson.position}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">이메일</span>
                                <p className="text-gray-900 dark:text-white">{remoteWork.contactPerson.email}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">응답 시간</span>
                                <p className="text-gray-900 dark:text-white">{remoteWork.contactPerson.responseTime}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">시간대</span>
                                <p className="text-gray-900 dark:text-white">{remoteWork.contactPerson.timezone}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">가능 시간</span>
                                <p className="text-gray-900 dark:text-white">{remoteWork.contactPerson.availableHours}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 리뷰&Q&A 탭 */}
          {activeTab === 'reviews' && (
            <div>
              <div className="space-y-8">
                
                {/* 서브 탭 네비게이션 */}
                <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveSubTab('questions')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors ${
                      activeSubTab === 'questions'
                        ? `${colors.primary.text} border-b-2 ${colors.primary.border.replace('border-', 'border-b-')}`
                        : `${colors.neutral.text} hover:text-gray-900 dark:hover:text-white`
                    }`}
                  >
                    💬 질문 & 답변 (12개)
                  </button>
                  <button
                    onClick={() => setActiveSubTab('reviews')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors ${
                      activeSubTab === 'reviews'
                        ? `${colors.primary.text} border-b-2 ${colors.primary.border.replace('border-', 'border-b-')}`
                        : `${colors.neutral.text} hover:text-gray-900 dark:hover:text-white`
                    }`}
                  >
                    ⭐ 원격근무 후기 (8개)
                  </button>
                </div>

                {/* Q&A 섹션 */}
                {activeSubTab === 'questions' && (
                  <div className="space-y-4">
                    {[
                      {
                        id: '1',
                        question: '원격근무 중 회의는 어떻게 진행되나요?',
                        answer: '매일 오전 10시 스탠드업 미팅을 진행하며, 주요 회의는 사전에 일정을 공유합니다. 모든 회의는 녹화되어 시차가 있는 팀원들도 확인할 수 있습니다.',
                        askedBy: '김개발',
                        answeredBy: '이원격 (팀 리드)',
                        date: '2024-01-15',
                        upvotes: 12,
                        category: '회의 문화',
                        tags: ['회의', '소통', '일정관리']
                      },
                      {
                        id: '2',
                        question: '장비 지원은 어떻게 받을 수 있나요?',
                        answer: '입사 후 1주일 내에 필요한 장비 리스트를 제출하면 검토 후 구매 또는 대여해드립니다. 맥북, 모니터, 의자, 데스크 등 업무에 필요한 모든 장비를 지원합니다.',
                        askedBy: '박디자이너',
                        answeredBy: 'HR팀',
                        date: '2024-01-10',
                        upvotes: 18,
                        category: '장비 지원',
                        tags: ['장비', '지원', '복리후생']
                      },
                      {
                        id: '3',
                        question: '시차가 있는 팀원들과는 어떻게 협업하나요?',
                        answer: '비동기 커뮤니케이션을 기본으로 하며, 코어타임(14:00-17:00 KST)에는 모든 팀원이 온라인 상태를 유지합니다. Notion을 통한 문서화와 Slack을 통한 소통을 활용합니다.',
                        askedBy: '정프론트',
                        answeredBy: '이원격 (팀 리드)',
                        date: '2024-01-08',
                        upvotes: 15,
                        category: '협업 방식',
                        tags: ['시차', '글로벌', '비동기']
                      }
                    ].map((qa) => (
                      <div key={qa.id} className={`${colors.card} p-6 rounded-xl shadow-sm`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`${colors.primary.bg} ${colors.primary.text} px-2 py-1 rounded text-xs`}>
                                {qa.category}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400 text-sm">{qa.date}</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{qa.question}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">질문: {qa.askedBy}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">👍 {qa.upvotes}</span>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                          <p className="text-gray-800 dark:text-gray-200 mb-2">{qa.answer}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">답변: {qa.answeredBy}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {qa.tags.map((tag, idx) => (
                            <span key={idx} className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 리뷰 섹션 */}
                {activeSubTab === 'reviews' && (
                  <div className="space-y-4">
                    {[
                      {
                        id: '1',
                        reviewerName: '김개발자',
                        rating: 5,
                        comment: '정말 좋은 원격근무 환경이었습니다. 장비 지원이 훌륭하고 팀 문화가 매우 포용적입니다.',
                        date: '2024-01-20',
                        workPeriod: '6개월',
                        position: '프론트엔드 개발자',
                        pros: ['장비 지원 우수', '유연한 근무시간', '좋은 팀 문화'],
                        cons: ['시차로 인한 소통 지연'],
                        workLifeBalance: 5,
                        communicationQuality: 4,
                        toolsAndTech: 5,
                        managementSupport: 5,
                        careerGrowth: 4
                      },
                      {
                        id: '2',
                        reviewerName: '박디자이너',
                        rating: 4,
                        comment: '크리에이티브한 업무 환경과 좋은 동료들. 다만 초기 적응 기간이 필요했습니다.',
                        date: '2024-01-15',
                        workPeriod: '4개월',
                        position: 'UX/UI 디자이너',
                        pros: ['자율적인 업무환경', '글로벌 프로젝트 경험', '성장 기회'],
                        cons: ['초기 적응 어려움', '시간대 차이'],
                        workLifeBalance: 4,
                        communicationQuality: 4,
                        toolsAndTech: 5,
                        managementSupport: 4,
                        careerGrowth: 5
                      }
                    ].map((review) => (
                      <div key={review.id} className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{review.reviewerName}</h4>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ⭐
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{review.position} • {review.workPeriod} 근무</p>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
                        </div>

                        <p className="text-gray-800 dark:text-gray-200 mb-4">{review.comment}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">👍 장점</h5>
                            <ul className="space-y-1">
                              {review.pros.map((pro, idx) => (
                                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">👎 아쉬운 점</h5>
                            <ul className="space-y-1">
                              {review.cons.map((con, idx) => (
                                <li key={idx} className="text-sm text-gray-700 dark:text-gray-300">• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">세부 평가</h5>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                            {[
                              { label: '워라밸', score: review.workLifeBalance },
                              { label: '소통', score: review.communicationQuality },
                              { label: '도구/기술', score: review.toolsAndTech },
                              { label: '지원', score: review.managementSupport },
                              { label: '성장', score: review.careerGrowth }
                            ].map((item, idx) => (
                              <div key={idx} className="text-center">
                                <p className="text-gray-600 dark:text-gray-400">{item.label}</p>
                                <p className="font-bold text-blue-600 dark:text-blue-400">{item.score}/5</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
      </div>

      {/* === 모달 컴포넌트들 === */}

      {/* 지원하기 모달 */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">📝 원격근무 지원서</h3>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이름</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이메일</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">원격근무 경험</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                  <option>1년 미만</option>
                  <option>1-3년</option>
                  <option>3-5년</option>
                  <option>5년 이상</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">선호 시간대</label>
                <select 
                  value={selectedTimezone}
                  onChange={(e) => setSelectedTimezone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="Asia/Seoul">Asia/Seoul (UTC+9)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                  <option value="Europe/London">Europe/London (UTC+0)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">근무 스타일</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="workStyle" 
                      value="flexible"
                      checked={workingHoursPreference === 'flexible'}
                      onChange={(e) => setWorkingHoursPreference(e.target.value)}
                      className="mr-2" 
                    />
                    유연 근무 (코어타임 준수)
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="workStyle" 
                      value="fixed"
                      checked={workingHoursPreference === 'fixed'}
                      onChange={(e) => setWorkingHoursPreference(e.target.value)}
                      className="mr-2" 
                    />
                    고정 근무 시간
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">자기소개</label>
                <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="원격근무 경험과 이 프로젝트에 지원하는 이유를 적어주세요..."></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                  지원서 제출
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 가상 오피스 투어 모달 */}
      {showVirtualOfficeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">🏢 가상 오피스 투어</h3>
                <button
                  onClick={() => setShowVirtualOfficeModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 p-8 rounded-xl border border-cyan-200 dark:border-cyan-700 mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏢</div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{remoteWork.virtualOffice.platform}</h4>
                  <p className="text-gray-600 dark:text-gray-400">3D 가상 오피스 환경</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {remoteWork.virtualOffice.virtualRooms.map((room) => (
                  <div key={room.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                    <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{room.name}</h5>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{room.purpose}</p>
                    <div className="space-y-2 text-sm">
                      <p><strong>수용 인원:</strong> {room.capacity}명</p>
                      <p><strong>이용 시간:</strong> {room.availability}</p>
                      <div>
                        <strong>도구:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {room.tools.map((tool, idx) => (
                            <span key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">소셜 공간</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {remoteWork.virtualOffice.socialSpaces.map((space, idx) => (
                    <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center border border-purple-200 dark:border-purple-700">
                      <div className="text-2xl mb-1">🎮</div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{space}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 환경 설정 도우미 모달 */}
      {showEnvironmentSetupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">⚙️ 홈오피스 환경 설정 가이드</h3>
                <button
                  onClick={() => setShowEnvironmentSetupModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">설정 진행도</h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{environmentSetupStep + 1}/5</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((environmentSetupStep + 1) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6">
                {environmentSetupStep === 0 && (
                  <div>
                    <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. 작업 공간 설정</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {remoteWork.remoteWorkEnvironment.workingSpaceRecommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-700">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                            ✓
                          </div>
                          <span className="text-gray-800 dark:text-gray-200">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {environmentSetupStep === 1 && (
                  <div>
                    <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. 장비 체크리스트</h5>
                    <div className="space-y-3">
                      {remoteWork.remoteWorkEnvironment.equipmentProvided.map((equipment, idx) => (
                        <label key={idx} className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700 cursor-pointer">
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                          <span className="text-gray-800 dark:text-gray-200">{equipment}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {environmentSetupStep === 2 && (
                  <div>
                    <h5 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. 보안 설정</h5>
                    <div className="space-y-3">
                      {remoteWork.remoteWorkEnvironment.securityRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-700">
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">
                            🔒
                          </div>
                          <span className="text-gray-800 dark:text-gray-200">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setEnvironmentSetupStep(Math.max(0, environmentSetupStep - 1))}
                  disabled={environmentSetupStep === 0}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  이전
                </button>
                <button
                  onClick={() => setEnvironmentSetupStep(Math.min(4, environmentSetupStep + 1))}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                >
                  {environmentSetupStep === 4 ? '완료' : '다음'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 실시간 채팅 모달 */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white">
                    👤
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{remoteWork.contactPerson.name}</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">🟢 온라인</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg max-w-xs">
                  <p className="text-sm text-gray-800 dark:text-gray-200">안녕하세요! 원격근무 포지션에 관심 가져주셔서 감사합니다. 궁금한 점이 있으시면 언제든 말씀해 주세요.</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">방금 전</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-blue-500 p-3 rounded-lg max-w-xs">
                  <p className="text-sm text-white">안녕하세요! 원격근무 환경에 대해 더 자세히 알고 싶습니다.</p>
                  <p className="text-xs text-blue-100 mt-1">방금 전</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  전송
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 화상 미팅 예약 모달 */}
      {showVideoCallModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">📹 화상 미팅 예약</h3>
                <button
                  onClick={() => setShowVideoCallModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  📹
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1:1 상담 예약</h4>
                <p className="text-gray-600 dark:text-gray-400">원격근무에 대한 상세한 상담을 받아보세요</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">날짜</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">시간</label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    <option>10:00</option>
                    <option>14:00</option>
                    <option>16:00</option>
                    <option>18:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">상담 주제</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                  <option>전반적인 원격근무 환경</option>
                  <option>기술 스택 및 도구</option>
                  <option>팀 문화 및 소통 방식</option>
                  <option>복리후생 및 지원사항</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowVideoCallModal(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                  예약하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 다른 모달들도 유사하게 구현 */}
      {/* ... 생산성 분석, 온보딩, 정책 모달 등 */}
    </div>
  );
} 