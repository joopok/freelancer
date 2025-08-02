/**
 * 추천 시스템 커스텀 훅
 * 프로젝트 추천 데이터를 가져오고 관리하는 훅
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { recommendationService } from '@/services/recommendation';
import {
  RecommendationRequest,
  RecommendationResponse,
  RecommendedProject,
  RecommendationFeedback,
  RecommendationStats
} from '@/types/recommendation';

interface UseRecommendationsOptions {
  userId?: string;
  projectId?: string;
  type?: 'user-based' | 'project-similarity' | 'popularity' | 'hybrid';
  limit?: number;
  autoFetch?: boolean;
  refreshInterval?: number;
  excludeIds?: string[];
  filters?: {
    category?: string;
    budgetRange?: { min: number; max: number };
    location?: string;
    experienceLevel?: string;
    skills?: string[];
    workType?: string;
  };
}

interface UseRecommendationsReturn {
  // 데이터 상태
  recommendations: RecommendedProject[];
  loading: boolean;
  error: string | null;
  metadata: RecommendationResponse['metadata'] | null;
  
  // 액션 함수들
  fetchRecommendations: () => Promise<void>;
  refresh: () => Promise<void>;
  submitFeedback: (feedback: Omit<RecommendationFeedback, 'userId' | 'timestamp'>) => Promise<void>;
  
  // 유틸리티
  getRecommendationsByCategory: (category: string) => RecommendedProject[];
  getTopRecommendations: (count: number) => RecommendedProject[];
  hasMore: boolean;
  
  // 통계
  stats: RecommendationStats | null;
  loadingStats: boolean;
}

export const useRecommendations = (
  options: UseRecommendationsOptions = {}
): UseRecommendationsReturn => {
  const {
    userId,
    projectId,
    type = 'hybrid',
    limit = 10,
    autoFetch = true,
    refreshInterval,
    excludeIds = [],
    filters
  } = options;

  // 상태 관리
  const [recommendations, setRecommendations] = useState<RecommendedProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<RecommendationResponse['metadata'] | null>(null);
  const [stats, setStats] = useState<RecommendationStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // 추천 요청 객체 생성 - filters 객체를 안정화
  const stableFilters = useMemo(() => filters, [
    filters?.category,
    filters?.budgetRange?.min,
    filters?.budgetRange?.max,
    filters?.location,
    filters?.experienceLevel,
    filters?.skills?.join(','),
    filters?.workType
  ]);

  const request = useMemo((): RecommendationRequest => ({
    userId,
    projectId,
    type,
    limit,
    excludeIds,
    filters: stableFilters
  }), [userId, projectId, type, limit, excludeIds?.join(','), stableFilters]);

  // 추천 데이터 가져오기
  const fetchRecommendations = useCallback(async () => {
    if (!autoFetch && !userId && !projectId) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 추천 데이터 가져오기 시작:', {
        userId,
        type,
        cacheHit: false
      });
      
      const response = await recommendationService.getRecommendations(request);
      
      setRecommendations(response.recommendations);
      setMetadata(response.metadata);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '추천 데이터를 가져오는 데 실패했습니다'; // TONE: OK
      console.error('❌ 추천 데이터 가져오기 실패:', err);
      setError(errorMessage);
      setRecommendations([]);
    } finally {
      // 렌더링이 완료될 때까지 약간의 지연을 추가
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLoading(false);
        });
      });
    }
  }, [request]);

  // 새로고침
  const refresh = useCallback(async () => {
    // 캐시 무효화를 위해 타임스탬프 추가
    const refreshRequest = {
      ...request,
      timestamp: Date.now()
    };
    
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 추천 데이터 새로고침');
      const response = await recommendationService.getRecommendations(refreshRequest);
      
      setRecommendations(response.recommendations);
      setMetadata(response.metadata);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '추천 데이터 새로고침에 실패했습니다'; // TONE: OK
      console.error('❌ 추천 데이터 새로고침 실패:', err);
      setError(errorMessage);
    } finally {
      // 렌더링이 완료될 때까지 약간의 지연을 추가
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLoading(false);
        });
      });
    }
  }, [request]);

  // 피드백 제출
  const submitFeedback = useCallback(async (
    feedback: Omit<RecommendationFeedback, 'userId' | 'timestamp'>
  ) => {
    if (!userId) {
      console.warn('사용자 ID가 없어 피드백을 제출할 수 없습니다');
      return;
    }

    try {
      const fullFeedback: RecommendationFeedback = {
        ...feedback,
        userId,
        timestamp: new Date().toISOString()
      };

      console.log('📊 추천 피드백 제출:', fullFeedback);
      await recommendationService.submitFeedback(fullFeedback);
      
      // 피드백 제출 후 추천 데이터 업데이트 (옵션)
      if (feedback.action === 'dislike') {
        setRecommendations(prev => 
          prev.filter(rec => rec.id.toString() !== feedback.projectId)
        );
      }
    } catch (err) {
      console.error('❌ 피드백 제출 실패:', err);
      throw err;
    }
  }, [userId]);

  // 카테고리별 추천 필터링
  const getRecommendationsByCategory = useCallback((category: string) => {
    return recommendations.filter(rec => rec.category === category);
  }, [recommendations]);

  // 상위 추천 가져오기
  const getTopRecommendations = useCallback((count: number) => {
    return recommendations
      .sort((a, b) => b.recommendationScore.total - a.recommendationScore.total)
      .slice(0, count);
  }, [recommendations]);

  // 더 많은 추천이 있는지 확인
  const hasMore = useMemo(() => {
    return recommendations.length >= (limit || 10);
  }, [recommendations.length, limit]);

  // 통계 데이터 가져오기
  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setLoadingStats(true);
    try {
      const statsData = await recommendationService.getRecommendationStats(userId);
      setStats(statsData);
    } catch (err) {
      console.error('❌ 추천 통계 가져오기 실패:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [userId]);

  // 초기 데이터 로딩 - 마운트 시 한 번만 실행
  useEffect(() => {
    let mounted = true;
    
    if (autoFetch && mounted) {
      fetchRecommendations();
    }
    
    return () => {
      mounted = false;
    };
  }, []); // 빈 배열로 마운트 시 한 번만 실행

  // 통계 데이터 로딩
  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [fetchStats, userId]);

  // 자동 새로고침 설정
  useEffect(() => {
    if (!refreshInterval) return;

    const intervalId = setInterval(() => {
      if (!loading) {
        fetchRecommendations();
      }
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval, loading, fetchRecommendations]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 필요시 정리 작업
    };
  }, []);

  return {
    // 데이터 상태
    recommendations,
    loading,
    error,
    metadata,
    
    // 액션 함수들
    fetchRecommendations,
    refresh,
    submitFeedback,
    
    // 유틸리티
    getRecommendationsByCategory,
    getTopRecommendations,
    hasMore,
    
    // 통계
    stats,
    loadingStats
  };
};

/**
 * 사용자 맞춤 추천 훅 (간편 버전)
 */
