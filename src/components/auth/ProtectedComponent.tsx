'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { authService } from '@/services/auth';

interface ProtectedComponentProps {
  children: ReactNode;
  fallback?: ReactNode; // 로그인이 필요할 때 보여줄 대체 컴포넌트
  redirectToLogin?: boolean; // 로그인 페이지로 리다이렉트할지 여부
}

/**
 * 로그인이 필요한 컴포넌트를 감싸는 컴포넌트
 * 로그인되지 않은 사용자가 접근할 경우 대체 컴포넌트를 표시하거나 로그인 페이지로 리다이렉트
 */
export default function ProtectedComponent({
  children,
  fallback,
  redirectToLogin = false
}: ProtectedComponentProps) {
  const router = useRouter();
  const { isLoggedIn, setUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isLoggedIn) {
          setIsAuthenticated(true);
          setIsChecking(false);
          return;
        }

        // 세션 확인
        const response = await authService.checkSession();
        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          if (redirectToLogin) {
            // 현재 페이지 URL을 저장
            if (typeof window !== 'undefined') {
              const currentPath = window.location.pathname + window.location.search;
              sessionStorage.setItem('redirectAfterLogin', currentPath);
            }
            router.push('/login');
          }
        }
      } catch (error) {
        console.warn('인증 확인 중 오류 발생:', error);
        setIsAuthenticated(false);
        if (redirectToLogin) {
          router.push('/login');
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isLoggedIn, router, redirectToLogin, setUser]);

  if (isChecking) {
    // 인증 확인 중 로딩 표시
    return (
      <div className="flex justify-center items-center h-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // 로그인이 필요하지만 리다이렉트하지 않는 경우 대체 컴포넌트 표시
    return (
      <>
        {fallback || (
          <div className="bg-white shadow rounded-lg p-6 mt-4">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="mt-3 text-xl font-semibold text-gray-800">로그인이 필요합니다</h3>
              <p className="mt-2 text-gray-600">이 기능을 사용하려면 로그인이 필요합니다.</p>
              <button
                onClick={() => router.push('/login')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                로그인하기
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // 인증된 사용자에게 원래 컴포넌트 표시
  return <>{children}</>;
} 