'use client';

import { motion } from 'framer-motion';
import { useThemeStore } from '@/store/theme';
import { useEffect, useState } from 'react';

export default function ThemeToggle(): JSX.Element {
  const { isDarkMode, toggleTheme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // 하이드레이션 이슈 방지 및 초기 테마 설정
  useEffect(() => {
    setMounted(true);
    
    // 시스템 다크모드 감지 및 초기 설정
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Zustand persist는 JSON 형태로 저장하므로 파싱 필요
    const savedThemeData = localStorage.getItem('theme-storage');
    let savedTheme = null;
    
    try {
      if (savedThemeData) {
        const parsed = JSON.parse(savedThemeData);
        savedTheme = parsed.state?.isDarkMode;
      }
    } catch (e) {
      console.log('테마 데이터 파싱 실패:', e);
    }
    
    if (savedTheme === null || savedTheme === undefined) {
      // 저장된 테마가 없으면 시스템 설정 사용
      setTheme(mediaQuery.matches);
    } else {
      // 저장된 테마가 있으면 DOM에 적용
      setTheme(savedTheme);
    }
    
    // 시스템 테마 변경 감지
    const handleChange = (e: MediaQueryListEvent) => {
      const currentSavedData = localStorage.getItem('theme-storage');
      if (!currentSavedData) {
        setTheme(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-gray-300 rounded-full flex items-center">
        <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
      </div>
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative w-14 h-7 rounded-full flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${isDarkMode 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-400'
        }
      `}
      whileTap={{ scale: 0.95 }}
    >
      {/* 토글 배경 효과 */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0"
          animate={{ opacity: isDarkMode ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* 슬라이더 */}
      <motion.div
        className={`
          w-5 h-5 rounded-full shadow-lg flex items-center justify-center
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        `}
        animate={{ 
          x: isDarkMode ? 28 : 4,
          rotate: isDarkMode ? 180 : 0
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30 
        }}
      >
        {/* 아이콘 */}
        <motion.div
          animate={{ 
            scale: isDarkMode ? 1 : 1.2,
            rotate: isDarkMode ? 0 : 180
          }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? (
            // 달 아이콘
            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" clipRule="evenodd" />
            </svg>
          ) : (
            // 해 아이콘
            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          )}
        </motion.div>
      </motion.div>
      
      {/* 배경 별들 (다크모드일 때) */}
      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <motion.div
            className="absolute top-1 left-2 w-0.5 h-0.5 bg-white rounded-full"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="absolute top-2 right-2 w-0.5 h-0.5 bg-white rounded-full"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-white rounded-full"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
        </div>
      )}
    </motion.button>
  );
} 