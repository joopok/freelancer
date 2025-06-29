'use client';

export default function JobSearchBar() {
  return (
    <div className="mb-8">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200"
        />
        <button className="bg-blue-500 dark:bg-blue-600 text-white px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-200">
          검색
        </button>
      </div>
      <div className="flex gap-2">
        <select className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200">
          <option>지역선택</option>
          <option>서울</option>
          <option>경기</option>
        </select>
        <select className="border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-200">
          <option>경력선택</option>
          <option>신입</option>
          <option>경력</option>
        </select>
      </div>
    </div>
  );
} 