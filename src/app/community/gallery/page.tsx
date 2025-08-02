'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 갤러리 아이템 타입 정의
interface GalleryItem {
  id: number;
  title: string;
  description: string;
  author: string;
  authorImage: string;
  category: string;
  imageUrl: string;
  likes: number;
  comments: number;
  date: string;
  isFeatured?: boolean;
}

// 배경 애니메이션 컴포넌트
const BackgroundAnimation = () => (
  <div className="absolute inset-0">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.2, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-400/20 to-transparent rounded-full"
    />
    <motion.div
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-400/20 to-transparent rounded-full"
    />
  </div>
);

// 실시간 배지 컴포넌트
const LiveBadge = () => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-10 backdrop-blur-lg text-white mb-6"
  >
    <span className="relative flex h-2 w-2 mr-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
    </span>
    실시간 갤러리
  </motion.div>
);

// 통계 카드 컴포넌트
interface StatCardProps {
  value: string;
  label: string;
  delay: number;
}

const StatCard = ({ value, label, delay }: StatCardProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:shadow-2xl transition-all duration-300"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
    >
      {value}
    </motion.div>
    <p className="text-blue-100">{label}</p>
  </motion.div>
);

// 공유 버튼 컴포넌트
const ShareButton = () => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="group inline-flex items-center px-6 py-3 rounded-full bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 text-white hover:bg-opacity-20 transition-all duration-300 shadow-lg hover:shadow-xl"
  >
    <motion.svg
      whileHover={{ rotate: 180 }}
      transition={{ duration: 0.3 }}
      className="w-5 h-5 mr-2 transform group-hover:scale-110"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </motion.svg>
    작품 공유하기
  </motion.button>
);

