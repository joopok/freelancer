import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { Project, ProjectDetail } from '@/types/project';
import axios, { AxiosError } from 'axios';

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface ProjectListResponse {
  projects: Project[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// 프로젝트 목록 조회 파라미터
export interface ProjectSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  projectType?: string;
  workType?: string;
  location?: string;
  experienceLevel?: string;
  skills?: string[];
  minBudget?: number;
  maxBudget?: number;
  categoryId?: number;
  urgentOnly?: boolean;
  featuredOnly?: boolean;
  deadlineWithin?: number;
  sortBy?: string;
  fastMode?: boolean;
}

// 목업 프로젝트 데이터 생성 함수
const createMockProjects = (page: number, limit: number): Project[] => {
  const projects: Project[] = [];
  const startIndex = (page - 1) * limit;
  
  const mockData = [
    {
      title: "AI 기반 고객 데이터 분석 플랫폼 개발",
      company: { name: "(주)테크이노베이션", logo: undefined },
      companyName: "(주)테크이노베이션",
      skills: ["React", "TypeScript", "Node.js", "Python", "TensorFlow", "AWS"],
      duration: "3개월",
      budget: "5,000만원",
      deadline: "D-7",
      type: "상주",
      description: "머신러닝과 AI 기술을 활용한 고객 데이터 분석 플랫폼 개발",
      level: "중급",
      category: "AI/ML",
      location: "서울특별시 강남구",
      applicants: 23,
      views: 456,
      isUrgent: true,
      isRemote: true
    },
    {
      title: "전자상거래 플랫폼 프론트엔드 개발",
      company: { name: "(주)쇼핑몰테크", logo: undefined },
      companyName: "(주)쇼핑몰테크",
      skills: ["React", "Next.js", "TypeScript", "Redux", "Styled Components"],
      duration: "4개월",
      budget: "4,000만원",
      deadline: "D-14",
      type: "상주",
      description: "대규모 전자상거래 플랫폼의 사용자 인터페이스 개발",
      level: "고급",
      category: "웹개발",
      location: "서울특별시 서초구",
      applicants: 18,
      views: 320,
      isUrgent: false,
      isRemote: true
    },
    {
      title: "모바일 뱅킹 앱 개발",
      company: { name: "(주)핀테크솔루션", logo: undefined },
      companyName: "(주)핀테크솔루션",
      skills: ["Flutter", "Dart", "Firebase", "REST API", "Git"],
      duration: "6개월",
      budget: "8,000만원",
      deadline: "D-21",
      type: "상주",
      description: "보안이 강화된 모바일 뱅킹 애플리케이션 개발",
      level: "고급",
      category: "앱개발",
      location: "서울특별시 중구",
      applicants: 31,
      views: 580,
      isUrgent: true,
      isRemote: false
    },
    {
      title: "클라우드 인프라 구축 및 운영",
      company: { name: "(주)클라우드시스템", logo: undefined },
      companyName: "(주)클라우드시스템",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"],
      duration: "5개월",
      budget: "7,000만원",
      deadline: "D-30",
      type: "상주",
      description: "마이크로서비스 아키텍처 기반 클라우드 인프라 구축",
      level: "고급",
      category: "시스템",
      location: "경기도 성남시",
      applicants: 12,
      views: 240,
      isUrgent: false,
      isRemote: true
    },
    {
      title: "빅데이터 분석 시스템 개발",
      company: { name: "(주)데이터인사이트", logo: undefined },
      companyName: "(주)데이터인사이트",
      skills: ["Python", "Apache Spark", "Kafka", "Elasticsearch", "Tableau"],
      duration: "4개월",
      budget: "6,000만원",
      deadline: "D-45",
      type: "상주",
      description: "실시간 빅데이터 수집, 처리 및 분석 시스템 구축",
      level: "중급",
      category: "데이터",
      location: "서울특별시 마포구",
      applicants: 27,
      views: 410,
      isUrgent: false,
      isRemote: true
    }
  ];

  for (let i = 0; i < limit; i++) {
    const dataIndex = (startIndex + i) % mockData.length;
    const mockProject = mockData[dataIndex];
    
    projects.push({
      id: startIndex + i + 1,
      ...mockProject,
      requiredSkills: mockProject.skills,
      preferredSkills: mockProject.skills
    });
  }
  
  return projects;
};

// 프로젝트 목록 조회 Hook
export const useProjects = (params: ProjectSearchParams = {}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true); // 초기값을 true로 변경
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const queryParams = new URLSearchParams();

    try {
      
      // 페이징 파라미터 (Spring Boot는 1-based index 사용 중)
      queryParams.append('page', String(params.page || 1));
      queryParams.append('limit', String(params.limit || 10));
      
      // 검색 파라미터
      if (params.search) queryParams.append('search', params.search);
      if (params.projectType) queryParams.append('projectType', params.projectType);
      if (params.workType) queryParams.append('workType', params.workType);
      if (params.location) queryParams.append('location', params.location);
      if (params.experienceLevel) queryParams.append('experienceLevel', params.experienceLevel);
      if (params.skills && params.skills.length > 0) {
        params.skills.forEach(skill => queryParams.append('skills', skill));
      }
      if (params.minBudget) queryParams.append('minBudget', String(params.minBudget));
      if (params.maxBudget) queryParams.append('maxBudget', String(params.maxBudget));
      if (params.categoryId) queryParams.append('categoryId', String(params.categoryId));
      if (params.urgentOnly) queryParams.append('urgentOnly', String(params.urgentOnly));
      if (params.featuredOnly) queryParams.append('featuredOnly', String(params.featuredOnly));
      if (params.deadlineWithin) queryParams.append('deadlineWithin', String(params.deadlineWithin));
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.fastMode !== undefined) queryParams.append('fastMode', String(params.fastMode));

      // API 호출 로그 - 프로덕션에서는 주석 처리
      if (process.env.NODE_ENV === 'development') {
        // Request params
      }

      // Mock API 사용 여부 확인
      const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
      
      let response;
      if (useMockApi) {
        // 목업 데이터 반환
        response = {
          data: {
            success: true,
            data: {
              projects: createMockProjects(params.page || 1, params.limit || 10),
              totalCount: 50,
              totalPages: 5,
              currentPage: params.page || 1
            }
          }
        };
      } else {
        response = await axiosInstance.get(
          `/api/projects?${queryParams.toString()}`
        );
      }
      
      // API 응답 처리 - success 필드 없이 직접 데이터를 반환하는 경우도 처리
      let data = response.data;
      let newProjects: Project[];
      let totalElements: number;
      let totalPages: number;
      let currentPage: number;
      
      // 응답이 ApiResponse 형식인 경우
      if (data && data.success !== undefined) {
        if (data.success && data.data) {
          data = data.data;
        } else {
          // API 응답이 실패인 경우
          throw new Error(data.message || '프로젝트 목록을 불러오는데 실패했습니다.');
        }
      }
      
      // Spring Boot Page 객체 형식 처리
      if ('projects' in data && Array.isArray(data.projects)) {
        // 서버에서 반환하는 형식
        newProjects = data.projects || [];
        totalElements = data.totalCount || 0;
        totalPages = data.totalPages || 0;
        currentPage = data.currentPage || 1;
      } else if ('content' in data && Array.isArray(data.content)) {
        newProjects = data.content || [];
        totalElements = data.totalElements || 0;
        totalPages = data.totalPages || 0;
        currentPage = data.number || 0;
      } else if (Array.isArray(data)) {
        // 단순 배열 형식
        newProjects = data;
        totalElements = newProjects.length;
        totalPages = 1;
        currentPage = 0;
      } else {
        newProjects = [];
        totalElements = 0;
        totalPages = 0;
        currentPage = 0;
      }
      
      // Parse skills from requiredSkills JSON string
      
      newProjects = newProjects.map(project => {
        // 프로젝트 데이터 복사 (원본 수정 방지)
        const processedProject = { ...project };
        
        // skills 파싱 및 병합
        const allSkills: string[] = [];
        
        // requiredSkills 파싱 (JSON 문자열인 경우)
        if (processedProject.requiredSkills) {
          if (typeof processedProject.requiredSkills === 'string') {
            try {
              const parsed = JSON.parse(processedProject.requiredSkills);
              if (Array.isArray(parsed)) {
                allSkills.push(...parsed);
                processedProject.requiredSkills = parsed;
              }
            } catch (e) {
              // Failed to parse requiredSkills
              processedProject.requiredSkills = [];
            }
          } else if (Array.isArray(processedProject.requiredSkills)) {
            allSkills.push(...processedProject.requiredSkills);
          }
        }
        
        // preferredSkills 파싱 (JSON 문자열인 경우)
        if (processedProject.preferredSkills) {
          if (typeof processedProject.preferredSkills === 'string') {
            try {
              const parsed = JSON.parse(processedProject.preferredSkills);
              if (Array.isArray(parsed)) {
                allSkills.push(...parsed);
                processedProject.preferredSkills = parsed;
              }
            } catch (e) {
              // Failed to parse preferredSkills
              processedProject.preferredSkills = [];
            }
          } else if (Array.isArray(processedProject.preferredSkills)) {
            allSkills.push(...processedProject.preferredSkills);
          }
        }
        
        processedProject.skills = Array.from(new Set(allSkills)); // 중복 제거
        
        // company 객체 생성 (ProjectCard 컴포넌트 호환성을 위해)
        if (!processedProject.company && processedProject.companyName) {
          processedProject.company = {
            name: processedProject.companyName,
            logo: processedProject.companyLogo
          };
        }
        
        return processedProject;
      });
      
        // 페이지가 1보다 크면 기존 프로젝트에 추가, 아니면 새로 설정
        if ((params.page || 1) > 1) {
          setProjects(prev => [...prev, ...newProjects]);
        } else {
          setProjects(newProjects);
        }
        
        setTotalCount(totalElements);
        // currentPage는 1-based이므로 totalPages와 직접 비교
        setHasMore(currentPage < totalPages);
        
    } catch (err) {
      const axiosError = err as AxiosError<any>;
      let errorMessage = '프로젝트 목록을 불러오는데 실패했습니다.';
      
      const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
      
      if (useMockApi) {
        // 목업 모드에서는 에러가 발생하지 않도록 빈 데이터 반환
        setProjects([]);
        setTotalCount(0);
        setHasMore(false);
        // Mock API mode: Error occurred but returning empty data
        return;
      } else {
        errorMessage = axiosError.response?.data?.message || axiosError.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    totalCount,
    hasMore,
    refetch: fetchProjects
  };
};

