'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate, formatRelativeTime } from '@/utils/format';
import { useFreelancerDetail } from '@/hooks/useFreelancerDetail';
import { freelancerService } from '@/services/freelancer';
import { useAuthStore } from '@/store/auth';
import type { FreelancerDetail } from '@/types/freelancer';
import AvailabilityCalendar from '@/components/freelancer/AvailabilityCalendar';
import { useRealtimeStats } from '@/hooks/useRealtimeStats';
import { 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  TrendingUp, 
  Award,
  Heart,
  MessageCircle,
  Send,
  Share2,
  Shield,
  Eye,
  CheckCircle,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  DollarSign,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

// 실시간 통계 업데이트를 위한 인터페이스
interface RealtimeStats {
  currentViewers: number;
  todayViews: number;
  todayInquiries: number;
  onlineStatus: boolean;
  lastActivity: string;
  activeProjects: number;
}

export default function FreelancerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const freelancerId = params.id as string;
  const { isLoggedIn, user } = useAuthStore();
  
  // API 호출을 위한 커스텀 훅 사용
  const { freelancer, loading, error, toggleBookmark, isBookmarked } = useFreelancerDetail(freelancerId);
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'experience' | 'reviews' | 'skills' | 'pricing'>('overview');
  
  // WebSocket을 통한 실시간 통계
  const { stats: wsStats, connected: wsConnected, updateStats } = useRealtimeStats({
    freelancerId,
    initialStats: {
      viewCount: freelancer?.viewCount || 0,
      currentViewers: 3,
      inquiryCount: 0
    },
    enableWebSocket: true
  });
  
  // 추가 실시간 통계 (로컬)
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats>({
    currentViewers: 3,
    todayViews: 0,
    todayInquiries: 0,
    onlineStatus: true,
    lastActivity: '방금 전',
    activeProjects: 2
  });
  
  // 모달 상태들
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [matchingScore, setMatchingScore] = useState(0);
  
  // 실시간 통계 업데이트
  useEffect(() => {
    if (freelancer) {
      setRealtimeStats(prev => ({
        ...prev,
        todayViews: freelancer.viewCount || 0,
        onlineStatus: freelancer.isOnline || false,
        lastActivity: freelancer.lastActiveDate ? formatRelativeTime(freelancer.lastActiveDate) : '알 수 없음'
      }));
      
      // WebSocket 통계도 업데이트
      updateStats({
        viewCount: freelancer.viewCount || 0
      });
    }
  }, [freelancer, updateStats]);
  
  // WebSocket 통계를 로컬 통계에 반영
  useEffect(() => {
    setRealtimeStats(prev => ({
      ...prev,
      currentViewers: wsStats.currentViewers,
      todayViews: wsStats.viewCount,
      todayInquiries: wsStats.inquiryCount || 0
    }));
  }, [wsStats]);
  
  // 매칭 점수 계산
  useEffect(() => {
    if (freelancer && user) {
      // 임시로 간단한 매칭 점수 계산
      const score = Math.floor(Math.random() * 30) + 70; // 70-100 사이의 점수
      setMatchingScore(score);
    }
  }, [freelancer, user]);
  
  // 문의하기 핸들러
  const handleContact = async (message: string) => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    
    try {
      const result = await freelancerService.contactFreelancer(freelancerId, {
        subject: `${freelancer?.name}님께 문의`,
        message
      });
      
      if (result.success) {
        alert('문의가 전송되었습니다.');
        setShowContactModal(false);
        setRealtimeStats(prev => ({ ...prev, todayInquiries: prev.todayInquiries + 1 }));
        updateStats({ inquiryCount: (wsStats.inquiryCount || 0) + 1 });
      } else {
        alert(result.error || '문의 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Contact error:', error);
      alert('문의 전송 중 오류가 발생했습니다.');
    }
  };
  
  const handleShare = () => {
    if (navigator.share && freelancer) {
      navigator.share({
        title: `${freelancer.name} - 프리랜서`,
        text: freelancer.tagline || `${freelancer.experience} 경력의 ${freelancer.category} 전문가`,
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
            href="/freelancer" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            프리랜서 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
  
  // 프리랜서가 없는 경우
  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">프리랜서를 찾을 수 없습니다</h1>
          <Link 
            href="/freelancer" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            프리랜서 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600">홈</Link>
            <span>›</span>
            <Link href="/freelancer" className="hover:text-blue-600">프리랜서</Link>
            <span>›</span>
            <span className="text-gray-900 dark:text-white">{freelancer.name}</span>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {freelancer.profileImage ? (
                    <Image
                      src={freelancer.profileImage}
                      alt={freelancer.name}
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {freelancer.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {freelancer.name}
                      </h1>
                      {freelancer.tagline && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{freelancer.tagline}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {freelancer.location || '위치 미공개'}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {freelancer.experience}
                        </span>
                        {freelancer.responseTime && (
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            응답시간: {freelancer.responseTime}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {freelancer.badges?.map((badge, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {freelancer.rating}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">평점</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {freelancer.projectCount}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">완료 프로젝트</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {freelancer.completionRate || 0}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">완료율</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {freelancer.viewCount}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">조회수</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">주요 기술</h3>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills?.slice(0, 8).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {freelancer.skills && freelancer.skills.length > 8 && (
                    <button
                      onClick={() => setActiveTab('skills')}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                    >
                      +{freelancer.skills.length - 8} 더보기
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
              <nav className="flex space-x-8 px-6 border-b border-gray-200 dark:border-gray-700">
                {[
                  { id: 'overview', label: '개요' },
                  { id: 'portfolio', label: '포트폴리오' },
                  { id: 'experience', label: '경력' },
                  { id: 'reviews', label: '리뷰' },
                  { id: 'skills', label: '기술 스택' },
                  { id: 'pricing', label: '단가' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">자기소개</h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {freelancer.bio || freelancer.description || '자기소개가 없습니다.'}
                  </p>
                  
                  {freelancer.languages && freelancer.languages.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">사용 언어</h3>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.languages.map((lang, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'portfolio' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">포트폴리오</h2>
                  {freelancer.portfolios && freelancer.portfolios.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {freelancer.portfolios.map((portfolio, index) => (
                        <div key={portfolio.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h3 className="font-semibold text-lg mb-2">{portfolio.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{portfolio.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {portfolio.technologies?.map((tech, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>기간: {portfolio.duration}</span>
                            {portfolio.projectUrl && (
                              <a href={portfolio.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                프로젝트 보기
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">등록된 포트폴리오가 없습니다.</p>
                  )}
                </div>
              )}
              
              {activeTab === 'experience' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">경력 사항</h2>
                  {freelancer.experiences && freelancer.experiences.length > 0 ? (
                    <div className="space-y-6">
                      {freelancer.experiences.map((exp, index) => (
                        <div key={exp.id || index} className="border-l-2 border-blue-500 pl-4">
                          <h3 className="font-semibold">{exp.position}</h3>
                          <p className="text-blue-600 dark:text-blue-400">{exp.company}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {exp.startDate} - {exp.endDate || '현재'}
                          </p>
                          {exp.description && (
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">등록된 경력 사항이 없습니다.</p>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">클라이언트 리뷰</h2>
                  {freelancer.reviews && freelancer.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {freelancer.reviews.map((review, index) => (
                        <div key={review.id || index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                                ))}
                              </div>
                              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                {review.rating}/5
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            - {review.clientName} ({review.projectTitle})
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">아직 리뷰가 없습니다.</p>
                  )}
                </div>
              )}
              
              {activeTab === 'skills' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">기술 스택</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">주요 기술</h3>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills?.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {freelancer.techStack && freelancer.techStack.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">기술 스택</h3>
                        <div className="flex flex-wrap gap-2">
                          {freelancer.techStack.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {freelancer.certificates && freelancer.certificates.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">자격증</h3>
                        <ul className="space-y-2">
                          {freelancer.certificates.map((cert, index) => (
                            <li key={index} className="flex items-center">
                              <Award className="w-4 h-4 text-blue-500 mr-2" />
                              <span className="text-gray-700 dark:text-gray-300">{cert}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'pricing' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">단가 정보</h2>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {typeof freelancer.hourlyRate === 'number' 
                          ? `₩${freelancer.hourlyRate.toLocaleString()}`
                          : freelancer.hourlyRate || '협의 가능'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">시간당</p>
                    </div>
                    
                    {freelancer.availableFrom && (
                      <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">참여 가능 시기</p>
                        <p className="font-medium text-gray-900 dark:text-white">{freelancer.availableFrom}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Availability Calendar */}
            {freelancer.availability && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
                <h2 className="text-lg font-semibold mb-4">참여 가능 일정</h2>
                <AvailabilityCalendar availability={freelancer.availability} />
              </div>
            )}
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  문의하기
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={toggleBookmark}
                    className={`py-2 px-4 rounded-lg border transition-colors flex items-center justify-center ${
                      isBookmarked
                        ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Real-time Stats */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">실시간 현황</h3>
                  {wsConnected && (
                    <span className="flex items-center text-xs text-green-600">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></span>
                      실시간
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">오늘 조회수</span>
                    <span className="font-semibold">{realtimeStats.todayViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">오늘 문의</span>
                    <span className="font-semibold">{realtimeStats.todayInquiries}건</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">현재 보는 사람</span>
                    <span className="font-semibold text-green-600">{realtimeStats.currentViewers}명</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">상태</span>
                    <span className={`flex items-center ${realtimeStats.onlineStatus ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-1 ${realtimeStats.onlineStatus ? 'bg-green-600' : 'bg-gray-500'}`}></span>
                      {realtimeStats.onlineStatus ? '온라인' : '오프라인'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">마지막 활동</span>
                    <span className="font-semibold">{realtimeStats.lastActivity}</span>
                  </div>
                </div>
              </div>
              
              {/* Skill Match Score */}
              {isLoggedIn && matchingScore > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h3 className="font-semibold mb-3">매칭도</h3>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${matchingScore}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      />
                    </div>
                    <p className="text-center text-lg font-bold text-blue-600">{matchingScore}%</p>
                  </div>
                </div>
              )}
              
              {/* Verification Status */}
              {freelancer.verificationStatus && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h3 className="font-semibold mb-3">인증 상태</h3>
                  <div className="space-y-2">
                    {Object.entries(freelancer.verificationStatus).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {key === 'emailVerified' ? '이메일' :
                           key === 'phoneVerified' ? '전화번호' :
                           key === 'identityVerified' ? '신원' :
                           key === 'paymentVerified' ? '결제수단' : key}
                        </span>
                        <CheckCircle className={`w-4 h-4 ${value ? 'text-green-500' : 'text-gray-400'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Similar Freelancers */}
            {freelancer.similarFreelancers && freelancer.similarFreelancers.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-4">
                <h3 className="font-semibold mb-4">비슷한 프리랜서</h3>
                <div className="space-y-3">
                  {freelancer.similarFreelancers.slice(0, 3).map((similar) => (
                    <Link
                      key={similar.id}
                      href={`/freelancer/${similar.id}`}
                      className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <h4 className="font-medium text-sm mb-1">{similar.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{similar.experience}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs ml-1">{similar.rating}</span>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {similar.projectCount}개 프로젝트
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">문의하기</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">메시지</label>
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg"
                  rows={6}
                  placeholder="프리랜서에게 전달할 메시지를 작성해주세요..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={() => handleContact('문의 메시지 내용')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  전송하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}