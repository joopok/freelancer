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
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [projectService.getProjectReviews] Fetching reviews for project:', projectId);
        console.log('🔍 [projectService.getProjectReviews] API URL:', `${API_BASE_URL}/api/projects/${projectId}/reviews`);
      }
      
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects/${projectId}/reviews`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [projectService.getProjectReviews] Response status:', response.status);
      }

      if (!response.ok) {
        // 404일 경우 빈 배열 반환 (API가 아직 구현되지 않음)
        if (response.status === 404) {
          console.warn(`❌ [projectService.getProjectReviews] Reviews endpoint not found for project ${projectId}`);
          return {
            success: true,
            data: [], // 빈 리뷰 목록 반환
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [projectService.getProjectReviews] Raw response data:', data);
      }
      
      // 다양한 응답 형식 처리
      let reviews = [];
      if (Array.isArray(data)) {
        reviews = data;
      } else if (data.data && Array.isArray(data.data)) {
        reviews = data.data;
      } else if (data.reviews && Array.isArray(data.reviews)) {
        reviews = data.reviews;
      } else if (data.content && Array.isArray(data.content)) {
        reviews = data.content;
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [projectService.getProjectReviews] Processed reviews:', reviews);
        console.log('✅ [projectService.getProjectReviews] Reviews count:', reviews.length);
        
        // 첫 번째 리뷰 상세 로그 (필드 매핑 확인용)
        if (reviews.length > 0) {
          console.log('🔍 [projectService.getProjectReviews] First review structure:', JSON.stringify(reviews[0], null, 2));
        }
      }
      
      return {
        success: true,
        data: reviews,
      };
    } catch (error) {
      console.warn('❌ [projectService.getProjectReviews] Error fetching project reviews (using fallback):', error);
      
      // API 에러 시 빈 목록 반환
      return {
        success: true,
        data: [],
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
        // 404나 기타 에러일 경우 조용히 실패 처리 (조회수 증가는 필수 기능이 아니므로)
        console.warn(`View increment failed for project ${projectId}: ${response.status}`);
        return {
          success: false,
          error: 'View increment endpoint not available',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      // 네트워크 에러나 API 미구현 시 조용히 실패
      console.warn('Error incrementing project view (non-critical):', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to increment view',
      };
    }
  },

  // 프로젝트 상세 정보 (탭별 데이터) - 현재는 기본 데이터 반환
  async getProjectTabData(projectId: string, tab: 'overview' | 'details' | 'company' | 'reviews'): Promise<ApiResponse<any>> {
    try {
      // 백엔드 API가 구현되기 전까지 기본 프로젝트 데이터 사용
      const projectData = await this.getProjectById(projectId);
      
      if (!projectData.success) {
        return projectData;
      }
      
      // 탭별로 필요한 데이터만 반환
      const tabData = {
        overview: projectData.data,
        details: projectData.data,
        company: projectData.data?.companyInfo || {},
        reviews: { questions: [], reviews: [] }
      };
      
      return {
        success: true,
        data: tabData[tab],
      };
    } catch (error) {
      console.error(`Error fetching project ${tab} data:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to fetch project ${tab} data`,
      };
    }
  },

  // 유사한 프로젝트 조회 - related 엔드포인트 사용
  async getSimilarProjects(projectId: string, limit: number = 10): Promise<ApiResponse<Project[]>> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [projectService.getSimilarProjects] Fetching related projects for project:', projectId);
        console.log('🔍 [projectService.getSimilarProjects] API URL:', `${API_BASE_URL}/api/projects/${projectId}/related`);
      }
      
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects/${projectId}/related`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [projectService.getSimilarProjects] Response status:', response.status);
      }

      if (!response.ok) {
        // 404나 500일 경우 일반 프로젝트 목록에서 가져오기
        if (response.status === 404 || response.status === 500) {
          console.warn(`❌ [projectService.getSimilarProjects] Related projects endpoint error for project ${projectId}: ${response.status}. Falling back to general projects.`);
          
          // 일반 프로젝트 목록에서 몇 개 가져와서 관련 프로젝트로 사용
          const fallbackResponse = await this.getProjects({ page: 1, pageSize: limit });
          if (fallbackResponse.success && fallbackResponse.data?.projects) {
            // 현재 프로젝트 제외
            const filteredProjects = fallbackResponse.data.projects.filter(
              (p: Project) => p.id.toString() !== projectId.toString()
            );
            console.log('✅ [projectService.getSimilarProjects] Using fallback projects:', filteredProjects.length);
            return {
              success: true,
              data: filteredProjects.slice(0, limit),
            };
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [projectService.getSimilarProjects] Raw response data:', data);
      }
      
      // 다양한 응답 형식 처리
      let projects = [];
      if (Array.isArray(data)) {
        projects = data;
      } else if (data.data && Array.isArray(data.data)) {
        projects = data.data;
      } else if (data.projects && Array.isArray(data.projects)) {
        projects = data.projects;
      } else if (data.relatedProjects && Array.isArray(data.relatedProjects)) {
        projects = data.relatedProjects;
      } else if (data.content && Array.isArray(data.content)) {
        projects = data.content;
      }
      
      const limitedProjects = projects.slice(0, limit);
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ [projectService.getSimilarProjects] Processed similar projects:', limitedProjects);
        console.log('✅ [projectService.getSimilarProjects] Similar projects count:', limitedProjects.length);
        
        // 첫 번째 프로젝트 상세 로그 (필드 매핑 확인용)
        if (limitedProjects.length > 0) {
          console.log('🔍 [projectService.getSimilarProjects] First project structure:', JSON.stringify(limitedProjects[0], null, 2));
        }
      }
      
      return {
        success: true,
        data: limitedProjects,
      };
    } catch (error) {
      console.warn('❌ [projectService.getSimilarProjects] Error fetching similar projects (using fallback):', error);
      
      // 최종 fallback: 빈 목록 반환
      return {
        success: true,
        data: [],
      };
    }
  },

  // 프로젝트 질문 목록 조회
  async getProjectQuestions(projectId: string): Promise<ApiResponse<any[]>> {
    try {
      console.log('🔍 [projectService.getProjectQuestions] Fetching questions for project:', projectId);
      console.log('🔍 [projectService.getProjectQuestions] API URL:', `${API_BASE_URL}/api/projects/${projectId}/questions`);
      
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects/${projectId}/questions`,
        {
          method: 'GET',
          headers: getHeaders(),
        }
      );

      console.log('🔍 [projectService.getProjectQuestions] Response status:', response.status);

      if (!response.ok) {
        // 404일 경우 빈 배열 반환 (API가 아직 구현되지 않음)
        if (response.status === 404) {
          console.warn(`❌ [projectService.getProjectQuestions] Questions endpoint not found for project ${projectId}`);
          return {
            success: true,
            data: [], // 빈 질문 목록 반환
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ [projectService.getProjectQuestions] Raw response data:', data);
      
      // 다양한 응답 형식 처리
      let questions = [];
      if (Array.isArray(data)) {
        questions = data;
      } else if (data.data && Array.isArray(data.data)) {
        questions = data.data;
      } else if (data.questions && Array.isArray(data.questions)) {
        questions = data.questions;
      } else if (data.content && Array.isArray(data.content)) {
        questions = data.content;
      }
      
      console.log('✅ [projectService.getProjectQuestions] Processed questions:', questions);
      console.log('✅ [projectService.getProjectQuestions] Questions count:', questions.length);
      
      // 첫 번째 질문 상세 로그 (필드 매핑 확인용)
      if (questions.length > 0) {
        console.log('🔍 [projectService.getProjectQuestions] First question structure:', JSON.stringify(questions[0], null, 2));
      }
      
      return {
        success: true,
        data: questions,
      };
    } catch (error) {
      console.warn('❌ [projectService.getProjectQuestions] Error fetching project questions (using fallback):', error);
      
      // API 에러 시 빈 목록 반환
      return {
        success: true,
        data: [],
      };
    }
  },

  // 프로젝트 질문 작성
  async createProjectQuestion(projectId: string, questionData: { content: string }): Promise<ApiResponse<any>> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects/${projectId}/questions`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(questionData),
        }
      );

      if (!response.ok) {
        // 404일 경우 API가 아직 구현되지 않음을 알림
        if (response.status === 404) {
          console.warn(`Question creation endpoint not found for project ${projectId}`);
          return {
            success: false,
            error: 'Question creation feature not yet implemented',
            message: '질문 기능이 아직 구현되지 않았습니다.',
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        message: '질문이 등록되었습니다.',
      };
    } catch (error) {
      console.warn('Error creating project question (API not available):', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create question',
        message: '질문 등록에 실패했습니다. API가 아직 구현되지 않았을 수 있습니다.',
      };
    }
  },

  // 프로젝트 지원자 목록 조회
  async getProjectApplicants(projectId: string): Promise<ApiResponse<Applicant[]>> {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/projects/${projectId}/applicants`,
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
        data: data.applicants || [],
      };
    } catch (error) {
      console.error('Error fetching project applicants:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project applicants',
      };
    }
  },
};