// 헤더 섹션 컴포넌트
const HeaderSection = () => (
  <div className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 py-16 px-4 sm:px-6 lg:px-8 text-white overflow-hidden">
    <BackgroundAnimation />
    
    <div className="relative max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <LiveBadge />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-blue-100"
        >
          갤러리
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl opacity-90 max-w-2xl mx-auto mb-8 text-blue-100"
        >
          포트폴리오, 작업물, 취업 성공 스토리 등 다양한 이미지를 공유해보세요
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <ShareButton />
        </motion.div>

        {/* 통계 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <StatCard value="1,234" label="총 작품수" delay={0.7} />
          <StatCard value="89" label="오늘 새 작품" delay={0.8} />
          <StatCard value="4,567" label="활성 작가" delay={0.9} />
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
);

export default function CommunityGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [layout, setLayout] = useState<'grid' | 'masonry'>('grid');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  
  // 카테고리 목록
  const categories = [
    { id: 'all', name: '전체' },
    { id: 'portfolio', name: '포트폴리오' },
    { id: 'design', name: '디자인' },
    { id: 'ui_ux', name: 'UI/UX' },
    { id: 'photo', name: '사진' },
    { id: 'illustration', name: '일러스트' },
    { id: 'success', name: '취업성공' }
  ];
  
  // 갤러리 데이터 로드
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      
      setTimeout(() => {
        const dummyGalleryItems: GalleryItem[] = [
          { id: 1, title: "모바일 앱 UI 디자인 포트폴리오", description: "...", author: "디자인마스터", authorImage: "https://randomuser.me/api/portraits/women/44.jpg", category: "ui_ux", imageUrl: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fG1vYmlsZSUyMGFwcHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60", likes: 128, comments: 24, date: "2023-11-28", isFeatured: true },
          { id: 2, title: "브랜드 아이덴티티 디자인", description: "...", author: "브랜딩전문가", authorImage: "https://randomuser.me/api/portraits/men/32.jpg", category: "design", imageUrl: "https://images.unsplash.com/photo-1634942536790-29fac3b6b047?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJyYW5kaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 96, comments: 18, date: "2023-11-25" },
          { id: 3, title: "웹 개발자 포트폴리오 사이트", description: "...", author: "프론트엔드개발자", authorImage: "https://randomuser.me/api/portraits/men/45.jpg", category: "portfolio", imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60", likes: 85, comments: 32, date: "2023-11-22" },
          { id: 4, title: "IT 기업 최종 합격 인증!", description: "...", author: "취업성공러", authorImage: "https://randomuser.me/api/portraits/women/22.jpg", category: "success", imageUrl: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2VsZWJyYXRpb258ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60", likes: 215, comments: 64, date: "2023-11-20", isFeatured: true },
          { id: 5, title: "제품 사진 촬영 작업물", description: "...", author: "제품사진작가", authorImage: "https://randomuser.me/api/portraits/women/67.jpg", category: "photo", imageUrl: "https://images.unsplash.com/photo-1581395204630-2256073ee7ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 74, comments: 15, date: "2023-11-18" },
          { id: 6, title: "캐릭터 일러스트레이션", description: "...", author: "일러스트레이터", authorImage: "https://randomuser.me/api/portraits/men/67.jpg", category: "illustration", imageUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y2hhcmFjdGVyJTIwZGVzaWdufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 112, comments: 28, date: "2023-11-15" },
          { id: 7, title: "모바일 앱 와이어프레임", description: "...", author: "UX디자이너", authorImage: "https://randomuser.me/api/portraits/women/28.jpg", category: "ui_ux", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHdpcmVmcmFtZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60", likes: 67, comments: 14, date: "2023-11-12" },
          { id: 8, title: "스타트업 채용 최종 합격!", description: "...", author: "취업축하해요", authorImage: "https://randomuser.me/api/portraits/men/22.jpg", category: "success", imageUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGhhcHB5JTIwcGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 142, comments: 38, date: "2023-11-10", isFeatured: true },
          { id: 9, title: "웹사이트 리디자인 프로젝트", description: "...", author: "웹디자이너", authorImage: "https://randomuser.me/api/portraits/women/54.jpg", category: "design", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHdlYnNpdGUlMjBkZXNpZ258ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60", likes: 89, comments: 22, date: "2023-11-08" },
          { id: 10, title: "자연 풍경 사진 작업물", description: "...", author: "풍경사진작가", authorImage: "https://randomuser.me/api/portraits/men/88.jpg", category: "photo", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 156, comments: 42, date: "2023-11-05" },
          { id: 11, title: "3D 아이콘 디자인", description: "...", author: "3D디자이너", authorImage: "https://randomuser.me/api/portraits/women/36.jpg", category: "design", imageUrl: "https://images.unsplash.com/photo-1618331833283-0a4148e11a1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8M2QlMjBpY29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 78, comments: 19, date: "2023-11-02" },
          { id: 12, title: "그래픽 디자이너 포트폴리오", description: "...", author: "그래픽마스터", authorImage: "https://randomuser.me/api/portraits/men/76.jpg", category: "portfolio", imageUrl: "https://images.unsplash.com/photo-1616002411355-49593fd89721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhcGhpYyUyMGRlc2lnbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60", likes: 94, comments: 26, date: "2023-10-30" },
          { id: 13, title: "모바일 앱 UI 디자인 포트폴리오 2", description: "...", author: "디자인마스터", authorImage: "https://randomuser.me/api/portraits/women/44.jpg", category: "ui_ux", imageUrl: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fG1vYmlsZSUyMGFwcHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60", likes: 128, comments: 24, date: "2023-11-28", isFeatured: true },
          { id: 14, title: "브랜드 아이덴티티 디자인 2", description: "...", author: "브랜딩전문가", authorImage: "https://randomuser.me/api/portraits/men/32.jpg", category: "design", imageUrl: "https://images.unsplash.com/photo-1634942536790-29fac3b6b047?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJyYW5kaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 96, comments: 18, date: "2023-11-25" },
          { id: 15, title: "웹 개발자 포트폴리오 사이트 2", description: "...", author: "프론트엔드개발자", authorImage: "https://randomuser.me/api/portraits/men/45.jpg", category: "portfolio", imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60", likes: 85, comments: 32, date: "2023-11-22" },
          { id: 16, title: "IT 기업 최종 합격 인증! 2", description: "...", author: "취업성공러", authorImage: "https://randomuser.me/api/portraits/women/22.jpg", category: "success", imageUrl: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2VsZWJyYXRpb258ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60", likes: 215, comments: 64, date: "2023-11-20", isFeatured: true },
          { id: 17, title: "제품 사진 촬영 작업물 2", description: "...", author: "제품사진작가", authorImage: "https://randomuser.me/api/portraits/women/67.jpg", category: "photo", imageUrl: "https://images.unsplash.com/photo-1581395204630-2256073ee7ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 74, comments: 15, date: "2023-11-18" },
          { id: 18, title: "캐릭터 일러스트레이션 2", description: "...", author: "일러스트레이터", authorImage: "https://randomuser.me/api/portraits/men/67.jpg", category: "illustration", imageUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y2hhcmFjdGVyJTIwZGVzaWdufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 112, comments: 28, date: "2023-11-15" },
          { id: 19, title: "모바일 앱 와이어프레임 2", description: "...", author: "UX디자이너", authorImage: "https://randomuser.me/api/portraits/women/28.jpg", category: "ui_ux", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHdpcmVmcmFtZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60", likes: 67, comments: 14, date: "2023-11-12" },
          { id: 20, title: "스타트업 채용 최종 합격! 2", description: "...", author: "취업축하해요", authorImage: "https://randomuser.me/api/portraits/men/22.jpg", category: "success", imageUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGhhcHB5JTIwcGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 142, comments: 38, date: "2023-11-10", isFeatured: true },
          { id: 21, title: "웹사이트 리디자인 프로젝트 2", description: "...", author: "웹디자이너", authorImage: "https://randomuser.me/api/portraits/women/54.jpg", category: "design", imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHdlYnNpdGUlMjBkZXNpZ258ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60", likes: 89, comments: 22, date: "2023-11-08" },
          { id: 22, title: "자연 풍경 사진 작업물 2", description: "...", author: "풍경사진작가", authorImage: "https://randomuser.me/api/portraits/men/88.jpg", category: "photo", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 156, comments: 42, date: "2023-11-05" },
          { id: 23, title: "3D 아이콘 디자인 2", description: "...", author: "3D디자이너", authorImage: "https://randomuser.me/api/portraits/women/36.jpg", category: "design", imageUrl: "https://images.unsplash.com/photo-1618331833283-0a4148e11a1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8M2QlMjBpY29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60", likes: 78, comments: 19, date: "2023-11-02" },
          { id: 24, title: "그래픽 디자이너 포트폴리오 2", description: "...", author: "그래픽마스터", authorImage: "https://randomuser.me/api/portraits/men/76.jpg", category: "portfolio", imageUrl: "https://images.unsplash.com/photo-1616002411355-49593fd89721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhcGhpYyUyMGRlc2lnbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60", likes: 94, comments: 26, date: "2023-10-30" }
        ];
        
        const startIndex = (page - 1) * 8; // 페이지당 8개 게시물
        const endIndex = startIndex + 8;
        const newItems = dummyGalleryItems.slice(startIndex, endIndex);

        setGalleryItems((prevItems) => [...prevItems, ...newItems]);
        setHasMore(endIndex < dummyGalleryItems.length);
        setLoading(false);
      }, 500);
    };
    
    fetchData();
  }, [page]);

  useEffect(() => {
    const currentLoader = loader.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1 }
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, loading]);
  
  // 필터링된 갤러리 아이템
  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);
  
  // 레이아웃 변경 핸들러
  const handleLayoutChange = (newLayout: 'grid' | 'masonry') => {
    setLayout(newLayout);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <HeaderSection />
      
      {/* 필터 및 레이아웃 옵션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                  filter === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* 레이아웃 옵션 */}
          <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <button
              onClick={() => handleLayoutChange('grid')}
              className={`p-2 rounded transition-colors duration-300 ${
                layout === 'grid'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              aria-label="그리드 뷰"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => handleLayoutChange('masonry')}
              className={`p-2 rounded transition-colors duration-300 ${
                layout === 'masonry'
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              aria-label="매스너리 뷰"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 갤러리 그리드 */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>이 카테고리에는 아직 갤러리 항목이 없습니다.</p>
          </div>
        ) : (
          <div className={`${
            layout === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr'
              : 'columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6'
          }`}>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${
                  layout === 'grid' 
                    ? item.isFeatured ? 'sm:col-span-2 sm:row-span-2' : ''
                    : 'inline-block w-full mb-6'
                }`}
              >
                <Link href={`/community/gallery/${item.id}`} className="block h-full">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden h-full transition-all hover:shadow-md border border-gray-200 dark:border-gray-700">
                    <div className={`relative ${item.isFeatured ? 'pt-[60%]' : 'pt-[75%]'}`}>
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      {item.isFeatured && (
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            인기작품
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 p-6 text-white">
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          <p className="text-sm line-clamp-2 text-gray-200">{item.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={item.authorImage}
                              alt={item.author}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{item.author}</span>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {categories.find(cat => cat.id === item.category)?.name || item.category}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{item.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{item.comments}</span>
                          </div>
                        </div>
                        <span className="text-xs">{item.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* 더보기 버튼 */}
        {!loading && filteredItems.length > 0 && (
          <div className="mt-12 text-center">
            <button className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
              더 많은 작품 보기
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* 갤러리 이용 안내 */}
      <div className="bg-white dark:bg-gray-800 py-16 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">갤러리 이용 안내</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-12 transition-colors duration-300">
              나만의 작품과 포트폴리오를 공유하고 다양한 분야의 크리에이터들과 소통해보세요.
              취업 성공 스토리도 자유롭게 공유할 수 있습니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-indigo-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">작품 업로드</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                고화질 이미지를 업로드하고 작품에 대한 설명을 추가하여 포트폴리오를 구성해보세요.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-indigo-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">피드백 받기</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                다른 사용자들로부터 작품에 대한 피드백과 조언을 받아 더 나은 결과물을 만들어보세요.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-indigo-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">취업 기회</h3>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                우수한 포트폴리오를 통해 기업의 스카우트 제안을 받거나 취업 기회를 얻을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 