/**
 * 추천 시스템 관련 TypeScript 인터페이스 정의
 */

import { Project } from './project';
import { Freelancer } from './freelancer';

/**
 * 사용자 프로필 기반 추천 정보
 */
export interface UserProfile {
  id: string;
  skills: string[];
  experienceLevel: string;
  preferredProjectTypes: string[];
  preferredBudgetRange: {
    min: number;
    max: number;
  };
  location?: string;
  workType?: string;
  appliedProjects: string[];
  bookmarkedProjects: string[];
  completedProjects: string[];
  interests: string[];
  categories: string[];
}

/**
 * 추천 점수 상세 정보
 */
export interface RecommendationScore {
  total: number;
  skillMatch: number;
  experienceMatch: number;
  budgetMatch: number;
  locationMatch: number;
  typeMatch: number;
  popularityScore: number;
  similarityScore: number;
  recentActivityScore: number;
}

/**
 * 추천 프로젝트 정보
 */
export interface RecommendedProject extends Project {
  recommendationScore: RecommendationScore;
  recommendationReason: string[];
  matchingSkills: string[];
  confidence: number;
  rank: number;
}

/**
 * 추천 프리랜서 정보
 */
export interface RecommendedFreelancer extends Freelancer {
  recommendationScore: RecommendationScore;
  recommendationReason: string[];
  matchingSkills: string[];
  confidence: number;
  rank: number;
}

/**
 * 추천 요청 매개변수
 */
export interface RecommendationRequest {
  userId?: string;
  projectId?: string;
  freelancerId?: string;
  type: 'user-based' | 'project-similarity' | 'popularity' | 'hybrid';
  limit?: number;
  excludeIds?: string[];
  filters?: {
    category?: string;
    budgetRange?: {
      min: number;
      max: number;
    };
    location?: string;
    experienceLevel?: string;
    skills?: string[];
    workType?: string;
  };
}

/**
 * 추천 응답 데이터
 */
export interface RecommendationResponse {
  recommendations: RecommendedProject[];
  metadata: {
    totalCount: number;
    algorithm: string;
    executionTime: number;
    version: string;
    cacheHit: boolean;
  };
  debug?: {
    userProfile?: UserProfile;
    scoringBreakdown?: RecommendationScore[];
    appliedFilters?: string[];
  };
}

/**
 * 유사성 계산 결과
 */
export interface SimilarityResult {
  targetId: string;
  similarId: string;
  similarity: number;
  method: 'cosine' | 'euclidean' | 'jaccard' | 'hybrid';
  features: {
    [key: string]: number;
  };
}

/**
 * 인기도 메트릭
 */
export interface PopularityMetrics {
  views: number;
  applications: number;
  bookmarks: number;
  recentActivity: number;
  trendingScore: number;
  viral: boolean;
}

/**
 * 추천 알고리즘 설정
 */
export interface RecommendationConfig {
  algorithms: {
    userBased: {
      enabled: boolean;
      weight: number;
      skillWeight: number;
      experienceWeight: number;
      budgetWeight: number;
      locationWeight: number;
      typeWeight: number;
    };
    projectSimilarity: {
      enabled: boolean;
      weight: number;
      skillSimilarityWeight: number;
      budgetSimilarityWeight: number;
      categorySimilarityWeight: number;
      typeSimilarityWeight: number;
    };
    popularity: {
      enabled: boolean;
      weight: number;
      viewsWeight: number;
      applicationsWeight: number;
      bookmarksWeight: number;
      recentActivityWeight: number;
      trendingWeight: number;
    };
  };
  cache: {
    enabled: boolean;
    ttl: number; // seconds
    maxSize: number;
  };
  diversity: {
    enabled: boolean;
    maxSimilarItemsPerCategory: number;
    categoryDiversityWeight: number;
  };
  freshness: {
    enabled: boolean;
    recentProjectsWeight: number;
    maxAge: number; // days
  };
}

/**
 * 추천 통계 정보
 */
