'use client';

import { useState, useMemo, useCallback } from 'react';
import { TechNewsItem, TechNewsCategory } from '@/types/techNews';
import TechNewsCard from './TechNewsCard';

interface TechNewsListProps {
  items: TechNewsItem[];
  categories?: TechNewsCategory[];
  showFilters?: boolean;
}

export default function TechNewsList({ 
  items, 
  categories = ['전체', '개발 테크', '실리콘밸리', 'AI 컬럼'],
  showFilters = true 
}: TechNewsListProps) {
  const [activeCategory, setActiveCategory] = useState<TechNewsCategory>('전체');
  const [searchTerm, setSearchTerm] = useState('');

  // 카테고리 변경 핸들러 메모이제이션
  const handleCategoryChange = useCallback((category: TechNewsCategory) => {
    setActiveCategory(category);
  }, []);

  // 검색어 변경 핸들러 메모이제이션
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // 필터링된 아이템 메모이제이션
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 카테고리 필터
      const categoryMatch = activeCategory === '전체' || item.category === activeCategory;
      
      // 검색어 필터 (검색어가 있을 때만 검색 수행)
      const searchMatch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tags && item.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      
      return categoryMatch && searchMatch;
    });
  }, [items, activeCategory, searchTerm]);

  // 검색 결과 없음 상태 메모이제이션
  const hasNoResults = useMemo(() => filteredItems.length === 0, [filteredItems]);

  return (
    <div className="w-full">
      {showFilters && (
        <div className="mb-8 space-y-4">
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* 검색 필터 */}
          <div className="relative">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {hasNoResults ? (
        <div className="text-center py-12 text-gray-500">
          <p>검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <TechNewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
} 