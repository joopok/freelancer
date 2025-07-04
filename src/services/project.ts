import { Project, ProjectDetail, ActiveProject, ProjectReview, Applicant } from '@/types/project';

// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

// 공통 헤더
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 프로젝트 검색 파라미터
export interface ProjectSearchParams {
  page?: number;
  pageSize?: number;
  category?: string;
  skills?: string[];
  type?: string;
  duration?: string;
  budget?: string;
  search?: string;
  sortBy?: 'latest' | 'deadline' | 'budget' | 'views';
  sortOrder?: 'asc' | 'desc';
}

// 프로젝트 목록 응답
interface ProjectListResponse {
  projects: Project[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// 타임아웃 처리 함수
const fetchWithTimeout = async (url: string, options: RequestInit): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    throw error;
  }
};

// 프로젝트 서비스
export const projectService = {
  // 프로젝트 목록 조회
  async getProjects(params: ProjectSearchParams = {}): Promise<ApiResponse<ProjectListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.category) queryParams.append('category', params.category);
      if (params.type) queryParams.append('type', params.type);
      if (params.duration) queryParams.append('duration', params.duration);
      if (params.budget) queryParams.append('budget', params.budget);
      if (params.search) queryParams.append('search', params.search);
      if (params.skills && params.skills.length > 0) {
        queryParams.append('skills', params.skills.join(','));
      }
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          projects: data.projects || [],
          totalCount: data.totalCount || 0,
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
        },
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
      };
    }
  },

  // 프로젝트 상세 조회
  async getProjectById(id: string): Promise<ApiResponse<ProjectDetail>> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects/${id}`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Error fetching project detail:', error);
      
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project detail',
      };
    }
  },

  // 활성 프로젝트 목록 조회
  async getActiveProjects(): Promise<ApiResponse<ActiveProject[]>> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects/active`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.projects || [],
      };
    } catch (error) {
      console.error('Error fetching active projects:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch active projects',
      };
    }
  },

  // 프로젝트 리뷰 조회
  async getProjectReviews(projectId: string): Promise<ApiResponse<ProjectReview[]>> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects/${projectId}/reviews`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.reviews || [],
      };
    } catch (error) {
      console.error('Error fetching project reviews:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project reviews',
      };
    }
  },

  // 프로젝트 지원
  async applyToProject(projectId: string, applicationData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects/${projectId}/apply`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(applicationData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: '프로젝트 지원이 완료되었습니다.',
      };
    } catch (error) {
      console.error('Error applying to project:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to apply to project',
      };
    }
  },

  // 프로젝트 조회수 증가
  async incrementProjectView(projectId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects/${projectId}/view`,
        {
          method: 'POST',
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Error incrementing project view:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to increment view',
      };
    }
  },
};

