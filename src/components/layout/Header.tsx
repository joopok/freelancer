'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useLoading } from './Loading';

// 서브메뉴를 가질 수 있는 메뉴 아이템 타입 정의
interface MenuItem {
  label: string;
  href: string;
  subMenus?: { label: string; href: string }[];
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn, setUser, logout } = useAuthStore();
  const { setLoading } = useLoading();
  
  // 서브메뉴 참조 생성
  const subMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 컴포넌트 마운트 시 세션 체크
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (data.success && data.user) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (error) {
        console.error('세션 체크 중 오류 발생:', error);
        logout();
      }
    };

    checkSession();
  }, [setUser, logout]);

  // 외부 클릭 감지 위한 이벤트 리스너
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && !Object.values(subMenuRefs.current).some(ref => 
        ref && ref.contains(event.target as Node)
      )) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  const handleLoginClick = () => {
    setLoading(true);
    router.push('/login');
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        logout();
        router.push('/login');
      }
      
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
      
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const handleMenuMouseEnter = (href: string) => {
    setActiveMenu(href);
  };

  const handleMenuMouseLeave = () => {
    setActiveMenu(null);
  };

  // 메뉴 아이템 정의 (블로그에 서브메뉴 추가)
  const menuItems: MenuItem[] = [
    { label: '프리랜서', href: '/freelancer' },
    { label: '상주 프로젝트', href: '/project' },
    { label: '재택 프로젝트', href: '/athome' },
    { 
      label: '블로그', 
      href: '/blog',
      subMenus: [
        { label: '기술 블로그', href: '/blog/tech' },
        { label: '트렌드', href: '/blog/trend' },
        { label: '노하우', href: '/blog/knowhow' },
        { label: '성공사례', href: '/blog/success' },
        { label: '인터뷰', href: '/blog/interview' }
      ]
    },
    { 
      label: '커뮤니티', 
      href: '/community',
      subMenus: [
        { label: '자유게시판', href: '/community/free' },
        { label: '질문답변', href: '/community/qna' },
        { label: '스터디/모임', href: '/community/study' },
        { label: '프로젝트 후기', href: '/community/review' },
        { label: '정보공유', href: '/community/share' }
      ]
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  // 페이지 이동 시 로딩 처리하는 함수
  const handleNavigation = (href: string) => {
    // 서브메뉴가 있는 항목은 단순히 서브메뉴만 토글
    if (activeMenu === href) {
      setActiveMenu(null);
    } else {
      setActiveMenu(href);
    }
  };

  // 페이지 이동 함수
  const navigateTo = (href: string) => {
    if (href === pathname) return;
    
    setLoading(true);
    setIsMenuOpen(false);
    router.push(href);
    
    // 로딩 상태 1초 후 해제 (페이지 전환 효과를 위해)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link 
            href="/" 
            className={clsx(
              "font-bold text-xl transition-colors",
              isActive('/') ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
            )}
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
          >
            잡코리아 빌보드
          </Link>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div 
                key={item.href}
                className="relative group"
                onMouseEnter={() => handleMenuMouseEnter(item.href)}
                onMouseLeave={handleMenuMouseLeave}
                ref={el => {
                  subMenuRefs.current[item.href] = el;
                }}
              >
                {item.subMenus ? (
                  <div
                    className={clsx(
                      "text-base font-bold transition-colors flex items-center cursor-pointer",
                      isActive(item.href) 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600'
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(item.href);
                    }}
                  >
                    {item.label}
                    <svg 
                      className={`ml-1 w-4 h-4 transition-transform ${activeMenu === item.href ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      "text-base font-bold transition-colors flex items-center",
                      isActive(item.href) 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600'
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(item.href);
                    }}
                  >
                    {item.label}
                  </Link>
                )}

                {/* 서브메뉴 */}
                {item.subMenus && (
                  <AnimatePresence>
                    {activeMenu === item.href && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-100"
                      >
                        {item.subMenus.map(subItem => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveMenu(null);
                              navigateTo(subItem.href);
                            }}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* 데스크톱 검색, 로그인/회원가입 */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* 검색 버튼 및 검색창 */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                aria-label="검색"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
              
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20"
                >
                  <form onSubmit={handleSearchSubmit} className="p-2">
                    <div className="flex">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 text-base border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="검색어를 입력하세요"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 text-base text-white bg-blue-600 rounded-r hover:bg-blue-700"
                      >
                        검색
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
            
            {isLoggedIn ? (
              <>
                <span className="text-base text-gray-600">
                  {user?.name}님 환영합니다
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-base text-gray-600 hover:text-blue-600"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-base font-bold text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLoginClick();
                  }}
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-base font-bold text-white bg-orange-500 rounded hover:bg-orange-600 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/register');
                  }}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div className={clsx(
          "lg:hidden",
          isMenuOpen ? "block" : "hidden"
        )}>
          <div className="py-2 space-y-1">
            {/* 모바일 검색창 */}
            <form onSubmit={handleSearchSubmit} className="px-3 py-2">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-base border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="검색어를 입력하세요"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-base text-white bg-blue-600 rounded-r hover:bg-blue-700"
                >
                  검색
                </button>
              </div>
            </form>
            
            {menuItems.map((item) => (
              <div key={item.href}>
                <div className="flex items-center justify-between">
                  {item.subMenus ? (
                    <div
                      className={clsx(
                        "block px-3 py-2 rounded-md text-base font-bold cursor-pointer",
                        isActive(item.href)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      )}
                      onClick={() => setActiveMenu(activeMenu === item.href ? null : item.href)}
                    >
                      {item.label}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        "block px-3 py-2 rounded-md text-base font-bold",
                        isActive(item.href)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(item.href);
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.subMenus && (
                    <button
                      className="px-3 py-2 text-gray-600"
                      onClick={() => setActiveMenu(activeMenu === item.href ? null : item.href)}
                    >
                      <svg 
                        className={`w-5 h-5 transition-transform ${activeMenu === item.href ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* 모바일 서브메뉴 */}
                {item.subMenus && activeMenu === item.href && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-3">
                    {item.subMenus.map(subItem => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          navigateTo(subItem.href);
                        }}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {!isLoggedIn && (
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-bold text-gray-700 hover:bg-gray-50"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    handleLoginClick();
                  }}
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-bold text-white bg-orange-500 hover:bg-orange-600 mt-2 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(false);
                    navigateTo('/register');
                  }}
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 