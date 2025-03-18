'use client';

import { useState, useEffect } from 'react';
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
  
  // 필터 옵션
  const filters = [
    { id: 'all', name: '전체' },
    { id: 'popular', name: '인기글' },
    { id: 'latest', name: '최신글' },
    { id: 'notice', name: '공지사항' }
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
      
      // 실제 프로젝트에서는 API 호출로 대체
      setTimeout(() => {
        const mockPosts: Post[] = [
          {
            id: 1,
            title: "공지사항: 커뮤니티 이용 규칙 안내",
            content: "안녕하세요, 모든 회원 여러분. 커뮤니티를 보다 유익하고 건전하게 이용하기 위한 규칙을 안내드립니다.",
            author: "관리자",
            profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
            date: "2023-11-15",
            views: 1254,
            likes: 89,
            comments: 23,
            category: "공지사항",
            isNotice: true
          },
          {
            id: 2,
            title: "개발자 면접 후기 (대기업 최종 합격했어요!)",
            content: "3개월간의 준비 끝에 대기업 개발자 면접에 최종 합격했습니다. 준비 과정과 면접 팁을 공유합니다.",
            author: "코딩마스터",
            profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
            date: "2023-11-12",
            views: 3456,
            likes: 271,
            comments: 54,
            category: "취업/이직"
          },
          {
            id: 3,
            title: "재택근무 2년차 노하우 공유합니다",
            content: "재택근무 2년차입니다. 업무 효율을 높이고 건강도 챙기는 노하우를 공유합니다.",
            author: "홈오피스",
            profileImage: "https://randomuser.me/api/portraits/women/28.jpg",
            date: "2023-11-10",
            views: 2187,
            likes: 194,
            comments: 42,
            category: "직장생활"
          },
          {
            id: 4,
            title: "개발자에서 PM으로 커리어 전환 후기",
            content: "5년차 개발자에서 PM으로 커리어를 전환한 경험을 공유합니다. 전환 과정과 필요한 역량에 대해 말씀드릴게요.",
            author: "커리어점프",
            profileImage: "https://randomuser.me/api/portraits/men/42.jpg",
            date: "2023-11-08",
            views: 1893,
            likes: 147,
            comments: 38,
            category: "커리어"
          },
          {
            id: 5,
            title: "첫 직장 스트레스 극복하는 방법 공유해요",
            content: "신입으로 입사해 겪는 스트레스를 극복하는 방법들을 공유합니다. 선배님들의 조언도 환영합니다!",
            author: "새내기직장인",
            profileImage: "https://randomuser.me/api/portraits/women/24.jpg",
            date: "2023-11-05",
            views: 2341,
            likes: 162,
            comments: 47,
            category: "고민상담"
          },
          {
            id: 6,
            title: "회사에서 인정받는 방법 5가지",
            content: "회사에서 능력을 인정받고 성장하기 위한 실질적인 방법 5가지를 소개합니다.",
            author: "경력관리",
            profileImage: "https://randomuser.me/api/portraits/women/57.jpg",
            date: "2023-11-03",
            views: 1987,
            likes: 173,
            comments: 29,
            category: "직장생활"
          },
          {
            id: 7,
            title: "개발자 번아웃 극복 경험담",
            content: "3년차 개발자로 심한 번아웃을 겪었지만 이를 극복한 경험을 나누고 싶습니다.",
            author: "회복중",
            profileImage: "https://randomuser.me/api/portraits/men/67.jpg",
            date: "2023-11-01",
            views: 2456,
            likes: 234,
            comments: 62,
            category: "고민상담"
          },
          {
            id: 8,
            title: "사이드 프로젝트로 월 300만원 버는 이야기",
            content: "본업 외에 사이드 프로젝트로 월 300만원의 추가 수입을 올리는 방법을 공유합니다.",
            author: "부업왕",
            profileImage: "https://randomuser.me/api/portraits/men/52.jpg",
            date: "2023-10-28",
            views: 5487,
            likes: 423,
            comments: 87,
            category: "수익창출"
          }
        ];
        
        setPosts(mockPosts);
        setLoading(false);
      }, 1000);
    };
    
    fetchData();
  }, []);
  
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
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 영역 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700">
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
                자유게시판
              </h1>
              <p className="text-blue-100 text-lg sm:text-xl mb-6">
                다양한 주제에 대해 자유롭게 의견을 나눌 수 있는 공간입니다.
                직장생활, 취업/이직, 커리어 등 자유롭게 이야기해보세요.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6 md:mb-0">
                <Link href="/community" className="inline-flex items-center text-sm bg-white bg-opacity-20 text-white px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  커뮤니티홈
                </Link>
                <Link href="/community/free" className="inline-flex items-center text-sm bg-white bg-opacity-20 text-white px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors">
                  자유주제
                </Link>
                <Link href="/community/qna" className="inline-flex items-center text-sm bg-white bg-opacity-20 text-white px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors">
                  질문&답변
                </Link>
                <Link href="/community/gallery" className="inline-flex items-center text-sm bg-white bg-opacity-20 text-white px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors">
                  갤러리
                </Link>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 md:mt-0"
            >
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-5 border border-white border-opacity-20">
                <div className="text-white text-center">
                  <div className="flex justify-center">
                    <div className="bg-blue-500 rounded-full p-3 mb-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-xl font-bold mb-1">8,245</div>
                  <div className="text-sm text-blue-100">전체 게시글</div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-lg font-semibold">127</div>
                      <div className="text-xs text-blue-100">오늘 새글</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">4,562</div>
                      <div className="text-xs text-blue-100">총 회원수</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* 곡선 구분선 */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F9FAFB"></path>
          </svg>
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 검색 및 필터 */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
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
                className="w-full md:w-64 px-3 py-1 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded-r-md hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
        
        {/* 게시글 목록 */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">조회</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">추천</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <motion.tr 
                      key={post.id}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => window.location.href = `/community/board/${post.id}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {post.isNotice && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                              공지
                            </span>
                          )}
                          <div className="text-sm font-medium text-gray-900">
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
                            <div className="text-sm font-medium text-gray-900">{post.author}</div>
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
          <div className="flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">이전</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" aria-current="page" className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 text-sm font-medium text-blue-600">
                1
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </a>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                ...
              </span>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                10
              </a>
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">다음</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
          
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