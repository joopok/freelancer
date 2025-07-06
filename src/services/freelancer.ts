import api from '@/utils/api';
import type { Freelancer, FreelancerDetail } from '@/types/freelancer';

export interface FreelancerListResponse {
  success: boolean;
  data?: {
    freelancers: Freelancer[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  error?: string;
  message?: string;
  details?: string;
}

export interface FreelancerDetailResponse {
  success: boolean;
  data?: FreelancerDetail;
  error?: string;
}

export interface ContactFreelancerDto {
  subject: string;
  message: string;
  projectId?: string;
}

export interface FreelancerSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  type?: string;
  experience?: string;
  skills?: string[];
  sortBy?: 'rating' | 'experience' | 'viewCount' | 'projectCount' | 'hourlyRateHigh' | 'hourlyRateLow' | 'recentActivity';
  sortOrder?: 'asc' | 'desc';
  rating?: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  projectCount?: number;
  availability?: string;
}

class FreelancerService {
  /**
   * Get list of freelancers with optional filters
   */
  async getFreelancers(params?: FreelancerSearchParams): Promise<FreelancerListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('limit', params.pageSize.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.category) queryParams.append('category', params.category);
        if (params.type) queryParams.append('type', params.type);
        if (params.experience) queryParams.append('experience', params.experience);
        if (params.skills && params.skills.length > 0) {
          queryParams.append('skills', params.skills.join(','));
        }
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        if (params.rating) queryParams.append('rating', params.rating.toString());
        if (params.hourlyRateMin) queryParams.append('hourlyRateMin', params.hourlyRateMin.toString());
        if (params.hourlyRateMax) queryParams.append('hourlyRateMax', params.hourlyRateMax.toString());
        if (params.projectCount) queryParams.append('projectCount', params.projectCount.toString());
        if (params.availability) queryParams.append('availability', params.availability);
      }

      const url = `/api/freelancers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('Requesting freelancers from:', url);
      console.log('Full API URL will be:', `${api.defaults.baseURL}${url}`);
      
      const response = await api.get<FreelancerListResponse>(url);
      console.log('Freelancer API raw response:', response);
      
      // Transform backend data to match frontend expectations
      if (response.data.success && response.data.data && response.data.data.freelancers) {
        // 원본 데이터 확인을 위한 로그
        if (response.data.data.freelancers.length > 0) {
          console.log('Raw freelancer data from backend:', response.data.data.freelancers[0]);
          console.log('viewCount in raw data:', response.data.data.freelancers[0].viewCount);
          console.log('projectCount in raw data:', response.data.data.freelancers[0].projectCount);
        }
        
        response.data.data.freelancers = response.data.data.freelancers.map((freelancer: any) => ({
          ...freelancer,
          name: freelancer.userFullName || freelancer.name || '이름 없음',
          experience: freelancer.experienceYears ? `${freelancer.experienceYears}년` : freelancer.experience || '경력 미입력',
          skills: typeof freelancer.skills === 'string' ? 
            (() => {
              try {
                return JSON.parse(freelancer.skills);
              } catch (e) {
                console.warn('Failed to parse skills JSON:', freelancer.skills);
                return [];
              }
            })() : 
            (Array.isArray(freelancer.skills) ? freelancer.skills : []),
          // viewCount와 projectCount 필드 확실히 포함
          viewCount: freelancer.viewCount || 0,
          projectCount: freelancer.projectCount || 0
        }));
        console.log('Transformed freelancer data:', response.data.data.freelancers[0]);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch freelancers:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // 서버 에러인 경우 더 자세한 정보 제공
      if (error.response?.status === 500) {
        return {
          success: false,
          error: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          details: error.response?.data?.message || 'Internal Server Error'
        };
      }
      
      // 네트워크 에러인 경우
      if (error.code === 'ERR_NETWORK' || !error.response) {
        return {
          success: false,
          error: '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.',
          details: error.message
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch freelancers'
      };
    }
  }

  /**
   * Get freelancer by ID
   */
  async getFreelancerById(id: string): Promise<FreelancerDetailResponse> {
    try {
      const response = await api.get<FreelancerDetailResponse>(`/api/freelancers/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch freelancer ${id}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch freelancer details'
      };
    }
  }

  /**
   * Update freelancer view count
   */
  async incrementViewCount(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.post(`/api/freelancers/${id}/view`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to increment view count for freelancer ${id}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update view count'
      };
    }
  }

  /**
   * Get available skills for freelancers
   */
  async getSkills(): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      const response = await api.get('/api/freelancers/skills');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch skills:', error);
      
      // 에러 시 기본 스킬 목록 반환
      const defaultSkills = [
        'React', 'Node.js', 'Python', 'Java', 'TypeScript',
        'React Native', 'Flutter', 'AWS', 'Docker', 'Spring',
        'Django', 'PHP', 'JavaScript', 'Vue.js', 'Angular',
        'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL'
      ];
      
      return {
        success: true,
        data: defaultSkills,
        error: 'API 연결 실패로 기본 스킬 목록을 사용합니다.'
      };
    }
  }

  /**
   * Get freelancer detail with portfolio, reviews, etc.
   */
  async getFreelancerDetail(id: string): Promise<FreelancerDetailResponse> {
    try {
      const response = await api.get<FreelancerDetailResponse>(`/api/freelancers/${id}/detail`);
      
      // Transform backend data to match frontend expectations
      if (response.data.success && response.data.data) {
        const freelancer = response.data.data;
        
        // Parse JSON fields if they come as strings
        if (typeof freelancer.skills === 'string') {
          try {
            freelancer.skills = JSON.parse(freelancer.skills);
          } catch (e) {
            console.warn('Failed to parse skills JSON:', freelancer.skills);
            freelancer.skills = [];
          }
        }
        
        if (typeof freelancer.techStack === 'string') {
          try {
            freelancer.techStack = JSON.parse(freelancer.techStack);
          } catch (e) {
            console.warn('Failed to parse techStack JSON:', freelancer.techStack);
            freelancer.techStack = [];
          }
        }
        
        if (typeof freelancer.certificates === 'string') {
          try {
            freelancer.certificates = JSON.parse(freelancer.certificates);
          } catch (e) {
            console.warn('Failed to parse certificates JSON:', freelancer.certificates);
            freelancer.certificates = [];
          }
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch freelancer detail ${id}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch freelancer details'
      };
    }
  }

  /**
   * Toggle bookmark for freelancer
   */
  async toggleBookmark(id: string): Promise<{ success: boolean; data?: { bookmarked: boolean }; error?: string }> {
    try {
      const response = await api.post(`/api/freelancers/${id}/bookmark`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to toggle bookmark for freelancer ${id}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to toggle bookmark'
      };
    }
  }

  /**
   * Contact freelancer
   */
  async contactFreelancer(id: string, data: ContactFreelancerDto): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.post(`/api/freelancers/${id}/contact`, data);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to contact freelancer ${id}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message'
      };
    }
  }

  /**
   * Get similar freelancers
   */
  async getSimilarFreelancers(id: string, limit: number = 6): Promise<FreelancerListResponse> {
    try {
      const response = await api.get(`/api/freelancers/${id}/similar?limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error(`Failed to fetch similar freelancers for ${id}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch similar freelancers'
      };
    }
  }

  /**
   * Rate freelancer
   */
  async rateFreelancer(id: string, rating: number, review?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await api.post(`/api/freelancers/${id}/rate`, { rating, review });
      return response.data;
    } catch (error: any) {
      console.error(`Failed to rate freelancer ${id}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to submit rating'
      };
    }
  }
}

export const freelancerService = new FreelancerService();