import React from 'react';

interface FreelancerFiltersProps {
  skillsLoading: boolean;
  allSkills: string[];
  selectedSkills: string[];
  toggleSkillFilter: (skill: string) => void;
  isFiltering: boolean;
  selectedExperience: string;
  handleExperienceChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedRating: string;
  setSelectedRating: (value: string) => void;
  hourlyRateMin: string;
  setHourlyRateMin: (value: string) => void;
  hourlyRateMax: string;
  setHourlyRateMax: (value: string) => void;
  selectedProjectCount: string;
  setSelectedProjectCount: (value: string) => void;
  selectedAvailability: string;
  setSelectedAvailability: (value: string) => void;
  selectedType: string;
  handleTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortBy: string;
  handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  resetFilters: () => void;
  searchTerms: string[];
  setSearchTerms: (terms: string[]) => void;
}

const FreelancerFilters: React.FC<FreelancerFiltersProps> = ({
  skillsLoading,
  allSkills,
  selectedSkills,
  toggleSkillFilter,
  isFiltering,
  selectedExperience,
  handleExperienceChange,
  selectedRating,
  setSelectedRating,
  hourlyRateMin,
  setHourlyRateMin,
  hourlyRateMax,
  setHourlyRateMax,
  selectedProjectCount,
  setSelectedProjectCount,
  selectedAvailability,
  setSelectedAvailability,
  selectedType,
  handleTypeChange,
  sortBy,
  handleSortChange,
  resetFilters,
  searchTerms,
  setSearchTerms,
}) => {
  return (
    <div className="lg:w-80 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md h-fit border border-gray-100 dark:border-gray-700 sticky top-8 transition-colors duration-300">
      <h3 className="text-xl font-bold mb-8 text-gray-900 dark:text-white border-b dark:border-gray-700 pb-4 flex items-center transition-colors duration-300">
        <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        프리랜서 필터
      </h3>

      {(selectedSkills.length > 0 || selectedExperience || selectedType || selectedRating ||
        hourlyRateMin || hourlyRateMax || selectedProjectCount || selectedAvailability ||
        searchTerms.length > 0) && (
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300">적용된 필터</h5>
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              모두 제거
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchTerms.map((term, index) => (
              <span key={`search-${index}`} className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {term}
                <button
                  onClick={() => setSearchTerms(searchTerms.filter((_, i) => i !== index))}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedSkills.map(skill => (
              <span key={skill} className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                {skill}
                <button
                  onClick={() => toggleSkillFilter(skill)}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedExperience && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                경력: {
                  selectedExperience === '1' ? '1년 미만' :
                    selectedExperience === '3' ? '1-3년' :
                      selectedExperience === '5' ? '3-5년' :
                        selectedExperience === '7' ? '5-7년' :
                          selectedExperience === '10' ? '7-10년' : '10년 이상'
                }
                <button
                  onClick={() => handleExperienceChange({ target: { value: '' } } as React.ChangeEvent<HTMLSelectElement>)}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            )}
            {selectedType && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                타입: {selectedType}
                <button
                  onClick={() => handleTypeChange({ target: { value: '' } } as React.ChangeEvent<HTMLSelectElement>)}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            )}
            {selectedRating && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                평점: {selectedRating}점 이상
                <button
                  onClick={() => setSelectedRating('')}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            )}
            {(hourlyRateMin || hourlyRateMax) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                시급: {hourlyRateMin || '0'} ~{hourlyRateMax || '∞'} 만원
                <button
                  onClick={() => { setHourlyRateMin(''); setHourlyRateMax(''); }}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            )}
            {selectedProjectCount && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                프로젝트: {selectedProjectCount}건 이상
                <button
                  onClick={() => setSelectedProjectCount('')}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            )}
            {selectedAvailability && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-gray-800 rounded-full text-xs border border-blue-200 dark:border-blue-700">
                시간대: {
                  selectedAvailability === 'fulltime' ? '풀타임' :
                    selectedAvailability === 'parttime' ? '파트타임' :
                      selectedAvailability === 'weekend' ? '주말 가능' : '저녁 가능'
                }
                <button
                  onClick={() => setSelectedAvailability('')}
                  className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          기술 스택
          {skillsLoading && (
            <div className="ml-2 w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </h4>
        <div className="flex flex-wrap gap-2">
          {skillsLoading ? (
            <div className="w-full text-center text-gray-500 dark:text-gray-400 text-sm py-4">
              기술 스택 로딩 중...
            </div>
          ) : allSkills.length > 0 ? (
            allSkills.map(skill => (
              <button
                key={skill}
                onClick={() => toggleSkillFilter(skill)}
                disabled={isFiltering}
                className={`text-xs px-3 py-1.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedSkills.includes(skill)
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}
              >
                {skill}
              </button>
            ))
          ) : (
            <div className="w-full text-center text-gray-500 dark:text-gray-400 text-sm py-4">
              기술 스택을 불러올 수 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          경력
        </h4>
        <select
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
          value={selectedExperience}
          onChange={handleExperienceChange}
          disabled={isFiltering}
        >
          <option value="">전체</option>
          <option value="1">1년 미만</option>
          <option value="3">1-3년</option>
          <option value="5">3-5년</option>
          <option value="7">5-7년</option>
          <option value="10">7-10년</option>
          <option value="11">10년 이상</option>
        </select>
      </div>

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          평점
        </h4>
        <select
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          disabled={isFiltering}
        >
          <option value="">전체</option>
          <option value="4.5">4.5점 이상</option>
          <option value="4.0">4.0점 이상</option>
          <option value="3.5">3.5점 이상</option>
          <option value="3.0">3.0점 이상</option>
        </select>
      </div>

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          프로젝트 완료 수
        </h4>
        <select
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
          value={selectedProjectCount}
          onChange={(e) => setSelectedProjectCount(e.target.value)}
          disabled={isFiltering}
        >
          <option value="">전체</option>
          <option value="5">5건 이상</option>
          <option value="10">10건 이상</option>
          <option value="20">20건 이상</option>
          <option value="50">50건 이상</option>
        </select>
      </div>

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          작업 시간대
        </h4>
        <select
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
          disabled={isFiltering}
        >
          <option value="">전체</option>
          <option value="fulltime">풀타임 가능</option>
          <option value="parttime">파트타임</option>
          <option value="weekend">주말 가능</option>
          <option value="evening">저녁 가능</option>
        </select>
      </div>

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          타입
        </h4>
        <select
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
          value={selectedType}
          onChange={handleTypeChange}
          disabled={isFiltering}
        >
          <option value="">전체</option>
          <option value="개인">개인</option>
          <option value="팀">팀</option>
          <option value="법인사업자">법인사업자</option>
        </select>
      </div>

      <div className="mb-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
          <svg className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          정렬
        </h4>
        <select
          className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 focus:border-blue-400 transition-all appearance-none bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
          value={sortBy}
          onChange={handleSortChange}
          disabled={isFiltering}
        >
          <option value="">기본 정렬</option>
          <option value="viewCount">인기순(조회수)</option>
          <option value="rating">평점 높은순</option>
          <option value="hourlyRateHigh">시급 높은순</option>
          <option value="hourlyRateLow">시급 낮은순</option>
          <option value="experience">경력순</option>
          <option value="recentActivity">최근 활동순</option>
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
};

export default FreelancerFilters; 