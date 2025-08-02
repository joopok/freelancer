/**
 * Cached API Service
 * 
 * 기존 API 서비스를 래핑하여 캐싱 기능 추가
 * - GET 요청 자동 캐싱
 * - 변경 작업 시 관련 캐시 자동 무효화
 * - 캐시 TTL 커스터마이징 지원
 */

import api from '@/utils/api';
import { apiCache } from './api-cache';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

interface CachedApiConfig extends AxiosRequestConfig {
  cacheTTL?: number; // 커스텀 TTL (밀리초)
  skipCache?: boolean; // 캐시 건너뛰기
  cacheKey?: string; // 커스텀 캐시 키
}

class CachedAPI {
  /**
   * 캐시 키 생성
   */
  private generateCacheKey(method: string, url: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${method}:${url}:${paramString}`;
  }

  /**
   * URL에서 리소스 타입 추출 (캐시 무효화용)
   */
  private extractResourceType(url: string): string {
    // /api/projects/123 -> projects
    // /api/freelancers -> freelancers
    const parts = url.split('/').filter(Boolean);
    return parts[1] || parts[0] || '';
  }

  /**
   * GET 요청 (캐싱 지원)
   */
  async get<T = any>(url: string, config?: CachedApiConfig): Promise<AxiosResponse<T>> {
    // 캐시 건너뛰기 옵션 확인
    if (config?.skipCache) {
      return api.get<T>(url, config);
    }

    // 캐시 키 생성
    const cacheKey = config?.cacheKey || this.generateCacheKey('GET', url, config?.params);
    
    // 캐시 확인
    const cached = apiCache.get<AxiosResponse<T>>(cacheKey);
    if (cached) {
      // 캐시된 응답 반환 (캐시 히트)
      // 헤더에 캐시 정보 추가 (읽기 전용이므로 새 객체로 반환)
      return {
        ...cached,
        headers: {
          ...cached.headers,
          'x-cache': 'HIT'
        }
      };
    }
    
    // API 호출
    const response = await api.get<T>(url, config);
    
    // 응답 캐싱
    apiCache.set(cacheKey, response, config?.cacheTTL);
    
    // 캐시 미스 정보를 헤더에 추가
    const responseWithCacheInfo = {
      ...response,
      headers: {
        ...response.headers,
        'x-cache': 'MISS'
      }
    };
    
    return responseWithCacheInfo;
  }

  /**
   * POST 요청 (캐시 무효화 포함)
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await api.post<T>(url, data, config);
    
    // 관련 캐시 무효화
    const resourceType = this.extractResourceType(url);
    if (resourceType) {
      apiCache.invalidate(resourceType);
    }
    
    return response;
  }

  /**
   * PUT 요청 (캐시 무효화 포함)
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await api.put<T>(url, data, config);
    
    // 관련 캐시 무효화
    const resourceType = this.extractResourceType(url);
    if (resourceType) {
      apiCache.invalidate(resourceType);
    }
    
    return response;
  }

  /**
   * PATCH 요청 (캐시 무효화 포함)
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await api.patch<T>(url, data, config);
    
    // 관련 캐시 무효화
    const resourceType = this.extractResourceType(url);
    if (resourceType) {
      apiCache.invalidate(resourceType);
    }
    
    return response;
  }

  /**
   * DELETE 요청 (캐시 무효화 포함)
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response = await api.delete<T>(url, config);
    
    // 관련 캐시 무효화
    const resourceType = this.extractResourceType(url);
    if (resourceType) {
      apiCache.invalidate(resourceType);
    }
    
    return response;
  }

  /**
   * 특정 패턴의 캐시 무효화
   */
  invalidateCache(pattern?: string): void {
    apiCache.invalidate(pattern);
  }

  /**
   * 전체 캐시 초기화
   */
  clearCache(): void {
    apiCache.invalidate();
  }

  /**
   * 캐시 상태 확인
   */
  getCacheStats() {
    return apiCache.getStats();
  }
}

// 싱글톤 인스턴스 export
export const cachedApi = new CachedAPI();

// 기본 export (기존 api와 호환)
export default cachedApi;