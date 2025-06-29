'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function BlogMenuSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL NEW');

  // 메인 카테고리
  const mainCategories = [
    'ALL NEW', '개발 테크', '디자인 테크', '구매 테크', 
    '인사 테크', '홍보 & 마케팅 테크', '물류 테크',
    '전략 테크', '제조 테크', '밸런스 UP',
    '실리콘밸리 AI 칼럼',
  ];

  return (
    <div>
      {/* 검색바 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="관심있는 키워드로 검색해 보세요"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 메인 네비게이션 */}
      <nav className="border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex overflow-x-auto no-scrollbar">
            {mainCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-4 py-4 whitespace-nowrap text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  activeCategory === category 
                    ? 'text-blue-600 dark:text-blue-400 font-bold' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {/* 활성 탭 배경 하이라이트 */}
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      duration: 0.5
                    }}
                  />
                )}
                
                {/* 활성 탭 하단 인디케이터 */}
                {activeCategory === category && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-t-full"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      duration: 0.6
                    }}
                  />
                )}
                
                {/* 텍스트 애니메이션 */}
                <motion.span 
                  className="relative z-10"
                  animate={{
                    scale: activeCategory === category ? 1.05 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  {category}
                </motion.span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
