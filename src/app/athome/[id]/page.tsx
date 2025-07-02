'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
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
  
  useEffect(() => {
    const loadRemoteWorkDetail = async () => {
      setLoading(true);
      
      // 임시 데이터 생성 (실제로는 API에서 가져옴)
      setTimeout(() => {
        const remoteWorkDetail = mockRemoteWork(remoteWorkId);
        setRemoteWork(remoteWorkDetail);
        setLoading(false);
      }, 1000);
    };

    if (remoteWorkId) {
      loadRemoteWorkDetail();
    }
  }, [remoteWorkId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">재택근무 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!remoteWork) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">재택근무를 찾을 수 없습니다</h1>
          <Link 
            href="/athome" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            재택근무 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              돌아가기
            </button>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
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
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {remoteWork.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {remoteWork.company}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {remoteWork.location}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {remoteWork.salary || remoteWork.budget}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{remoteWork.type}</div>
                </div>
              </div>

              {/* 탭 네비게이션 */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', label: '개요' },
                    { id: 'environment', label: '근무환경' },
                    { id: 'culture', label: '회사문화' },
                    { id: 'tools', label: '협업도구' },
                    { id: 'company', label: '회사정보' },
                    { id: 'reviews', label: '후기·질문' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
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

              {/* 탭 컨텐츠 */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">업무 개요</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300">{remoteWork.description}</p>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">요구사항</h4>
                      <ul className="space-y-2">
                        {remoteWork.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">기술 스택</h4>
                      <div className="flex flex-wrap gap-2">
                        {remoteWork.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900 dark:text-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex space-x-4 mb-6">
                      <button
                        onClick={() => setActiveSubTab('questions')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          activeSubTab === 'questions'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                      >
                        질문 ({mockRemoteWorkQuestions.length})
                      </button>
                      <button
                        onClick={() => setActiveSubTab('reviews')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                          activeSubTab === 'reviews'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                      >
                        후기 ({mockRemoteWorkReviews.length})
                      </button>
                    </div>

                    {activeSubTab === 'questions' && (
                      <div className="space-y-4">
                        {mockRemoteWorkQuestions.map((questionItem) => (
                          <div key={questionItem.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">{questionItem.question}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{questionItem.answeredAt}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{questionItem.answer}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">by {questionItem.askedBy}</span>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                  </svg>
                                  {questionItem.upvotes}개 추천
                                </span>
                                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                  답변하기
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeSubTab === 'reviews' && (
                      <div className="space-y-4">
                        {mockRemoteWorkReviews.map((review) => (
                          <div key={review.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center">
                                <div className="flex items-center mr-3">
                                  {[...Array(5)].map((_, i) => (
                                    <svg 
                                      key={i} 
                                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                      fill="currentColor" 
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{review.reviewerName}</span>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{review.comment}</p>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              {review.position} · 근무기간: {review.workPeriod}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* 지원하기 카드 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <button 
                onClick={() => setShowApplicationModal(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
              >
                지원하기
              </button>
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">마감일</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{remoteWork.deadline}</div>
              </div>
            </div>

            {/* 회사 정보 카드 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">회사 정보</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  {remoteWork.companyLogo ? (
                    <Image
                      src={remoteWork.companyLogo}
                      alt={remoteWork.company}
                      width={40}
                      height={40}
                      className="rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
                        {remoteWork.company.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="font-medium text-gray-900 dark:text-white">{remoteWork.company}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{remoteWork.companySize || '회사 규모 정보 없음'}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {remoteWork.companyDescription || '회사 설명이 없습니다.'}
                </div>
                <button 
                  onClick={() => setShowCompanyModal(true)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  회사 더보기 →
                </button>
              </div>
            </div>

            {/* 유사한 재택근무 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">유사한 재택근무</h3>
              <div className="space-y-3">
                {mockSimilarRemoteWorks.slice(0, 3).map((similar) => (
                  <Link 
                    key={similar.id} 
                    href={`/athome/${similar.id}`}
                    className="block p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {similar.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                      {similar.company} · {similar.duration}
                    </div>
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {similar.budget}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}