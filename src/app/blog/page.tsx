'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoading } from '@/components/layout/Loading';
import { motion } from 'framer-motion';

// 블로그 포스트 타입 정의
interface BlogPost {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  author: string;
  imageUrl: string;
  tags: string[];
}

export default function BlogPage() {
  const { setLoading } = useLoading();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [scrollY, setScrollY] = useState(0);
  
  // 초기 데이터
  const initialBlogData: BlogPost[] = [
    {
      id: "1",
      title: "프리랜서로 성공하기 위한 10가지 팁",
      category: "프리랜서",
      description: "프리랜서로 성공적인 커리어를 쌓기 위한 실용적인 조언과 팁을 소개합니다.",
      date: "2023-12-15",
      author: "김프리",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZWxhbmNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
      tags: ["프리랜서", "커리어", "성공전략"]
    },
    {
      id: "2",
      title: "2023년 개발자 취업 트렌드 분석",
      category: "취업정보",
      description: "최신 IT 시장의 채용 동향과 개발자들이 갖추어야 할 필수 역량에 대해 알아봅니다.",
      date: "2023-11-28",
      author: "이개발",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcmVlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
      tags: ["개발자", "취업", "IT트렌드"]
    },
    {
      id: "3",
      title: "원격근무 생산성을 높이는 팁",
      category: "재택근무",
      description: "재택근무 시 집중력과 생산성을 유지하는 방법과 효율적인 시간 관리 전략을 소개합니다.",
      date: "2023-10-10",
      author: "박재택",
      imageUrl: "https://images.unsplash.com/photo-1591382696684-38c427c7547a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cmVtb3RlJTIwd29ya3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
      tags: ["재택근무", "생산성", "시간관리"]
    },
    {
      id: "4",
      title: "IT 면접 준비 가이드",
      category: "취업정보",
      description: "기술 면접부터 인성 면접까지, IT 기업 면접에 효과적으로 대비하는 방법을 알아봅니다.",
      date: "2023-09-22",
      author: "김면접",
      imageUrl: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW50ZXJ2aWV3fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      tags: ["면접", "취업준비", "IT취업"]
    },
    {
      id: "5",
      title: "프로그래머를 위한 건강 관리법",
      category: "라이프스타일",
      description: "장시간 컴퓨터 작업으로 인한 건강 문제를 예방하고 관리하는 방법을 소개합니다.",
      date: "2023-08-15",
      author: "정건강",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aGVhbHRoeSUyMGxpZmVzdHlsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
      tags: ["건강", "개발자", "라이프스타일"]
    },
    {
      id: "6",
      title: "포트폴리오 제작 완벽 가이드",
      category: "포트폴리오",
      description: "채용 담당자의 시선을 사로잡는 효과적인 개발자 포트폴리오 제작 방법을 안내합니다.",
      date: "2023-07-20",
      author: "이포트",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydGZvbGlvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      tags: ["포트폴리오", "취업준비", "개발자"]
    }
  ];

  // 페이지 로드 시 데이터 초기화
  useEffect(() => {
    // 카테고리 추출
    const uniqueCategories = Array.from(new Set(initialBlogData.map(post => post.category)));
    
    // 데이터 설정
    setPosts(initialBlogData);
    setCategories(uniqueCategories);
  }, []);

  // 스크롤 위치 추적
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 카테고리별 필터링
  const filteredPosts = selectedCategory === '전체' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 인터랙티브 블로그 헤더 */}
      <div className="relative overflow-hidden">
        {/* 배경 패턴 */}
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* 그라데이션 배경 */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 to-blue-500" />
        
        {/* 움직이는 원형 그래픽 요소들 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div 
            className="absolute w-64 h-64 rounded-full bg-white opacity-10" 
            style={{ 
              top: '10%', 
              left: '5%',
              x: scrollY * 0.1,
              y: scrollY * -0.05 
            }}
          />
          <motion.div 
            className="absolute w-40 h-40 rounded-full bg-indigo-300 opacity-10" 
            style={{ 
              top: '60%', 
              left: '60%',
              x: scrollY * -0.2,
              y: scrollY * 0.05 
            }}
          />
          <motion.div 
            className="absolute w-96 h-96 rounded-full bg-blue-200 opacity-10" 
            style={{ 
              top: '30%', 
              right: '-5%',
              x: scrollY * -0.15,
              y: scrollY * -0.05 
            }}
          />
        </div>
        
        {/* 콘텐츠 */}
        <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-10 md:mb-0">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
                      <span className="block">잡코리아 빌보드</span>
                      <span className="block mt-2 text-blue-100">블로그</span>
                    </h1>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <p className="text-xl md:text-2xl opacity-90 max-w-lg">
                      프리랜서, 취업, IT 트렌드에 관한 최신 소식과 인사이트를 
                      전문가의 시각으로 전달합니다.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-6 flex flex-wrap gap-4"
                  >
                    <Link 
                      href="/blog/categories"
                      className="px-6 py-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all text-white font-medium flex items-center backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      카테고리 둘러보기
                    </Link>
                    <Link 
                      href="/blog/about"
                      className="px-6 py-3 rounded-full border border-white border-opacity-40 hover:bg-white hover:bg-opacity-10 transition-all text-white font-medium flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      블로그 소개
                    </Link>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative hidden md:block"
                  style={{ width: '320px', height: '320px' }}
                >
                  <div className="absolute inset-0 rounded-full bg-white bg-opacity-10 backdrop-blur-lg shadow-xl"></div>
                  <div className="absolute inset-4 rounded-full bg-white bg-opacity-5 backdrop-blur-sm"></div>
                  <div className="absolute inset-8 rounded-full overflow-hidden">
                    <Image 
                      src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNvZGluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
                      alt="프로그래밍"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </div>
              
              {/* 스크롤 다운 인디케이터 */}
              <motion.div 
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* 카테고리 네비게이션 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto py-4">
            <button
              onClick={() => handleCategoryChange('전체')}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === '전체' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              전체 글
            </button>
            
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
            
            <Link 
              href="/blog/categories"
              className="px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              모든 카테고리
            </Link>
          </nav>
        </div>
      </div>
      
      {/* 블로그 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <Link 
              key={post.id} 
              href={`/blog/posts/${post.id}`}
              className="block"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
                    {post.category}
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                </div>
                <div className="px-6 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 