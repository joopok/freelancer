'use client';

import React from 'react';

interface AthomeFilterProps {
  allSkills: string[];
  selectedSkills: string[];
  toggleSkillFilter: (skill: string) => void;
  selectedDuration: string;
  handleDurationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedBudget: string;
  handleBudgetChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  resetFilters: () => void;
}

export function AthomeFilter({
  allSkills,
  selectedSkills,
  toggleSkillFilter,
  selectedDuration,
  handleDurationChange,
  selectedBudget,
  handleBudgetChange,
  sortBy,
  setSortBy,
  resetFilters,
}: AthomeFilterProps) {
  return (
    <div className="lg:w-80 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md h-fit border border-gray-100 dark:border-gray-700 sticky top-8 transition-colors duration-300">
      <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-4 flex items-center transition-colors duration-300">
        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        프로젝트 필터
      </h3>

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          기술 스택
        </h4>
        <div className="flex flex-wrap gap-2">
          {allSkills.map(skill => (
            <button
              key={skill}
              onClick={() => toggleSkillFilter(skill)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all ${selectedSkills.includes(skill)
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          개발 기간
        </h4>
        <select
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all appearance-none bg-no-repeat bg-right pr-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
          value={selectedDuration}
          onChange={handleDurationChange}
        >
          <option value="">전체</option>
          <option value="3">3개월 이내</option>
          <option value="6">6개월 이내</option>
          <option value="12">12개월 이내</option>
        </select>
      </div>

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          예산
        </h4>
        <select
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all appearance-none bg-no-repeat bg-right pr-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
          value={selectedBudget}
          onChange={handleBudgetChange}
        >
          <option value="">전체</option>
          <option value="3000000">300만원 이상</option>
          <option value="5000000">500만원 이상</option>
          <option value="10000000">1,000만원 이상</option>
          <option value="30000000">3,000만원 이상</option>
          <option value="50000000">5,000만원 이상</option>
        </select>
      </div>

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          정렬
        </h4>
        <select
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all appearance-none bg-no-repeat bg-right pr-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">기본 정렬</option>
          <option value="latest">최신순</option>
          <option value="budget">금액 높은순</option>
          <option value="duration">기간 긴순</option>
          <option value="deadline">마감일 임박순</option>
        </select>
      </div>

      <button
        onClick={resetFilters}
        className="w-full py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-gray-200 rounded-xl transition-all text-sm font-medium border border-gray-200 dark:border-gray-600 hover:shadow-sm flex items-center justify-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        필터 초기화
      </button>
    </div>
  );
}