export const useUserRecommendations = (
  userId?: string,
  limit = 10
) => {
  return useRecommendations({
    userId,
    type: 'user-based',
    limit,
    autoFetch: !!userId
  });
};

/**
 * 프로젝트 유사성 추천 훅 (간편 버전)
 */
export const useProjectSimilarRecommendations = (
  projectId?: string,
  limit = 5
) => {
  return useRecommendations({
    projectId,
    type: 'project-similarity',
    limit,
    autoFetch: !!projectId
  });
};

/**
 * 인기 프로젝트 추천 훅 (간편 버전)
 */
export const usePopularRecommendations = (limit = 10) => {
  return useRecommendations({
    type: 'popularity',
    limit,
    autoFetch: true
  });
};

/**
 * 하이브리드 추천 훅 (간편 버전)
 */
export const useHybridRecommendations = (
  userId?: string,
  projectId?: string,
  limit = 10
) => {
  return useRecommendations({
    userId,
    projectId,
    type: 'hybrid',
    limit,
    autoFetch: !!(userId || projectId)
  });
};

/**
 * 추천 피드백 전용 훅
 */
export const useRecommendationFeedback = (userId?: string) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = useCallback(async (
    feedback: Omit<RecommendationFeedback, 'userId' | 'timestamp'>
  ) => {
    if (!userId) {
      setError('사용자 인증이 필요합니다');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const fullFeedback: RecommendationFeedback = {
        ...feedback,
        userId,
        timestamp: new Date().toISOString()
      };

      await recommendationService.submitFeedback(fullFeedback);
      console.log('✅ 피드백 제출 성공');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '피드백 제출에 실패했습니다'; // TONE: OK
      console.error('❌ 피드백 제출 실패:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [userId]);

  return {
    submitFeedback,
    submitting,
    error
  };
};

/**
 * 추천 통계 전용 훅
 */
export const useRecommendationStats = (userId?: string) => {
  const [stats, setStats] = useState<RecommendationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const statsData = await recommendationService.getRecommendationStats(userId);
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '통계 데이터를 가져오는 데 실패했습니다'; // TONE: OK
      console.error('❌ 통계 가져오기 실패:', err);
      setError(errorMessage);
    } finally {
      // 렌더링이 완료될 때까지 약간의 지연을 추가
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLoading(false);
        });
      });
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [fetchStats, userId]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  };
};

/**
 * 추천 시스템 디버깅 훅
 */
export const useRecommendationDebug = () => {
  const [cacheStats, setCacheStats] = useState<{
    size: number;
    hitRate: number;
    entries: number;
  } | null>(null);

  const getCacheStats = useCallback(() => {
    const stats = recommendationService.getCacheStats();
    setCacheStats(stats);
    return stats;
  }, []);

  const clearCache = useCallback(() => {
    recommendationService.clearCache();
    setCacheStats(null);
  }, []);

  return {
    cacheStats,
    getCacheStats,
    clearCache
  };
};

export default useRecommendations;