/**
 * 프로젝트 추천 시스템 서비스
 * 사용자 기반, 유사성 기반, 인기도 기반 추천 알고리즘 구현
 */

// Cached API 클라이언트 사용
import { cachedApi } from '@/services/cached-api';
import { Project } from '@/types/project';
import { Freelancer } from '@/types/freelancer';
import {
  RecommendationRequest,
  RecommendationResponse,
  RecommendedProject,
  RecommendedFreelancer,
  UserProfile,
  SimilarityResult,
  PopularityMetrics,
  RecommendationScore,
  RecommendationConfig,
  RecommendationCacheEntry,
  RecommendationFeedback,
  RecommendationStats
} from '@/types/recommendation';

class RecommendationService {
  private cache = new Map<string, RecommendationCacheEntry>();
  private readonly CACHE_TTL = 30 * 60 * 1000; // 30분
  private readonly MAX_CACHE_SIZE = 1000;

  /**
   * 추천 설정 (가중치 및 알고리즘 설정)
   */
  private readonly config: RecommendationConfig = {
    algorithms: {
      userBased: {
        enabled: true,
        weight: 0.4,
        skillWeight: 0.3,
        experienceWeight: 0.2,
        budgetWeight: 0.2,
        locationWeight: 0.15,
        typeWeight: 0.15
      },
      projectSimilarity: {
        enabled: true,
        weight: 0.4,
        skillSimilarityWeight: 0.4,
        budgetSimilarityWeight: 0.2,
        categorySimilarityWeight: 0.2,
        typeSimilarityWeight: 0.2
      },
      popularity: {
        enabled: true,
        weight: 0.2,
        viewsWeight: 0.3,
        applicationsWeight: 0.3,
        bookmarksWeight: 0.2,
        recentActivityWeight: 0.1,
        trendingWeight: 0.1
      }
    },
    cache: {
      enabled: true,
      ttl: 1800,
      maxSize: 1000
    },
    diversity: {
      enabled: true,
      maxSimilarItemsPerCategory: 3,
      categoryDiversityWeight: 0.1
    },
    freshness: {
      enabled: true,
      recentProjectsWeight: 0.1,
      maxAge: 30
    }
  };

