"use client";

import { useState, Fragment } from "react";
import Image from "next/image";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale/ko';
import { format } from 'date-fns';

// 한국어 로케일 등록
registerLocale('ko', ko);

interface Freelancer {
  id: string;
  name: string;
  experience: string;
  type: '개인' | '팀' | '법인사업자';
  skills: string[];
  description: string;
  rating: number;
  projectCount: number;
  viewCount: number;
  proposalCount: number;
}

// 고정된 프리랜서 데이터 생성을 위한 시드 함수
const getNameByIndex = (index: number): string => {
  const surnames = ['김', '이', '박', '정', '최'];
  const surnameIndex = index % surnames.length;
  return `${surnames[surnameIndex]}${'*'.repeat(2)}`;
};

const generateFreelancers = (count: number): Freelancer[] => {
  const types: ('개인' | '팀' | '법인사업자')[] = ['개인', '팀', '법인사업자'];
  const sampleSkills = [
    ['React', 'TypeScript', 'Node.js'],
    ['Java', 'Spring', 'MySQL'],
    ['Python', 'Django', 'PostgreSQL'],
    ['Flutter', 'Dart', 'Firebase'],
    ['Vue.js', 'JavaScript', 'AWS'],
    ['Angular', 'NestJS', 'MongoDB'],
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: (i + 1).toString(),
    name: getNameByIndex(i), // 인덱스 기반으로 이름 생성
    experience: `${i % 15}년 경력`, // 일관된 경력 생성
    type: types[i % types.length], // 일관된 타입 할당
    skills: sampleSkills[i % sampleSkills.length], // 일관된 스킬 할당
    description: "안녕하세요. 열정적인 개발자입니다.",
    rating: 4 + (i % 10) / 10, // 일관된 평점 생성
    projectCount: (i % 50) + 1, // 일관된 프로젝트 수 생성
    viewCount: 10 + (i % 90),
    proposalCount: 1 + (i % 19),
  }));
};

// 프리랜서 데이터를 컴포넌트 외부에서 한 번만 생성
const freelancers = generateFreelancers(100);

const skills = [
  // 개발
  "Java", "Spring", "Node.js", "React", "Vue.js", "Angular", "TypeScript",
  "Python", "Django", "Flask", "PHP", "Laravel", "MySQL", "MongoDB", "AWS",
  "Docker", "Kubernetes", "iOS", "Android", "Flutter", "React Native",
  // 기획
  "PM", "PO", "서비스기획", "UI/UX기획", "프로덕트 기획", "IT기획",
  // 디자인
  "UI디자인", "UX디자인", "웹디자인", "앱디자인", "그래픽디자인"
];

const locations = {
  서울: ['강남구', '서초구', '영등포구', '마포구', '송파구', '강동구'],
  경기: ['성남시', '수원시', '안양시', '용인시', '부천시', '고양시'],
  인천: ['남동구', '연수구', '부평구', '서구', '중구'],
  부산: ['해운대구', '부산진구', '동래구', '남구', '수영구'],
  대구: ['중구', '동구', '서구', '남구', '북구'],
  대전: ['서구', '중구', '동구', '유성구', '대덕구'],
};