// Mock 프로젝트 상세 데이터 생성 함수
const createMockProjectDetail = (id: string | number): ProjectDetail => {
  const mockDetails: Record<string, Partial<ProjectDetail>> = {
    '1': {
      title: "AI 기반 고객 데이터 분석 플랫폼 개발",
      companyName: "(주)테크이노베이션",
      description: "머신러닝과 AI 기술을 활용한 고객 데이터 분석 플랫폼을 개발합니다. 대규모 데이터를 실시간으로 처리하고 인사이트를 도출하는 시스템 구축이 목표입니다.",
      detailedDescription: "본 프로젝트는 AI와 빅데이터 기술을 활용하여 고객 행동 패턴을 분석하고 예측하는 플랫폼을 구축하는 것입니다.\n\n주요 개발 내용:\n- 실시간 데이터 수집 및 처리 파이프라인 구축\n- 머신러닝 모델 개발 및 학습\n- 시각화 대시보드 개발\n- RESTful API 설계 및 구현",
      skills: ["React", "TypeScript", "Node.js", "Python", "TensorFlow", "AWS"],
      requiredSkills: ["React", "TypeScript", "Python", "TensorFlow"],
      preferredSkills: ["AWS", "Docker", "Kubernetes", "GraphQL"],
      responsibilities: [
        "AI 모델 개발 및 최적화",
        "데이터 파이프라인 구축",
        "프론트엔드 대시보드 개발",
        "API 설계 및 구현"
      ],
      requirements: [
        "React/TypeScript 3년 이상 경험",
        "Python 기반 ML 프로젝트 경험",
        "대용량 데이터 처리 경험"
      ],
      workingConditions: {
        workingHours: "09:00 ~ 18:00",
        workingDays: "월요일 ~ 금요일",
        overtime: "필요시 협의",
        remote: true,
        dress_code: "자유 복장",
        equipment_provided: true
      },
      additionalBenefits: [
        "스톡옵션 제공",
        "점심 식사 제공",
        "자기계발비 지원",
        "건강검진 지원"
      ]
    },
    '2': {
      title: "전자상거래 플랫폼 프론트엔드 개발",
      companyName: "(주)쇼핑몰테크",
      description: "대규모 전자상거래 플랫폼의 사용자 인터페이스를 개발합니다.",
      skills: ["React", "Next.js", "TypeScript", "Redux", "Styled Components"],
      workingConditions: {
        workingHours: "09:00 ~ 18:00",
        workingDays: "월요일 ~ 금요일",
        overtime: "없음",
        remote: true,
        dress_code: "비즈니스 캐주얼",
        equipment_provided: true
      }
    }
  };

  const baseDetail: ProjectDetail = {
    id: Number(id),
    title: "프로젝트 제목",
    company: { 
      name: "회사명",
      logo: undefined
    },
    companyName: "회사명",
    companyInfo: {
      name: "회사명",
      industry: "IT/소프트웨어",
      size: "중견기업",
      founded: "2015년",
      employees: "100-500명",
      description: "혁신적인 기술로 세상을 변화시키는 기업입니다."
    },
    description: "프로젝트 설명",
    detailedDescription: "상세 프로젝트 설명",
    skills: ["React", "TypeScript"],
    requiredSkills: ["React"],
    preferredSkills: ["TypeScript"],
    duration: "3개월",
    budget: "5,000만원",
    budgetMin: 40000000,
    budgetMax: 60000000,
    deadline: "2024-03-31",
    startDate: "2024-01-01",
    type: "상주",
    workType: "상주",
    projectType: "contract",
    location: "서울특별시 강남구",
    experienceLevel: "mid",
    level: "중급",
    category: "웹개발",
    applicants: 15,
    applicationsCount: 15,
    views: 234,
    isUrgent: false,
    isRemote: true,
    isFeatured: false,
    teamSize: "5",
    responsibilities: ["프론트엔드 개발", "UI/UX 구현"],
    requirements: ["React 2년 이상 경험"],
    workingConditions: {
      workingHours: "09:00 ~ 18:00",
      workingDays: "월요일 ~ 금요일",
      overtime: "없음",
      remote: false,
      dress_code: "자유 복장",
      equipment_provided: true
    },
    additionalBenefits: ["점심 제공", "교통비 지원"],
    contactPerson: {
      name: "김담당",
      position: "프로젝트 매니저",
      email: "contact@company.com",
      phone: "02-1234-5678"
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // ID에 해당하는 mock 데이터가 있으면 병합
  const specificMock = mockDetails[String(id)];
  if (specificMock) {
    return { ...baseDetail, ...specificMock } as ProjectDetail;
  }

  // 없으면 기본 데이터에 ID만 반영
  return { ...baseDetail, title: `프로젝트 #${id}` };
};

// 프로젝트 상세 조회 Hook
export const useProjectDetail = (id: string | number) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Mock API 사용 여부 확인
        const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
        
        // useProjectDetail - Mock API 사용
        // useProjectDetail - Project ID

        if (useMockApi) {
          // Mock 데이터 반환
          setTimeout(() => {
            const mockProject = createMockProjectDetail(id);
            setProject(mockProject);
            setLoading(false);
          }, 500); // 실제 API 호출처럼 약간의 지연 추가
          return;
        }

        const response = await axiosInstance.get<ApiResponse<ProjectDetail>>(
          `/api/projects/${id}`
        );

        // 다양한 응답 형식 처리
        let projectData: ProjectDetail | null = null;
        
        // 1. success 필드가 있는 경우
        if (response.data && typeof response.data === 'object' && 'success' in response.data) {
          if (response.data.success && response.data.data) {
            projectData = response.data.data;
          } else {
            throw new Error(response.data.message || '프로젝트 정보를 불러오는데 실패했습니다.');
          }
        } 
        // 2. 직접 데이터가 반환되는 경우
        else if (response.data && typeof response.data === 'object' && 'id' in response.data) {
          projectData = response.data as any;
        }
        // 3. data 필드 안에 실제 데이터가 있는 경우
        else if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          projectData = (response.data as any).data;
        }

        if (projectData) {
          // requiredSkills가 JSON 문자열인 경우 파싱
          if (typeof projectData.requiredSkills === 'string') {
            try {
              projectData.requiredSkills = JSON.parse(projectData.requiredSkills);
            } catch (e) {
              // Failed to parse requiredSkills
              projectData.requiredSkills = [];
            }
          }

          // preferredSkills가 JSON 문자열인 경우 파싱
          if (typeof projectData.preferredSkills === 'string') {
            try {
              projectData.preferredSkills = JSON.parse(projectData.preferredSkills);
            } catch (e) {
              // Failed to parse preferredSkills
              projectData.preferredSkills = [];
            }
          }

          // skills 배열 처리
          if (!projectData.skills && (projectData.requiredSkills || projectData.preferredSkills)) {
            const allSkills: string[] = [];
            if (Array.isArray(projectData.requiredSkills)) {
              allSkills.push(...projectData.requiredSkills);
            }
            if (Array.isArray(projectData.preferredSkills)) {
              allSkills.push(...projectData.preferredSkills);
            }
            projectData.skills = Array.from(new Set(allSkills));
          }

          // company 객체 생성 (호환성을 위해)
          if (!projectData.company && projectData.companyName) {
            projectData.company = {
              name: projectData.companyName,
              logo: projectData.companyLogo
            };
          }

          // 필수 필드 기본값 설정
          projectData = {
            ...projectData,
            duration: projectData.duration || '협의',
            budget: projectData.budget || (projectData.budgetMin && projectData.budgetMax 
              ? `${(projectData.budgetMin / 10000).toFixed(0)}~${(projectData.budgetMax / 10000).toFixed(0)}만원`
              : '협의'),
            teamSize: projectData.teamSize || "1",
            deadline: projectData.deadline || '협의',
            type: projectData.type || projectData.workType || '상주',
            applicants: projectData.applicants || projectData.applications || projectData.applicationsCount || 0,
            views: projectData.views || 0,
            isRemote: projectData.isRemote || projectData.workType === 'remote' || projectData.workType === 'hybrid'
          };

          // Project detail loaded
          setProject(projectData);
        } else {
          throw new Error('프로젝트 데이터를 찾을 수 없습니다.');
        }
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message 
          : '프로젝트 정보를 불러오는데 실패했습니다.';
        setError(errorMessage);
        if (process.env.NODE_ENV === 'development') {
          // Error fetching project detail
        }
      } finally {
        // 렌더링이 완료될 때까지 약간의 지연을 추가
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setLoading(false);
          });
        });
      }
    };

    fetchProjectDetail();
  }, [id]);

  return { project, loading, error };
};

