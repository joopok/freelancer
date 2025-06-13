'use client';

import React, { useState } from 'react';

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
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="관심있는 키워드로 검색해 보세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 메인 네비게이션 */}
      <nav className="border-b sticky top-0 bg-white z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar">
            {mainCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-4 whitespace-nowrap text-sm font-medium border-b-2 transition-colors ${activeCategory === category ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
