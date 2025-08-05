import { useState, useEffect, useCallback, useRef } from 'react';
import { remoteProjectService } from '@/services/remoteProject';
import type { RemoteProject, RemoteProjectSearchParams } from '@/types/remoteProject';

interface UseRemoteProjectsReturn {
  projects: RemoteProject[];
  loading: boolean;
  loadingMore: boolean;
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
  initialParams: RemoteProjectSearchParams = {},
  options: { autoFetch?: boolean } = { autoFetch: true }
): UseRemoteProjectsReturn {
  const [projects, setProjects] = useState<RemoteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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
      // 페이지가 1보다 크면 더보기 로딩, 아니면 전체 로딩
      const isLoadMore = params?.page && params.page > 1;
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
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
      
      const result = await remoteProjectService.getProjects(searchParams);
      
      if (!isMountedRef.current) return;
      
      if (result.success && result.data) {
        
        // Check if data is in paginated format or simple array
        let content: RemoteProject[] = [];
        let totalElements = 0;
        let totalPages = 1;
        let number = 0;
        
        if (Array.isArray(result.data)) {
          // Simple array format (likely mock data)
          content = result.data;
          totalElements = content.length;
          totalPages = 1;
          number = 0;
        } else if ('projects' in result.data && result.data.projects !== undefined) {
          // Backend API format - transform the data
          const rawProjects = (result.data as any).projects || [];
          content = rawProjects.map((project: any) => ({
            ...project,
            // Map client.company to companyName
            companyName: project.client?.company || project.companyName || '',
            clientName: project.client?.name || project.clientName || '',
            // Map timeline fields
            deadline: project.timeline?.deadline || project.deadline || '',
            urgency: project.timeline?.urgency || project.urgency || 'medium',
            // Ensure skills is an array
            skills: Array.isArray(project.skills) ? project.skills : [],
            // Ensure ID is string
            id: String(project.id),
          }));
          totalElements = (result.data as any).totalCount || 0;
          totalPages = (result.data as any).totalPages || 1;
          number = (result.data as any).currentPage - 1 || 0; // Backend uses 1-based
        } else if (result.data.content !== undefined) {
          // Spring Boot Page format
          content = result.data.content || [];
          totalElements = result.data.totalElements || 0;
          totalPages = result.data.totalPages || 1;
          number = result.data.number || 0;
        } else {
          console.error('❌ Unexpected data format in API response');
          setError('프로젝트 데이터 형식이 올바르지 않습니다.');
          return;
        }
        
        // 페이지가 1이면 새로운 검색, 아니면 추가 로드
        if (searchParams.page === 1) {
          setProjects(content);
        } else {
          setProjects(prev => [...prev, ...content]);
        }
        
        setTotalCount(totalElements);
        setTotalPages(totalPages);
        setCurrentPage(number + 1); // Spring은 0부터 시작
        setHasMore((number + 1) < totalPages);
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
        // 렌더링이 완료될 때까지 약간의 지연을 추가
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setLoading(false);
            setLoadingMore(false);
          });
        });
      }
    }
  }, []);
  
  // 더 보기 함수
  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    
    const nextPage = currentPage + 1;
    // 현재 검색 파라미터를 유지하면서 페이지만 증가
    await fetchProjects({ 
      ...paramsRef.current, 
      page: nextPage 
    });
  }, [currentPage, hasMore, loading, loadingMore, fetchProjects]);
  
  // 새로고침 함수
  const refresh = useCallback(async () => {
    paramsRef.current = { ...paramsRef.current, page: 1 };
    await fetchProjects({ page: 1 });
  }, [fetchProjects]);
  
  // 초기 로드
  useEffect(() => {
    isMountedRef.current = true;
    
    // autoFetch 옵션이 true일 때만 자동 로드
    if (options.autoFetch !== false) {
      fetchProjects();
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return {
    projects,
    loading,
    loadingMore,
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