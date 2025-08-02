'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRemoteProjectDetail } from '@/hooks/useRemoteProjectDetail';
import { formatDate } from '@/utils/format';
import { useNumberFormat } from '@/hooks/useNumberFormat';
import { remoteProjectService } from '@/services/remoteProject';
import type { RemoteProjectDetail, RemoteProjectApplication } from '@/types/remoteProject';
import { useAuthStore } from '@/store/auth';
import BookmarkButton from '@/components/common/BookmarkButton';
import ApplyModal, { ApplyFormData } from '@/components/project/ApplyModal';
import InquiryModal, { InquiryFormData } from '@/components/project/InquiryModal';
import { 
  Share2, 
  MessageCircle, 
  Bookmark, 
  BookmarkCheck, 
  Eye, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Shield, 
  TrendingUp, 
  Award, 
  Wifi, 
  WifiOff, 
  RefreshCw 
} from 'lucide-react';
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

// formatCurrency 함수 추가
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// 마감일까지 남은 일수 계산
const getDeadlineDays = (deadline: string) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// 프로젝트 데이터 변환 함수
const formatBudget = (project: RemoteProjectDetail, formatManwonRange: (min?: number, max?: number) => string) => {
  // budget이 객체인 경우 처리
  if (typeof project.budget === 'object' && project.budget !== null) {
    const amount = typeof project.budget.amount === 'number' 
      ? formatManwonRange(project.budget.amount, project.budget.amount)
      : project.budget.amount;
    const type = project.budget.type === 'hourly' ? '시간당 ' : '';
    const negotiable = project.budget.negotiable ? ' (협의 가능)' : '';
    return `${type}${amount}${negotiable}`;
  }
  
  // budget이 문자열인 경우 (fallback)
  if (project.budgetType === 'hourly') {
    return `시간당 ${project.budget}${project.budgetNegotiable ? ' (협의 가능)' : ''}`;
  }
  return `${project.budget}${project.budgetNegotiable ? ' (협의 가능)' : ''}`;
};

// Loading 컴포넌트
const LoadingComponent = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-opacity duration-300">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full animate-ping"></div>
                </div>
                </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">재택 프로젝트 정보를 불러오는 중...</p>
      <div className="mt-2 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
    </div>
    </div>
    );

