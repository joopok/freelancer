import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 * 
 * 값의 변경을 지연시켜 과도한 업데이트를 방지합니다.
 * 주로 검색 입력, API 호출 등에 사용됩니다.
 * 
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운스된 값
 * 
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // API 호출 등의 작업 수행
 *     fetchSearchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 클린업 함수: 값이 변경되면 이전 타이머를 취소
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useDebounceCallback Hook
 * 
 * 함수 호출을 디바운스합니다.
 * 연속적인 호출을 하나의 호출로 그룹화합니다.
 * 
 * @param callback - 디바운스할 함수
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운스된 함수
 * 
 * @example
 * ```tsx
 * const handleSearch = useDebounceCallback((searchTerm: string) => {
 *   console.log('Searching for:', searchTerm);
 *   // API 호출 등의 작업 수행
 * }, 500);
 * 
 * <input onChange={(e) => handleSearch(e.target.value)} />
 * ```
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const debouncedCallback = (...args: Parameters<T>) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  };

  return debouncedCallback;
}

// 기본 export
export default useDebounce;