'use client';

import React, { memo, useCallback } from 'react';
import { useNumberFormat } from '@/hooks/useNumberFormat';

interface ProjectFiltersProps {
  selectedSkills: string[];
  selectedWorkType: string;
  selectedExperienceLevel: string;
  selectedLocation: string;
  minBudget?: number;
  maxBudget?: number;
  sortBy: string;
  onSkillToggle: (skill: string) => void;
  onWorkTypeChange: (value: string) => void;
  onExperienceLevelChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onBudgetRangeChange: (min?: number, max?: number) => void;
  onSortByChange: (value: string) => void;
  onResetFilters: () => void;
}

// 기술 스택 필터 컴포넌트
const SkillFilter = memo(({ 
  skills, 
  selectedSkills, 
  onToggle 
}: { 
  skills: string[]; 
  selectedSkills: string[]; 
  onToggle: (skill: string) => void;
}) => (
  <div>
    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
      <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
      기술 스택
    </h3>
    <div className="grid grid-cols-3 gap-2">
      {skills.map((skill) => (
        <button
          key={skill}
          onClick={() => onToggle(skill)}
          className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
            selectedSkills.includes(skill)
              ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600'
              : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
          }`}
        >
          {skill}
        </button>
      ))}
    </div>
  </div>
));

SkillFilter.displayName = 'SkillFilter';

// 셀렉트 박스 컴포넌트
const SelectFilter = memo(({ 
  label, 
  value, 
  onChange, 
  options 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
        >
          <option value="">전체</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
});

SelectFilter.displayName = 'SelectFilter';

// 예산 범위 필터 컴포넌트
const BudgetRangeFilter = memo(({ 
  minBudget, 
  maxBudget, 
  onChange 
}: { 
  minBudget?: number; 
  maxBudget?: number; 
  onChange: (min?: number, max?: number) => void;
}) => {
  const { formatNumber } = useNumberFormat();
  
  const handleBudgetSelect = useCallback((range: string) => {
    switch (range) {
      case '1000-3000':
        onChange(1000, 3000);
        break;
      case '3000-5000':
        onChange(3000, 5000);
        break;
      case '5000-7000':
        onChange(5000, 7000);
        break;
      case '7000+':
        onChange(7000, undefined);
        break;
      default:
        onChange(undefined, undefined);
    }
  }, [onChange]);

  const getCurrentRange = () => {
    if (!minBudget && !maxBudget) return '';
    if (minBudget === 1000 && maxBudget === 3000) return '1000-3000';
    if (minBudget === 3000 && maxBudget === 5000) return '3000-5000';
    if (minBudget === 5000 && maxBudget === 7000) return '5000-7000';
    if (minBudget === 7000 && !maxBudget) return '7000+';
    return 'custom';
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">예산 범위 (만원)</label>
      <div className="relative">
        <select
          value={getCurrentRange()}
          onChange={(e) => handleBudgetSelect(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
        >
          <option value="">전체</option>
          <option value="1000-3000">{formatNumber(1000)} - {formatNumber(3000)}만원</option>
          <option value="3000-5000">{formatNumber(3000)} - {formatNumber(5000)}만원</option>
          <option value="5000-7000">{formatNumber(5000)} - {formatNumber(7000)}만원</option>
          <option value="7000+">{formatNumber(7000)}만원 이상</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
});

BudgetRangeFilter.displayName = 'BudgetRangeFilter';

// 메인 필터 컴포넌트
const ProjectFilters = memo((props: ProjectFiltersProps) => {
  const {
    selectedSkills,
    selectedWorkType,
    selectedExperienceLevel,
    selectedLocation,
    minBudget,
    maxBudget,
    sortBy,
    onSkillToggle,
    onWorkTypeChange,
    onExperienceLevelChange,
    onLocationChange,
    onBudgetRangeChange,
    onSortByChange,
    onResetFilters
  } = props;

  const allSkills = [
    'AWS', 'Figma', 'Node.js',
    'Python', 'React', 'Kubernetes',
    'Adobe XD', 'Docker', 'Terraform',
    'TensorFlow', 'MongoDB', 'Sketch',
    'Prototyping', 'Vue.js', 'Java',
    'Flutter', 'Swift', 'User Research',
    'Redux', 'Nuxt.js'
  ];

  const workTypeOptions = [
    { value: '상주', label: '상주' },
    { value: '재택', label: '재택' },
    { value: '혼합', label: '혼합' }
  ];

  const experienceLevelOptions = [
    { value: '주니어', label: '주니어 (1-3년)' },
    { value: '미드레벨', label: '미드레벨 (4-6년)' },
    { value: '시니어', label: '시니어 (7년 이상)' }
  ];

  const locationOptions = [
    { value: '서울', label: '서울' },
    { value: '경기', label: '경기' },
    { value: '인천', label: '인천' },
    { value: '부산', label: '부산' },
    { value: '대구', label: '대구' },
    { value: '광주', label: '광주' },
    { value: '대전', label: '대전' },
    { value: '기타', label: '기타' }
  ];

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'budget_high', label: '예산 높은순' },
    { value: 'budget_low', label: '예산 낮은순' },
    { value: 'deadline', label: '마감임박순' }
  ];

  // 필터가 적용되었는지 확인
  const hasActiveFilters = selectedSkills.length > 0 || 
    selectedWorkType || 
    selectedExperienceLevel || 
    selectedLocation || 
    minBudget || 
    maxBudget;

  return (
    <div className="space-y-6">
      {/* 기술 스택 필터 */}
      <SkillFilter
        skills={allSkills}
        selectedSkills={selectedSkills}
        onToggle={onSkillToggle}
      />

      {/* 근무 형태 필터 */}
      <SelectFilter
        label="근무 형태"
        value={selectedWorkType}
        onChange={onWorkTypeChange}
        options={workTypeOptions}
      />

      {/* 경력 수준 필터 */}
      <SelectFilter
        label="경력 수준"
        value={selectedExperienceLevel}
        onChange={onExperienceLevelChange}
        options={experienceLevelOptions}
      />

      {/* 지역 필터 */}
      <SelectFilter
        label="지역"
        value={selectedLocation}
        onChange={onLocationChange}
        options={locationOptions}
      />

      {/* 예산 범위 필터 */}
      <BudgetRangeFilter
        minBudget={minBudget}
        maxBudget={maxBudget}
        onChange={onBudgetRangeChange}
      />

      {/* 정렬 필터 */}
      <SelectFilter
        label="정렬"
        value={sortBy}
        onChange={onSortByChange}
        options={sortOptions}
      />

      {/* 필터 초기화 버튼 */}
      {hasActiveFilters && (
        <button
          onClick={onResetFilters}
          className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          필터 초기화
        </button>
      )}
    </div>
  );
});

ProjectFilters.displayName = 'ProjectFilters';

export default ProjectFilters;