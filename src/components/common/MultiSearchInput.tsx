'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { X, Search } from 'lucide-react';

interface MultiSearchInputProps {
  searchTerms: string[];
  onSearchTermsChange: (terms: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSearchInput({
  searchTerms,
  onSearchTermsChange,
  placeholder = "검색어를 입력하고 Enter를 누르세요 (여러 검색어 지원)",
  className = ""
}: MultiSearchInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTerm = inputValue.trim();
      
      // 중복 검색어 방지
      if (!searchTerms.includes(newTerm)) {
        onSearchTermsChange([...searchTerms, newTerm]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && searchTerms.length > 0) {
      // 입력값이 없을 때 백스페이스로 마지막 태그 제거
      onSearchTermsChange(searchTerms.slice(0, -1));
    }
  };

  const removeSearchTerm = (termToRemove: string) => {
    onSearchTermsChange(searchTerms.filter(term => term !== termToRemove));
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      const newTerm = inputValue.trim();
      if (!searchTerms.includes(newTerm)) {
        onSearchTermsChange([...searchTerms, newTerm]);
      }
      setInputValue('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
        
        {/* 검색어 태그들 */}
        <div className="flex flex-wrap gap-2 mr-3">
          {searchTerms.map((term, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700"
            >
              {term}
              <button
                onClick={() => removeSearchTerm(term)}
                className="ml-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${term}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* 입력 필드 */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={searchTerms.length === 0 ? placeholder : ""}
          className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-w-0"
        />

        {/* 검색 버튼 */}
        <button
          onClick={handleSubmit}
          className="ml-3 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 flex-shrink-0"
        >
          <Search className="w-4 h-4" />
          검색
        </button>
      </div>

      {/* 도움말 텍스트 */}
      {searchTerms.length === 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
          <span>💡</span>
          여러 검색어를 입력하려면 각 검색어 후 Enter를 누르세요
        </p>
      )}
      
      {searchTerms.length > 0 && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {searchTerms.length}개의 검색어로 필터링 중
          </p>
          <button
            onClick={() => onSearchTermsChange([])}
            className="text-xs text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
          >
            모든 검색어 제거
          </button>
        </div>
      )}
    </div>
  );
}