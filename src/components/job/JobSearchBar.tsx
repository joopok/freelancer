'use client';

export default function JobSearchBar() {
  return (
    <div className="mb-8">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="flex-1 border rounded p-2"
        />
        <button className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600">
          검색
        </button>
      </div>
      <div className="flex gap-2">
        <select className="border rounded p-2">
          <option>지역선택</option>
          <option>서울</option>
          <option>경기</option>
        </select>
        <select className="border rounded p-2">
          <option>경력선택</option>
          <option>신입</option>
          <option>경력</option>
        </select>
      </div>
    </div>
  );
} 