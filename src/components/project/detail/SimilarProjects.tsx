'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  HeartIcon, 
  BookmarkIcon, 
  EyeIcon, 
  UserGroupIcon,
  StarIcon,
  BoltIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Project } from '@/types/project';
import { useProjectSimilarRecommendations, useRecommendationFeedback } from '@/hooks/useRecommendations';
import { formatDate } from '@/utils/format';

interface SimilarProjectsProps {
  projectId: string;
  projects?: Project[];
  loading?: boolean;
}

const SimilarProjects = React.memo(({ projectId, projects: fallbackProjects, loading: fallbackLoading }: SimilarProjectsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Set<string>>(new Set());
  const itemsPerPage = 3;

  // 추천 시스템 사용
  const {
    recommendations,
    loading: recommendationLoading,
    error: recommendationError,
    refresh,
    metadata
  } = useProjectSimilarRecommendations(projectId, 6);

  const { submitFeedback } = useRecommendationFeedback();

  // 추천 결과가 있으면 사용, 없으면 fallback 사용
  const projects = recommendations.length > 0 ? recommendations : (fallbackProjects || []);
  const loading = recommendationLoading || fallbackLoading;

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - itemsPerPage));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => 
      Math.min(projects.length - itemsPerPage, prev + itemsPerPage)
    );
  }, [projects.length]);

  // 피드백 제출 핸들러
  const handleFeedback = async (project: any, action: 'click' | 'bookmark' | 'like') => {
    try {
      await submitFeedback({
        recommendationId: `rec_${project.id}`,
        projectId: project.id.toString(),
        action,
        relevanceScore: 0.8
      });

      if (action === 'bookmark') {
        setBookmarkedProjects(prev => new Set(prev).add(project.id.toString()));
      }
    } catch (error) {
      console.error('피드백 제출 실패:', error);
    }
  };

  const visibleProjects = projects.slice(currentIndex, currentIndex + itemsPerPage);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex + itemsPerPage < projects.length;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <SparklesIcon className="h-6 w-6 text-blue-500 animate-pulse" />
          <h3 className="text-xl font-bold">AI 추천 유사 프로젝트</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-bold">AI 추천 유사 프로젝트</h3>
          </div>
          {recommendationError && (
            <button
              onClick={refresh}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <ArrowPathIcon className="h-4 w-4" />
              다시 시도
            </button>
          )}
        </div>
        <div className="text-center py-8">
          <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            유사한 프로젝트를 찾고 있습니다
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            AI가 관련 프로젝트를 분석하여 추천해드리겠습니다
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-6 w-6 text-blue-500" />
          <h3 className="text-xl font-bold">AI 추천 유사 프로젝트</h3>
          {metadata && (
            <div className="flex items-center gap-2 ml-2">
              <BoltIcon className="h-4 w-4 text-green-500" />
              <span className="text-xs text-gray-500">
                {metadata.algorithm} • {metadata.executionTime}ms
              </span>
            </div>
          )}
        </div>
        {projects.length > itemsPerPage && (
          <div className="flex space-x-2">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className={`p-2 rounded-lg transition-colors ${
                canGoPrevious
                  ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                  : 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className={`p-2 rounded-lg transition-colors ${
                canGoNext
                  ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                  : 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleProjects.map((project, index) => {
          const isRecommended = 'recommendationScore' in project;
          const recommendedProject = project as any;
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-all hover:-translate-y-1 relative group"
            >
              {/* 추천 뱃지 */}
              {isRecommended && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    #{recommendedProject.rank || index + 1}
                  </div>
                  {recommendedProject.confidence > 0.8 && (
                    <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full">
                      HIGH
                    </div>
                  )}
                </div>
              )}

              <Link
                href={`/project/${project.id}`}
                onClick={() => handleFeedback(project, 'click')}
                className="block"
              >
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 pr-16">
                  {project.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {project.description}
                </p>

                {/* 매칭 스킬 표시 (추천된 경우) */}
                {isRecommended && recommendedProject.matchingSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {recommendedProject.matchingSkills.slice(0, 3).map((skill: string, skillIndex: number) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-medium"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                    {recommendedProject.matchingSkills.length > 3 && (
                      <span className="text-green-600 dark:text-green-400 text-xs">
                        +{recommendedProject.matchingSkills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* 일반 스킬 표시 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(project.skills || []).slice(0, 3).map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.skills && project.skills.length > 3 && (
                    <span className="px-2 py-1 text-gray-500 text-xs">
                      +{project.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* 추천 이유 (추천된 경우) */}
                {isRecommended && recommendedProject.recommendationReason?.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs p-2 rounded mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <StarIcon className="h-3 w-3" />
                      <span className="font-medium">추천 이유</span>
                    </div>
                    <p className="line-clamp-1">
                      {recommendedProject.recommendationReason[0]}
                    </p>
                  </div>
                )}

                {/* 프로젝트 정보 */}
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-600 dark:text-gray-400">
                    {project.budgetMin && project.budgetMax 
                      ? `${(project.budgetMin / 10000).toFixed(0)}~${(project.budgetMax / 10000).toFixed(0)}만원`
                      : project.budget || '협의'}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {project.duration || '협의'}
                  </span>
                </div>

                {/* 통계 정보 */}
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <EyeIcon className="h-3 w-3" />
                    <span>{project.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserGroupIcon className="h-3 w-3" />
                    <span>{project.applications || 0}</span>
                  </div>
                </div>
              </Link>

              {/* 액션 버튼 */}
              <div className="flex items-center justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleFeedback(project, 'bookmark')}
                  className={`p-1.5 rounded transition-colors ${
                    bookmarkedProjects.has(project.id.toString())
                      ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 hover:text-yellow-600'
                  }`}
                >
                  <BookmarkIcon className="h-3 w-3" />
                </button>
                
                <button
                  onClick={() => handleFeedback(project, 'like')}
                  className="p-1.5 rounded bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 transition-colors"
                >
                  <HeartIcon className="h-3 w-3" />
                </button>
              </div>

              {/* 신뢰도 점수 (추천된 경우) */}
              {isRecommended && recommendedProject.confidence && (
                <div className="absolute bottom-1 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded">
                    신뢰도: {Math.round(recommendedProject.confidence * 100)}%
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 페이지 인디케이터 */}
      {projects.length > itemsPerPage && (
        <div className="flex justify-center mt-4 space-x-1">
          {Array.from({ length: Math.ceil(projects.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerPage)}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / itemsPerPage) === index
                  ? 'bg-blue-600 dark:bg-blue-400'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

SimilarProjects.displayName = 'SimilarProjects';

export default SimilarProjects;