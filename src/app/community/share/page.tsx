'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// 공유 아이템 타입 정의
interface SharedItem {
  id: number;
  title: string;
  description: string;
  author: string;
  profileImage: string;
  date: string;
  likes: number;
  views: number;
  shares: number;
  contentType: string; // 'article', 'resource', 'tool', 'template'
  tags: string[];
  thumbnailUrl?: string;
  resourceUrl?: string;
}

export default function CommunitySharePage() {
  // 상태 관리
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);
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
    fetchData();
  }, [page, fetchData]);

  // 모의 데이터 가져오기 함수
  const fetchData = () => {
    // 실제 API 호출을 대신하는 모의 데이터
    const mockItems: SharedItem[] = [
      { id: 1, title: "2023년 개발자 이력서 템플릿 공유", description: "...", author: "김개발", profileImage: "https://randomuser.me/api/portraits/men/32.jpg", date: "2023-03-10", likes: 128, views: 1024, shares: 56, contentType: "template", tags: ["이력서", "취업", "템플릿"], thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80", resourceUrl: "https://example.com/resume-template" },
      { id: 2, title: "프론트엔드 개발자를 위한 유용한 VS Code 확장 프로그램 모음", description: "...", author: "이프론트", profileImage: "https://randomuser.me/api/portraits/women/44.jpg", date: "2023-03-12", likes: 85, views: 750, shares: 32, contentType: "resource", tags: ["VS Code", "개발도구", "프론트엔드"], thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 3, title: "개발자 포트폴리오 사이트 제작 가이드", description: "...", author: "박디자인", profileImage: "https://randomuser.me/api/portraits/women/68.jpg", date: "2023-03-15", likes: 64, views: 512, shares: 28, contentType: "article", tags: ["포트폴리오", "Next.js", "Tailwind CSS"], thumbnailUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80", resourceUrl: "https://example.com/portfolio-guide" },
      { id: 4, title: "무료 API 모음 - 사이드 프로젝트를 위한 데이터 소스", description: "...", author: "최백엔드", profileImage: "https://randomuser.me/api/portraits/men/75.jpg", date: "2023-03-18", likes: 96, views: 678, shares: 42, contentType: "resource", tags: ["API", "사이드프로젝트", "데이터"], thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 5, title: "개발자 로드맵 2023 - 프론트엔드, 백엔드, DevOps", description: "...", author: "정멘토", profileImage: "https://randomuser.me/api/portraits/women/90.jpg", date: "2023-03-20", likes: 112, views: 890, shares: 64, contentType: "article", tags: ["로드맵", "커리어", "학습"], thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80", resourceUrl: "https://example.com/developer-roadmap" },
      { id: 6, title: "프로그래밍 알고리즘 문제 해결 전략", description: "...", author: "조알고", profileImage: "https://randomuser.me/api/portraits/men/42.jpg", date: "2023-03-22", likes: 78, views: 546, shares: 38, contentType: "article", tags: ["알고리즘", "코딩테스트", "문제해결"], thumbnailUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 7, title: "클린 코드 작성법", description: "...", author: "클린코더", profileImage: "https://randomuser.me/api/portraits/men/1.jpg", date: "2023-03-25", likes: 150, views: 1200, shares: 70, contentType: "article", tags: ["클린코드", "개발"], thumbnailUrl: "https://images.unsplash.com/photo-1504384308090-c894fd248f46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 8, title: "Git & GitHub 완벽 가이드", description: "...", author: "깃마스터", profileImage: "https://randomuser.me/api/portraits/women/2.jpg", date: "2023-03-28", likes: 90, views: 800, shares: 40, contentType: "resource", tags: ["Git", "GitHub", "버전관리"], thumbnailUrl: "https://images.unsplash.com/photo-1593642532842-98d0fd5f8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 9, title: "개발자를 위한 생산성 도구 모음", description: "...", author: "생산성덕후", profileImage: "https://randomuser.me/api/portraits/men/3.jpg", date: "2023-03-30", likes: 110, views: 950, shares: 50, contentType: "tool", tags: ["생산성", "개발도구"], thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 10, title: "면접 대비 알고리즘 문제 풀이", description: "...", author: "코딩고수", profileImage: "https://randomuser.me/api/portraits/women/4.jpg", date: "2023-04-02", likes: 130, views: 1100, shares: 60, contentType: "article", tags: ["알고리즘", "면접"], thumbnailUrl: "https://images.unsplash.com/photo-1520004434532-cd668035079d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 11, title: "개발자를 위한 효과적인 커뮤니케이션 전략", description: "...", author: "소통전문가", profileImage: "https://randomuser.me/api/portraits/men/5.jpg", date: "2023-04-05", likes: 70, views: 600, shares: 30, contentType: "article", tags: ["커뮤니케이션", "소프트스킬"], thumbnailUrl: "https://images.unsplash.com/photo-1521737711867-ee1bd4808bd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 12, title: "웹 개발자를 위한 디자인 시스템 가이드", description: "...", author: "디자인시스템", profileImage: "https://randomuser.me/api/portraits/women/6.jpg", date: "2023-04-08", likes: 95, views: 850, shares: 45, contentType: "resource", tags: ["디자인시스템", "웹개발"], thumbnailUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 13, title: "2023년 개발자 이력서 템플릿 공유 2", description: "...", author: "김개발", profileImage: "https://randomuser.me/api/portraits/men/32.jpg", date: "2023-03-10", likes: 128, views: 1024, shares: 56, contentType: "template", tags: ["이력서", "취업", "템플릿"], thumbnailUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80", resourceUrl: "https://example.com/resume-template" },
      { id: 14, title: "프론트엔드 개발자를 위한 유용한 VS Code 확장 프로그램 모음 2", description: "...", author: "이프론트", profileImage: "https://randomuser.me/api/portraits/women/44.jpg", date: "2023-03-12", likes: 85, views: 750, shares: 32, contentType: "resource", tags: ["VS Code", "개발도구", "프론트엔드"], thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 15, title: "개발자 포트폴리오 사이트 제작 가이드 2", description: "...", author: "박디자인", profileImage: "https://randomuser.me/api/portraits/women/68.jpg", date: "2023-03-15", likes: 64, views: 512, shares: 28, contentType: "article", tags: ["포트폴리오", "Next.js", "Tailwind CSS"], thumbnailUrl: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80", resourceUrl: "https://example.com/portfolio-guide" },
      { id: 16, title: "무료 API 모음 - 사이드 프로젝트를 위한 데이터 소스 2", description: "...", author: "최백엔드", profileImage: "https://randomuser.me/api/portraits/men/75.jpg", date: "2023-03-18", likes: 96, views: 678, shares: 42, contentType: "resource", tags: ["API", "사이드프로젝트", "데이터"], thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" },
      { id: 17, title: "개발자 로드맵 2023 - 프론트엔드, 백엔드, DevOps 2", description: "...", author: "정멘토", profileImage: "https://randomuser.me/api/portraits/women/90.jpg", date: "2023-03-20", likes: 112, views: 890, shares: 64, contentType: "article", tags: ["로드맵", "커리어", "학습"], thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80", resourceUrl: "https://example.com/developer-roadmap" },
      { id: 18, title: "프로그래밍 알고리즘 문제 해결 전략 2", description: "...", author: "조알고", profileImage: "https://randomuser.me/api/portraits/men/42.jpg", date: "2023-03-22", likes: 78, views: 546, shares: 38, contentType: "article", tags: ["알고리즘", "코딩테스트", "문제해결"], thumbnailUrl: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" }
    ];
    
    const startIndex = (page - 1) * 8; // 페이지당 8개 게시물
    const endIndex = startIndex + 8;
    const newItems = mockItems.slice(startIndex, endIndex);

    setSharedItems((prevItems) => [...prevItems, ...newItems]);
    setHasMore(endIndex < mockItems.length);
    setLoading(false);
  };

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

  // 공유하기 함수
  const handleShare = (item: SharedItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: item.resourceUrl || window.location.href,
      })
      .catch((error) => console.log('공유하기 실패:', error));
    } else {
      // 공유 API가 지원되지 않는 경우, 링크 복사 기능 제공
      copyToClipboard(item.id, item.resourceUrl || window.location.href);
    }
  };

  // 클립보드에 복사 함수
  const copyToClipboard = (id: number, text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 500);
      })
      .catch(err => console.error('클립보드 복사 실패:', err));
  };

  // 필터링된 아이템 목록
  const filteredItems = sharedItems.filter(item => {
    // 검색어 필터링
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // 카테고리 필터링
    if (activeFilters.length > 0 && !activeFilters.includes(item.contentType)) {
      return false;
    }
    
    return true;
  });

  // 컨텐츠 타입 리스트
  const contentTypes = [
    { id: "article", name: "아티클" },
    { id: "resource", name: "리소스" },
    { id: "tool", name: "개발 도구" },
    { id: "template", name: "템플릿" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 공유 페이지 헤더 섹션 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" ref={heroRef}>
        {/* 배경 패턴 */}
        <div 
          className="absolute inset-0 opacity-10 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
          className="absolute w-80 h-80 rounded-full bg-blue-300 opacity-10" 
          style={{ 
            bottom: '-10%', 
            right: '-5%',
            x: scrollY * -0.15,
            y: scrollY * 0.05 
          }}
        />
        
        {/* 3D 도형 요소 */}
        <motion.div
          className="absolute w-32 h-32 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-xl opacity-20"
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
          className="absolute w-28 h-28 bg-gradient-to-tr from-indigo-300 to-purple-400 rounded-full opacity-20"
          style={{
            top: '20%',
            right: '15%',
            rotate: scrollY * -0.02,
            y: scrollY * -0.05,
            transformStyle: 'preserve-3d',
            transform: `perspective(1000px) rotateX(${scrollY * -0.01}deg) rotateY(${scrollY * -0.02}deg)`
          }}
        />
        
        {/* SVG 아이콘 요소 */}
        <motion.div
          className="absolute w-16 h-16 opacity-20"
          style={{
            top: '50%',
            left: '15%',
            y: scrollY * 0.03,
            rotate: scrollY * 0.01
          }}
        >
          <svg fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
          </svg>
        </motion.div>
        <motion.div
          className="absolute w-14 h-14 opacity-20"
          style={{
            bottom: '30%',
            right: '20%',
            y: scrollY * -0.04,
            rotate: scrollY * -0.01
          }}
        >
          <svg fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </motion.div>
        
        {/* 헤더 콘텐츠 */}
        <div className="relative px-4 py-24 sm:px-6 lg:px-8 text-center text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              <span className="block">지식과 자료 공유</span>
              <span className="block text-blue-200 mt-2 text-3xl sm:text-4xl">함께 배우고, 함께 성장하는 공간</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl opacity-90 mb-8">
              유용한 개발 자료, 템플릿, 툴, 아티클을 공유하고<br /> 
              다른 개발자들과 함께 성장해보세요.
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
                자료 공유하기
              </motion.div>
              <motion.a
                href="#shared-content"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-full border border-white border-opacity-40 text-white font-medium hover:bg-white hover:bg-opacity-10 transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                공유 자료 찾아보기
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
      
      {/* 공유 아이템 검색 및 필터 영역 */}
      <div id="shared-content" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">모든 공유 자료</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">총 {filteredItems.length}개의 공유 자료를 찾았습니다.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 min-w-[250px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="공유 자료 검색하기"
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
              {contentTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => toggleFilter(type.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                    activeFilters.includes(type.id)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* 공유 아이템 목록 */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-600 hover:shadow-xl transition-all duration-300"
              >
                {item.thumbnailUrl && (
                  <div className="h-48 relative overflow-hidden group">
                    <Image 
                      src={item.thumbnailUrl} 
                      alt={item.title}
                      className="object-cover transition-transform group-hover:scale-105"
                      fill
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-4">
                      <span className="text-white font-medium">{contentTypes.find(t => t.id === item.contentType)?.name}</span>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden relative mr-3">
                      <Image 
                        src={item.profileImage} 
                        alt={item.author}
                        className="object-cover"
                        fill
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{item.author}</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">{item.date}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 transition-colors duration-300">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-medium transition-colors duration-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {item.views}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {item.likes}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      {item.shares}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.a
                      href={item.resourceUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      자료 보기
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </motion.a>
                    <motion.button
                      onClick={() => handleShare(item)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-300"
                    >
                      {copiedId === item.id ? (
                        <>
                          <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          복사됨
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          공유
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* 더 보기 버튼 */}
        {!loading && filteredItems.length > 0 && (
          <div className="mt-12 text-center">
            <button className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
              더 많은 공유 자료 보기
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
