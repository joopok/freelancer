import { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface UseApiOptions extends AxiosRequestConfig {
  autoFetch?: boolean; // 컴포넌트 마운트 시 자동 호출 여부
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

// Generic API Hook
export function useApi<T = any>(
  url: string,
  options?: UseApiOptions
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { autoFetch = true, onSuccess, onError, ...axiosConfig } = options || {};
  
  // useRef로 콜백 함수들을 저장하여 의존성 문제 해결
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const axiosConfigRef = useRef(axiosConfig);
  
  // 참조 업데이트
  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    axiosConfigRef.current = axiosConfig;
  });
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios({
        url,
        method: 'GET',
        ...axiosConfigRef.current,
      });
      
      // API 응답 구조에 따라 데이터 추출
      let responseData;
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        // Spring Boot ApiResponse 형식
        responseData = response.data.data;
      } else {
        // 일반 응답
        responseData = response.data;
      }
      
      setData(responseData);
      
      if (onSuccessRef.current) {
        onSuccessRef.current(responseData);
      }
    } catch (err) {
      const error = err as AxiosError;
      setError(error);
      
      if (onErrorRef.current) {
        onErrorRef.current(error);
      }
      
      console.error(`API Error (${url}):`, error.message);
    } finally {
      setLoading(false);
    }
  }, [url]);
  
  // 자동 호출 - 마운트 시 한 번만 실행
  useEffect(() => {
    let isMounted = true;
    
    if (autoFetch && isMounted) {
      fetchData();
    }
    
    return () => {
      isMounted = false;
    };
  }, [url]); // autoFetch는 의존성에서 제외
  
  // 수동으로 데이터 업데이트
  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);
  
  return {
    data,
    loading,
    error,
    refetch: fetchData,
    mutate,
  };
}

// POST, PUT, DELETE 등을 위한 Mutation Hook
interface UseMutationOptions<TData = any, TVariables = any> extends Omit<AxiosRequestConfig, 'data'> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: any, variables: TVariables) => void;
}

interface UseMutationReturn<TData, TVariables> {
  data: TData | null;
  loading: boolean;
  error: Error | null;
  mutate: (variables: TVariables) => Promise<TData | null>;
  reset: () => void;
}

export function useMutation<TData = any, TVariables = any>(
  url: string | ((variables: TVariables) => string),
  options?: UseMutationOptions<TData, TVariables>
): UseMutationReturn<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { onSuccess, onError, method = 'POST', ...axiosConfig } = options || {};
  
  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setLoading(true);
      setError(null);
      
      const finalUrl = typeof url === 'function' ? url(variables) : url;
      
      const response = await axios({
        url: finalUrl,
        method,
        data: variables,
        ...axiosConfig,
      });
      
      const responseData = response.data.data || response.data;
      setData(responseData);
      
      if (onSuccess) {
        onSuccess(responseData, variables);
      }
      
      return responseData;
    } catch (err) {
      const error = err as AxiosError;
      setError(error);
      
      if (onError) {
        onError(error, variables);
      }
      
      console.error(`Mutation Error (${url}):`, error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, method, axiosConfig, onSuccess, onError]);
  
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);
  
  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

// 특정 API를 위한 커스텀 훅들
export function useCategories() {
  return useApi<any[]>('/api/categories');
}

export function useFreelancers(params?: any) {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  return useApi<any[]>(`/api/freelancers${queryString}`);
}

export function useProjects(params?: any) {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  return useApi<any[]>(`/api/projects${queryString}`);
}