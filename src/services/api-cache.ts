/**
 * API Cache Service
 * 
 * 효율적인 API 응답 캐싱을 위한 서비스
 * - TTL 기반 캐시 만료
 * - 패턴 기반 캐시 무효화
 * - 메모리 효율적인 Map 구조
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5분 기본 TTL
  private maxCacheSize = 100; // 최대 캐시 항목 수

  /**
   * 캐시에서 데이터 가져오기
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // TTL 확인
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * 캐시에 데이터 저장
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // 캐시 크기 제한 확인
    if (this.cache.size >= this.maxCacheSize) {
      // 가장 오래된 항목 제거 (FIFO)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  /**
   * 패턴에 맞는 캐시 무효화
   */
  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // 패턴에 맞는 키들 찾아서 삭제
    Array.from(this.cache.keys())
      .filter(key => key.includes(pattern))
      .forEach(key => this.cache.delete(key));
  }

  /**
   * 특정 키 무효화
   */
  invalidateKey(key: string): void {
    this.cache.delete(key);
  }

  /**
   * 캐시 존재 여부 확인
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // TTL 확인
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * 캐시 크기 가져오기
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * 만료된 캐시 정리
   */
  cleanup(): void {
    const now = Date.now();
    Array.from(this.cache.entries()).forEach(([key, item]) => {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * 캐시 통계 가져오기
   */
  getStats(): {
    size: number;
    keys: string[];
    oldestEntry: number | null;
  } {
    const keys = Array.from(this.cache.keys());
    let oldestTimestamp: number | null = null;

    this.cache.forEach(item => {
      if (!oldestTimestamp || item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
      }
    });

    return {
      size: this.cache.size,
      keys,
      oldestEntry: oldestTimestamp
    };
  }
}

// 싱글톤 인스턴스 export
export const apiCache = new APICache();

// 주기적인 캐시 정리 (10분마다)
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 10 * 60 * 1000);
}