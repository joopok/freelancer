import api from '@/utils/api';
import type { 
  RemoteProject, 
  RemoteProjectDetail,
  RemoteProjectSearchParams,
  RemoteProjectApplication,
  RemoteProjectInquiry 
} from '@/types/remoteProject';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

class RemoteProjectService {
  // 재택 프로젝트 목록 조회
  async getProjects(params: RemoteProjectSearchParams): Promise<ApiResponse<PaginatedResponse<RemoteProject>>> {
    try {
      const queryParams = new URLSearchParams();
      
      // 페이지네이션
      queryParams.append('page', String(params.page || 1));
      queryParams.append('size', String(params.size || 10));
      
      // 검색 조건
      if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
      if (params.skills?.length) queryParams.append('skills', params.skills.join(','));
      if (params.duration) queryParams.append('duration', params.duration);
      if (params.budgetMin) queryParams.append('budgetMin', String(params.budgetMin));
      if (params.budgetMax) queryParams.append('budgetMax', String(params.budgetMax));
      if (params.workType) queryParams.append('workType', params.workType);
      if (params.experienceLevel) queryParams.append('experienceLevel', params.experienceLevel);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      
      const response = await api.get(`/api/remote-projects?${queryParams.toString()}`);
      
      if (response.data?.success) {
        // Check if the data has the expected structure
        if (!response.data.data || typeof response.data.data !== 'object') {
          return {
            success: false,
            error: '서버 응답 형식이 올바르지 않습니다.'
          };
        }
        
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        error: response.data?.message || '프로젝트 목록을 불러오는데 실패했습니다.'
      };
    } catch (error: any) {
      console.error('Error fetching remote projects:', error);
      return {
        success: false,
        error: error.response?.data?.message || '네트워크 오류가 발생했습니다.'
      };
    }
  }
  
  // 재택 프로젝트 상세 조회
  async getProjectDetail(id: string): Promise<ApiResponse<RemoteProjectDetail>> {
    try {
      const response = await api.get(`/api/remote-projects/${id}`);
      
      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        error: response.data?.message || '프로젝트 정보를 불러오는데 실패했습니다.'
      };
    } catch (error: any) {
      console.error('Error fetching remote project detail:', error);
      return {
        success: false,
        error: error.response?.data?.message || '네트워크 오류가 발생했습니다.'
      };
    }
  }
  
  // 재택 프로젝트 지원
  async applyProject(projectId: string, data: Partial<RemoteProjectApplication>): Promise<ApiResponse<RemoteProjectApplication>> {
    try {
      const response = await api.post(`/api/remote-projects/${projectId}/apply`, data);
      
      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data,
          message: '프로젝트 지원이 완료되었습니다.'
        };
      }
      
      return {
        success: false,
        error: response.data?.message || '프로젝트 지원에 실패했습니다.'
      };
    } catch (error: any) {
      console.error('Error applying to remote project:', error);
      return {
        success: false,
        error: error.response?.data?.message || '네트워크 오류가 발생했습니다.'
      };
    }
  }
  
  // 재택 프로젝트 북마크 토글
  async toggleBookmark(projectId: string): Promise<ApiResponse<{ bookmarked: boolean }>> {
    try {
      const response = await api.post(`/api/remote-projects/${projectId}/bookmark`);
      
      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        error: response.data?.message || '북마크 처리에 실패했습니다.'
      };
    } catch (error: any) {
      console.error('Error toggling bookmark:', error);
      return {
        success: false,
        error: error.response?.data?.message || '네트워크 오류가 발생했습니다.'
      };
    }
  }
  
  // 재택 프로젝트 문의하기
  async inquireProject(projectId: string, data: Partial<RemoteProjectInquiry>): Promise<ApiResponse<RemoteProjectInquiry>> {
    try {
      const response = await api.post(`/api/remote-projects/${projectId}/inquire`, data);
      
      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data,
          message: '문의가 성공적으로 전송되었습니다.'
        };
      }
      
      return {
        success: false,
        error: response.data?.message || '문의 전송에 실패했습니다.'
      };
    } catch (error: any) {
      console.error('Error sending inquiry:', error);
      return {
        success: false,
        error: error.response?.data?.message || '네트워크 오류가 발생했습니다.'
      };
    }
  }
  
  // 전체 기술 스택 목록 조회
  async getSkills(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get('/api/remote-projects/skills');
      
      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        error: response.data?.message || '기술 스택 목록을 불러오는데 실패했습니다.'
      };
    } catch (error: any) {
      console.error('Error fetching skills:', error);
      return {
        success: false,
        error: error.response?.data?.message || '네트워크 오류가 발생했습니다.'
      };
    }
  }
  
  // 유사한 재택 프로젝트 조회
  async getSimilarProjects(projectId: string, limit: number = 6): Promise<ApiResponse<RemoteProject[]>> {
    try {
      const response = await api.get(`/api/remote-projects/${projectId}/similar?limit=${limit}`);
      
      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        error: response.data?.message || '유사한 프로젝트를 불러오는데 실패했습니다.'
      };
    } catch (error: any) {
      console.error('Error fetching similar projects:', error);
      return {
        success: false,
        error: error.response?.data?.message || '네트워크 오류가 발생했습니다.'
      };
    }
  }
  
  // 프로젝트 조회수 증가
  async incrementViewCount(projectId: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.post(`/api/remote-projects/${projectId}/view`);
      
      if (response.data?.success) {
        return {
          success: true
        };
      }
      
      return {
        success: false,
        error: response.data?.message || '조회수 업데이트에 실패했습니다.'
      };
    } catch (error: any) {
      console.error('Error incrementing view count:', error);
      return {
        success: false,
        error: error.response?.data?.message || '네트워크 오류가 발생했습니다.'
      };
    }
  }
  
  
  // 프로젝트 기술 스택 상위 20개 조회
  async getTopProjectSkills(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get('/api/remote-projects/skills');
      
      if (response.data?.success) {
        return {
          success: true,
          data: response.data.data || []
        };
      }
      
      return {
        success: false,
        error: response.data?.message || '기술 스택 목록을 불러오는데 실패했습니다.'
      };
    } catch (error: any) {
      console.error('Error fetching top project skills:', error);
      return {
        success: false,
        error: error.response?.data?.message || '네트워크 오류가 발생했습니다.'
      };
    }
  }
}

export const remoteProjectService = new RemoteProjectService();