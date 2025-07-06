import { useState, useEffect, useCallback, useRef } from 'react';
import { freelancerService } from '@/services/freelancer';
import type { FreelancerDetail } from '@/types/freelancer';

interface UseFreelancerDetailReturn {
  freelancer: FreelancerDetail | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleBookmark: () => Promise<void>;
  isBookmarked: boolean;
}

export function useFreelancerDetail(freelancerId: string): UseFreelancerDetailReturn {
  const [freelancer, setFreelancer] = useState<FreelancerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const isMountedRef = useRef(true);
  
  // 프리랜서 상세 정보 조회
  const fetchFreelancerDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching freelancer detail:', freelancerId);
      
      // 조회수 증가
      await freelancerService.incrementViewCount(freelancerId);
      
      // 프리랜서 상세 정보 조회
      const result = await freelancerService.getFreelancerDetail(freelancerId);
      
      if (!isMountedRef.current) return;
      
      if (result.success && result.data) {
        setFreelancer(result.data);
        setIsBookmarked(result.data.isBookmarked || false);
        console.log('✅ Loaded freelancer detail:', result.data.name);
      } else {
        setError(result.error || '프리랜서 정보를 불러오는데 실패했습니다.');
        console.error('❌ Failed to fetch freelancer detail:', result.error);
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;
      
      const errorMessage = err.message || '네트워크 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('❌ Error fetching freelancer detail:', err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [freelancerId]);
  
  // 북마크 토글
  const toggleBookmark = useCallback(async () => {
    if (!freelancer) return;
    
    try {
      const result = await freelancerService.toggleBookmark(freelancerId);
      
      if (result.success && result.data) {
        setIsBookmarked(result.data.bookmarked);
        
        // 프리랜서 객체 업데이트
        setFreelancer(prev => prev ? {
          ...prev,
          isBookmarked: result.data.bookmarked,
          bookmarkCount: prev.bookmarkCount + (result.data.bookmarked ? 1 : -1)
        } : null);
      }
    } catch (err) {
      console.error('❌ Error toggling bookmark:', err);
    }
  }, [freelancerId, freelancer]);
  
  // 새로고침
  const refresh = useCallback(async () => {
    await fetchFreelancerDetail();
  }, [fetchFreelancerDetail]);
  
  // 초기 로드
  useEffect(() => {
    isMountedRef.current = true;
    
    if (freelancerId) {
      fetchFreelancerDetail();
    }
    
    return () => {
      isMountedRef.current = false;
    };
  }, [freelancerId]);
  
  return {
    freelancer,
    loading,
    error,
    refresh,
    toggleBookmark,
    isBookmarked
  };
}