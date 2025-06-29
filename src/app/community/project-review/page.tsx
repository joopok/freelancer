'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

// 프로젝트 후기 타입 정의
interface ProjectReview {
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
  tags: string[];
  rating: number;
  projectDuration: string;
  projectType: string;
  thumbnailImage: string;
}

export default function ProjectReviewPage() {
  const [reviews, setReviews] = useState<ProjectReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { scrollY } = useScroll();
  
  // 스크롤 기반 애니메이션 값
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.95]);
  const headerY = useTransform(scrollY, [0, 200], [0, -20]);
  
  // 필터 옵션
  const filterOptions = [
    { id: 'all', name: '전체 보기' },
    { id: 'web', name: '웹 개발' },
    { id: 'app', name: '앱 개발' },
    { id: 'design', name: '디자인' },
    { id: 'marketing', name: '마케팅' },
    { id: 'planning', name: '기획' }
  ];
  
  // 정렬 옵션
  const sortOptions = [
    { id: 'latest', name: '최신순' },
    { id: 'popular', name: '인기순' },
    { id: 'rating', name: '평점순' }
  ];
  
  // 더미 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 실제로는 API 호출로 데이터를 가져옴
      setTimeout(() => {
        const dummyReviews: ProjectReview[] = Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          title: `${['웹사이트 리뉴얼', '모바일 앱 개발', '브랜딩 디자인', '마케팅 캠페인'][i % 4]} 프로젝트 후기`,
          content: '이 프로젝트는 정말 도전적이었지만 많은 것을 배울 수 있었습니다. 팀원들과의 협업을 통해 문제를 해결하고 성공적으로 마무리했습니다.',
          author: `개발자${i + 1}`,
          profileImage: `/images/profile-${(i % 5) + 1}.jpg`,
          date: `2023-${(i % 12) + 1}-${(i % 28) + 1}`,
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 100) + 10,
          comments: Math.floor(Math.random() * 50) + 5,
          category: ['웹 개발', '앱 개발', '디자인', '마케팅', '기획'][i % 5],
          tags: [
            ['React', 'NextJS', 'TailwindCSS'],
            ['Flutter', 'Firebase', '앱 개발'],
            ['UI/UX', 'Figma', '디자인'],
            ['SNS', '콘텐츠 마케팅', '광고'],
            ['서비스 기획', 'PM', '요구사항 분석']
          ][i % 5],
          rating: (Math.floor(Math.random() * 10) + 35) / 10,
          projectDuration: `${Math.floor(Math.random() * 5) + 1}개월`,
          projectType: ['상주', '재택', '혼합'][i % 3],
          thumbnailImage: `/images/project-${(i % 6) + 1}.jpg`
        }));
        
        setReviews(dummyReviews);
        setLoading(false);
      }, 1000);
    };
    
    fetchData();
  }, []);
  
  // 필터링된 리뷰 목록
  const filteredReviews = reviews.filter(review => {
    if (activeFilter !== 'all' && !review.category.toLowerCase().includes(activeFilter)) {
      return false;
    }
    
    if (searchTerm && !review.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !review.content.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 헤더 섹션 */}
      <motion.div 
        className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 overflow-hidden"
        style={{ 
          opacity: headerOpacity,
          scale: headerScale,
          y: headerY
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <motion.div 
            className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat opacity-10"
            animate={{ 
              x: [0, 100],
              y: [0, -100]
            }}
            transition={{ 
              repeat: Infinity,
              repeatType: "reverse",
              duration: 40,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              프로젝트 후기
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-indigo-100">
              실제 프로젝트 경험을 공유하고 인사이트를 얻어보세요
            </p>
            
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative rounded-md shadow-sm max-w-lg w-full">
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-3 pl-4 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-colors duration-300"
                  placeholder="프로젝트 후기 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                후기 작성하기
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* 물결 효과 */}
          <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden pointer-events-none">
            <svg
              className="absolute bottom10 w-full h-24 text-gray-50"
              viewBox="0 0 1440 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0 48h1440V0c-211.2 32-480 48-720 48S211.2 32 0 0v48z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </motion.div>
      
      {/* 필터 섹션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 shadow-sm border border-gray-200 dark:border-gray-600 ${
                  activeFilter === option.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 whitespace-nowrap transition-colors duration-300">정렬:</span>
            <select
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-300"
              defaultValue="latest"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* 후기 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">검색 결과가 없습니다</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400 transition-colors duration-300">다른 검색어나 필터를 사용해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={review.thumbnailImage || '/images/placeholder.jpg'}
                    alt={review.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-indigo-600 dark:bg-indigo-700 text-white text-xs font-bold px-2 py-1 rounded transition-colors duration-300">
                    {review.projectType}
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 transition-colors duration-300">
                      {review.category}
                    </span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(review.rating)
                              ? 'text-yellow-400'
                              : i < review.rating
                              ? 'text-yellow-300'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-600">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 transition-colors duration-300">
                    {review.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 transition-colors duration-300">
                    {review.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {review.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 transition-colors duration-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                        <Image
                          src={review.profileImage || '/images/avatar-placeholder.jpg'}
                          alt={review.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{review.author}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                      <span className="mr-3 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {review.views}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {review.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* 페이지네이션 */}
        {!loading && filteredReviews.length > 0 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">이전</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100">2</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">8</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">9</a>
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">10</a>
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
      
      {/* CTA 섹션 */}
      <div className="bg-indigo-700 dark:bg-indigo-800 text-white py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">나만의 프로젝트 경험을 공유해보세요</h2>
          <p className="text-indigo-100 text-lg max-w-3xl mx-auto mb-8">
            여러분의 소중한 경험은 다른 개발자들에게 큰 도움이 됩니다.
            프로젝트를 진행하면서 겪은 어려움과 해결 방법, 성공 사례를 공유해주세요.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <svg className="mr-2 -ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            후기 작성하기
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
