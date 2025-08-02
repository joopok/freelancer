'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 게시글 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  profileImage: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  category?: string;
}

export default function CommunityFreePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('trending');
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  
  // 필터 옵션
  const filters = [
    { id: 'trending', name: '인기글' },
    { id: 'recent', name: '최신글' },
    { id: 'discussion', name: '토론중' },
    { id: 'humor', name: '유머' },
    { id: 'daily', name: '일상' }
  ];
  
  // 인기 태그
  const popularTags = [
    '취준생', '직장인', '개발자', '디자이너', '퇴사', '이직',
    '재택근무', '회사생활', '워라밸', '연봉협상'
  ];
  
  // 스크롤 위치 추적
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 게시글 데이터 로드
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      
      setTimeout(() => {
        const dummyPosts: Post[] = [
          { id: 1, title: "재택근무 4년차인데 사무실 출근으로 바뀌면 어떻게 적응하나요?", content: "...", author: "재택러", profileImage: "https://randomuser.me/api/portraits/men/32.jpg", date: "2023-11-28", views: 1854, likes: 142, comments: 78, tags: ["재택근무", "사무실출근", "직장생활"] },
          { id: 2, title: "오늘 퇴사했습니다! 자유인이 된 기념으로 치맥 먹으러 갑니다", content: "...", author: "자유인", profileImage: "https://randomuser.me/api/portraits/women/28.jpg", date: "2023-11-27", views: 2156, likes: 184, comments: 92, tags: ["퇴사", "자유", "치맥"] },
          { id: 3, title: "직장 내 점심 메뉴 정하기 전쟁... 어떻게 해결하시나요?", content: "...", author: "점심고민", profileImage: "https://randomuser.me/api/portraits/men/45.jpg", date: "2023-11-25", views: 1654, likes: 112, comments: 96, tags: ["직장생활", "점심메뉴", "회사문화"] },
          { id: 4, title: "월급 3,000만원 vs 행복한 직장... 어떤 걸 선택하시겠어요?", content: "...", author: "선택장애", profileImage: "https://randomuser.me/api/portraits/women/22.jpg", date: "2023-11-23", views: 3267, likes: 245, comments: 125, tags: ["연봉", "직장선택", "행복"] },
          { id: 5, title: "오늘 입사한 신입인데 실수했어요... 어떡하죠?", content: "...", author: "초보직장인", profileImage: "https://randomuser.me/api/portraits/women/54.jpg", date: "2023-11-22", views: 2842, likes: 156, comments: 84, tags: ["신입", "직장생활", "실수"] },
          { id: 6, title: "요즘 퇴근 후에 뭐하세요? 취미 추천 부탁드립니다", content: "...", author: "취미부자", profileImage: "https://randomuser.me/api/portraits/men/67.jpg", date: "2023-11-20", views: 1432, likes: 98, comments: 72, tags: ["취미", "퇴근후", "여가생활"] },
          { id: 7, title: "재택근무할 때 집중력 높이는 팁 공유해요!", content: "...", author: "집중력짱", profileImage: "https://randomuser.me/api/portraits/women/42.jpg", date: "2023-11-18", views: 1875, likes: 134, comments: 53, tags: ["재택근무", "집중력", "팁"] },
          { id: 8, title: "직장인 점심값 평균이 얼마까지 올라갔나요?", content: "...", author: "알뜰족", profileImage: "https://randomuser.me/api/portraits/men/22.jpg", date: "2023-11-16", views: 2345, likes: 87, comments: 145, tags: ["점심값", "물가", "직장인"] },
          { id: 9, title: "개발자 커뮤니티에서 활발하게 활동하는 방법", content: "...", author: "커뮤니티장", profileImage: "https://randomuser.me/api/portraits/men/1.jpg", date: "2023-11-15", views: 1234, likes: 56, comments: 12, tags: ["커뮤니티", "활동", "팁"] },
          { id: 10, title: "사이드 프로젝트 아이디어 공유합니다", content: "...", author: "아이디어뱅크", profileImage: "https://randomuser.me/api/portraits/women/2.jpg", date: "2023-11-14", views: 987, likes: 45, comments: 8, tags: ["사이드프로젝트", "아이디어"] },
          { id: 11, title: "개발자에게 필요한 소프트 스킬은 무엇일까요?", content: "...", author: "소프트맨", profileImage: "https://randomuser.me/api/portraits/men/3.jpg", date: "2023-11-13", views: 765, likes: 32, comments: 5, tags: ["소프트스킬", "개발자", "커리어"] },
          { id: 12, title: "IT 업계 최신 트렌드 분석", content: "...", author: "트렌드세터", profileImage: "https://randomuser.me/api/portraits/women/4.jpg", date: "2023-11-12", views: 1543, likes: 78, comments: 20, tags: ["IT트렌드", "기술"] },
          { id: 13, title: "개발자 번아웃 예방 및 극복 방법", content: "...", author: "힐링코더", profileImage: "https://randomuser.me/api/portraits/men/5.jpg", date: "2023-11-11", views: 1123, likes: 67, comments: 15, tags: ["번아웃", "개발자", "멘탈관리"] },
          { id: 14, title: "효율적인 코드 리뷰 방법", content: "...", author: "코드마스터", profileImage: "https://randomuser.me/api/portraits/women/6.jpg", date: "2023-11-10", views: 876, likes: 40, comments: 10, tags: ["코드리뷰", "개발", "협업"] },
          { id: 15, title: "개발자 이직 시 연봉 협상 팁", content: "...", author: "연봉협상가", profileImage: "https://randomuser.me/api/portraits/men/7.jpg", date: "2023-11-09", views: 1987, likes: 90, comments: 25, tags: ["이직", "연봉", "협상"] },
          { id: 16, title: "주니어 개발자를 위한 성장 로드맵", content: "...", author: "성장멘토", profileImage: "https://randomuser.me/api/portraits/women/8.jpg", date: "2023-11-08", views: 1345, likes: 70, comments: 18, tags: ["주니어개발자", "성장", "로드맵"] },
          { id: 17, title: "개발자 건강 관리의 중요성", content: "...", author: "건강지킴이", profileImage: "https://randomuser.me/api/portraits/men/9.jpg", date: "2023-11-07", views: 654, likes: 28, comments: 7, tags: ["건강", "개발자", "관리"] },
          { id: 18, title: "개발자 커뮤니티 활용법", content: "...", author: "커뮤니티활용", profileImage: "https://randomuser.me/api/portraits/women/10.jpg", date: "2023-11-06", views: 987, likes: 50, comments: 11, tags: ["커뮤니티", "활용법"] },
          { id: 19, title: "개발자를 위한 독서 추천", content: "...", author: "책벌레", profileImage: "https://randomuser.me/api/portraits/men/11.jpg", date: "2023-11-05", views: 765, likes: 35, comments: 9, tags: ["독서", "개발자", "추천"] },
          { id: 20, title: "개발자 포트폴리오에 넣으면 좋은 프로젝트", content: "...", author: "포트폴리오장인", profileImage: "https://randomuser.me/api/portraits/women/12.jpg", date: "2023-11-04", views: 1876, likes: 80, comments: 22, tags: ["포트폴리오", "프로젝트"] },
          { id: 21, title: "개발자에게 필요한 비전공 지식", content: "...", author: "지식탐험가", profileImage: "https://randomuser.me/api/portraits/men/13.jpg", date: "2023-11-03", views: 543, likes: 20, comments: 5, tags: ["비전공", "지식"] },
          { id: 22, title: "개발자 커리어 전환 성공 사례", content: "...", author: "커리어전환", profileImage: "https://randomuser.me/api/portraits/women/14.jpg", date: "2023-11-02", views: 1234, likes: 60, comments: 16, tags: ["커리어전환", "성공사례"] },
          { id: 23, title: "개발자에게 추천하는 운동", content: "...", author: "운동맨", profileImage: "https://randomuser.me/api/portraits/men/15.jpg", date: "2023-11-01", views: 432, likes: 15, comments: 3, tags: ["운동", "개발자"] },
          { id: 24, title: "개발자에게 필요한 글쓰기 능력", content: "...", author: "글쓰기장인", profileImage: "https://randomuser.me/api/portraits/women/16.jpg", date: "2023-10-31", views: 876, likes: 40, comments: 10, tags: ["글쓰기", "개발자"] },
          { id: 25, title: "개발자에게 추천하는 유튜브 채널", content: "...", author: "유튜브매니아", profileImage: "https://randomuser.me/api/portraits/men/17.jpg", date: "2023-10-30", views: 1567, likes: 70, comments: 19, tags: ["유튜브", "추천"] },
          { id: 26, title: "개발자에게 필요한 영어 공부법", content: "...", author: "영어마스터", profileImage: "https://randomuser.me/api/portraits/women/18.jpg", date: "2023-10-29", views: 987, likes: 50, comments: 12, tags: ["영어", "공부법"] },
          { id: 27, title: "개발자에게 추천하는 블로그", content: "...", author: "블로그매니아", profileImage: "https://randomuser.me/api/portraits/men/19.jpg", date: "2023-10-28", views: 765, likes: 30, comments: 8, tags: ["블로그", "추천"] },
          { id: 28, title: "개발자에게 필요한 커뮤니케이션 스킬", content: "...", author: "커뮤니케이션전문가", profileImage: "https://randomuser.me/api/portraits/women/20.jpg", date: "2023-10-27", views: 1234, likes: 60, comments: 15, tags: ["커뮤니케이션", "스킬"] },
          { id: 29, title: "개발자에게 추천하는 컨퍼런스", content: "...", author: "컨퍼런스매니아", profileImage: "https://randomuser.me/api/portraits/men/21.jpg", date: "2023-10-26", views: 876, likes: 40, comments: 10, tags: ["컨퍼런스", "추천"] },
          { id: 30, title: "개발자에게 필요한 시간 관리법", content: "...", author: "시간관리전문가", profileImage: "https://randomuser.me/api/portraits/women/22.jpg", date: "2023-10-25", views: 543, likes: 20, comments: 5, tags: ["시간관리", "개발자"] }
        ];
        
        const startIndex = (page - 1) * 8; // 페이지당 8개 게시물
        const endIndex = startIndex + 8;
        const newPosts = dummyPosts.slice(startIndex, endIndex);

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setHasMore(endIndex < dummyPosts.length);
        setLoading(false);
      }, 500);
    };
    
    fetchData();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [hasMore, loading]);
  
  // 필터링된 게시글
  const filteredPosts = posts.filter(post => {
    return searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 헤더 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-indigo-600 dark:from-gray-800 dark:to-gray-700 transition-colors duration-300">
        {/* 배경 패턴 */}
        <div 
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* 움직이는 그래픽 요소들 */}
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-white opacity-5" 
          style={{ 
            top: '20%', 
            left: '10%',
            x: scrollY * 0.12,
            y: scrollY * -0.08 
          }}
        />
        <motion.div 
          className="absolute w-80 h-80 rounded-full bg-rose-300 opacity-10" 
          style={{ 
            bottom: '-20%', 
            right: '5%',
            x: scrollY * -0.1,
            y: scrollY * 0.07 
          }}
        />
        
        {/* 헤더 콘텐츠 */}
        <div className="relative px-4 py-20 sm:px-6 lg:px-8 text-center text-white dark:text-gray-100 z-10 transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
              <span className="block">자유게시판</span>
              <span className="block text-rose-200 dark:text-gray-300 mt-2 text-2xl sm:text-3xl font-medium transition-colors duration-300">무엇이든 자유롭게 이야기해보세요</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl opacity-90 dark:text-gray-300 mb-8 transition-colors duration-300">
              일상, 취미, 직장생활, 유머까지 다양한 주제로
              자유롭게 대화를 나눌 수 있는 공간입니다.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-white dark:bg-gray-200 text-indigo-600 dark:text-gray-800 font-medium transition-all shadow-md hover:bg-gray-50 dark:hover:bg-gray-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                새 글 작성하기
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-transparent border border-white dark:border-gray-300 text-white dark:text-gray-100 font-medium transition-all hover:bg-white hover:bg-opacity-10 dark:hover:bg-gray-600 dark:hover:bg-opacity-20"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                인기 태그 둘러보기
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        {/* 흐르는 물결 효과 */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-16 w-full">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor" className="text-gray-50 dark:text-gray-900"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor" className="text-gray-50 dark:text-gray-900"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" className="text-gray-50 dark:text-gray-900"></path>
          </svg>
        </div>
      </div>
      
      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1">
            {/* 필터 메뉴 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">카테고리</h3>
              <nav className="space-y-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* 인기 태그 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">인기 태그</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-rose-100 dark:hover:bg-rose-900 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 게시 팁 */}
            <div className="bg-gradient-to-br from-indigo-600 to-rose-500 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-sm p-6 text-white dark:text-gray-100 transition-colors duration-300">
              <h3 className="text-lg font-bold mb-4 text-white dark:text-gray-100">게시판 이용 팁</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>상대방을 존중하는 언어를 사용해주세요</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>태그를 활용하면 관련 주제를 찾는 사람들에게 더 많이 노출됩니다</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>유용한 정보는 북마크에 저장해두세요</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* 오른쪽 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 검색 및 정렬 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="flex flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="관심있는 주제를 검색해보세요"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  />
                  <button 
                    type="submit"
                    className="bg-rose-600 dark:bg-rose-700 text-white px-4 py-2 rounded-r-md hover:bg-rose-700 dark:hover:bg-rose-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
                <button
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  글쓰기
                </button>
              </div>
            </div>
            
            {/* 게시글 목록 */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-rose-600"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <svg className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                  >
                    <Link href={`/community/free/${post.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex-shrink-0">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={post.profileImage}
                                alt={post.author}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{post.author}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{post.date}</p>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight transition-colors duration-300">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 transition-colors duration-300">{post.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                          <div className="flex space-x-4">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {post.views}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {post.likes}
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                              {post.comments}
                            </div>
                          </div>
                          <div className="text-indigo-600 dark:text-indigo-400 font-medium hidden sm:block transition-colors duration-300">
                            더 보기
                            <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* 페이지네이션 */}
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                  <span className="sr-only">이전</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" aria-current="page" className="relative inline-flex items-center px-4 py-2 border border-rose-500 dark:border-rose-400 bg-rose-50 dark:bg-rose-900 text-sm font-medium text-rose-600 dark:text-rose-300 transition-colors duration-300">
                  1
                </a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                  2
                </a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                  3
                </a>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  ...
                </span>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                  10
                </a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                  <span className="sr-only">다음</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