// 프로젝트 지원하기 Hook
export const useProjectApply = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyToProject = async (projectId: string | number, applicationData: {
    coverLetter: string;
    proposedBudget?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<ApiResponse<null>>(
        `/api/projects/${projectId}/apply`,
        applicationData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || '프로젝트 지원에 실패했습니다.');
      }

      return true;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : '프로젝트 지원에 실패했습니다.';
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        // Error applying to project
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { applyToProject, loading, error };
};

// 북마크 토글 Hook
export const useProjectBookmark = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleBookmark = async (projectId: string | number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<ApiResponse<{ isBookmarked: boolean }>>(
        `/api/projects/${projectId}/bookmark`,
        {}
      );

      if (response.data.success) {
        return response.data.data.isBookmarked;
      } else {
        throw new Error(response.data.message || '북마크 처리에 실패했습니다.');
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : '북마크 처리에 실패했습니다.';
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        // Error toggling bookmark
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { toggleBookmark, loading, error };
};

// 관련 프로젝트 조회 Hook
export const useRelatedProjects = (projectId: string | number, limit = 6) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProjects = async () => {
      if (!projectId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get<ApiResponse<Project[]>>(
          `/api/projects/${projectId}/related?limit=${limit}`
        );

        if (response.data.success) {
          setProjects(response.data.data);
        } else {
          throw new Error(response.data.message || '관련 프로젝트를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message 
          : '관련 프로젝트를 불러오는데 실패했습니다.';
        setError(errorMessage);
        if (process.env.NODE_ENV === 'development') {
          // Error fetching related projects
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProjects();
  }, [projectId, limit]);

  return { projects, loading, error };
};