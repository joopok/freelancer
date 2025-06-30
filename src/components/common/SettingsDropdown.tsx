'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';

interface SettingsDropdownProps {
  className?: string;
}

export default function SettingsDropdown({ className = '' }: SettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const router = useRouter();

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      logout();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth-storage');
      }
      router.push('/');
      setIsOpen(false);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  const menuItems = [
    {
      icon: '👤',
      label: '프로필',
      href: '/profile',
      description: '프로필 정보 관리'
    },
    {
      icon: '⚙️',
      label: '설정',
      href: '/settings',
      description: '계정 및 환경 설정'
    },
    {
      icon: '🔔',
      label: '알림',
      href: '/notifications',
      description: '알림 센터'
    },
    {
      icon: '📋',
      label: '대시보드',
      href: '/dashboard',
      description: '활동 현황'
    },
    {
      icon: '💳',
      label: '결제 관리',
      href: '/billing',
      description: '결제 및 구독 관리'
    },
    {
      icon: '📞',
      label: '고객 지원',
      href: '/support',
      description: '도움말 및 문의'
    },
  ];

  const themeOptions = [
    { value: 'light', label: '라이트', icon: '☀️' },
    { value: 'dark', label: '다크', icon: '🌙' },
    { value: 'system', label: '시스템', icon: '⚙️' },
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 설정 버튼 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 group"
        aria-label="설정 메뉴"
      >
        <motion.svg
          className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </motion.svg>
      </motion.button>

      {/* 드롭다운 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            {/* 사용자 정보 헤더 */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.name || user?.username || '사용자'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* 테마 설정 */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                테마 설정
              </div>
              <div className="flex space-x-1">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value as any)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      theme === option.value
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-base">{option.icon}</span>
                      <span className="text-xs">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 메뉴 아이템들 */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
                >
                  <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            {/* 로그아웃 버튼 */}
            <div className="border-t border-gray-200 dark:border-gray-600 p-2">
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 group"
              >
                <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                  🚪
                </span>
                <div className="flex-1 text-left">
                  <div className="font-medium">로그아웃</div>
                  <div className="text-xs text-red-500 dark:text-red-400">
                    현재 세션에서 로그아웃
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}