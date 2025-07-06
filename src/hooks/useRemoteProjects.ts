import { useState, useEffect, useCallback, useRef } from 'react';
import { remoteProjectService } from '@/services/remoteProject';
import type { RemoteProject, RemoteProjectSearchParams } from '@/types/remoteProject';

interface UseRemoteProjectsReturn {
  projects: RemoteProject[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  fetchProjects: (params?: RemoteProjectSearchParams) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useRemoteProjects(
  initialParams: RemoteProjectSearchParams = {}
): UseRemoteProjectsReturn {
  const [projects, setProjects] = useState<RemoteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const paramsRef = useRef<RemoteProjectSearchParams>(initialParams);
  const isMountedRef = useRef(true);
  
  // API 호출 함수
  const fetchProjects = useCallback(async (
    params?: RemoteProjectSearchParams
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      // 파라미터 업데이트
      if (params) {
        paramsRef.current = { ...paramsRef.current, ...params };
      }
      
      const searchParams = {
        ...paramsRef.current,
        page: params?.page || paramsRef.current.page || 1,
        size: params?.size || paramsRef.current.size || 10
      };
      
      console.log('🔍 Fetching remote projects with params:', searchParams);
      
      const result = await remoteProjectService.getProjects(searchParams);
      
      if (!isMountedRef.current) return;
      
      if (result.success && result.data) {
        const { content, totalElements, totalPages, number } = result.data;
        
        // 페이지가 1이면 새로운 검색, 아니면 추가 로드
        if (searchParams.page === 1) {
          setProjects(content);
        } else {
          setProjects(prev => [...prev, ...content]);
        }
        
        setTotalCount(totalElements);
        setTotalPages(totalPages);
        setCurrentPage(number + 1); // Spring은 0부터 시작
        setHasMore(number + 1 < totalPages);
        
        console.log(`✅ Loaded ${content.length} remote projects, total: ${totalElements}`);
      } else {
        setError(result.error || '프로젝트를 불러오는데 실패했습니다.');
        console.error('❌ Failed to fetch remote projects:', result.error);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      
      const errorMessage = err.message || '네트워크 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('❌ Error fetching remote projects:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);
  
  // 더 보기 함수
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    const nextPage = currentPage + 1;
    await fetchProjects({ page: nextPage });
  }, [currentPage, hasMore, loading, fetchProjects]);
  
  // 새로고침 함수
  const refresh = useCallback(async () => {
    paramsRef.current = { ...paramsRef.current, page: 1 };
    await fetchProjects({ page: 1 });
  }, [fetchProjects]);
  
  // 초기 로드
  useEffect(() => {
    isMountedRef.current = true;
    fetchProjects();
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return {
    projects,
    loading,
    error,
    totalCount,
    totalPages,
    currentPage,
    hasMore,
    fetchProjects,
    loadMore,
    refresh
  };
}