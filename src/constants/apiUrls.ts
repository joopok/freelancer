// API URL 상수 관리
// Next.js rewrites를 통해 자동으로 Spring Boot 서버로 프록시됨
export const API_URLS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    SESSION: '/api/auth/session',
    REFRESH: '/api/auth/refresh',
  },
  
  // 카테고리
  CATEGORIES: '/api/categories',
  
  // 프리랜서
  FREELANCERS: {
    LIST: '/api/freelancers',
    DETAIL: (id: string | number) => `/api/freelancers/${id}`,
    SKILLS: '/api/freelancers/skills',
    SEARCH: '/api/freelancers/search',
  },
  
  // 프로젝트
  PROJECTS: {
    LIST: '/api/projects',
    DETAIL: (id: string | number) => `/api/projects/${id}`,
    CREATE: '/api/projects/create',
    UPDATE: (id: string | number) => `/api/projects/${id}/update`,
    DELETE: (id: string | number) => `/api/projects/${id}/delete`,
    APPLY: (id: string | number) => `/api/projects/${id}/apply`,
  },
  
  // 채용공고
  JOBS: {
    LIST: '/api/jobs',
    DETAIL: (id: string | number) => `/api/jobs/${id}`,
    APPLY: (id: string | number) => `/api/jobs/${id}/apply`,
  },
  
  // 블로그
  BLOG: {
    LIST: '/api/blog/posts',
    DETAIL: (id: string | number) => `/api/blog/posts/${id}`,
    CATEGORIES: '/api/blog/categories',
    TAGS: '/api/blog/tags',
  },
  
  // 커뮤니티
  COMMUNITY: {
    LIST: '/api/community/posts',
    DETAIL: (id: string | number) => `/api/community/posts/${id}`,
    CREATE: '/api/community/posts/create',
    UPDATE: (id: string | number) => `/api/community/posts/${id}/update`,
    DELETE: (id: string | number) => `/api/community/posts/${id}/delete`,
  },
  
  // 사용자
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile/update',
    PORTFOLIO: '/api/user/portfolio',
    NOTIFICATIONS: '/api/user/notifications',
    MESSAGES: '/api/user/messages',
  },
  
  // 검색
  SEARCH: {
    ALL: '/api/search',
    PROJECTS: '/api/search/projects',
    FREELANCERS: '/api/search/freelancers',
    JOBS: '/api/search/jobs',
  },
  
  // 파일 업로드
  UPLOAD: {
    IMAGE: '/api/upload/image',
    FILE: '/api/upload/file',
  },
} as const;

// 타입 추론을 위한 헬퍼 타입
export type ApiUrls = typeof API_URLS;