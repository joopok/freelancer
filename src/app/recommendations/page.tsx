'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  ChartBarIcon,
  FunnelIcon,
  ArrowPathIcon,
  CogIcon,
  UserIcon,
  BoltIcon,
  TrophyIcon,
  HeartIcon,
  BookmarkIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  useRecommendations, 
  useUserRecommendations,
  usePopularRecommendations,
  useRecommendationStats,
  useRecommendationDebug
} from '@/hooks/useRecommendations';
import { RecommendedProjects } from '@/components/main/RecommendedProjects';

// Mock 사용자 ID (실제로는 로그인된 사용자 정보에서 가져옴)
const MOCK_USER_ID = 'user123';

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState<'personalized' | 'popular' | 'analytics'>('personalized');
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    budgetRange: { min: 0, max: 0 },
    location: '',
    experienceLevel: '',
    skills: [] as string[],
    workType: ''
  });

  // 사용자 맞춤 추천
  const userRecommendations = useUserRecommendations(MOCK_USER_ID, 20);
  
  // 인기 프로젝트 추천
  const popularRecommendations = usePopularRecommendations(20);
  
  // 추천 통계
  const { stats, loading: statsLoading } = useRecommendationStats(MOCK_USER_ID);
  
  // 디버그 정보
  const { cacheStats, getCacheStats, clearCache } = useRecommendationDebug();

  useEffect(() => {
    getCacheStats();
  }, [getCacheStats]);

  const handleRefresh = () => {
    if (activeTab === 'personalized') {
      userRecommendations.refresh();
    } else if (activeTab === 'popular') {
      popularRecommendations.refresh();
    }
  };

  const handleClearCache = () => {
    clearCache();
    getCacheStats();
    handleRefresh();
  };

  const currentRecommendations = activeTab === 'personalized' 
    ? userRecommendations 
    : popularRecommendations;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                <SparklesIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  AI 프로젝트 추천
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  개인 맞춤형 프로젝트 추천과 분석 대시보드
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <FunnelIcon className="h-4 w-4" />
                필터
                {showFilters ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
              
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4" />
                새로고침
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <CogIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 통계 요약 */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrophyIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">총 추천</span>
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {stats.totalRecommendations}
                </p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">클릭률</span>
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {(stats.clickThroughRate * 100).toFixed(1)}%
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <HeartIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">지원률</span>
                </div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {(stats.applicationRate * 100).toFixed(1)}%
                </p>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <BookmarkIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">관련도</span>
                </div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {(stats.averageRelevanceScore * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 필터 패널 */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4">추천 필터</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">카테고리</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="">전체</option>
                  <option value="웹개발">웹개발</option>
                  <option value="모바일앱">모바일앱</option>
                  <option value="AI">AI</option>
                  <option value="게임">게임</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">근무형태</label>
                <select
                  value={filters.workType}
                  onChange={(e) => setFilters(prev => ({ ...prev, workType: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="">전체</option>
                  <option value="remote">원격</option>
                  <option value="onsite">상주</option>
                  <option value="hybrid">하이브리드</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">경험수준</label>
                <select
                  value={filters.experienceLevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                >
                  <option value="">전체</option>
                  <option value="junior">주니어</option>
                  <option value="mid">미드</option>
                  <option value="senior">시니어</option>
                  <option value="expert">전문가</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">최소 예산</label>
                <input
                  type="number"
                  value={filters.budgetRange.min || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    budgetRange: { ...prev.budgetRange, min: Number(e.target.value) }
                  }))}
                  placeholder="만원"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">최대 예산</label>
                <input
                  type="number"
                  value={filters.budgetRange.max || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    budgetRange: { ...prev.budgetRange, max: Number(e.target.value) }
                  }))}
                  placeholder="만원"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* 설정 패널 */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-4">추천 시스템 설정</h3>
            
            {/* 캐시 정보 */}
            {cacheStats && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">캐시 상태</h4>
                  <button
                    onClick={handleClearCache}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    캐시 초기화
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">크기:</span>
                    <span className="ml-1 font-medium">{cacheStats.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">히트율:</span>
                    <span className="ml-1 font-medium">{(cacheStats.hitRate * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">엔트리:</span>
                    <span className="ml-1 font-medium">{cacheStats.entries}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* 알고리즘 성능 */}
            {stats && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium mb-3">알고리즘 성능</h4>
                <div className="space-y-2">
                  {Object.entries(stats.performanceMetrics.algorithmPerformance).map(([algorithm, metrics]) => (
                    <div key={algorithm} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{algorithm}</span>
                      <div className="flex gap-4">
                        <span>정밀도: {(metrics.precision * 100).toFixed(1)}%</span>
                        <span>재현율: {(metrics.recall * 100).toFixed(1)}%</span>
                        <span>F1: {(metrics.f1Score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 탭 네비게이션 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 mb-8 shadow-sm">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('personalized')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                activeTab === 'personalized'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <UserIcon className="h-5 w-5" />
              맞춤 추천
              {userRecommendations.recommendations.length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                  {userRecommendations.recommendations.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('popular')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                activeTab === 'popular'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <TrophyIcon className="h-5 w-5" />
              인기 프로젝트
              {popularRecommendations.recommendations.length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                  {popularRecommendations.recommendations.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <ChartBarIcon className="h-5 w-5" />
              분석
            </button>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="space-y-8">
          {activeTab === 'analytics' ? (
            // 분석 탭
            <div className="space-y-6">
              {statsLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">분석 데이터를 불러오는 중...</p>
                </div>
              ) : stats ? (
                <>
                  {/* 주요 지표 */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">주요 성과 지표</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {(stats.clickThroughRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">클릭률</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {(stats.applicationRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">지원률</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {(stats.bookmarkRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">북마크율</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                          {stats.performanceMetrics.averageResponseTime}ms
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">응답시간</div>
                      </div>
                    </div>
                  </div>

                  {/* 상위 카테고리 */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">관심 분야</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">상위 카테고리</h4>
                        <div className="space-y-2">
                          {stats.topCategories.map((category, index) => (
                            <div key={category} className="flex items-center justify-between">
                              <span className="text-sm">{category}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${(3 - index) * 33.33}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">#{index + 1}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">상위 스킬</h4>
                        <div className="space-y-2">
                          {stats.topSkills.map((skill, index) => (
                            <div key={skill} className="flex items-center justify-between">
                              <span className="text-sm">{skill}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${(3 - index) * 33.33}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">#{index + 1}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                  <ExclamationTriangleIcon className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">분석 데이터 없음</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    충분한 데이터가 수집되면 분석 결과를 제공합니다.
                  </p>
                </div>
              )}
            </div>
          ) : (
            // 추천 결과 표시
            <div>
              {currentRecommendations.loading ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">추천 프로젝트를 불러오는 중...</p>
                </div>
              ) : currentRecommendations.error ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                  <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">오류가 발생했습니다</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{currentRecommendations.error}</p>
                  <button
                    onClick={handleRefresh}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              ) : currentRecommendations.recommendations.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold">
                        {activeTab === 'personalized' ? '맞춤 추천 프로젝트' : '인기 프로젝트'}
                      </h2>
                      {currentRecommendations.metadata && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <BoltIcon className="h-4 w-4" />
                          <span>{currentRecommendations.metadata.algorithm}</span>
                          <span>•</span>
                          <span>{currentRecommendations.metadata.executionTime}ms</span>
                          {currentRecommendations.metadata.cacheHit && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">캐시 적중</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentRecommendations.recommendations.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all"
                      >
                        {/* 프로젝트 카드 내용은 RecommendedProjects 컴포넌트와 유사하게 구현 */}
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-semibold text-lg line-clamp-2">{project.title}</h3>
                          <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                            #{project.rank}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        
                        {project.matchingSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.matchingSkills.slice(0, 3).map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-2 py-1 rounded-full"
                              >
                                ✓ {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {project.recommendationReason.length > 0 && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs p-3 rounded-lg mb-4">
                            <div className="flex items-center gap-1 mb-1">
                              <InformationCircleIcon className="h-3 w-3" />
                              <span className="font-medium">추천 이유</span>
                            </div>
                            <p>{project.recommendationReason[0]}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>{project.budget || '협의'}</span>
                          <span>신뢰도: {Math.round(project.confidence * 100)}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center">
                  <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">추천 프로젝트가 없습니다</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    프로필을 완성하면 더 나은 추천을 받을 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}