// NotFound 컴포넌트
const NotFoundComponent = () => (
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

// Breadcrumb 컴포넌트
const Breadcrumb = ({ project }: { project: RemoteProjectDetail }) => (
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
);

// 프로젝트 헤더 컴포넌트
const ProjectHeader = ({ project }: { project: RemoteProjectDetail }) => (
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
          {typeof project.budget === 'object' ? formatCurrency(project.budget.amount) : project.budget}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {typeof project.budget === 'object' ? (project.budget.type === 'fixed' ? '고정 금액' : '시간당') : project.budgetType === 'fixed' ? '고정 금액' : '시간당'}
          {(typeof project.budget === 'object' ? project.budget.negotiable : project.budgetNegotiable) && ' · 협의 가능'}
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
);

// 프로젝트 탭 컴포넌트
const ProjectTabs = ({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void; 
}) => (
  <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
    <nav className="-mb-px flex space-x-8">
      {[
        { id: 'description', label: '프로젝트 상세' },
    { id: 'requirements', label: '요구사항' },
        { id: 'client', label: '클라이언트 정보' },
        { id: 'questions', label: '질문 및 답변' },
        { id: 'applications', label: '지원 현황' },
    ].map((tab) => (
      <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
);

// 프로젝트 설명 컴포넌트
const ProjectDescription = ({ project }: { project: RemoteProjectDetail }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">프로젝트 개요</h3>
      <div className="prose dark:prose-dark max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {project.description}
        </p>
          </div>
          </div>

    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">작업 범위</h3>
      <ul className="space-y-2">1
        {project.scope.map((item, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
        ))}
                </ul>
                </div>

    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">프로젝트 일정</h3>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">시작 예정일</div>
            <div className="font-medium text-gray-900 dark:text-white">{project.startDate}</div>
  </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">완료 예정일</div>
            <div className="font-medium text-gray-900 dark:text-white">{project.endDate}</div>
  </div>
      <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">작업 기간</div>
            <div className="font-medium text-gray-900 dark:text-white">{project.duration}</div>
                </div>
                      </div>
                            </div>
                                  </div>
                                  </div>
);

// 요구사항 컴포넌트
const ProjectRequirements = ({ project }: { project: RemoteProjectDetail }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">필수 기술</h3>
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

    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">경험 수준</h3>
      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full dark:bg-green-900 dark:text-green-200">
        {experienceLevelLabels[project.experienceLevel]}
              </span>
              </div>

        <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">근무 형태</h3>
      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full dark:bg-purple-900 dark:text-purple-200">
        {workTypeLabels[project.workType]}
      </span>
                </div>

  <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">우대 사항</h3>
      <ul className="space-y-2">
        {project.preferences?.map((pref, index) => (
          <li key={index} className="flex items-start">
            <Award className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-gray-700 dark:text-gray-300">{pref}</span>
          </li>
        ))}
      </ul>
          </div>
        </div>
);

// 클라이언트 정보 컴포넌트
const ClientInfo = ({ project }: { project: RemoteProjectDetail }) => (
  <div className="space-y-6">
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">클라이언트 정보</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">회사명</div>
          <div className="font-medium text-gray-900 dark:text-white">{project.client?.company || '비공개'}</div>
        </div>
          <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">업종</div>
          <div className="font-medium text-gray-900 dark:text-white">{project.client?.industry || '정보 없음'}</div>
              </div>
<div>
          <div className="text-sm text-gray-500 dark:text-gray-400">회사 규모</div>
          <div className="font-medium text-gray-900 dark:text-white">{project.client?.size || '정보 없음'}</div>
                  </div>
<div>
          <div className="text-sm text-gray-500 dark:text-gray-400">설립년도</div>
          <div className="font-medium text-gray-900 dark:text-white">{project.client?.founded || '정보 없음'}</div>
            </div>
                  </div>
                        </div>

  <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">프로젝트 담당자</h3>
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {project.client?.contact?.name?.charAt(0) || 'C'}
                                </div>
  <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {project.client?.contact?.name || '담당자'}
      </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {project.client?.contact?.role || '프로젝트 매니저'}
      </div>
      </div>
                        </div>
                        </div>
                        </div>
</div>
);

// 액션 버튼들 컴포넌트
const ActionButtons = ({ 
  project,
  isBookmarked,
  onApply,
  onInquiry,
  onShare,
  onToggleBookmark 
}: {
  project: RemoteProjectDetail;
  isBookmarked: boolean;
  onApply: () => void;
  onInquiry: () => void;
  onShare: () => void;
  onToggleBookmark: () => void;
}) => {
  const deadlineDays = getDeadlineDays(project.applicationDeadline);
  const isDeadlinePassed = deadlineDays === 0;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 sticky top-6">
      <div className="space-y-4">
        {/* 예산 정보 */}
        <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {typeof project.budget === 'object' ? formatCurrency(project.budget.amount) : project.budget}
              </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {typeof project.budget === 'object' ? (project.budget.type === 'fixed' ? '고정 금액' : '시간당') : project.budgetType === 'fixed' ? '고정 금액' : '시간당'}
            {(typeof project.budget === 'object' ? project.budget.negotiable : project.budgetNegotiable) && ' · 협의 가능'}
                            </div>
                            </div>

        {/* 마감 정보 */}
        <div className="text-center">
          <div className={`text-sm font-medium ${isDeadlinePassed ? 'text-red-600' : 'text-gray-600'} dark:text-gray-300`}>
            {isDeadlinePassed ? '마감되었습니다' : `${deadlineDays}일 후 마감`}
            </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {project.applicationDeadline}
  </div>
  </div>

        {/* 액션 버튼들 */}
        <div className="space-y-2">
  <button 
            onClick={onApply}
            disabled={isDeadlinePassed}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isDeadlinePassed
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isDeadlinePassed ? '마감됨' : '지원하기'}
    </button>

  <button 
            onClick={onInquiry}
            className="w-full py-3 px-4 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            문의하기
</button>
        </div>

        {/* 보조 액션들 */}
        <div className="flex space-x-2">
          <button
            onClick={onToggleBookmark}
            className="flex-1 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-blue-600" />
            ) : (
              <Bookmark className="w-4 h-4 text-gray-500" />
            )}
  </button>
          
          <button
            onClick={onShare}
            className="flex-1 py-2 px-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <Share2 className="w-4 h-4 text-gray-500" />
          </button>
  </div>

        {/* 통계 정보 */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
      <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {project.applicationsCount}
          </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">지원자</div>
              </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {project.views || 0}
                  </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">조회수</div>
</div>
  </div>
  </div>
  </div>
              </div>
  );
};

export default function RemoteProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { isLoggedIn, user } = useAuthStore();
  const { formatManwonRange } = useNumberFormat();

  // API 호출을 위한 커스텀 훅 사용
  const { project, loading, error, toggleBookmark, isBookmarked } = useRemoteProjectDetail(projectId);
  
  const [activeTab, setActiveTab] = useState('description');
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
        el.classList.add(styles.statUpdateAnimation);
        setTimeout(() => {
          el.classList.remove(styles.statUpdateAnimation);
        }, 500);
      });
    }
    setPreviousStats(realtimeStats);
  }, [realtimeStats, previousStats]);

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

  if (loading) {
    return <LoadingComponent />;
  }

  if (!project) {
    return <NotFoundComponent />;
  }

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <ProjectDescription project={project} />;
      case 'requirements':
        return <ProjectRequirements project={project} />;
      case 'client':
        return <ClientInfo project={project} />;
      case 'questions':
        return (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">아직 질문과 답변이 없습니다.</p>
      </div>
        );
      case 'applications':
        return (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">지원 현황은 비공개입니다.</p>
                </div>
        );
      default:
        return <ProjectDescription project={project} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Breadcrumb project={project} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 프로젝트 정보 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <ProjectHeader project={project} />
              <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
              {renderTabContent()}
                        </div>
                                </div>

          {/* 오른쪽: 액션 버튼들 */}
          <div className="lg:col-span-1">
            <ActionButtons
              project={project}
              isBookmarked={isBookmarked}
              onApply={() => setShowApplicationModal(true)}
              onInquiry={() => setShowInquiryModal(true)}
              onShare={handleShare}
              onToggleBookmark={toggleBookmark}
            />
                                </div>
                                </div>
                                </div>

      {/* 모달들 */}
      {showApplicationModal && (
        <ApplyModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          onSubmit={handleApplication}
          projectTitle={project.title}
        />
      )}

      {showInquiryModal && (
        <InquiryModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          onSubmit={handleInquiry}
          projectTitle={project.title}
        />
      )}

      {/* 실시간 연결 상태 표시 */}
      {wsConnected !== undefined && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm ${
            wsConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {wsConnected ? (
              <>
                <Wifi className="w-4 h-4" />
                <span>실시간 연결됨</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>연결 끊김</span>
              </>
            )}
          </div>
        </div>
      )}
  </div>
  );
} 