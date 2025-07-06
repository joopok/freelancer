'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => Promise<void>;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export default function BookmarkButton({
  isBookmarked,
  onToggle,
  count = 0,
  size = 'md',
  showCount = false,
  className = ''
}: BookmarkButtonProps) {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [localBookmarked, setLocalBookmarked] = useState(isBookmarked);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = async () => {
    if (!isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setLocalBookmarked(!localBookmarked); // Optimistic update

    try {
      await onToggle();
    } catch (error) {
      // Revert on error
      setLocalBookmarked(localBookmarked);
      console.error('Failed to toggle bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center space-x-1 transition-all ${
        localBookmarked 
          ? 'text-yellow-500 hover:text-yellow-600' 
          : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {localBookmarked ? (
        <BookmarkCheck className={sizeClasses[size]} />
      ) : (
        <Bookmark className={sizeClasses[size]} />
      )}
      {showCount && (
        <span className="text-sm font-medium">
          {count + (localBookmarked !== isBookmarked ? (localBookmarked ? 1 : -1) : 0)}
        </span>
      )}
    </button>
  );
}