'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  HeartIcon, 
  BookmarkIcon, 
  EyeIcon, 
  UserGroupIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  BoltIcon,
  StarIcon,
  ThumbUpIcon,
  ThumbDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { 
  HeartIcon as HeartIconSolid, 
  BookmarkIcon as BookmarkIconSolid 
} from '@heroicons/react/24/solid';
import { useRecommendations, useRecommendationFeedback } from '@/hooks/useRecommendations';
import { formatDate } from '@/utils/format';
import { RecommendedProject } from '@/types/recommendation';

interface RecommendedProjectsProps {
  userId?: string;
  limit?: number;
  showTitle?: boolean;
  showFilters?: boolean;
}

export const RecommendedProjects: React.FC<RecommendedProjectsProps> = ({
  userId,
  limit = 8,
  showTitle = true,
  showFilters = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Set<string>>(new Set());
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  
  const {
    recommendations,
    loading,
    error,
    metadata,
    refresh,
    getRecommendationsByCategory,
    getTopRecommendations
  } = useRecommendations({
    userId,
    type: 'hybrid',
    limit,
    autoFetch: true
  });

  const { submitFeedback, submitting } = useRecommendationFeedback(userId);

  // 카테고리 필터링
  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : getRecommendationsByCategory(selectedCategory);

  // 사용 가능한 카테고리 추출
  const availableCategories = React.useMemo(() => {
    const categories = recommendations.map(rec => rec.category).filter(Boolean);
    return ['all', ...Array.from(new Set(categories))];
  }, [recommendations]);

  // 피드백 제출 핸들러
  const handleFeedback = async (
    projectId: string,
    action: 'like' | 'dislike' | 'bookmark' | 'click'
  ) => {
    try {
      await submitFeedback({
        recommendationId: `rec_${projectId}`,
        projectId,
        action,
        relevanceScore: action === 'like' ? 1 : action === 'dislike' ? 0 : 0.5
      });

      // UI 상태 업데이트
      if (action === 'like') {
        setLikedProjects(prev => new Set(prev).add(projectId));
      } else if (action === 'bookmark') {
        setBookmarkedProjects(prev => new Set(prev).add(projectId));
      }
    } catch (error) {
      console.error('피드백 제출 실패:', error);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {showTitle && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                AI 추천 프로젝트
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                당신의 스킬과 경험을 바탕으로 선별된 맞춤 프로젝트를 확인해보세요
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded px-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded px-2"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 오류 상태
  if (error) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <ExclamationTriangleIcon className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              추천 프로젝트를 불러올 수 없습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              잠시 후 다시 시도해 주세요. 문제가 계속되면 고객센터로 문의해 주세요.
            </p>
            <button
              onClick={refresh}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 추천 데이터가 없는 경우
  if (filteredRecommendations.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <SparklesIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              맞춤 추천을 준비하고 있습니다
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              프로필을 완성하면 더 정확한 프로젝트 추천을 받으실 수 있습니다.
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              <SparklesIcon className="h-4 w-4" />
              프로필 완성하기
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <SparklesIcon className="h-8 w-8 text-blue-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI 추천 프로젝트
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              당신의 스킬과 경험을 바탕으로 선별된 맞춤 프로젝트를 확인해보세요
            </p>
            {metadata && (
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <BoltIcon className="h-4 w-4" />
                  {metadata.algorithm} 알고리즘
                </span>
                <span>응답시간: {metadata.executionTime}ms</span>
                {metadata.cacheHit && (
                  <span className="text-green-600 dark:text-green-400">캐시 적중</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* 카테고리 필터 */}
        {showFilters && availableCategories.length > 2 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category || 'all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? '전체' : category}
              </button>
            ))}
          </div>
        )}

        {/* 추천 프로젝트 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRecommendations.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 relative group"
            >
              {/* 추천 뱃지 */}
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                  #{project.rank}
                </div>
                {project.confidence > 0.8 && (
                  <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">
                    HIGH
                  </div>
                )}
              </div>

              {/* 프로젝트 카테고리 */}
              {project.category && (
                <div className="text-blue-600 dark:text-blue-400 text-xs font-medium mb-2">
                  {project.category}
                </div>
              )}

              {/* 프로젝트 제목 */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {project.title}
              </h3>

              {/* 프로젝트 설명 */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* 매칭 스킬 */}
              {project.matchingSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.matchingSkills.slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.matchingSkills.length > 3 && (
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      +{project.matchingSkills.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* 추천 이유 */}
              {project.recommendationReason.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs p-2 rounded-lg mb-4">
                  <div className="flex items-center gap-1 mb-1">
                    <StarIcon className="h-3 w-3" />
                    <span className="font-medium">추천 이유</span>
                  </div>
                  <p className="line-clamp-2">
                    {project.recommendationReason[0]}
                  </p>
                </div>
              )}

              {/* 프로젝트 정보 */}
              <div className="space-y-2 mb-4">
                {project.budget && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CurrencyDollarIcon className="h-4 w-4" />
                    <span>{project.budget}</span>
                  </div>
                )}
                {project.workType && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{project.workType === 'remote' ? '원격' : project.workType === 'onsite' ? '상주' : '하이브리드'}</span>
                  </div>
                )}
                {project.deadline && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatDate(project.deadline)}</span>
                  </div>
                )}
              </div>

              {/* 통계 정보 */}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4" />
                  <span>{project.views || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <UserGroupIcon className="h-4 w-4" />
                  <span>{project.applications || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookmarkIcon className="h-4 w-4" />
                  <span>{project.bookmarkCount || 0}</span>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex items-center justify-between">
                <Link
                  href={`/project/${project.id}`}
                  onClick={() => handleFeedback(project.id.toString(), 'click')}
                  className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 text-blue-700 dark:text-blue-300 font-medium py-2 px-4 rounded-xl transition-all text-center text-sm mr-2"
                >
                  상세보기
                </Link>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFeedback(project.id.toString(), 'like')}
                    disabled={submitting}
                    className={`p-2 rounded-lg transition-colors ${
                      likedProjects.has(project.id.toString())
                        ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600'
                    }`}
                  >
                    {likedProjects.has(project.id.toString()) ? (
                      <HeartIconSolid className="h-4 w-4" />
                    ) : (
                      <HeartIcon className="h-4 w-4" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleFeedback(project.id.toString(), 'bookmark')}
                    disabled={submitting}
                    className={`p-2 rounded-lg transition-colors ${
                      bookmarkedProjects.has(project.id.toString())
                        ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 hover:text-yellow-600'
                    }`}
                  >
                    {bookmarkedProjects.has(project.id.toString()) ? (
                      <BookmarkIconSolid className="h-4 w-4" />
                    ) : (
                      <BookmarkIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 신뢰도 점수 표시 */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded">
                  신뢰도: {Math.round(project.confidence * 100)}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 더 많은 추천 보기 버튼 */}
        <div className="text-center mt-12">
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            <SparklesIcon className="h-5 w-5" />
            더 많은 추천 보기
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProjects;