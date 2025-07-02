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
  category: string;
  isNotice?: boolean;
}

export default function CommunityBoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loader = useRef(null);
  
  // 필터 옵션
  const filters = [
    { id: 'all', name: '전체' },
    { id: 'popular', name: '인기글' },
    { id: 'latest', name: '최신글' },
    { id: 'notice', name: '공지사항' }
  ];

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
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
      
      // 실제 프로젝트에서는 API 호출로 대체
      setTimeout(() => {
        const mockPosts: Post[] = [
          { id: 1, title: "공지사항: 커뮤니티 이용 규칙 안내", content: "...", author: "관리자", profileImage: "https://randomuser.me/api/portraits/men/75.jpg", date: "2023-11-15", views: 1254, likes: 89, comments: 23, category: "공지사항", isNotice: true },
          { id: 2, title: "개발자 면접 후기 (대기업 최종 합격했어요!)", content: "...", author: "코딩마스터", profileImage: "https://randomuser.me/api/portraits/men/32.jpg", date: "2023-11-12", views: 3456, likes: 271, comments: 54, category: "취업/이직" },
          { id: 3, title: "재택근무 2년차 노하우 공유합니다", content: "...", author: "홈오피스", profileImage: "https://randomuser.me/api/portraits/women/28.jpg", date: "2023-11-10", views: 2187, likes: 194, comments: 42, category: "직장생활" },
          { id: 4, title: "개발자에서 PM으로 커리어 전환 후기", content: "...", author: "커리어점프", profileImage: "https://randomuser.me/api/portraits/men/42.jpg", date: "2023-11-08", views: 1893, likes: 147, comments: 38, category: "커리어" },
          { id: 5, title: "첫 직장 스트레스 극복하는 방법 공유해요", content: "...", author: "새내기직장인", profileImage: "https://randomuser.me/api/portraits/women/24.jpg", date: "2023-11-05", views: 2341, likes: 162, comments: 47, category: "고민상담" },
          { id: 6, title: "회사에서 인정받는 방법 5가지", content: "...", author: "경력관리", profileImage: "https://randomuser.me/api/portraits/women/57.jpg", date: "2023-11-03", views: 1987, likes: 173, comments: 29, category: "직장생활" },
          { id: 7, title: "개발자 번아웃 극복 경험담", content: "...", author: "회복중", profileImage: "https://randomuser.me/api/portraits/men/67.jpg", date: "2023-11-01", views: 2456, likes: 234, comments: 62, category: "고민상담" },
          { id: 8, title: "사이드 프로젝트로 월 300만원 버는 이야기", content: "...", author: "부업왕", profileImage: "https://randomuser.me/api/portraits/men/52.jpg", date: "2023-10-28", views: 5487, likes: 423, comments: 87, category: "수익창출" },
          { id: 9, title: "프론트엔드 개발자를 위한 React/Next.js 스터디", content: "...", author: "김개발", profileImage: "https://randomuser.me/api/portraits/men/32.jpg", date: "2023-03-10", views: 123, likes: 45, comments: 6, category: "개발" },
          { id: 10, title: "백엔드 개발자 모임: Node.js와 Express 마스터하기", content: "...", author: "이서버", profileImage: "https://randomuser.me/api/portraits/women/44.jpg", date: "2023-03-12", views: 456, likes: 78, comments: 9, category: "개발" },
          { id: 11, title: "UI/UX 디자인 스터디: 사용자 중심 디자인의 이해", content: "...", author: "박디자인", profileImage: "https://randomuser.me/api/portraits/women/68.jpg", date: "2023-03-15", views: 789, likes: 12, comments: 3, category: "디자인" },
          { id: 12, title: "Python 데이터 사이언스 스터디", content: "...", author: "최데이터", profileImage: "https://randomuser.me/api/portraits/men/75.jpg", date: "2023-03-18", views: 101, likes: 11, comments: 1, category: "데이터" },
          { id: 13, title: "취업 준비생을 위한 포트폴리오 및 면접 스터디", content: "...", author: "정취업", profileImage: "https://randomuser.me/api/portraits/women/90.jpg", date: "2023-03-20", views: 234, likes: 56, comments: 7, category: "취업/이직" },
          { id: 14, title: "모바일 앱 개발 스터디: Flutter & Swift", content: "...", author: "조모바일", profileImage: "https://randomuser.me/api/portraits/men/42.jpg", date: "2023-03-22", views: 567, likes: 89, comments: 10, category: "개발" },
          { id: 15, title: "클라우드 컴퓨팅 기초 스터디", content: "...", author: "강클라우드", profileImage: "https://randomuser.me/api/portraits/men/1.jpg", date: "2023-03-25", views: 890, likes: 123, comments: 14, category: "개발" },
          { id: 16, title: "인공지능 윤리 토론 모임", content: "...", author: "윤리연구가", profileImage: "https://randomuser.me/api/portraits/women/2.jpg", date: "2023-03-28", views: 123, likes: 12, comments: 3, category: "기타" },
          { id: 17, title: "블록체인 기술 동향 스터디", content: "...", author: "블록체인매니아", profileImage: "https://randomuser.me/api/portraits/men/3.jpg", date: "2023-03-30", views: 456, likes: 34, comments: 5, category: "개발" },
          { id: 18, title: "사이버 보안 전문가 양성 과정", content: "...", author: "보안전문가", profileImage: "https://randomuser.me/api/portraits/women/4.jpg", date: "2023-04-01", views: 789, likes: 56, comments: 7, category: "기타" },
          { id: 19, title: "게임 개발 입문 스터디", content: "...", author: "게임덕후", profileImage: "https://randomuser.me/api/portraits/men/5.jpg", date: "2023-04-03", views: 101, likes: 7, comments: 1, category: "개발" },
          { id: 20, title: "UX 리서치 방법론 스터디", content: "...", author: "리서치퀸", profileImage: "https://randomuser.me/api/portraits/women/6.jpg", date: "2023-04-05", views: 234, likes: 18, comments: 2, category: "디자인" },
          { id: 21, title: "애자일 방법론 실천 스터디", content: "...", author: "애자일전도사", profileImage: "https://randomuser.me/api/portraits/men/7.jpg", date: "2023-04-07", views: 567, likes: 29, comments: 4, category: "기획" },
          { id: 22, title: "데브옵스 자동화 스터디", content: "...", author: "자동화마스터", profileImage: "https://randomuser.me/api/portraits/women/8.jpg", date: "2023-04-09", views: 890, likes: 40, comments: 6, category: "개발" },
          { id: 23, title: "IT 트렌드 분석 모임", content: "...", author: "트렌드세터", profileImage: "https://randomuser.me/api/portraits/men/9.jpg", date: "2023-04-11", views: 123, likes: 8, comments: 1, category: "기타" },
          { id: 24, title: "데이터 시각화 스터디", content: "...", author: "시각화전문가", profileImage: "https://randomuser.me/api/portraits/women/10.jpg", date: "2023-04-13", views: 456, likes: 19, comments: 3, category: "데이터" },
          { id: 25, title: "클린 코드 작성법 스터디", content: "...", author: "클린코더", profileImage: "https://randomuser.me/api/portraits/men/11.jpg", date: "2023-04-15", views: 789, likes: 30, comments: 5, category: "개발" },
          { id: 26, title: "서비스 기획 실무 스터디", content: "...", author: "기획장인", profileImage: "https://randomuser.me/api/portraits/women/12.jpg", date: "2023-04-17", views: 101, likes: 5, comments: 1, category: "기획" },
          { id: 27, title: "모바일 게임 기획 스터디", content: "...", author: "게임기획자", profileImage: "https://randomuser.me/api/portraits/men/13.jpg", date: "2023-04-19", views: 234, likes: 10, comments: 2, category: "기획" },
          { id: 28, title: "웹 접근성 스터디", content: "...", author: "웹접근성전문가", profileImage: "https://randomuser.me/api/portraits/women/14.jpg", date: "2023-04-21", views: 567, likes: 15, comments: 3, category: "개발" },
          { id: 29, title: "인공지능 모델 배포 스터디", content: "...", author: "AI엔지니어", profileImage: "https://randomuser.me/api/portraits/men/15.jpg", date: "2023-04-23", views: 890, likes: 20, comments: 4, category: "개발" },
          { id: 30, title: "클라우드 보안 스터디", content: "...", author: "보안담당자", profileImage: "https://randomuser.me/api/portraits/women/16.jpg", date: "2023-04-25", views: 123, likes: 2, comments: 0, category: "기타" }
        ];
        
        const startIndex = (page - 1) * 8; // 페이지당 8개 게시물
        const endIndex = startIndex + 8;
        const newPosts = mockPosts.slice(startIndex, endIndex);

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setHasMore(endIndex < mockPosts.length);
        setLoading(false);
      }, 1000);
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
    if (activeFilter === 'all') return true;
    if (activeFilter === 'notice') return post.isNotice === true;
    if (activeFilter === 'popular') return post.likes > 200;
    if (activeFilter === 'latest') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const postDate = new Date(post.date);
      return postDate >= oneWeekAgo;
    }
    return true;
  }).filter(post => {
    if (searchTerm === '') return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower) ||
      post.author.toLowerCase().includes(searchLower) ||
      post.category.toLowerCase().includes(searchLower)
    );
  });
  
  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 구현에서는 서버 검색이 필요할 수 있음
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 헤더 영역 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-700 transition-colors duration-300">
        {/* 배경 패턴 */}
        <div 
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* 움직이는 그래픽 요소들 */}
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-white opacity-5" 
          style={{ 
            top: '15%', 
            left: '10%',
            x: scrollY * 0.1,
            y: scrollY * -0.07
          }}
        />
        <motion.div 
          className="absolute w-80 h-80 rounded-full bg-blue-300 opacity-10" 
          style={{ 
            bottom: '-15%', 
            right: '5%',
            x: scrollY * -0.12,
            y: scrollY * 0.06
          }}
        />
        
        {/* 헤더 콘텐츠 */}
        <div className="relative px-4 py-16 sm:px-6 lg:px-8 text-center sm:text-left max-w-7xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:flex md:items-center md:justify-between"
          >
            <div className="md:max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white mb-4"
              >
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                실시간 커뮤니티
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white dark:text-gray-100 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 dark:from-gray-100 dark:to-gray-300"
              >
                자유게시판
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-blue-100 dark:text-gray-300 text-lg sm:text-xl mb-6 leading-relaxed"
              >
                다양한 주제에 대해 자유롭게 의견을 나눌 수 있는 공간입니다.
                직장생활, 취업/이직, 커리어 등 자유롭게 이야기해보세요.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap gap-3 mb-6 md:mb-0"
              >
                <Link href="/community" className="group inline-flex items-center text-sm bg-white bg-opacity-20 text-white px-4 py-2 rounded-full hover:bg-opacity-30 transition-all duration-300 hover:scale-105">
                  <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  커뮤니티홈
                </Link>
                <Link href="/community/free" className="group inline-flex items-center text-sm bg-white bg-opacity-20 text-white px-4 py-2 rounded-full hover:bg-opacity-30 transition-all duration-300 hover:scale-105">
                  <svg className="w-4 h-4 mr-2 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  자유주제
                </Link>
                <Link href="/community/qna" className="group inline-flex items-center text-sm bg-white bg-opacity-20 text-white px-4 py-2 rounded-full hover:bg-opacity-30 transition-all duration-300 hover:scale-105">
                  <svg className="w-4 h-4 mr-2 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  질문&답변
                </Link>
                <Link href="/community/gallery" className="group inline-flex items-center text-sm bg-white bg-opacity-20 text-white px-4 py-2 rounded-full hover:bg-opacity-30 transition-all duration-300 hover:scale-105">
                  <svg className="w-4 h-4 mr-2 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  갤러리
                </Link>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 md:mt-0"
            >
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-white text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    className="flex justify-center"
                  >
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-4 mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100"
                  >
                    8,245
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="text-sm text-blue-100"
                  >
                    전체 게시글
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-6 grid grid-cols-2 gap-4 text-center"
                  >
                    <div className="bg-white bg-opacity-5 rounded-xl p-3 hover:bg-opacity-10 transition-colors">
                      <div className="text-lg font-semibold text-white">127</div>
                      <div className="text-xs text-blue-100">오늘 새글</div>
                    </div>
                    <div className="bg-white bg-opacity-5 rounded-xl p-3 hover:bg-opacity-10 transition-colors">
                      <div className="text-lg font-semibold text-white">4,562</div>
                      <div className="text-xs text-blue-100">총 회원수</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* 곡선 구분선 */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-gray-50 dark:text-gray-900"></path>
          </svg>
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 및 필터 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
            
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요"
                className="w-full md:w-64 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
              />
              <button 
                type="submit"
                className="bg-blue-600 dark:bg-blue-700 text-white px-3 py-1 rounded-r-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        
        {/* 게시글 목록 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden mb-8 transition-colors duration-300">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">추천</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                  {filteredPosts.map((post) => (
                    <motion.tr 
                      key={post.id}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                      onClick={() => window.location.href = `/community/board/${post.id}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {post.isNotice && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                              공지
                            </span>
                          )}
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {post.title}
                            {post.comments > 0 && (
                              <span className="ml-2 text-blue-600">[{post.comments}]</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 relative">
                            <Image
                              className="rounded-full"
                              src={post.profileImage}
                              alt=""
                              fill
                              sizes="32px"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{post.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.likes}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* 페이지네이션 및 작성 버튼 */}
        <div className="flex justify-between items-center">
          {totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">이전</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === page
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">다음</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            글쓰기
          </motion.button>
        </div>
      </div>
    </div>
  );
} 