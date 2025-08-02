import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  renderCount: number;
  timestamp: number;
}

interface PerformanceMonitorOptions {
  enableLogging?: boolean;
  enableAnalytics?: boolean;
  threshold?: number; // 성능 경고 임계값 (ms)
}

// 전역 윈도우 타입 확장
declare global {
  interface Window {
    gtag?: (
      type: string,
      action: string,
      parameters: {
        event_category?: string;
        event_label?: string;
        value?: number;
        custom_map?: Record<string, any>;
      }
    ) => void;
  }
}

/**
 * usePerformanceMonitor Hook
 * 
 * 컴포넌트의 렌더링 성능을 모니터링합니다.
 * 개발 환경에서는 콘솔에 로그를 출력하고,
 * 프로덕션 환경에서는 Google Analytics로 데이터를 전송합니다.
 * 
 * @param componentName - 모니터링할 컴포넌트 이름
 * @param options - 모니터링 옵션
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   usePerformanceMonitor('MyComponent', {
 *     enableLogging: true,
 *     threshold: 16 // 16ms 이상이면 경고
 *   });
 *   
 *   return <div>...</div>;
 * }
 * ```
 */
export function usePerformanceMonitor(
  componentName: string,
  options: PerformanceMonitorOptions = {}
) {
  const {
    enableLogging = process.env.NODE_ENV === 'development',
    enableAnalytics = process.env.NODE_ENV === 'production',
    threshold = 16, // 60fps = ~16ms per frame
  } = options;

  const renderCount = useRef(0);
  const renderStartTime = useRef<number>(0);
  const previousRenderTime = useRef<number>(0);

  // 렌더링 시작 시간 기록
  renderStartTime.current = performance.now();

  useEffect(() => {
    renderCount.current += 1;
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;
    const timeSinceLastRender = previousRenderTime.current
      ? renderEndTime - previousRenderTime.current
      : 0;

    // 성능 메트릭스 객체 생성
    const metrics: PerformanceMetrics = {
      componentName,
      renderTime,
      renderCount: renderCount.current,
      timestamp: Date.now(),
    };

    // 개발 환경에서 로깅
    if (enableLogging) {
      const logStyle = renderTime > threshold
        ? 'color: #ff6b6b; font-weight: bold;'
        : 'color: #51cf66;';

      console.log(
        `%c[Performance] ${componentName}`,
        logStyle,
        {
          renderCount: renderCount.current,
          renderTime: `${renderTime.toFixed(2)}ms`,
          timeSinceLastRender: timeSinceLastRender > 0
            ? `${timeSinceLastRender.toFixed(2)}ms`
            : 'N/A',
          threshold: `${threshold}ms`,
        }
      );

      // 임계값 초과 시 경고
      if (renderTime > threshold) {
        console.warn(
          `⚠️ Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
        );
      }
    }

    // 프로덕션 환경에서 분석 데이터 전송
    if (enableAnalytics && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        event_category: 'Performance',
        event_label: componentName,
        value: Math.round(renderTime),
        custom_map: {
          dimension1: renderCount.current,
          dimension2: renderTime > threshold ? 'slow' : 'normal',
        },
      });
    }

    // 이전 렌더링 시간 업데이트
    previousRenderTime.current = renderEndTime;
  });

  // 컴포넌트 언마운트 시 로깅
  useEffect(() => {
    return () => {
      if (enableLogging) {
        console.log(
          `[Performance] ${componentName} unmounted after ${renderCount.current} renders`
        );
      }
    };
  }, [componentName, enableLogging]);
}

/**
 * useRenderCount Hook
 * 
 * 컴포넌트의 렌더링 횟수만 추적합니다.
 * 
 * @param componentName - 컴포넌트 이름 (선택사항)
 * @returns 현재까지의 렌더링 횟수
 */
export function useRenderCount(componentName?: string): number {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;

    if (process.env.NODE_ENV === 'development' && componentName) {
      console.log(`[RenderCount] ${componentName}: ${renderCount.current}`);
    }
  });

  return renderCount.current;
}

/**
 * measurePerformance 유틸리티 함수
 * 
 * 특정 함수의 실행 시간을 측정합니다.
 * 
 * @param fn - 측정할 함수
 * @param label - 로그에 표시할 레이블
 * @returns 함수 실행 결과
 */
export function measurePerformance<T>(
  fn: () => T,
  label: string
): T {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;

    console.log(
      `[Performance] ${label}: ${duration.toFixed(2)}ms`
    );

    return result;
  }

  return fn();
}

// 기본 export
export default usePerformanceMonitor;