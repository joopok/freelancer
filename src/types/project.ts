/**
 * Project 관련 TypeScript 인터페이스 정의
 * Spring Boot 엔티티와 DTO를 기반으로 생성됨
 */

/**
 * Project 엔티티 인터페이스
 * @interface Project
 */
export interface Project {
  // 기본 정보
  id: string | number;
  companyId?: number;
  clientId?: number;
  categoryId?: number;
  category?: string;
  title: string;
  description: string;
  
  // 프로젝트 타입 정보
  projectType?: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship' | string;
  budgetType?: 'fixed' | 'hourly' | 'negotiable';
  workType?: 'remote' | 'onsite' | 'hybrid' | string;
  location?: string;
  
  // 예산 정보
  budgetMin?: number;
  budgetMax?: number;
  budget?: string; // 포맷된 예산 문자열 (예: "3,000만원")
  
  // 일정 정보
  duration?: string;
  startDate?: string; // ISO 8601 format (YYYY-MM-DD)
  deadline?: string; // ISO 8601 format (YYYY-MM-DD)
  
  // 스킬 및 경험 요구사항
  requiredSkills?: string[]; // JSON string
  preferredSkills?: string[]; // JSON string
  skills?: string[]; // 파싱된 스킬 배열
  experienceYears?: number;
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'expert' | string;
  level?: string; // 레거시 호환
  
  // 상태 정보
  status?: 'draft' | 'active' | 'in_progress' | 'closed' | 'completed' | 'cancelled';
  views?: number;
  applications?: number;
  applicationsCount?: number;
  applicants?: number; // 레거시 호환
  isFeatured?: boolean;
  isUrgent?: boolean;
  
  // 시간 정보
  createdAt?: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
  updatedAt?: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss)
  
  // Join된 정보
  company?: CompanyInfo | string; // 레거시 호환 및 객체 지원
  companyName?: string;
  companyLogo?: string;
  clientName?: string;
  categoryName?: string;
  
  // 추가 정보
  isBookmarked?: boolean;
  hasApplied?: boolean;
  bookmarkCount?: number;
  type?: string; // 레거시 호환
  isRemote?: boolean; // 레거시 호환
  teamSize?: number;
}

/**
 * Project 생성/수정용 DTO 인터페이스
 * @interface ProjectDto
 */
export interface ProjectDto {
  companyId?: number;
  clientId?: number;
  categoryId?: number;
  category?: string;
  title: string;
  description: string;
  projectType?: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
  budgetType?: 'fixed' | 'hourly' | 'negotiable';
  workType?: 'remote' | 'onsite' | 'hybrid';
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  duration?: string;
  startDate?: string;
  deadline?: string;
  requiredSkills?: string;
  preferredSkills?: string;
  experienceYears?: number;
  experienceLevel?: 'junior' | 'mid' | 'senior' | 'expert';
  status?: 'draft' | 'active' | 'in_progress' | 'closed' | 'completed' | 'cancelled';
  isFeatured?: boolean;
  isUrgent?: boolean;
}

/**
 * 프로젝트 지원 요청 DTO
 * @interface ProjectApplicationRequest
 */
export interface ProjectApplicationRequest {
  projectId: number; // @NotNull - 필수
  coverLetter?: string; // @Size(max = 5000) - 최대 5000자
  proposedBudget?: number;
}

/**
 * 프로젝트 상세 정보 (디테일 페이지용)
 */
export interface ProjectDetail extends Project {
  detailedDescription?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  workEnvironment?: string;
  applicationDeadline?: string;
  contactPerson?: ContactPerson;
  projectStages?: ProjectStage[];
  companyInfo?: CompanyInfo;
  workingConditions?: WorkingConditions;
  evaluationCriteria?: string[];
  submissionGuidelines?: string[];
  additionalBenefits?: string[];
}

/**
 * 회사 정보
 */
export interface CompanyInfo {
  name: string;
  logo?: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  description?: string;
  founded?: string;
  employees?: string;
  ceo?: string;
}

/**
 * 프로젝트 단계
 */
export interface ProjectStage {
  id: string;
  name: string;
  description: string;
  duration: string;
  deliverables: string[];
}

/**
 * 담당자 정보
 */
export interface ContactPerson {
  name: string;
  position: string;
  email: string;
  phone?: string;
  responseTime?: string;
}

/**
 * 근무 조건
 */
export interface WorkingConditions {
  workingHours?: string;
  workingDays?: string;
  overtime?: string;
  remote?: boolean;
  location?: string;
  equipment_provided?: boolean;
  dress_code?: string;
}

/**
 * 활성 프로젝트 (대시보드용)
 */
export interface ActiveProject {
  id: string;
  title: string;
  status: string;
  progress: number;
  nextMilestone: string;
  daysLeft: number;
}

/**
 * 프로젝트 리뷰
 */
export interface ProjectReview {
  id: string;
  projectId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/**
 * 지원자 정보
 */
export interface Applicant {
  id: string;
  name: string;
  title: string;
  rating: number;
  skills: string[];
  experience: string;
  proposedBudget?: string;
  coverLetter?: string;
  appliedAt: string;
  avatar?: string;
}

/**
 * 스킬 배열 타입 (requiredSkills, preferredSkills JSON 파싱 후 사용)
 */
export type SkillArray = string[];

/**
 * 프로젝트 타입 enum
 */
export enum ProjectType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship'
}

/**
 * 예산 타입 enum
 */
export enum BudgetType {
  FIXED = 'fixed',
  HOURLY = 'hourly',
  NEGOTIABLE = 'negotiable'
}

/**
 * 근무 형태 enum
 */
export enum WorkType {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid'
}

/**
 * 경험 레벨 enum
 */
export enum ExperienceLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  EXPERT = 'expert'
}

/**
 * 프로젝트 상태 enum
 */
export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * 유틸리티 타입: 부분 업데이트용
 */
export type PartialProject = Partial<Project>;

/**
 * 유틸리티 타입: 프로젝트 목록 조회 응답
 */
export interface ProjectListResponse {
  content: Project[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
}

/**
 * 유틸리티 타입: 프로젝트 필터
 */
export interface ProjectFilter {
  categoryId?: number;
  projectType?: ProjectType | string;
  budgetType?: BudgetType;
  workType?: WorkType | string;
  experienceLevel?: ExperienceLevel | string;
  status?: ProjectStatus;
  budgetMin?: number;
  budgetMax?: number;
  keyword?: string;
  companyId?: number;
  clientId?: number;
  skills?: string[];
  location?: string;
}

/**
 * 스킬 파싱 헬퍼 함수
 */
export const parseSkills = (skillsJson: string | string[] | undefined): string[] => {
  if (!skillsJson) return [];
  if (Array.isArray(skillsJson)) return skillsJson;
  try {
    return JSON.parse(skillsJson) as string[];
  } catch {
    return [];
  }
};

/**
 * 날짜 포맷 헬퍼 함수
 */
export const formatDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * 예산 포맷 헬퍼 함수
 */
export const formatBudget = (min?: number, max?: number): string => {
  if (!min && !max) return '협의';
  if (min && max) {
    if (min === max) return `${(min / 10000).toFixed(0)}만원`;
    return `${(min / 10000).toFixed(0)}~${(max / 10000).toFixed(0)}만원`;
  }
  if (min) return `${(min / 10000).toFixed(0)}만원 이상`;
  if (max) return `${(max / 10000).toFixed(0)}만원 이하`;
  return '협의';
};