export default function FreelancerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("개발자");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedWorkType, setSelectedWorkType] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [isResetting, setIsResetting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const tabs = ["개발자", "기획자", "퍼블리셔", "디자이너", "기타"];

  const filteredFreelancers = freelancers.filter((freelancer) =>
    freelancer.name.includes(searchTerm)
  );

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredFreelancers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFreelancers.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      setSelectedSkills([]);
      setSelectedType([]);
      setSelectedWorkType([]);
      setSelectedLevel("");
      setStartDate(null);
      setSelectedCity('');
      setSelectedDistrict('');
      // 실제 API 호출이 있다면 여기서 처리
      await new Promise(resolve => setTimeout(resolve, 500)); // 시각적 효과를 위한 지연
    } finally {
      setIsResetting(false);
    }
  };

  // 날짜 포맷 함수
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return format(date, 'yyyy년 MM월 dd일');
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <section className="bg-gradient-to-br from-rose-50 to-rose-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">프리랜서</h1>
              <p className="mt-1 text-gray-600">프리미엄 IT 아웃소싱 1등</p>
              <p className="text-gray-600">이랜서가 보유하는 IT 파트너스 41만명</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm">
              프로필트 등록하기+
            </button>
          </div>
        </div>
      </section>

      {/* 탭 네비게이션 */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 relative ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 검색 영역 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="관련기술을 키워드로 검색해보세요."
              className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">최신 검색어:</span>
              <div className="flex gap-2">
                {["프론트엔드", "React", "Java", "Flutter","Swift","안드로이드","IOS"].map((keyword) => (
                  <span
                    key={keyword}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 나머지 컨텐츠 (필터 및 리스트) */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">
        {/* Left Sidebar - 3칸으로 수정 */}
        <aside className="col-span-3 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">스마트 필터</h2>
            <button 
              onClick={handleReset}
              disabled={isResetting}
              className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 rounded-full px-3 py-1"
            >
              초기화
              {isResetting && (
                <svg 
                  className="animate-spin h-4 w-4 text-blue-600" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="space-y-6">
            {/* 프리랜서 유형 */}
            <div>
              <h3 className="font-semibold mb-2">프리랜서 유형</h3>
              <div className="space-y-2">
                {["개인", "팀", "법인사업자"].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedType.includes(type)}
                      onChange={() => {
                        setSelectedType(prev =>
                          prev.includes(type)
                            ? prev.filter(t => t !== type)
                            : [...prev, type]
                        );
                      }}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* 근무형태 */}
            <div>
              <h3 className="font-semibold mb-2">근무형태</h3>
              <div className="space-y-2">
                {["상주", "비상주", "재택"].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedWorkType.includes(type)}
                      onChange={() => {
                        setSelectedWorkType(prev =>
                          prev.includes(type)
                            ? prev.filter(t => t !== type)
                            : [...prev, type]
                        );
                      }}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* 숙련도 */}
            <div>
              <h3 className="font-semibold mb-2">숙련도</h3>
              <div className="space-y-2">
                {["초급", "중급", "고급", "특급"].map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="level"
                      checked={selectedLevel === level}
                      onChange={() => setSelectedLevel(level)}
                      className="mr-2"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* 업무 시작 가능일 */}
            <div>
              <h3 className="font-semibold mb-2">업무 시작 가능일</h3>
              <DatePicker
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                dateFormat="yyyy년 MM월 dd일"
                locale="ko"
                minDate={new Date()}
                placeholderText="날짜를 선택하세요"
                className="w-full border rounded-lg p-2 cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                popperClassName="react-datepicker-popper"
                popperPlacement="bottom-start"
                popperModifiers={[
                  {
                    name: "offset",
                    options: {
                      offset: [0, 8],
                    },
                  },
                ]}
                customInput={
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2 pr-10 cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={startDate ? formatDate(startDate) : ""}
                      placeholder="날짜를 선택하세요"
                      readOnly
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                }
              />
            </div>

            <div className="border-t border-gray-200" />

            {/* 희망 근무지역 - 2단 구조로 변경 */}
            <div>
              <h3 className="font-semibold mb-2">희망 근무지역</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* 시/도 선택 */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-2">시/도</p>
                  {Object.keys(locations).map((city) => (
                    <label key={city} className="flex items-center">
                      <input
                        type="radio"
                        name="city"
                        checked={selectedCity === city}
                        onChange={() => {
                          setSelectedCity(city);
                          setSelectedDistrict('');
                        }}
                        className="mr-2"
                      />
                      {city}
                    </label>
                  ))}
                </div>

                {/* 구/군 선택 */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-2">구/군</p>
                  {selectedCity && locations[selectedCity as keyof typeof locations].map((district) => (
                    <label key={district} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedDistrict === district}
                        onChange={() => setSelectedDistrict(district)}
                        className="mr-2"
                      />
                      {district}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* 관련 기술 - 맨 아래로 이동 */}
            <div>
              <h3 className="font-semibold mb-2">관련 기술</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <button
                    key={skill}
                    onClick={() => {
                      setSelectedSkills(prev =>
                        prev.includes(skill)
                          ? prev.filter(s => s !== skill)
                          : [...prev, skill]
                      );
                    }}
                    className={`text-sm px-3 py-1 rounded-full border ${
                      selectedSkills.includes(skill)
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - 9칸으로 수정 */}
        <div className="col-span-9">
          <div className="grid grid-cols-1 gap-6">
            {currentItems.map((freelancer) => (
              <div
                key={freelancer.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <Image
                      src="/images/avatar-placeholder.png"
                      alt={`프리랜서 ${freelancer.name}`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{freelancer.name}</h3>
                        <span className="px-2 py-1 bg-gray-100 text-sm rounded-full text-gray-600">
                          {freelancer.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {freelancer.experience} | 평점 {freelancer.rating.toFixed(1)} | 
                        프로젝트 {freelancer.projectCount}건
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-red-500">
                    ❤
                  </button>
                </div>
                
                <p className="text-gray-700 mb-4">{freelancer.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex gap-2 text-sm text-gray-500">
                    <span>프로필 열람 {freelancer.viewCount}</span>
                    <span>•</span>
                    <span>제안 {freelancer.proposalCount}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">
                    상세보기 →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* 처음으로 버튼 */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
              >
                처음으로
              </button>

              {/* 이전 버튼 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
              >
                이전
              </button>

              {/* 페이지 번호 */}
              <div className="flex flex-wrap gap-2 max-w-2xl justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* 다음 버튼 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
              >
                다음
              </button>

              {/* 끝으로 버튼 */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
              >
                끝으로
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 스타일 추가 */}
      <style jsx global>{`
        .react-datepicker {
          font-family: inherit;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .react-datepicker__header {
          background-color: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          padding-top: 0.5rem;
        }
        
        .react-datepicker__day--selected {
          background-color: #2563eb !important;
          color: white !important;
          border-radius: 0.375rem;
        }
        
        .react-datepicker__day:hover {
          background-color: #bfdbfe !important;
          border-radius: 0.375rem;
        }
        
        .react-datepicker__day--keyboard-selected {
          background-color: #93c5fd !important;
          border-radius: 0.375rem;
        }
        
        .react-datepicker__navigation {
          top: 0.75rem;
        }
        
        .react-datepicker__day-name {
          color: #4b5563;
          font-weight: 500;
        }
        
        .react-datepicker__current-month {
          color: #1f2937;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        
        .react-datepicker__day {
          width: 2rem;
          line-height: 2rem;
          margin: 0.166rem;
          border-radius: 0.375rem;
        }
        
        .react-datepicker__day--outside-month {
          color: #9ca3af;
        }
      `}</style>
    </main>
  );
}
