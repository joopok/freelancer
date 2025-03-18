'use client';

import { useState, useEffect } from 'react';
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

export default function CommunityGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [layout, setLayout] = useState<'grid' | 'masonry'>('grid');
  
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
          {
            id: 1,
            title: "모바일 앱 UI 디자인 포트폴리오",
            description: "새로운 핀테크 앱을 위해 디자인한 UI 컴포넌트 모음입니다.",
            author: "디자인마스터",
            authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
            category: "ui_ux",
            imageUrl: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fG1vYmlsZSUyMGFwcHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
            likes: 128,
            comments: 24,
            date: "2023-11-28",
            isFeatured: true
          },
          {
            id: 2,
            title: "브랜드 아이덴티티 디자인",
            description: "신규 스타트업을 위한 브랜드 아이덴티티 작업물입니다.",
            author: "브랜딩전문가",
            authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
            category: "design",
            imageUrl: "https://images.unsplash.com/photo-1634942536790-29fac3b6b047?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJyYW5kaW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
            likes: 96,
            comments: 18,
            date: "2023-11-25"
          },
          {
            id: 3,
            title: "웹 개발자 포트폴리오 사이트",
            description: "React와 Next.js로 제작한 개인 포트폴리오 사이트입니다.",
            author: "프론트엔드개발자",
            authorImage: "https://randomuser.me/api/portraits/men/45.jpg",
            category: "portfolio",
            imageUrl: "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ViJTIwZGV2ZWxvcG1lbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
            likes: 85,
            comments: 32,
            date: "2023-11-22"
          },
          {
            id: 4,
            title: "IT 기업 최종 합격 인증!",
            description: "6개월간의 취업 준비 끝에 드디어 대기업에 합격했습니다!",
            author: "취업성공러",
            authorImage: "https://randomuser.me/api/portraits/women/22.jpg",
            category: "success",
            imageUrl: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2VsZWJyYXRpb258ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
            likes: 215,
            comments: 64,
            date: "2023-11-20",
            isFeatured: true
          },
          {
            id: 5,
            title: "제품 사진 촬영 작업물",
            description: "화장품 브랜드의 신제품 사진 촬영 작업물입니다.",
            author: "제품사진작가",
            authorImage: "https://randomuser.me/api/portraits/women/67.jpg",
            category: "photo",
            imageUrl: "https://images.unsplash.com/photo-1581395204630-2256073ee7ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
            likes: 74,
            comments: 15,
            date: "2023-11-18"
          },
          {
            id: 6,
            title: "캐릭터 일러스트레이션",
            description: "게임 캐릭터 디자인을 위한 일러스트레이션 작업물입니다.",
            author: "일러스트레이터",
            authorImage: "https://randomuser.me/api/portraits/men/67.jpg",
            category: "illustration",
            imageUrl: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8Y2hhcmFjdGVyJTIwZGVzaWdufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
            likes: 112,
            comments: 28,
            date: "2023-11-15"
          },
          {
            id: 7,
            title: "모바일 앱 와이어프레임",
            description: "신규 라이프스타일 앱을 위한 와이어프레임 디자인입니다.",
            author: "UX디자이너",
            authorImage: "https://randomuser.me/api/portraits/women/28.jpg",
            category: "ui_ux",
            imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHdpcmVmcmFtZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
            likes: 67,
            comments: 14,
            date: "2023-11-12"
          },
          {
            id: 8,
            title: "스타트업 채용 최종 합격!",
            description: "유망 스타트업 UX 디자이너 포지션에 최종 합격했습니다.",
            author: "취업축하해요",
            authorImage: "https://randomuser.me/api/portraits/men/22.jpg",
            category: "success",
            imageUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGhhcHB5JTIwcGVyc29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
            likes: 142,
            comments: 38,
            date: "2023-11-10"
          },
          {
            id: 9,
            title: "웹사이트 리디자인 프로젝트",
            description: "기존 쇼핑몰 웹사이트의 리디자인 프로젝트 결과물입니다.",
            author: "웹디자이너",
            authorImage: "https://randomuser.me/api/portraits/women/54.jpg",
            category: "design",
            imageUrl: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHdlYnNpdGUlMjBkZXNpZ258ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
            likes: 89,
            comments: 22,
            date: "2023-11-08"
          },
          {
            id: 10,
            title: "자연 풍경 사진 작업물",
            description: "여행 중 촬영한 자연 풍경 사진 포트폴리오입니다.",
            author: "풍경사진작가",
            authorImage: "https://randomuser.me/api/portraits/men/88.jpg",
            category: "photo",
            imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
            likes: 156,
            comments: 42,
            date: "2023-11-05"
          },
          {
            id: 11,
            title: "3D 아이콘 디자인",
            description: "앱용으로 제작한 3D 아이콘 디자인 세트입니다.",
            author: "3D디자이너",
            authorImage: "https://randomuser.me/api/portraits/women/36.jpg",
            category: "design",
            imageUrl: "https://images.unsplash.com/photo-1618331833283-0a4148e11a1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8M2QlMjBpY29ufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
            likes: 78,
            comments: 19,
            date: "2023-11-02"
          },
          {
            id: 12,
            title: "그래픽 디자이너 포트폴리오",
            description: "그래픽 디자이너로서의 다양한 작업물을 모은 포트폴리오입니다.",
            author: "그래픽마스터",
            authorImage: "https://randomuser.me/api/portraits/men/76.jpg",
            category: "portfolio",
            imageUrl: "https://images.unsplash.com/photo-1616002411355-49593fd89721?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhcGhpYyUyMGRlc2lnbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
            likes: 94,
            comments: 26,
            date: "2023-10-30"
          }
        ];
        
        setGalleryItems(dummyGalleryItems);
        setLoading(false);
      }, 800);
    };
    
    fetchData();
  }, []);
  
  // 필터링된 갤러리 아이템
  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);
  
  // 레이아웃 변경 핸들러
  const handleLayoutChange = (newLayout: 'grid' | 'masonry') => {
    setLayout(newLayout);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl mb-4">갤러리</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            포트폴리오, 작업물, 취업 성공 스토리 등 다양한 이미지를 공유해보세요
          </p>
          
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-indigo-600 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              작품 공유하기
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* 필터 및 레이아웃 옵션 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* 레이아웃 옵션 */}
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => handleLayoutChange('grid')}
              className={`p-2 rounded ${
                layout === 'grid'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label="그리드 뷰"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => handleLayoutChange('masonry')}
              className={`p-2 rounded ${
                layout === 'masonry'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
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
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-sm p-6 text-gray-500">
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
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full transition-all hover:shadow-md">
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
                          <span className="text-sm font-medium text-gray-900">{item.author}</span>
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
            <button className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              더 많은 작품 보기
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* 갤러리 이용 안내 */}
      <div className="bg-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">갤러리 이용 안내</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">작품 업로드</h3>
              <p className="text-gray-600">
                고화질 이미지를 업로드하고 작품에 대한 설명을 추가하여 포트폴리오를 구성해보세요.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-indigo-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">피드백 받기</h3>
              <p className="text-gray-600">
                다른 사용자들로부터 작품에 대한 피드백과 조언을 받아 더 나은 결과물을 만들어보세요.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-indigo-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">취업 기회</h3>
              <p className="text-gray-600">
                우수한 포트폴리오를 통해 기업의 스카우트 제안을 받거나 취업 기회를 얻을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 