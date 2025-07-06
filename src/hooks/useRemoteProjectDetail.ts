import { useState, useEffect, useCallback, useRef } from 'react';
import { remoteProjectService } from '@/services/remoteProject';
import type { RemoteProjectDetail } from '@/types/remoteProject';

interface UseRemoteProjectDetailReturn {
  project: RemoteProjectDetail | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleBookmark: () => Promise<void>;
  isBookmarked: boolean;
}

export function useRemoteProjectDetail(projectId: string): UseRemoteProjectDetailReturn {
  const [project, setProject] = useState<RemoteProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const isMountedRef = useRef(true);
  
  // 프로젝트 상세 정보 조회
  const fetchProjectDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching remote project detail:', projectId);
      
      // 조회수 증가
      await remoteProjectService.incrementViewCount(projectId);
      
      // 프로젝트 상세 정보 조회
      const result = await remoteProjectService.getProjectDetail(projectId);
      
      if (!isMountedRef.current) return;
      
      if (result.success && result.data) {
        setProject(result.data);
        setIsBookmarked(result.data.isBookmarked || false);
        console.log('✅ Loaded remote project detail:', result.data.title);
      } else {
        setError(result.error || '프로젝트 정보를 불러오는데 실패했습니다.');
        console.error('❌ Failed to fetch remote project detail:', result.error);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      
      const errorMessage = err.message || '네트워크 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('❌ Error fetching remote project detail:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [projectId]);
  
  // 북마크 토글
  const toggleBookmark = useCallback(async () => {
    if (!project) return;
    
    try {
      const result = await remoteProjectService.toggleBookmark(projectId);
      
      if (result.success && result.data) {
        setIsBookmarked(result.data.bookmarked);
        
        // 프로젝트 객체 업데이트
        setProject(prev => prev ? {
          ...prev,
          isBookmarked: result.data.bookmarked,
          bookmarkCount: prev.bookmarkCount + (result.data.bookmarked ? 1 : -1)
        } : null);
      }
    } catch (err) {
      console.error('❌ Error toggling bookmark:', err);
    }
  }, [projectId, project]);
  
  // 새로고침
  const refresh = useCallback(async () => {
    await fetchProjectDetail();
  }, [fetchProjectDetail]);
  
  // 초기 로드
  useEffect(() => {
    isMountedRef.current = true;
    
    if (projectId) {
      fetchProjectDetail();
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [projectId]);
  
  return {
    project,
    loading,
    error,
    refresh,
    toggleBookmark,
    isBookmarked
  };
}