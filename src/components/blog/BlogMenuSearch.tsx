'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogMenuSearchProps {
  currentPage?: string;
}

export default function BlogMenuSearch({ currentPage = 'all' }: BlogMenuSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL NEW');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 메인 카테고리 (모바일용 축약형 포함)
  const mainCategories = [
    { full: 'ALL NEW', short: 'ALL' },
    { full: '개발 테크', short: '개발' },
    { full: '디자인 테크', short: '디자인' },
    { full: '구매 테크', short: '구매' },
    { full: '인사 테크', short: '인사' },
    { full: '홍보 & 마케팅 테크', short: '마케팅' },
    { full: '물류 테크', short: '물류' },
    { full: '전략 테크', short: '전략' },
    { full: '제조 테크', short: '제조' },
    { full: '밸런스 UP', short: '밸런스' },
    { full: '실리콘밸리 AI 칼럼', short: 'AI' },
  ];

  // 카테고리별 자동완성 제안 데이터
  const categorySpecificData: Record<string, string[]> = {
    'dev-tech': [
      'React', 'TypeScript', 'Next.js', 'JavaScript', 'Node.js',
      'Vue.js', 'Angular', 'Python', 'Java', 'Spring Boot',
      'Docker', 'Kubernetes', 'AWS', 'Firebase', 'MongoDB',
      'GraphQL', 'REST API', 'Git', 'CI/CD', '마이크로서비스',
      'Redis', 'PostgreSQL', 'MySQL', 'Elasticsearch', 'Rust',
      'Go', 'WebAssembly', 'Progressive Web App', '성능 최적화', '보안',
      '테스팅', '배포', '아키텍처', '클린 코드', '리팩토링'
    ],
    'design-tech': [
      'UI/UX 디자인', 'Figma', 'Sketch', 'Adobe XD', '디자인 시스템',
      '프로토타이핑', '와이어프레임', '사용자 경험', '인터페이스', '반응형 디자인',
      '타이포그래피', '색상 이론', '브랜딩', '아이콘 디자인', '일러스트레이션',
      '포트폴리오', '디자인 트렌드', '접근성', '인클루시브 디자인', '다크모드',
      '모바일 디자인', '웹 디자인', '디자인 패턴', '사용성 테스트', '디자인 시스템',
      '컴포넌트 라이브러리', '디자인 토큰', '협업 도구', '디자인 프로세스', '디자인 씽킹'
    ],
    'hr-tech': [
      '인사관리', '채용', '급여', '근태관리', '성과평가',
      '인재개발', '교육훈련', '조직문화', '리더십', '팀빌딩',
      '원격근무', '하이브리드 근무', '워라밸', '복리후생', '직무분석',
      '인사정책', '노무관리', '퇴직연금', '4대보험', '인사평가',
      'AI 채용', 'HR 테크', 'HRIS', '인사시스템', '디지털 HR'
    ],
    'marketing-tech': [
      '디지털 마케팅', 'SEO', 'SEM', '소셜미디어 마케팅', '콘텐츠 마케팅',
      '이메일 마케팅', '마케팅 자동화', '데이터 마케팅', '퍼포먼스 마케팅', 'CRM',
      '고객 여정', '브랜드 마케팅', '인플루언서 마케팅', '바이럴 마케팅', 'ROI',
      '마케팅 분석', 'Google Analytics', 'Facebook 광고', 'Instagram 마케팅', 'YouTube 마케팅',
      '마케팅 전략', '타겟팅', '세그멘테이션', '포지셔닝', '마케팅 믹스'
    ],
    'logistics-tech': [
      '물류관리', '공급망관리', 'SCM', '재고관리', '창고관리',
      '배송관리', '운송관리', '물류 자동화', '스마트 물류', 'WMS',
      'TMS', 'ERP', '물류 최적화', '배송 추적', '마지막 마일',
      '드론 배송', '자율주행', 'IoT', '빅데이터', 'AI 물류',
      '글로벌 물류', '국제 배송', '관세', '통관', '물류 비용'
    ],
    'strategy-tech': [
      '디지털 전환', '비즈니스 전략', '경영전략', '혁신', '스타트업',
      '비즈니스 모델', '플랫폼 비즈니스', '데이터 전략', 'AI 전략', '클라우드 전략',
      '조직 변화', '디지털 리더십', '애자일', '린 스타트업', '스케일업',
      '경쟁 전략', '시장 분석', '트렌드 분석', '미래 예측', '기술 동향',
      '투자 전략', 'M&A', '파트너십', '생태계', '플랫폼'
    ],
    'manufacturing-tech': [
      '스마트 팩토리', '제조업', '생산관리', '품질관리', '공정관리',
      '자동화', 'MES', 'PLM', 'CAD', 'CAM',
      'IoT', '빅데이터', 'AI', '머신러닝', '예측 정비',
      '3D 프린팅', '로봇공학', '센서', 'RFID', 'QR코드',
      '린 제조', '식스 시그마', 'JIT', '칸반', '생산성'
    ],
    'balance-up': [
      '워라밸', '업무 효율성', '시간 관리', '스트레스 관리', '번아웃',
      '원격근무', '재택근무', '유연근무', '집중력', '생산성',
      '자기계발', '학습', '독서', '운동', '건강관리',
      '명상', '마인드풀니스', '취미', '여행', '인간관계',
      '소통', '팀워크', '리더십', '커리어', '성장'
    ],
    'silicon-valley-ai': [
      'AI', '인공지능', '머신러닝', '딥러닝', '자연어처리',
      'ChatGPT', 'GPT', 'LLM', '생성형 AI', 'Transformer',
      '컴퓨터 비전', '음성인식', '로봇공학', '자율주행', 'AI 윤리',
      '실리콘밸리', '스타트업', '투자', 'VC', '유니콘',
      '빅테크', '구글', '애플', 'Meta', 'OpenAI',
      'AI 트렌드', 'AI 활용', 'AI 도구', 'AI 개발', 'AI 비즈니스'
    ]
  };

  // 현재 페이지에 따른 자동완성 데이터 선택
  const getSuggestionData = () => {
    const pageSpecificData = categorySpecificData[currentPage] || [];
    const generalData = [
      'React', 'TypeScript', 'Next.js', 'JavaScript', 'Python',
      'UI/UX 디자인', 'Figma', '디자인 시스템', 'AI', '머신러닝',
      '프론트엔드', '백엔드', '풀스택', '개발자', '디자이너',
      '마케팅', '데이터 분석', '프로젝트 관리', '스타트업', '투자'
    ];
    
    return [...pageSpecificData, ...generalData].slice(0, 50);
  };

  const suggestionData = getSuggestionData();

  // 로컬 스토리지에서 최근 검색어 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('blog-recent-searches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // 필터링된 제안 목록
  const filteredSuggestions = searchQuery.length > 0 
    ? suggestionData.filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  // 하이라이트 텍스트 렌더링 함수
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800/50 text-yellow-900 dark:text-yellow-200 font-medium">
          {part}
        </span>
      ) : part
    );
  };

  // 이벤트 핸들러들
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0 || recentSearches.length > 0);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputFocus = () => {
    setShowSuggestions(searchQuery.length > 0 || recentSearches.length > 0);
  };

  const handleInputBlur = () => {
    // 약간의 지연을 두어 클릭 이벤트가 먼저 처리되도록 함
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalSuggestions = filteredSuggestions.length + (searchQuery.length === 0 ? recentSearches.length : 0);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < totalSuggestions - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : totalSuggestions - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0) {
        const suggestions = searchQuery.length > 0 ? filteredSuggestions : recentSearches;
        const selected = suggestions[selectedSuggestionIndex];
        if (selected) {
          selectSuggestion(selected);
        }
      } else if (searchQuery.trim()) {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      searchInputRef.current?.blur();
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    // 최근 검색어에 추가
    const newRecentSearches = [suggestion, ...recentSearches.filter(item => item !== suggestion)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('blog-recent-searches', JSON.stringify(newRecentSearches));
    
    // 실제 검색 실행
    handleSearch(suggestion);
  };

  const handleSearch = (query?: string) => {
    const searchTerm = query || searchQuery;
    if (searchTerm.trim()) {
      console.log('검색 실행:', searchTerm);
      // 여기에 실제 검색 로직 구현
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('blog-recent-searches');
  };

  const removeRecentSearch = (searchToRemove: string) => {
    const newRecentSearches = recentSearches.filter(item => item !== searchToRemove);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('blog-recent-searches', JSON.stringify(newRecentSearches));
  };

  return (
    <div>
      {/* 검색바 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative">
            <motion.div
              initial={{ scale: 1 }}
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="관심있는 키워드로 검색해 보세요"
                className="w-full px-4 py-3 pr-12 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
              />
              
              {/* 검색 아이콘 */}
              <motion.button
                onClick={() => handleSearch()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>

              {/* 검색어 삭제 버튼 */}
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => {
                    setSearchQuery('');
                    setShowSuggestions(recentSearches.length > 0);
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              )}
            </motion.div>

            {/* 자동완성 드롭다운 */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                >
                  {/* 검색 결과 제안 */}
                  {searchQuery.length > 0 && filteredSuggestions.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                        검색 제안
                      </div>
                      {filteredSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={suggestion}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => selectSuggestion(suggestion)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 flex items-center gap-2 ${
                            selectedSuggestionIndex === index
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span>{highlightText(suggestion, searchQuery)}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* 최근 검색어 */}
                  {searchQuery.length === 0 && recentSearches.length > 0 && (
                    <div className="p-2">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">최근 검색어</span>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          전체 삭제
                        </button>
                      </div>
                      {recentSearches.map((search, index) => (
                        <motion.div
                          key={search}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-150 ${
                            selectedSuggestionIndex === index
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <button
                            onClick={() => selectSuggestion(search)}
                            className="flex-1 text-left"
                          >
                            {search}
                          </button>
                          <button
                            onClick={() => removeRecentSearch(search)}
                            className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* 검색 결과가 없을 때 */}
                  {searchQuery.length > 0 && filteredSuggestions.length === 0 && (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p>검색 결과가 없습니다</p>
                      <p className="text-xs mt-1">다른 키워드로 검색해보세요</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 메인 네비게이션 */}
      <nav className="border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative flex overflow-x-auto overflow-y-hidden scrollbar-hide">
            {mainCategories.map((category) => (
              <button
                key={category.full}
                onClick={() => setActiveCategory(category.full)}
                className={`relative px-2 sm:px-3 lg:px-4 py-4 whitespace-nowrap text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 flex-shrink-0 ${
                  activeCategory === category.full 
                    ? 'text-blue-600 dark:text-blue-400 font-bold' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {/* 활성 탭 배경 하이라이트 */}
                {activeCategory === category.full && (
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
                {activeCategory === category.full && (
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
                
                {/* 반응형 텍스트 애니메이션 */}
                <motion.span 
                  className="relative z-10"
                  animate={{
                    scale: activeCategory === category.full ? 1.05 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <span className="hidden sm:inline">{category.full}</span>
                  <span className="sm:hidden">{category.short}</span>
                </motion.span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
