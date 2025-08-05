'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 스터디/모임 타입 정의
interface Study {
  id: number;
  title: string;
  description: string;
  author: string;
  profileImage: string;
  date: string;
  participants: number;
  maxParticipants: number;
  location: string;
  tags: string[];
  category: string;
  isRecruiting: boolean;
  imageUrl?: string;
}

export default function CommunityStudyPage() {
  // 상태 관리
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  // 스크롤 위치 추적
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = () => {
    // 실제 API 호출을 대신하는 모의 데이터
    const mockStudies: Study[] = [
      { id: 1, title: "프론트엔드 개발자를 위한 React/Next.js 스터디", description: "...", author: "김개발", profileImage: "https://randomuser.me/api/portraits/men/32.jpg", date: "2023-03-10", participants: 8, maxParticipants: 10, location: "온라인/줌", tags: ["React", "Next.js", "프론트엔드"], category: "개발", isRecruiting: true, imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 2, title: "백엔드 개발자 모임: Node.js와 Express 마스터하기", description: "...", author: "이서버", profileImage: "https://randomuser.me/api/portraits/women/44.jpg", date: "2023-03-12", participants: 12, maxParticipants: 15, location: "강남 스터디룸", tags: ["Node.js", "Express", "백엔드"], category: "개발", isRecruiting: true },
      { id: 3, title: "UI/UX 디자인 스터디: 사용자 중심 디자인의 이해", description: "...", author: "박디자인", profileImage: "https://randomuser.me/api/portraits/women/68.jpg", date: "2023-03-15", participants: 6, maxParticipants: 8, location: "선릉역 카페", tags: ["UI", "UX", "디자인"], category: "디자인", isRecruiting: true, imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" },
      { id: 4, title: "Python 데이터 사이언스 스터디", description: "...", author: "최데이터", profileImage: "https://randomuser.me/api/portraits/men/75.jpg", date: "2023-03-18", participants: 15, maxParticipants: 20, location: "온라인/디스코드", tags: ["Python", "데이터분석", "머신러닝"], category: "데이터", isRecruiting: true },
      { id: 5, title: "취업 준비생을 위한 포트폴리오 및 면접 스터디", description: "...", author: "정취업", profileImage: "https://randomuser.me/api/portraits/women/90.jpg", date: "2023-03-20", participants: 10, maxParticipants: 12, location: "홍대입구역 스터디카페", tags: ["취업", "포트폴리오", "면접"], category: "취업/이직", isRecruiting: false },
      { id: 6, title: "모바일 앱 개발 스터디: Flutter & Swift", description: "...", author: "조모바일", profileImage: "https://randomuser.me/api/portraits/men/42.jpg", date: "2023-03-22", participants: 7, maxParticipants: 10, location: "강남 토즈", tags: ["Flutter", "Swift", "앱개발"], category: "개발", isRecruiting: true, imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80" },
      { id: 7, title: "클라우드 컴퓨팅 스터디", description: "...", author: "클라우드맨", profileImage: "https://randomuser.me/api/portraits/men/1.jpg", date: "2023-03-25", participants: 5, maxParticipants: 8, location: "온라인", tags: ["클라우드", "AWS"], category: "개발", isRecruiting: true },
      { id: 8, title: "인공지능 스터디", description: "...", author: "AI마스터", profileImage: "https://randomuser.me/api/portraits/women/2.jpg", date: "2023-03-28", participants: 10, maxParticipants: 12, location: "판교", tags: ["AI", "머신러닝"], category: "데이터", isRecruiting: true },
      { id: 9, title: "블록체인 개발 스터디", description: "...", author: "블록체인전문가", profileImage: "https://randomuser.me/api/portraits/men/3.jpg", date: "2023-03-30", participants: 7, maxParticipants: 10, location: "강남", tags: ["블록체인", "솔리디티"], category: "개발", isRecruiting: true },
      { id: 10, title: "데이터 시각화 스터디", description: "...", author: "시각화전문가", profileImage: "https://randomuser.me/api/portraits/women/4.jpg", date: "2023-04-02", participants: 8, maxParticipants: 10, location: "온라인", tags: ["데이터시각화", "태블로"], category: "데이터", isRecruiting: true },
      { id: 11, title: "서비스 기획 스터디", description: "...", author: "기획자", profileImage: "https://randomuser.me/api/portraits/men/5.jpg", date: "2023-04-05", participants: 6, maxParticipants: 8, location: "강남", tags: ["서비스기획", "PM"], category: "기획", isRecruiting: true },
      { id: 12, title: "UX 리서치 스터디", description: "...", author: "UX리서처", profileImage: "https://randomuser.me/api/portraits/women/6.jpg", date: "2023-04-08", participants: 4, maxParticipants: 6, location: "홍대", tags: ["UX리서치", "사용자경험"], category: "디자인", isRecruiting: true }
    ];
    
    const startIndex = (page - 1) * 8; // 페이지당 8개 게시물
    const endIndex = startIndex + 8;
    const newStudies = mockStudies.slice(startIndex, endIndex);

    setStudies((prevStudies) => [...prevStudies, ...newStudies]);
    setHasMore(endIndex < mockStudies.length);
    setLoading(false);
    };
    
    fetchData();
  }, [page]);

  // 필터링 토글 함수
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(item => item !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // 검색 처리 함수
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 검색 API를 호출하거나 필터링을 구현
    console.log(`검색어: ${searchTerm}`);
  };

  // 필터링된 스터디 목록
  const filteredStudies = studies.filter(study => {
    // 검색어 필터링
    if (searchTerm && !study.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !study.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // 카테고리 필터링
    if (activeFilters.length > 0 && !activeFilters.includes(study.category)) {
      return false;
    }
    
    return true;
  });

  // 카테고리 리스트
  const categories = ["개발", "디자인", "데이터", "취업/이직", "기타"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 스터디/모임 헤더 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-800" ref={heroRef}>
        {/* 배경 패턴 */}
        <div 
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* 움직이는 그래픽 요소들 */}
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-white opacity-5" 
          style={{ 
            top: '10%', 
            left: '5%',
            x: scrollY * 0.1,
            y: scrollY * -0.05 
          }}
        />
        <motion.div 
          className="absolute w-80 h-80 rounded-full bg-indigo-300 opacity-10" 
          style={{ 
            bottom: '-10%', 
            right: '-5%',
            x: scrollY * -0.15,
            y: scrollY * 0.05 
          }}
        />
        
        {/* 3D 도형 요소 */}
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-br from-indigo-300 to-purple-400 rounded-xl opacity-20"
          style={{
            top: '30%',
            left: '25%',
            rotate: scrollY * 0.02,
            y: scrollY * 0.08,
            transformStyle: 'preserve-3d',
            transform: `perspective(1000px) rotateX(${scrollY * 0.02}deg) rotateY(${scrollY * 0.01}deg)`
          }}
        />
        <motion.div
          className="absolute w-28 h-28 bg-gradient-to-tr from-purple-300 to-indigo-400 rounded-full opacity-20"
          style={{
            top: '20%',
            right: '15%',
            rotate: scrollY * -0.02,
            y: scrollY * -0.05,
            transformStyle: 'preserve-3d',
            transform: `perspective(1000px) rotateX(${scrollY * -0.01}deg) rotateY(${scrollY * -0.02}deg)`
          }}
        />
        
        {/* 헤더 콘텐츠 */}
        <div className="relative px-4 py-24 sm:px-6 lg:px-8 text-center text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              <span className="block">스터디/모임</span>
              <span className="block text-indigo-200 mt-2 text-3xl sm:text-4xl">함께 배우고, 함께 성장하기</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl opacity-90 mb-8">
              다양한 직무와 주제의 스터디 모임에 참여하거나,<br /> 
              나만의 스터디를 개설하여 함께 배우고 성장해보세요.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-white text-indigo-700 font-medium transition-all shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                모임 개설하기
              </motion.div>
              <motion.a
                href="#study-list"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-full border border-white border-opacity-40 text-white font-medium hover:bg-white hover:bg-opacity-10 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                스터디 찾아보기
              </motion.a>
            </div>
          </motion.div>
          
          {/* 스크롤 다운 인디케이터 */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
        
        {/* 물결 효과 */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F9FAFB"></path>
          </svg>
        </div>
      </div>
      
      {/* 스터디 검색 및 필터 영역 */}
      <div id="study-list" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">모든 스터디/모임</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">총 {filteredStudies.length}개의 스터디/모임을 찾았습니다.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 min-w-[250px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="스터디 검색하기"
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleFilter(category)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    activeFilters.includes(category)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 스터디 목록 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudies.map(study => (
              <motion.div 
                key={study.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-600 hover:shadow-xl transition-all duration-300"
              >
                {study.imageUrl && (
                  <div className="h-48 relative overflow-hidden">
                    <Image 
                      src={study.imageUrl} 
                      alt={study.title}
                      className="object-cover"
                      fill
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden relative mr-3">
                      <Image 
                        src={study.profileImage} 
                        alt={study.author}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{study.author}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">{study.date}</div>
                    </div>
                    <div className="ml-auto">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        study.isRecruiting 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {study.isRecruiting ? '모집중' : '모집완료'}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 transition-colors duration-300">{study.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 transition-colors duration-300">{study.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {study.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-medium transition-colors duration-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {study.participants}/{study.maxParticipants}명
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {study.location}
                      </span>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-5 w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                  >
                    {study.isRecruiting ? '참여 신청하기' : '상세 보기'}
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* 더 보기 버튼 */}
        {!loading && filteredStudies.length > 0 && (
          <div className="flex justify-center mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
            >
              더 많은 스터디 보기
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </div>
        )}
        
        {/* 스터디 없음 표시 */}
        {!loading && filteredStudies.length === 0 && (
          <div className="text-center py-20">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">스터디를 찾을 수 없습니다</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400 transition-colors duration-300">검색어나 필터를 변경해보세요.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilters([]);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                필터 초기화
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* 하단 CTA 섹션 */}
      <div className="bg-indigo-700 dark:bg-indigo-800 text-white py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">나만의 스터디 모임을 개설해보세요</h2>
          <p className="text-indigo-100 text-lg max-w-3xl mx-auto mb-8">
            관심 있는 주제로 직접 스터디를 개설하고 함께 성장할 멤버를 모집해보세요.
            다양한 배경을 가진 사람들과 지식을 나누고 네트워크를 형성할 수 있습니다.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <svg className="mr-2 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            스터디 개설하기
          </motion.button>
        </div>
      </div>
      
      {/* 커뮤니티 페이지로 돌아가기 링크 */}
      <div className="bg-gray-100 dark:bg-gray-800 py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/community" className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            커뮤니티 메인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
