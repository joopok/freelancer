/**
 * Database Schema TypeScript Interfaces
 * Generated from: jobtracker database schema
 * Version: 2.0 (통합버전)
 * Created: 2025-01-02
 */

// =====================================================
// 1. Users Table Interface
// =====================================================
export interface DatabaseUser {
  id: number;
  username: string; // 로그인ID
  email: string;
  password: string; // 비밀번호 (BCrypt) - 새 스키마
  password_hash?: string; // 비밀번호 (BCrypt) - 레거시 호환
  name: string; // 사용자명 - 새 스키마
  full_name?: string; // 사용자명 - 레거시 호환
  phone?: string | null; // 전화번호
  profile_image?: string | null; // 프로필 이미지 URL
  role: 'USER' | 'ADMIN' | 'PM' | 'DEVELOPER' | 'freelancer' | 'client' | 'admin' | 'user'; // 역할
  status?: 'active' | 'inactive' | 'suspended' | 'deleted'; // 계정 상태
  bio?: string | null; // 자기소개
  location?: string | null; // 지역
  website?: string | null; // 개인 웹사이트
  is_active?: boolean; // 활성 상태
  email_verified?: boolean; // 이메일 인증 여부
  last_login?: Date | null; // 마지막 로그인 시간
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 2. Categories Table Interface
// =====================================================
export interface DatabaseCategory {
  id: number;
  parent_id?: number | null; // 상위 카테고리 ID
  name: string; // 카테고리명
  slug: string; // URL 슬러그
  description?: string | null; // 설명
  icon?: string | null; // 아이콘 클래스명
  display_order?: number; // 표시 순서
  is_active?: boolean; // 활성 상태
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 3. Companies Table Interface
// =====================================================
export interface DatabaseCompany {
  id: number;
  user_id: number; // 사용자 ID
  company_name: string; // 회사명
  name?: string; // 회사명 별칭 (GENERATED)
  business_number?: string | null; // 사업자등록번호
  ceo_name?: string | null; // 대표자명
  description?: string | null; // 회사 소개
  industry?: string | null; // 업종
  company_size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise' | null; // 회사 규모
  employee_count?: string | null; // 직원수
  founded_year?: number | null; // 설립연도
  website?: string | null; // 웹사이트
  location?: string | null; // 회사 위치
  address?: string | null; // 주소
  logo_url?: string | null; // 로고 URL
  cover_image?: string | null; // 커버 이미지 URL
  is_verified?: boolean; // 인증 여부
  status?: 'active' | 'inactive' | 'suspended'; // 회사 상태
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 4. Freelancers Table Interface
// =====================================================
export interface DatabaseFreelancer {
  id: number;
  user_id: number; // 사용자 ID
  title: string; // 전문 분야/직함
  description?: string | null; // 상세 소개
  skills?: string | null; // 보유 기술 (JSON 배열)
  experience_years?: number; // 경력 년수
  experience_level: 'junior' | 'mid' | 'senior' | 'expert'; // 경력 수준
  hourly_rate?: number | null; // 시급 (원)
  availability?: 'available' | 'busy' | 'not_available' | 'unavailable'; // 활동 상태
  work_preference?: 'remote' | 'onsite' | 'hybrid' | 'all'; // 근무 선호도
  preferred_work_type?: string; // 근무 선호도 별칭 (GENERATED)
  rating?: number; // 평점
  total_reviews?: number; // 리뷰 수
  total_projects?: number; // 완료 프로젝트 수
  completed_projects?: number; // 완료 프로젝트 수 별칭 (GENERATED)
  portfolio_url?: string | null; // 포트폴리오 URL
  github_url?: string | null; // GitHub URL
  linkedin_url?: string | null; // LinkedIn URL
  bio?: string | null; // 자기소개
  is_verified?: boolean; // 인증 여부
  verification_date?: Date | null; // 인증 날짜
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 5. Projects Table Interface
// =====================================================
export interface DatabaseProject {
  id: number;
  company_id?: number | null; // 회사 ID
  client_id?: number | null; // 프로젝트 등록 사용자
  category_id?: number | null; // 카테고리 ID
  category?: string | null; // 프로젝트 카테고리
  title: string; // 프로젝트명
  description: string; // 상세 설명
  project_type?: 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship' | null; // 프로젝트 유형
  budget_type?: 'fixed' | 'hourly' | 'negotiable'; // 예산 타입
  work_type?: 'remote' | 'onsite' | 'hybrid'; // 근무 형태
  type?: 'remote' | 'onsite' | 'hybrid'; // 근무 형태 - 레거시 호환
  location?: string | null; // 근무 지역
  budget_min?: number | null; // 최소 예산/연봉
  budget_max?: number | null; // 최대 예산/연봉
  budget?: string | null; // 예산 - 레거시 호환
  duration?: string | null; // 프로젝트 기간
  start_date?: Date | null; // 시작 예정일
  deadline?: Date | string | null; // 마감일
  required_skills?: string | null; // 필수 기술 (JSON 배열)
  skills?: string | null; // 기술 - 레거시 호환
  preferred_skills?: string | null; // 우대 기술 (JSON 배열)
  experience_years?: number; // 요구 경력 연수
  experience_level?: 'junior' | 'mid' | 'senior' | 'expert'; // 요구 경력
  level?: 'junior' | 'mid' | 'senior' | 'expert'; // 요구 경력 - 레거시 호환
  status?: 'draft' | 'active' | 'in_progress' | 'closed' | 'completed' | 'cancelled'; // 상태
  views?: number; // 조회수
  applications?: number; // 지원자수
  applications_count?: number; // 지원자수 별칭 (GENERATED)
  is_featured?: boolean; // 추천 여부
  is_urgent?: boolean; // 긴급 여부
  company?: string | null; // 회사명 - 레거시 호환
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 6. Job Postings Table Interface (레거시)
// =====================================================
export interface DatabaseJobPosting {
  id: number;
  company_id: number;
  title: string;
  description?: string | null;
  requirements?: string | null;
  location?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  employment_type?: 'full_time' | 'part_time' | 'contract' | 'internship' | null;
  is_active?: boolean;
  expires_at?: Date | null;
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 7. Project Applications Table Interface
// =====================================================
export interface DatabaseProjectApplication {
  id: number;
  project_id: number; // 프로젝트 ID
  user_id?: number | null; // 지원자 ID
  freelancer_id?: number | null; // 지원한 프리랜서 ID
  cover_letter?: string | null; // 자기소개서
  proposed_budget?: number | null; // 제안 금액
  expected_rate?: number | null; // 희망 시급/연봉
  available_date?: Date | null; // 가능 시작일
  portfolio_url?: string | null; // 포트폴리오 URL
  status?: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn'; // 지원 상태
  notes?: string | null; // 메모
  applied_at?: Date; // 지원 날짜
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 8. Reviews Table Interface
// =====================================================
export interface DatabaseReview {
  id: number;
  reviewer_id: number; // 리뷰 작성자 ID
  reviewee_id: number; // 리뷰 대상자 ID
  project_id?: number | null; // 관련 프로젝트 ID
  rating: number; // 평점 (0-5)
  comment?: string | null; // 리뷰 내용
  content?: string; // 리뷰 내용 별칭 (GENERATED)
  review_type?: 'freelancer_to_client' | 'client_to_freelancer' | null; // 리뷰 타입
  is_visible?: boolean; // 공개 여부
  created_at: Date;
  updated_at?: Date;
}

// =====================================================
// 9. Messages Table Interface
// =====================================================
export interface DatabaseMessage {
  id: number;
  sender_id: number; // 발신자 ID
  receiver_id: number; // 수신자 ID
  project_id?: number | null; // 관련 프로젝트 ID
  subject?: string | null; // 제목
  content: string; // 내용
  is_read?: boolean; // 읽음 여부
  read_at?: Date | null; // 읽은 시간
  created_at: Date;
}

// =====================================================
// 10. Notifications Table Interface
// =====================================================
export interface DatabaseNotification {
  id: number;
  user_id: number; // 수신자 ID
  type: string; // 알림 유형
  title: string; // 제목
  message?: string | null; // 내용
  link?: string | null; // 관련 링크
  is_read?: boolean; // 읽음 여부
  read_at?: Date | null; // 읽은 시간
  created_at: Date;
}

// =====================================================
// 11. Portfolios Table Interface
// =====================================================
export interface DatabasePortfolio {
  id: number;
  user_id: number; // 사용자 ID
  title: string; // 제목
  description?: string | null; // 설명
  project_url?: string | null; // 프로젝트 URL
  image_url?: string | null; // 대표 이미지 URL
  tags?: string | null; // 태그 (JSON 배열)
  is_featured?: boolean; // 대표작품 여부
  display_order?: number; // 표시 순서
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 12. Blog Posts Table Interface
// =====================================================
export interface DatabaseBlogPost {
  id: number;
  user_id?: number | null; // 작성자 ID
  author_id?: number | null; // 작성자 ID (V1)
  category_id?: number | null; // 카테고리 ID
  category?: string | null; // 카테고리
  title: string; // 제목
  slug: string; // URL 슬러그
  content: string; // 내용
  excerpt?: string | null; // 요약
  featured_image?: string | null; // 대표 이미지
  tags?: string | null; // 태그 (JSON 배열)
  status?: 'draft' | 'published' | 'archived'; // 상태
  views?: number; // 조회수
  likes?: number; // 좋아요 수
  published_at?: Date | null; // 발행일
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 13. Community Posts Table Interface
// =====================================================
export interface DatabaseCommunityPost {
  id: number;
  user_id: number; // 작성자 ID
  category_id?: number | null; // 카테고리 ID
  title: string; // 제목
  content: string; // 내용
  post_type?: 'question' | 'discussion' | 'share' | 'notice'; // 게시글 유형
  is_pinned?: boolean; // 고정 여부
  is_locked?: boolean; // 잠금 여부
  views?: number; // 조회수
  likes?: number; // 좋아요 수
  comments_count?: number; // 댓글 수
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 14. Comments Table Interface
// =====================================================
export interface DatabaseComment {
  id: number;
  user_id?: number | null; // 작성자 ID
  author_id?: number | null; // 작성자 ID (V1)
  commentable_type?: string | null; // 댓글 대상 유형
  commentable_id?: number | null; // 댓글 대상 ID
  post_id?: number | null; // 게시물 ID
  post_type?: 'blog' | 'project' | null; // 게시물 타입
  parent_id?: number | null; // 부모 댓글 ID
  content: string; // 내용
  likes?: number; // 좋아요 수
  is_deleted?: boolean; // 삭제 여부
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// 15. User Sessions Table Interface
// =====================================================
export interface DatabaseUserSession {
  id: number;
  user_id: number;
  session_token: string;
  ip_address?: string | null;
  user_agent?: string | null;
  expires_at: Date;
  created_at: Date;
}

// =====================================================
// Additional Tables
// =====================================================
export interface DatabaseFileUpload {
  id: number;
  user_id: number;
  file_name: string;
  file_path: string;
  file_type?: string | null;
  file_size?: number | null;
  entity_type?: string | null;
  entity_id?: number | null;
  created_at: Date;
}

export interface DatabaseTag {
  id: number;
  name: string;
  slug: string;
  usage_count?: number;
  created_at: Date;
}

export interface DatabaseSystemSetting {
  id: number;
  setting_key: string;
  setting_value?: string | null;
  setting_type?: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseSearchLog {
  id: number;
  user_id?: number | null;
  search_query: string;
  search_type?: string | null;
  results_count?: number;
  ip_address?: string | null;
  created_at: Date;
}

export interface DatabaseProjectSkill {
  id: number;
  project_id: number;
  skill_name: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  is_required?: boolean;
}

export interface DatabaseProjectBenefit {
  id: number;
  project_id: number;
  benefit: string;
  display_order?: number;
}

export interface DatabaseProjectRequirement {
  id: number;
  project_id: number;
  requirement: string;
  display_order?: number;
}

export interface DatabaseProjectResponsibility {
  id: number;
  project_id: number;
  responsibility: string;
  display_order?: number;
}

export interface DatabaseProjectView {
  id: number;
  project_id: number;
  user_id?: number | null;
  ip_address?: string | null;
  viewed_at: Date;
}

export interface DatabaseProjectBookmark {
  id: number;
  project_id: number;
  user_id: number;
  created_at: Date;
}

// =====================================================
// Type Aliases for Frontend Compatibility
// =====================================================

// User role types
export type UserRole = DatabaseUser['role'];
export type UserStatus = DatabaseUser['status'];

// Company types
export type CompanySize = DatabaseCompany['company_size'];
export type CompanyStatus = DatabaseCompany['status'];

// Freelancer types
export type ExperienceLevel = DatabaseFreelancer['experience_level'];
export type AvailabilityStatus = DatabaseFreelancer['availability'];
export type WorkPreference = DatabaseFreelancer['work_preference'];

// Project types
export type ProjectType = DatabaseProject['project_type'];
export type BudgetType = DatabaseProject['budget_type'];
export type WorkType = DatabaseProject['work_type'];
export type ProjectStatus = DatabaseProject['status'];

// Application types
export type ApplicationStatus = DatabaseProjectApplication['status'];

// Review types
export type ReviewType = DatabaseReview['review_type'];

// Blog/Community types
export type BlogStatus = DatabaseBlogPost['status'];
export type PostType = DatabaseCommunityPost['post_type'];

// Skill level types
export type SkillLevel = DatabaseProjectSkill['skill_level'];

// =====================================================
// Relationship Interfaces (for populated queries)
// =====================================================

// User with related data
export interface UserWithRelations extends DatabaseUser {
  company?: DatabaseCompany;
  freelancer?: DatabaseFreelancer;
  portfolios?: DatabasePortfolio[];
}

// Company with related data
export interface CompanyWithRelations extends DatabaseCompany {
  user?: DatabaseUser;
  projects?: DatabaseProject[];
}

// Freelancer with related data
export interface FreelancerWithRelations extends DatabaseFreelancer {
  user?: DatabaseUser;
  portfolios?: DatabasePortfolio[];
  reviews?: DatabaseReview[];
}

// Project with related data
export interface ProjectWithRelations extends Omit<DatabaseProject, 'category' | 'skills' | 'applications' | 'company'> {
  company?: DatabaseCompany; // Related company data
  companyName?: string | null; // Original company field from database
  client?: DatabaseUser;
  category?: DatabaseCategory | null;
  categoryString?: string | null; // Original category field from database
  applications?: DatabaseProjectApplication[]; // Related applications data
  applicationsCount?: number; // Original applications count from database
  skills?: DatabaseProjectSkill[]; // Related skills table data
  skillsJson?: string | null; // Original skills field from database (JSON string)
  benefits?: DatabaseProjectBenefit[];
  requirements?: DatabaseProjectRequirement[];
  responsibilities?: DatabaseProjectResponsibility[];
}

// Application with related data
export interface ApplicationWithRelations extends DatabaseProjectApplication {
  project?: DatabaseProject;
  user?: DatabaseUser;
  freelancer?: DatabaseUser;
}

// Review with related data
export interface ReviewWithRelations extends DatabaseReview {
  reviewer?: DatabaseUser;
  reviewee?: DatabaseUser;
  project?: DatabaseProject;
}

// Message with related data
export interface MessageWithRelations extends DatabaseMessage {
  sender?: DatabaseUser;
  receiver?: DatabaseUser;
  project?: DatabaseProject;
}

// Blog post with related data
export interface BlogPostWithRelations extends Omit<DatabaseBlogPost, 'category'> {
  user?: DatabaseUser;
  author?: DatabaseUser;
  category?: DatabaseCategory | null;
  categoryString?: string | null; // Original category field from database
  comments?: DatabaseComment[];
}

// Community post with related data
export interface CommunityPostWithRelations extends DatabaseCommunityPost {
  user?: DatabaseUser;
  category?: DatabaseCategory;
  comments?: DatabaseComment[];
}

// Comment with related data
export interface CommentWithRelations extends DatabaseComment {
  user?: DatabaseUser;
  author?: DatabaseUser;
  parent?: DatabaseComment;
  children?: DatabaseComment[];
}

// =====================================================
// Database Query Result Types
// =====================================================
export interface QueryResult<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

export interface InsertResult {
  insertId: number;
  affectedRows: number;
}

export interface UpdateResult {
  affectedRows: number;
  changedRows: number;
}

export interface DeleteResult {
  affectedRows: number;
}

// =====================================================
// Database Connection Types
// =====================================================
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit?: number;
  acquireTimeout?: number;
  timeout?: number;
}

export interface ConnectionInfo {
  host: string;
  port: number;
  database: string;
  user: string;
  connectionLimit: number;
}

// =====================================================
// Migration Types
// =====================================================
export interface Migration {
  id: number;
  name: string;
  executed_at: Date;
}

export interface MigrationFile {
  name: string;
  up: string;
  down: string;
}

// =====================================================
// Pagination Types
// =====================================================
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// =====================================================
// Search Types
// =====================================================
export interface SearchOptions {
  query: string;
  fields: string[];
  filters?: Record<string, any>;
  pagination?: PaginationOptions;
}

export interface SearchResult<T> extends PaginatedResult<T> {
  searchQuery: string;
  searchFields: string[];
}

// =====================================================
// Database Error Types
// =====================================================
export interface DatabaseError extends Error {
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
}

// =====================================================
// Utility Types for JSON Fields
// =====================================================

// Helper to parse JSON string fields
export type ParsedSkills = string[];
export type ParsedTags = string[];

// Transform database types to frontend types
export interface FreelancerFrontend extends Omit<DatabaseFreelancer, 'skills'> {
  skills: ParsedSkills;
}

export interface ProjectFrontend extends Omit<DatabaseProject, 'required_skills' | 'preferred_skills'> {
  required_skills: ParsedSkills;
  preferred_skills: ParsedSkills;
}

export interface BlogPostFrontend extends Omit<DatabaseBlogPost, 'tags'> {
  tags: ParsedTags;
}

export interface PortfolioFrontend extends Omit<DatabasePortfolio, 'tags'> {
  tags: ParsedTags;
}

// Export all types individually - no default export needed for types 