  /**
   * 메인 추천 API - 하이브리드 추천 시스템
   */
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResponse> {
    const startTime = Date.now();
    
    try {
      // 캐시 확인
      const cacheKey = this.generateCacheKey(request);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return {
          recommendations: cached.recommendations,
          metadata: {
            totalCount: cached.recommendations.length,
            algorithm: cached.algorithm,
            executionTime: Date.now() - startTime,
            version: cached.version,
            cacheHit: true
          }
        };
      }

      let recommendations: RecommendedProject[] = [];

      // 하이브리드 추천 실행
      switch (request.type) {
        case 'user-based':
          recommendations = await this.getUserBasedRecommendations(request);
          break;
        case 'project-similarity':
          recommendations = await this.getProjectSimilarityRecommendations(request);
          break;
        case 'popularity':
          recommendations = await this.getPopularityBasedRecommendations(request);
          break;
        case 'hybrid':
        default:
          recommendations = await this.getHybridRecommendations(request);
          break;
      }

      // 다양성 보장
      if (this.config.diversity.enabled) {
        recommendations = this.ensureDiversity(recommendations);
      }

      // 결과 정렬 및 제한
      recommendations = recommendations
        .sort((a, b) => b.recommendationScore.total - a.recommendationScore.total)
        .slice(0, request.limit || 10);

      // 순위 설정
      recommendations.forEach((rec, index) => {
        rec.rank = index + 1;
      });

      // 캐시 저장
      this.saveToCache(cacheKey, {
        key: cacheKey,
        userId: request.userId || '',
        recommendations,
        timestamp: new Date().toISOString(),
        ttl: this.CACHE_TTL,
        hitCount: 0,
        algorithm: request.type,
        version: '1.0'
      });

      return {
        recommendations,
        metadata: {
          totalCount: recommendations.length,
          algorithm: request.type,
          executionTime: Date.now() - startTime,
          version: '1.0',
          cacheHit: false
        }
      };
    } catch (error) {
      console.error('❌ 추천 시스템 오류:', error);
      throw error;
    }
  }

  /**
   * 사용자 기반 추천 시스템
   */
  private async getUserBasedRecommendations(request: RecommendationRequest): Promise<RecommendedProject[]> {
    
    try {
      // 사용자 프로필 가져오기
      const userProfile = await this.getUserProfile(request.userId);
      if (!userProfile) {
        return await this.getPopularityBasedRecommendations(request);
      }

      // 모든 프로젝트 가져오기
      const projects = await this.getAllProjects(request.excludeIds);
      
      // 배열 확인
      if (!Array.isArray(projects) || projects.length === 0) {
        return [];
      }
      
      // 각 프로젝트에 대한 점수 계산
      const scoredProjects = projects.map(project => {
        const score = this.calculateUserBasedScore(userProfile, project);
        const reasons = this.generateRecommendationReasons(userProfile, project, score);
        const matchingSkills = this.getMatchingSkills(userProfile.skills, project.skills || []);
        
        return {
          ...project,
          recommendationScore: score,
          recommendationReason: reasons,
          matchingSkills,
          confidence: this.calculateConfidence(score),
          rank: 0
        } as RecommendedProject;
      });

      return scoredProjects.filter(p => p.recommendationScore.total > 0.1);
    } catch (error) {
      console.error('❌ 사용자 기반 추천 오류:', error);
      return [];
    }
  }

  /**
   * 프로젝트 유사성 기반 추천 시스템
   */
  private async getProjectSimilarityRecommendations(request: RecommendationRequest): Promise<RecommendedProject[]> {
    console.log('🔍 프로젝트 유사성 기반 추천 시작');
    
    try {
      if (!request.projectId) {
        throw new Error('프로젝트 ID가 필요합니다');
      }

      // 기준 프로젝트 가져오기
      const baseProject = await this.getProject(request.projectId);
      if (!baseProject) {
        throw new Error('기준 프로젝트를 찾을 수 없습니다');
      }

      // 모든 프로젝트 가져오기
      const projects = await this.getAllProjects([request.projectId, ...(request.excludeIds || [])]);
      
      // 배열 확인
      if (!Array.isArray(projects) || projects.length === 0) {
        return [];
      }
      
      // 유사성 점수 계산
      const scoredProjects = projects.map(project => {
        const similarityScore = this.calculateProjectSimilarity(baseProject, project);
        const score = this.createSimilarityScore(similarityScore);
        const reasons = this.generateSimilarityReasons(baseProject, project, similarityScore);
        const matchingSkills = this.getMatchingSkills(baseProject.skills || [], project.skills || []);
        
        return {
          ...project,
          recommendationScore: score,
          recommendationReason: reasons,
          matchingSkills,
          confidence: this.calculateConfidence(score),
          rank: 0
        } as RecommendedProject;
      });

      return scoredProjects.filter(p => p.recommendationScore.total > 0.2);
    } catch (error) {
      console.error('❌ 프로젝트 유사성 추천 오류:', error);
      return [];
    }
  }

  /**
   * 인기도 기반 추천 시스템
   */
  private async getPopularityBasedRecommendations(request: RecommendationRequest): Promise<RecommendedProject[]> {
    try {
      // 모든 프로젝트 가져오기
      const projects = await this.getAllProjects(request.excludeIds);
      
      // 배열 확인
      if (!Array.isArray(projects) || projects.length === 0) {
        return [];
      }
      
      // 인기도 점수 계산
      const scoredProjects = projects.map(project => {
        const popularityMetrics = this.calculatePopularityMetrics(project);
        const score = this.createPopularityScore(popularityMetrics);
        const reasons = this.generatePopularityReasons(popularityMetrics);
        
        return {
          ...project,
          recommendationScore: score,
          recommendationReason: reasons,
          matchingSkills: [],
          confidence: this.calculateConfidence(score),
          rank: 0
        } as RecommendedProject;
      });

      return scoredProjects.filter(p => p.recommendationScore.total > 0.1);
    } catch (error) {
      console.error('❌ 인기도 기반 추천 오류:', error);
      return [];
    }
  }

  /**
   * 하이브리드 추천 시스템
   */
  private async getHybridRecommendations(request: RecommendationRequest): Promise<RecommendedProject[]> {
    console.log('🔍 하이브리드 추천 시작');
    
    try {
      const results: RecommendedProject[] = [];
      
      // 사용자 기반 추천
      if (this.config.algorithms.userBased.enabled && request.userId) {
        const userBasedResults = await this.getUserBasedRecommendations(request);
        results.push(...userBasedResults);
      }

      // 프로젝트 유사성 기반 추천
      if (this.config.algorithms.projectSimilarity.enabled && request.projectId) {
        const similarityResults = await this.getProjectSimilarityRecommendations(request);
        results.push(...similarityResults);
      }

      // 인기도 기반 추천
      if (this.config.algorithms.popularity.enabled) {
        const popularityResults = await this.getPopularityBasedRecommendations(request);
        results.push(...popularityResults);
      }

      // 결과 병합 및 중복 제거
      const mergedResults = this.mergeAndDeduplicateResults(results);
      
      // 하이브리드 점수 계산
      return mergedResults.map(project => {
        const hybridScore = this.calculateHybridScore(project);
        return {
          ...project,
          recommendationScore: hybridScore,
          confidence: this.calculateConfidence(hybridScore)
        };
      });
    } catch (error) {
      console.error('❌ 하이브리드 추천 오류:', error);
      return [];
    }
  }

  /**
   * 사용자 기반 점수 계산
   */
  private calculateUserBasedScore(userProfile: UserProfile, project: Project): RecommendationScore {
    const skillMatch = this.calculateSkillMatch(userProfile.skills, project.skills || []);
    const experienceMatch = this.calculateExperienceMatch(userProfile.experienceLevel, project.experienceLevel || '');
    const budgetMatch = this.calculateBudgetMatch(userProfile.preferredBudgetRange, project.budgetMin || 0, project.budgetMax || 0);
    const locationMatch = this.calculateLocationMatch(userProfile.location, project.location);
    const typeMatch = this.calculateTypeMatch(userProfile.preferredProjectTypes, project.projectType || '');

    const weights = this.config.algorithms.userBased;
    const total = (
      skillMatch * weights.skillWeight +
      experienceMatch * weights.experienceWeight +
      budgetMatch * weights.budgetWeight +
      locationMatch * weights.locationWeight +
      typeMatch * weights.typeWeight
    ) * weights.weight;

    return {
      total,
      skillMatch,
      experienceMatch,
      budgetMatch,
      locationMatch,
      typeMatch,
      popularityScore: 0,
      similarityScore: 0,
      recentActivityScore: 0
    };
  }

  /**
   * 프로젝트 유사성 계산 (코사인 유사도 사용)
   */
  private calculateProjectSimilarity(baseProject: Project, targetProject: Project): number {
    const features1 = this.extractProjectFeatures(baseProject);
    const features2 = this.extractProjectFeatures(targetProject);
    
    return this.cosineSimilarity(features1, features2);
  }

  /**
   * 코사인 유사도 계산
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, a, i) => sum + a * vec2[i], 0);
    const magnitude1 = Math.sqrt(vec1.reduce((sum, a) => sum + a * a, 0));
    const magnitude2 = Math.sqrt(vec2.reduce((sum, a) => sum + a * a, 0));
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * 유클리드 거리 계산
   */
  private euclideanDistance(vec1: number[], vec2: number[]): number {
    const sumSquaredDiff = vec1.reduce((sum, a, i) => sum + Math.pow(a - vec2[i], 2), 0);
    return Math.sqrt(sumSquaredDiff);
  }

  /**
   * 프로젝트 특성 벡터 추출
   */
  private extractProjectFeatures(project: Project): number[] {
    const features: number[] = [];
    
    // 예산 범위 정규화 (0-1)
    const budgetMin = (project.budgetMin || 0) / 10000000; // 1천만원 기준
    const budgetMax = (project.budgetMax || 0) / 10000000;
    features.push(budgetMin, budgetMax);
    
    // 프로젝트 타입 원핫 인코딩
    const projectTypes = ['full_time', 'part_time', 'contract', 'freelance', 'internship'];
    projectTypes.forEach(type => {
      features.push(project.projectType === type ? 1 : 0);
    });
    
    // 근무 형태 원핫 인코딩
    const workTypes = ['remote', 'onsite', 'hybrid'];
    workTypes.forEach(type => {
      features.push(project.workType === type ? 1 : 0);
    });
    
    // 경험 레벨 원핫 인코딩
    const experienceLevels = ['junior', 'mid', 'senior', 'expert'];
    experienceLevels.forEach(level => {
      features.push(project.experienceLevel === level ? 1 : 0);
    });
    
    // 스킬 벡터 (자주 사용되는 스킬들)
    const commonSkills = ['React', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript', 'Vue.js', 'Angular'];
    commonSkills.forEach(skill => {
      features.push((project.skills || []).includes(skill) ? 1 : 0);
    });
    
    return features;
  }

  /**
   * 인기도 메트릭 계산
   */
  private calculatePopularityMetrics(project: Project): PopularityMetrics {
    const views = project.views || 0;
    const applications = project.applications || 0;
    const bookmarks = project.bookmarkCount || 0;
    const recentActivity = this.calculateRecentActivity(project);
    const trendingScore = this.calculateTrendingScore(project);
    
    return {
      views,
      applications,
      bookmarks,
      recentActivity,
      trendingScore,
      viral: trendingScore > 0.8
    };
  }

  /**
   * 최근 활동 점수 계산
   */
  private calculateRecentActivity(project: Project): number {
    if (!project.createdAt) return 0;
    
    const createdDate = new Date(project.createdAt);
    const now = new Date();
    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // 최근 7일 이내는 1.0, 30일 이후는 0.0으로 선형 감소
    return Math.max(0, Math.min(1, (30 - daysDiff) / 30));
  }

  /**
   * 트렌딩 점수 계산
   */
  private calculateTrendingScore(project: Project): number {
    const views = project.views || 0;
    const applications = project.applications || 0;
    const bookmarks = project.bookmarkCount || 0;
    const recentActivity = this.calculateRecentActivity(project);
    
    // 가중 평균으로 트렌딩 점수 계산
    const normalizedViews = Math.min(views / 100, 1);
    const normalizedApplications = Math.min(applications / 10, 1);
    const normalizedBookmarks = Math.min(bookmarks / 5, 1);
    
    return (
      normalizedViews * 0.4 +
      normalizedApplications * 0.3 +
      normalizedBookmarks * 0.2 +
      recentActivity * 0.1
    );
  }

  /**
   * 스킬 매칭 점수 계산
   */
  private calculateSkillMatch(userSkills: string[], projectSkills: string[]): number {
    if (!userSkills.length || !projectSkills.length) return 0;
    
    const matchingSkills = userSkills.filter(skill => 
      projectSkills.some(pSkill => pSkill.toLowerCase().includes(skill.toLowerCase()))
    );
    
    return matchingSkills.length / Math.max(userSkills.length, projectSkills.length);
  }

  /**
   * 경험 매칭 점수 계산
   */
  private calculateExperienceMatch(userLevel: string, projectLevel: string): number {
    const levels = ['junior', 'mid', 'senior', 'expert'];
    const userIndex = levels.indexOf(userLevel.toLowerCase());
    const projectIndex = levels.indexOf(projectLevel.toLowerCase());
    
    if (userIndex === -1 || projectIndex === -1) return 0.5;
    
    const diff = Math.abs(userIndex - projectIndex);
    return Math.max(0, 1 - diff * 0.3);
  }

  /**
   * 예산 매칭 점수 계산
   */
  private calculateBudgetMatch(
    userBudgetRange: { min: number; max: number },
    projectBudgetMin: number,
    projectBudgetMax: number
  ): number {
    if (!userBudgetRange.min && !userBudgetRange.max) return 0.5;
    if (!projectBudgetMin && !projectBudgetMax) return 0.5;
    
    const userMin = userBudgetRange.min || 0;
    const userMax = userBudgetRange.max || Infinity;
    const projectMin = projectBudgetMin || 0;
    const projectMax = projectBudgetMax || Infinity;
    
    // 범위 겹침 계산
    const overlapMin = Math.max(userMin, projectMin);
    const overlapMax = Math.min(userMax, projectMax);
    
    if (overlapMin <= overlapMax) {
      const overlapSize = overlapMax - overlapMin;
      const userRange = userMax - userMin;
      const projectRange = projectMax - projectMin;
      const maxRange = Math.max(userRange, projectRange);
      
      return maxRange > 0 ? overlapSize / maxRange : 1;
    }
    
    return 0;
  }

  /**
   * 지역 매칭 점수 계산
   */
  private calculateLocationMatch(userLocation?: string, projectLocation?: string): number {
    if (!userLocation || !projectLocation) return 0.5;
    
    const userLoc = userLocation.toLowerCase();
    const projectLoc = projectLocation.toLowerCase();
    
    if (userLoc === projectLoc) return 1;
    if (userLoc.includes(projectLoc) || projectLoc.includes(userLoc)) return 0.8;
    
    return 0.2;
  }

  /**
   * 프로젝트 타입 매칭 점수 계산
   */
  private calculateTypeMatch(userTypes: string[], projectType: string): number {
    if (!userTypes.length || !projectType) return 0.5;
    
    return userTypes.includes(projectType) ? 1 : 0.3;
  }

  /**
   * 매칭 스킬 추출
   */
  private getMatchingSkills(userSkills: string[], projectSkills: string[]): string[] {
    return userSkills.filter(skill => 
      projectSkills.some(pSkill => pSkill.toLowerCase().includes(skill.toLowerCase()))
    );
  }

  /**
   * 추천 이유 생성
   */
  private generateRecommendationReasons(
    userProfile: UserProfile,
    project: Project,
    score: RecommendationScore
  ): string[] {
    const reasons: string[] = [];
    
    if (score.skillMatch > 0.7) {
      const matchingSkills = this.getMatchingSkills(userProfile.skills, project.skills || []);
      reasons.push(`${matchingSkills.slice(0, 3).join(', ')} 스킬이 일치합니다`);
    }
    
    if (score.experienceMatch > 0.8) {
      reasons.push('경험 수준이 적합합니다');
    }
    
    if (score.budgetMatch > 0.8) {
      reasons.push('예산 범위가 적합합니다');
    }
    
    if (score.locationMatch > 0.8) {
      reasons.push('근무 지역이 일치합니다');
    }
    
    if (score.typeMatch > 0.8) {
      reasons.push('선호하는 프로젝트 유형입니다');
    }
    
    return reasons;
  }

  /**
   * 유사성 추천 이유 생성
   */
  private generateSimilarityReasons(
    baseProject: Project,
    targetProject: Project,
    similarityScore: number
  ): string[] {
    const reasons: string[] = [];
    
    if (similarityScore > 0.8) {
      reasons.push('매우 유사한 프로젝트입니다');
    } else if (similarityScore > 0.6) {
      reasons.push('유사한 특성을 가진 프로젝트입니다');
    }
    
    if (baseProject.category === targetProject.category) {
      reasons.push('같은 카테고리의 프로젝트입니다');
    }
    
    if (baseProject.projectType === targetProject.projectType) {
      reasons.push('같은 프로젝트 타입입니다');
    }
    
    const commonSkills = this.getMatchingSkills(baseProject.skills || [], targetProject.skills || []);
    if (commonSkills.length > 2) {
      reasons.push(`${commonSkills.slice(0, 3).join(', ')} 등 기술 스택이 유사합니다`);
    }
    
    return reasons;
  }

  /**
   * 인기도 추천 이유 생성
   */
  private generatePopularityReasons(metrics: PopularityMetrics): string[] {
    const reasons: string[] = [];
    
    if (metrics.viral) {
      reasons.push('화제가 되고 있는 프로젝트입니다');
    }
    
    if (metrics.views > 100) {
      reasons.push('많은 관심을 받고 있는 프로젝트입니다');
    }
    
    if (metrics.applications > 10) {
      reasons.push('지원자가 많은 인기 프로젝트입니다');
    }
    
    if (metrics.recentActivity > 0.8) {
      reasons.push('최근에 등록된 프로젝트입니다');
    }
    
    if (metrics.trendingScore > 0.7) {
      reasons.push('트렌딩 프로젝트입니다');
    }
    
    return reasons;
  }

  /**
   * 유사성 점수를 RecommendationScore로 변환
   */
  private createSimilarityScore(similarity: number): RecommendationScore {
    return {
      total: similarity * this.config.algorithms.projectSimilarity.weight,
      skillMatch: 0,
      experienceMatch: 0,
      budgetMatch: 0,
      locationMatch: 0,
      typeMatch: 0,
      popularityScore: 0,
      similarityScore: similarity,
      recentActivityScore: 0
    };
  }

  /**
   * 인기도 점수를 RecommendationScore로 변환
   */
  private createPopularityScore(metrics: PopularityMetrics): RecommendationScore {
    const popularityScore = metrics.trendingScore * this.config.algorithms.popularity.weight;
    
    return {
      total: popularityScore,
      skillMatch: 0,
      experienceMatch: 0,
      budgetMatch: 0,
      locationMatch: 0,
      typeMatch: 0,
      popularityScore,
      similarityScore: 0,
      recentActivityScore: metrics.recentActivity
    };
  }

  /**
   * 하이브리드 점수 계산
   */
  private calculateHybridScore(project: RecommendedProject): RecommendationScore {
    const originalScore = project.recommendationScore;
    
    // 각 알고리즘의 가중치를 적용한 최종 점수 계산
    const total = 
      originalScore.skillMatch * this.config.algorithms.userBased.skillWeight +
      originalScore.experienceMatch * this.config.algorithms.userBased.experienceWeight +
      originalScore.budgetMatch * this.config.algorithms.userBased.budgetWeight +
      originalScore.locationMatch * this.config.algorithms.userBased.locationWeight +
      originalScore.typeMatch * this.config.algorithms.userBased.typeWeight +
      originalScore.similarityScore * this.config.algorithms.projectSimilarity.weight +
      originalScore.popularityScore * this.config.algorithms.popularity.weight;
    
    return {
      ...originalScore,
      total
    };
  }

  /**
   * 신뢰도 점수 계산
   */
  private calculateConfidence(score: RecommendationScore): number {
    const factors = [
      score.skillMatch,
      score.experienceMatch,
      score.budgetMatch,
      score.locationMatch,
      score.typeMatch,
      score.popularityScore,
      score.similarityScore
    ].filter(factor => factor > 0);
    
    if (factors.length === 0) return 0;
    
    const average = factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
    const variance = factors.reduce((sum, factor) => sum + Math.pow(factor - average, 2), 0) / factors.length;
    
    // 높은 평균과 낮은 분산일 때 높은 신뢰도
    return Math.max(0, Math.min(1, average - Math.sqrt(variance) * 0.5));
  }

  /**
   * 다양성 보장
   */
  private ensureDiversity(recommendations: RecommendedProject[]): RecommendedProject[] {
    const diverseResults: RecommendedProject[] = [];
    const categoryCount: { [key: string]: number } = {};
    
    for (const rec of recommendations) {
      const category = rec.category || 'unknown';
      const currentCount = categoryCount[category] || 0;
      
      if (currentCount < this.config.diversity.maxSimilarItemsPerCategory) {
        diverseResults.push(rec);
        categoryCount[category] = currentCount + 1;
      }
    }
    
    return diverseResults;
  }

  /**
   * 결과 병합 및 중복 제거
   */
  private mergeAndDeduplicateResults(results: RecommendedProject[]): RecommendedProject[] {
    const projectMap = new Map<string, RecommendedProject>();
    
    for (const project of results) {
      const id = project.id.toString();
      const existing = projectMap.get(id);
      
      if (!existing || project.recommendationScore.total > existing.recommendationScore.total) {
        projectMap.set(id, project);
      }
    }
    
    return Array.from(projectMap.values());
  }

  /**
   * 캐시 관련 메서드들
   */
  private generateCacheKey(request: RecommendationRequest): string {
    return `rec_${request.userId || 'anon'}_${request.projectId || 'none'}_${request.type}_${JSON.stringify(request.filters || {})}`;
  }

  private getFromCache(key: string): RecommendationCacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - new Date(entry.timestamp).getTime() > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    entry.hitCount++;
    return entry;
  }

  private saveToCache(key: string, entry: RecommendationCacheEntry): void {
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // LRU 캐시 구현 (간단 버전)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, entry);
  }

  /**
   * 외부 API 호출 메서드들
   */
  private async getUserProfile(userId?: string): Promise<UserProfile | null> {
    if (!userId) return null;
    
    try {
      // Mock 데이터 또는 실제 API 호출
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        return this.getMockUserProfile(userId);
      }
      
      const response = await cachedApi.get(`/api/users/${userId}/profile`, {
        cacheTTL: 10 * 60 * 1000 // 10분 캐싱
      });
      return response.data;
    } catch (error) {
      console.error('사용자 프로필 가져오기 실패:', error);
      return null;
    }
  }

  private async getAllProjects(excludeIds?: string[]): Promise<Project[]> {
    try {
      // Mock 데이터 또는 실제 API 호출
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        return this.getMockProjects(excludeIds);
      }
      
      const response = await cachedApi.get('/api/projects', {
        params: { 
          page: 1, 
          limit: 100,
          excludeIds: excludeIds?.join(',')
        },
        cacheTTL: 5 * 60 * 1000 // 5분 캐싱
      });
      
      // 응답 데이터 확인 및 배열 추출
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      } else if (data?.content && Array.isArray(data.content)) {
        return data.content;
      } else if (data?.projects && Array.isArray(data.projects)) {
        return data.projects;
      }
      
      return [];
    } catch (error) {
      console.error('프로젝트 목록 가져오기 실패:', error);
      return [];
    }
  }

  private async getProject(projectId: string): Promise<Project | null> {
    try {
      // Mock 데이터 또는 실제 API 호출
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        return this.getMockProject(projectId);
      }
      
      const response = await cachedApi.get(`/api/projects/${projectId}`, {
        cacheTTL: 10 * 60 * 1000 // 10분 캐싱
      });
      return response.data;
    } catch (error) {
      console.error('프로젝트 가져오기 실패:', error);
      return null;
    }
  }

  /**
   * Mock 데이터 생성 메서드들
   */
  private getMockUserProfile(userId: string): UserProfile {
    return {
      id: userId,
      skills: ['React', 'TypeScript', 'Node.js', 'Python'],
      experienceLevel: 'senior',
      preferredProjectTypes: ['full_time', 'contract'],
      preferredBudgetRange: { min: 3000000, max: 8000000 },
      location: '서울',
      workType: 'hybrid',
      appliedProjects: [],
      bookmarkedProjects: [],
      completedProjects: [],
      interests: ['웹개발', '모바일앱', 'AI'],
      categories: ['웹개발', 'IT컨설팅']
    };
  }

  private getMockProjects(excludeIds?: string[]): Project[] {
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'React 기반 쇼핑몰 개발',
        description: '최신 React 기술을 활용한 쇼핑몰 플랫폼 개발',
        category: '웹개발',
        skills: ['React', 'TypeScript', 'Node.js'],
        budgetMin: 5000000,
        budgetMax: 8000000,
        projectType: 'contract',
        workType: 'hybrid',
        location: '서울',
        experienceLevel: 'senior',
        views: 120,
        applications: 15,
        bookmarkCount: 8,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: '2',
        title: 'AI 챗봇 개발 프로젝트',
        description: '고객 서비스용 AI 챗봇 개발',
        category: 'AI',
        skills: ['Python', 'TensorFlow', 'NLP'],
        budgetMin: 3000000,
        budgetMax: 6000000,
        projectType: 'full_time',
        workType: 'remote',
        location: '전국',
        experienceLevel: 'mid',
        views: 89,
        applications: 12,
        bookmarkCount: 5,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      }
    ];

    if (excludeIds) {
      return mockProjects.filter(p => !excludeIds.includes(p.id.toString()));
    }
    
    return mockProjects;
  }

  private getMockProject(projectId: string): Project | null {
    const mockProjects = this.getMockProjects();
    return mockProjects.find(p => p.id.toString() === projectId) || null;
  }

  /**
   * 추천 피드백 처리
   */
  async submitFeedback(feedback: RecommendationFeedback): Promise<void> {
    try {
      console.log('📊 추천 피드백 제출:', feedback);
      
      if (process.env.NEXT_PUBLIC_USE_MOCK_API !== 'true') {
        await cachedApi.post('/api/recommendations/feedback', feedback);
      }
      
      // 피드백을 통한 학습 (간단한 버전)
      this.updateRecommendationWeights(feedback);
    } catch (error) {
      console.error('추천 피드백 제출 실패:', error);
    }
  }

  private updateRecommendationWeights(feedback: RecommendationFeedback): void {
    // 피드백을 기반으로 가중치 조정 (간단한 버전)
    const adjustment = feedback.action === 'like' ? 0.1 : 
                     feedback.action === 'dislike' ? -0.05 : 0;
    
    // 실제 구현에서는 더 정교한 학습 알고리즘을 적용
    console.log('🔄 추천 가중치 업데이트:', adjustment);
  }

  /**
   * 추천 통계 조회
   */
  async getRecommendationStats(userId: string): Promise<RecommendationStats> {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        return this.getMockRecommendationStats(userId);
      }
      
      const response = await cachedApi.get(`/api/recommendations/stats/${userId}`, {
        cacheTTL: 15 * 60 * 1000 // 15분 캐싱
      });
      return response.data;
    } catch (error) {
      console.error('추천 통계 조회 실패:', error);
      return this.getMockRecommendationStats(userId);
    }
  }

  private getMockRecommendationStats(userId: string): RecommendationStats {
    return {
      userId,
      totalRecommendations: 150,
      clickThroughRate: 0.25,
      applicationRate: 0.12,
      bookmarkRate: 0.08,
      averageRelevanceScore: 0.78,
      topCategories: ['웹개발', 'AI', '모바일앱'],
      topSkills: ['React', 'Python', 'TypeScript'],
      performanceMetrics: {
        averageResponseTime: 245,
        cacheHitRate: 0.65,
        algorithmPerformance: {
          'user-based': { precision: 0.72, recall: 0.68, f1Score: 0.70 },
          'project-similarity': { precision: 0.78, recall: 0.65, f1Score: 0.71 },
          'popularity': { precision: 0.65, recall: 0.85, f1Score: 0.73 },
          'hybrid': { precision: 0.75, recall: 0.74, f1Score: 0.74 }
        }
      }
    };
  }

  /**
   * 캐시 통계 조회
   */
  getCacheStats(): { size: number; hitRate: number; entries: number } {
    const entries = Array.from(this.cache.values());
    const totalHits = entries.reduce((sum, entry) => sum + entry.hitCount, 0);
    const totalRequests = entries.length;
    
    return {
      size: this.cache.size,
      hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
      entries: entries.length
    };
  }

  /**
   * 캐시 초기화
   */
  clearCache(): void {
    this.cache.clear();
    console.log('✅ 추천 캐시 초기화 완료');
  }
}

// 싱글톤 인스턴스 생성
export const recommendationService = new RecommendationService();
export default recommendationService;