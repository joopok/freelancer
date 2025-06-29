'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 질문 타입 정의
interface Question {
  id: number;
  title: string;
  content: string;
  author: string;
  profileImage: string;
  date: string;
  views: number;
  likes: number;
  answers: number;
  category: string;
  isResolved: boolean;
  tags: string[];
}

export default function CommunityQnaPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  
  // 카테고리 목록
  const categories = [
    '전체', '취업/이직', '개발', '디자인', '마케팅', '기획', 'HR', '기타'
  ];
  
  // 인기 태그 목록
  const popularTags = [
    '신입', '면접', '포트폴리오', 'React', '자기소개서', 'PM', 'UX/UI', '연봉협상'
  ];
  
  // 질문 데이터 로드
  useEffect(() => {
    // 실제로는 API 호출로 데이터를 가져옴
    const fetchData = () => {
      setLoading(true);
      
      setTimeout(() => {
        const dummyQuestions: Question[] = [
          { id: 1, title: "신입 개발자 포트폴리오에 꼭 포함되어야 할 내용이 있을까요?", content: "...", author: "코딩초보", profileImage: "https://randomuser.me/api/portraits/men/32.jpg", date: "2023-11-28", views: 1254, likes: 56, answers: 8, category: "취업/이직", isResolved: true, tags: ["포트폴리오", "신입", "개발자"] },
          { id: 2, title: "면접에서 '본인의 단점'을 물어볼 때 어떻게 대답하는 게 좋을까요?", content: "...", author: "면접준비생", profileImage: "https://randomuser.me/api/portraits/women/54.jpg", date: "2023-11-27", views: 986, likes: 42, answers: 12, category: "취업/이직", isResolved: true, tags: ["면접", "취업준비", "자기소개"] },
          { id: 3, title: "React와 Next.js 중 취업에 더 유리한 기술은 무엇인가요?", content: "...", author: "프론트개발자", profileImage: "https://randomuser.me/api/portraits/men/45.jpg", date: "2023-11-25", views: 854, likes: 38, answers: 6, category: "개발", isResolved: false, tags: ["React", "Next.js", "프론트엔드", "취업"] },
          { id: 4, title: "UX/UI 디자이너의 포트폴리오에는 어떤 프로젝트가 포함되어야 할까요?", content: "...", author: "디자인꿈나무", profileImage: "https://randomuser.me/api/portraits/women/33.jpg", date: "2023-11-22", views: 742, likes: 29, answers: 5, category: "디자인", isResolved: true, tags: ["UX/UI", "디자인", "포트폴리오"] },
          { id: 5, title: "기획자로 이직하려면 어떤 경험이 필요할까요?", content: "...", author: "예비기획자", profileImage: "https://randomuser.me/api/portraits/men/22.jpg", date: "2023-11-20", views: 635, likes: 24, answers: 4, category: "기획", isResolved: false, tags: ["기획", "이직", "PM"] },
          { id: 6, title: "첫 연봉 협상, 어떻게 준비해야 할까요?", content: "...", author: "연봉고민", profileImage: "https://randomuser.me/api/portraits/women/28.jpg", date: "2023-11-18", views: 892, likes: 47, answers: 9, category: "취업/이직", isResolved: true, tags: ["연봉협상", "취업", "신입"] },
          { id: 7, title: "백엔드 개발자 로드맵 추천해주세요", content: "...", author: "백엔드지망생", profileImage: "https://randomuser.me/api/portraits/men/67.jpg", date: "2023-11-15", views: 723, likes: 35, answers: 7, category: "개발", isResolved: false, tags: ["백엔드", "개발자", "로드맵"] },
          { id: 8, title: "HR 직무 취업 준비, 어떤 자격증이 도움이 될까요?", content: "...", author: "HR준비생", profileImage: "https://randomuser.me/api/portraits/women/42.jpg", date: "2023-11-12", views: 542, likes: 18, answers: 3, category: "HR", isResolved: true, tags: ["HR", "자격증", "취업"] },
          { id: 9, title: "프론트엔드 개발자 포트폴리오 피드백 부탁드립니다", content: "...", author: "프론트초보", profileImage: "https://randomuser.me/api/portraits/men/1.jpg", date: "2023-11-10", views: 321, likes: 15, answers: 2, category: "개발", isResolved: false, tags: ["포트폴리오", "프론트엔드"] },
          { id: 10, title: "백엔드 개발자에게 필요한 데이터베이스 지식", content: "...", author: "DB마스터", profileImage: "https://randomuser.me/api/portraits/women/2.jpg", date: "2023-11-08", views: 456, likes: 20, answers: 4, category: "개발", isResolved: true, tags: ["데이터베이스", "백엔드"] },
          { id: 11, title: "UX/UI 디자이너에게 추천하는 툴", content: "...", author: "툴추천", profileImage: "https://randomuser.me/api/portraits/men/3.jpg", date: "2023-11-06", views: 123, likes: 5, answers: 1, category: "디자인", isResolved: false, tags: ["UX/UI", "툴"] },
          { id: 12, title: "마케터에게 필요한 데이터 분석 능력", content: "...", author: "데이터마케터", profileImage: "https://randomuser.me/api/portraits/women/4.jpg", date: "2023-11-04", views: 789, likes: 30, answers: 6, category: "마케팅", isResolved: true, tags: ["데이터분석", "마케팅"] },
          { id: 13, title: "기획자에게 필요한 커뮤니케이션 스킬", content: "...", author: "소통왕", profileImage: "https://randomuser.me/api/portraits/men/5.jpg", date: "2023-11-02", views: 987, likes: 40, answers: 8, category: "기획", isResolved: false, tags: ["커뮤니케이션", "기획"] },
          { id: 14, title: "HR 담당자에게 필요한 법률 지식", content: "...", author: "법률전문가", profileImage: "https://randomuser.me/api/portraits/women/6.jpg", date: "2023-10-30", views: 654, likes: 25, answers: 3, category: "HR", isResolved: true, tags: ["법률", "HR"] },
          { id: 15, title: "개발자에게 추천하는 알고리즘 문제 사이트", content: "...", author: "알고리즘매니아", profileImage: "https://randomuser.me/api/portraits/men/7.jpg", date: "2023-10-28", views: 1234, likes: 50, answers: 10, category: "개발", isResolved: false, tags: ["알고리즘", "코딩테스트"] },
          { id: 16, title: "디자이너에게 필요한 코딩 지식", content: "...", author: "코딩디자이너", profileImage: "https://randomuser.me/api/portraits/women/8.jpg", date: "2023-10-26", views: 876, likes: 35, answers: 7, category: "디자인", isResolved: true, tags: ["코딩", "디자인"] },
          { id: 17, title: "마케터에게 필요한 심리학 지식", content: "...", author: "심리마케터", profileImage: "https://randomuser.me/api/portraits/men/9.jpg", date: "2023-10-24", views: 543, likes: 20, answers: 2, category: "마케팅", isResolved: false, tags: ["심리학", "마케팅"] },
          { id: 18, title: "기획자에게 필요한 시장 분석 능력", content: "...", author: "시장분석가", profileImage: "https://randomuser.me/api/portraits/women/10.jpg", date: "2023-10-22", views: 101, likes: 5, answers: 1, category: "기획", isResolved: true, tags: ["시장분석", "기획"] },
          { id: 19, title: "HR 담당자에게 필요한 채용 트렌드", content: "...", author: "채용전문가", profileImage: "https://randomuser.me/api/portraits/men/11.jpg", date: "2023-10-20", views: 234, likes: 10, answers: 3, category: "HR", isResolved: false, tags: ["채용", "HR"] },
          { id: 20, title: "개발자에게 추천하는 커뮤니티", content: "...", author: "커뮤니티매니아", profileImage: "https://randomuser.me/api/portraits/women/12.jpg", date: "2023-10-18", views: 567, likes: 15, answers: 4, category: "개발", isResolved: true, tags: ["커뮤니티", "개발자"] },
          { id: 21, title: "디자이너에게 필요한 포토샵 스킬", content: "...", author: "포토샵장인", profileImage: "https://randomuser.me/api/portraits/men/13.jpg", date: "2023-10-16", views: 890, likes: 20, answers: 5, category: "디자인", isResolved: false, tags: ["포토샵", "디자인"] },
          { id: 22, title: "마케터에게 필요한 글쓰기 능력", content: "...", author: "글쓰기마케터", profileImage: "https://randomuser.me/api/portraits/women/14.jpg", date: "2023-10-14", views: 123, likes: 2, answers: 0, category: "마케팅", isResolved: true, tags: ["글쓰기", "마케팅"] },
          { id: 23, title: "기획자에게 필요한 데이터 시각화", content: "...", author: "데이터시각화", profileImage: "https://randomuser.me/api/portraits/men/15.jpg", date: "2023-10-12", views: 456, likes: 8, answers: 1, category: "기획", isResolved: false, tags: ["데이터시각화", "기획"] },
          { id: 24, title: "HR 담당자에게 필요한 협상 스킬", content: "...", author: "협상전문가", profileImage: "https://randomuser.me/api/portraits/women/16.jpg", date: "2023-10-10", views: 789, likes: 15, answers: 3, category: "HR", isResolved: true, tags: ["협상", "HR"] }
        ];
        
        const startIndex = (page - 1) * 8; // 페이지당 8개 게시물
        const endIndex = startIndex + 8;
        const newQuestions = dummyQuestions.slice(startIndex, endIndex);

        setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);
        setHasMore(endIndex < dummyQuestions.length);
        setLoading(false);
      }, 800);
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
  
  // 질문 필터링
  const filteredQuestions = questions.filter(question => {
    // 검색어 필터링
    return searchTerm === '' || 
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      question.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
      question.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });
  
  // 정렬 로직
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (activeTab === 'latest') {
      // 최신순 정렬
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (activeTab === 'popular') {
      // 인기순 정렬 (좋아요 기준)
      return b.likes - a.likes;
    } else if (activeTab === 'unanswered') {
      // 미해결 질문 먼저, 그 다음 최신순
      if (a.isResolved !== b.isResolved) {
        return a.isResolved ? 1 : -1;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });
  
  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 여기서 API 검색 요청 등의 로직이 추가될 수 있음
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl mb-4">질문과 답변</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            취업, 이직, 커리어 관련 고민을 질문하고 전문가와 동료들의 답변을 받아보세요
          </p>
          
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-indigo-600 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              질문하기
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">카테고리</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <a
                    key={category}
                    href="#"
                    className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                  >
                    {category}
                  </a>
                ))}
              </nav>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">인기 태그</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <a
                    key={tag}
                    href="#"
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-300"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900 dark:bg-gray-700 rounded-lg shadow-sm p-6 text-white border border-gray-200 dark:border-gray-600 transition-colors duration-300">
              <h3 className="text-lg font-medium mb-3">질문 작성 팁</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex">
                  <svg className="w-5 h-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>구체적인 상황과 배경을 설명하세요</span>
                </li>
                <li className="flex">
                  <svg className="w-5 h-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>명확한 질문을 통해 원하는 답변을 얻으세요</span>
                </li>
                <li className="flex">
                  <svg className="w-5 h-5 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>관련 태그를 추가하여 적합한 사람에게 도달하게 하세요</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* 오른쪽 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {/* 검색 및 필터 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('latest')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      activeTab === 'latest'
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    최신순
                  </button>
                  <button
                    onClick={() => setActiveTab('popular')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      activeTab === 'popular'
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    인기순
                  </button>
                  <button
                    onClick={() => setActiveTab('unanswered')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      activeTab === 'unanswered'
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    미해결 질문
                  </button>
                </div>
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="질문 또는 태그 검색"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
                  />
                  <button 
                    type="submit"
                    className="bg-indigo-600 dark:bg-indigo-700 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors duration-300"
                  >
                    검색
                  </button>
                </form>
              </div>
            </div>
            
            {/* 질문 목록 */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                </div>
              ) : sortedQuestions.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>검색 결과가 없습니다.</p>
                </div>
              ) : (
                sortedQuestions.map((question) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                  >
                    <Link href={`/community/qna/${question.id}`} className="block">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                <Image
                                  src={question.profileImage}
                                  alt={question.author}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{question.author}</span>
                              <span className="text-gray-500 dark:text-gray-400 mx-2 transition-colors duration-300">•</span>
                              <span className="text-gray-500 dark:text-gray-400 transition-colors duration-300">{question.date}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 transition-colors duration-300">
                              {question.category}
                            </span>
                            {question.isResolved ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                해결됨
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                미해결
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                          {question.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 transition-colors duration-300">{question.content}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 transition-colors duration-300"
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
                              <span>{question.views}</span>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>{question.likes}</span>
                            </div>
                          </div>
                          <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium transition-colors duration-300">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <span>{question.answers}개의 답변</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* 페이지네이션 */}
            {!loading && sortedQuestions.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">이전</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" aria-current="page" className="relative inline-flex items-center px-4 py-2 border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-600">
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
                    8
                  </a>
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">다음</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 