export interface RecommendationStats {
  userId: string;
  totalRecommendations: number;
  clickThroughRate: number;
  applicationRate: number;
  bookmarkRate: number;
  averageRelevanceScore: number;
  topCategories: string[];
  topSkills: string[];
  performanceMetrics: {
    averageResponseTime: number;
    cacheHitRate: number;
    algorithmPerformance: {
      [algorithm: string]: {
        precision: number;
        recall: number;
        f1Score: number;
      };
    };
  };
}

/**
 * 추천 피드백 정보
 */
export interface RecommendationFeedback {
  userId: string;
  recommendationId: string;
  projectId: string;
  action: 'click' | 'apply' | 'bookmark' | 'dismiss' | 'like' | 'dislike';
  relevanceScore?: number;
  feedback?: string;
  timestamp: string;
}

/**
 * 실시간 추천 업데이트
 */
export interface RecommendationUpdate {
  type: 'new_project' | 'project_update' | 'user_activity' | 'trending_change';
  projectId: string;
  affectedUsers: string[];
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

/**
 * 추천 A/B 테스트 설정
 */
export interface RecommendationExperiment {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  variants: {
    control: RecommendationConfig;
    test: RecommendationConfig;
  };
  trafficSplit: number; // 0-100
  metrics: string[];
  startDate: string;
  endDate: string;
  results?: {
    [metric: string]: {
      control: number;
      test: number;
      significance: number;
    };
  };
}

/**
 * 추천 시스템 성능 모니터링
 */
export interface RecommendationMetrics {
  timestamp: string;
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
  algorithmDistribution: {
    [algorithm: string]: number;
  };
  userSatisfaction: {
    averageRating: number;
    totalFeedback: number;
    positiveRate: number;
  };
}

/**
 * 추천 컨텍스트 정보
 */
export interface RecommendationContext {
  sessionId: string;
  userAgent: string;
  referrer?: string;
  currentPage: string;
  timeOfDay: string;
  dayOfWeek: string;
  userLocation?: {
    country: string;
    city: string;
    timezone: string;
  };
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
  };
  previousActions: string[];
  sessionDuration: number;
}

/**
 * 추천 개인화 설정
 */
export interface PersonalizationSettings {
  userId: string;
  preferences: {
    enableRecommendations: boolean;
    showExplicitRecommendations: boolean;
    receiveEmailRecommendations: boolean;
    recommendationFrequency: 'daily' | 'weekly' | 'monthly';
    preferredCategories: string[];
    blockedCategories: string[];
    privacyLevel: 'public' | 'private' | 'anonymous';
  };
  weightings: {
    skillMatch: number;
    experienceMatch: number;
    budgetMatch: number;
    locationMatch: number;
    popularityScore: number;
    novelty: number;
    diversity: number;
  };
  excludeFilters: {
    companies: string[];
    locations: string[];
    budgetRanges: Array<{
      min: number;
      max: number;
    }>;
    projectTypes: string[];
    skills: string[];
  };
}

/**
 * 추천 설명 정보
 */
export interface RecommendationExplanation {
  projectId: string;
  mainReason: string;
  detailedReasons: Array<{
    type: 'skill_match' | 'experience_match' | 'budget_match' | 'location_match' | 'popularity' | 'similarity';
    description: string;
    impact: number;
    evidence: string[];
  }>;
  confidence: number;
  alternativeReasons: string[];
  improvementSuggestions: string[];
}

/**
 * 추천 캐시 엔트리
 */
export interface RecommendationCacheEntry {
  key: string;
  userId: string;
  recommendations: RecommendedProject[];
  timestamp: string;
  ttl: number;
  hitCount: number;
  algorithm: string;
  version: string;
}

/**
 * 추천 배치 작업 정보
 */
export interface RecommendationBatchJob {
  id: string;
  type: 'user_recommendations' | 'similarity_matrix' | 'popularity_scores' | 'trending_analysis';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  endTime?: string;
  processedItems: number;
  totalItems: number;
  errors: string[];
  results?: {
    [key: string]: any;
  };
}