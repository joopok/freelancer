'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({  // TONE: OK - Component name for error boundary
  error,
  reset,
}: {
  error: Error & { digest?: string };  // TONE: OK - Error type definition
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅
    console.error('애플리케이션 에러:', error);  // TONE: OK - Console logging
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            어머, 예상치 못한 일이 생겼네요
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            페이지를 불러오는 중 문제가 있었어요. 아래 버튼을 눌러 다시 시도해보세요.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            다시 시도
          </button>
          
          <Link
            href="/"
            className="inline-block text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
          >
            홈으로 돌아가기
          </Link>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
              개발자 정보 (개발 모드에서만 표시)
            </summary>
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-red-600 dark:text-red-400">
              {error.message}  {/* TONE: OK - Technical error details for developers */}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}