'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useLoading } from './Loading';
import api from '@/utils/api';
import { authService } from '@/services/auth';

// 서브메뉴를 가질 수 있는 메뉴 아이템 타입 정의
interface MenuItem {
  label: string;
  href: string;
  subMenus?: { label: string; href: string; icon?: React.ReactNode }[];
  icon?: React.ReactNode;
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

  // 세션 체크 로직 개선
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 이미 로그인 상태라면 추가 체크 불필요
        if (isLoggedIn && user) {
          return;
        }

        // 현재 페이지가 로그인 페이지인 경우 세션 체크를 건너뜀
        if (pathname === '/login' || pathname?.includes('/login')) {
          return;
        }

        // 로컬 스토리지에서 토큰이 있는지 확인
        const token = localStorage.getItem('auth_token');
        if (!token) {
          return;
        }

        // 로컬 스토리지에 토큰이 있으면 세션 체크
        setLoading(true);
        const response = await api.get('/auth/session');
        
        if (response.data?.success && response.data?.user) {
          // 세션이 유효하면 유저 정보 설정
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('세션 체크 중 오류:', error);
        // 오류 발생 시 로컬 스토리지 토큰 제거
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    // 클라이언트 측에서만 실행
    if (typeof window !== 'undefined') {
      // 세션 체크 실행
      initAuth();
    }
  }, [pathname, isLoggedIn, user, setUser, setLoading]);

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
    setLoading(true, '로그인 페이지 이동');
    router.push('/login');
    setTimeout(() => {
      setLoading(false, '로그인 페이지 이동 완료');
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      // 즉시 로딩 상태 설정
      setLoading(true, '로그아웃 처리 시작');
      console.log('로그아웃 프로세스 시작 -', new Date().toISOString());
      
      // 1. 먼저 로컬 상태 초기화 (페이지 전환 전에 수행)
      console.log('로컬 스토어 상태 초기화');
      logout();
      
      // 2. 로컬 스토리지에서 자체적으로 토큰 제거 (중복 제거이지만 안전성을 위해)
      if (typeof window !== 'undefined') {
        console.log('로컬 스토리지에서 토큰 및 인증 상태 제거 중');
        localStorage.removeItem('auth_token');
        // Zustand 영속 상태 강제 초기화 (필요한 경우)
        localStorage.removeItem('auth-storage');
        console.log('로컬 스토리지 정리 완료');
      }
      
      // 3. 백엔드 로그아웃 API 호출 (비동기로 수행)
      console.log('백엔드 로그아웃 API 호출 중');
      authService.logout().then(() => {
        console.log('백엔드 로그아웃 요청 성공');
      }).catch(error => {
        console.warn('로그아웃 API 호출 중 오류:', error);
        // 백엔드 오류가 있어도 클라이언트 측 로그아웃은 계속 진행
      });
      
      // 4. 홈으로 이동
      console.log('홈 페이지로 이동 준비');
      router.push('/');
      
      // 5. 약간의 지연 후 로딩 상태 종료 (페이지 전환 애니메이션을 위해)
      setTimeout(() => {
        console.log('로그아웃 프로세스 완료 -', new Date().toISOString());
        setLoading(false, '로그아웃 처리 완료');
      }, 500); // 시간을 1000ms에서 500ms로 줄임
    } catch (error) {
      console.error('로그아웃 중 예상치 못한 오류 발생:', error);
      // 오류가 발생해도 로컬 로그아웃은 진행
      logout();
      setLoading(false, '로그아웃 오류 발생');
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
        { 
          label: '블로그 홈', 
          href: '/blog',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          )
        },
        { 
          label: '카테고리', 
          href: '/blog/categories',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          )
        },
        { 
          label: '블로그 소개', 
          href: '/blog/about',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        { 
          label: '문의하기', 
          href: '/blog/contact',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        }
      ]
    },
    { 
      label: '커뮤니티', 
      href: '/community',
      subMenus: [
        { 
          label: '자유게시판', 
          href: '/community/free',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          )
        },
        { 
          label: '질문답변', 
          href: '/community/qna',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        { 
          label: '스터디/모임', 
          href: '/community/study',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )
        },
        { 
          label: '프로젝트 후기', 
          href: '/community/project-review',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )
        },
        { 
          label: '정보공유', 
          href: '/community/share',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          )
        }
      ]
    },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
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
                    {item.icon}
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
                    {item.icon}
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
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center"
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveMenu(null);
                              navigateTo(subItem.href);
                            }}
                          >
                            {subItem.icon}
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
                      {item.icon}
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
                      {item.icon}
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
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md flex items-center"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMenuOpen(false);
                          navigateTo(subItem.href);
                        }}
                      >
                        {subItem.icon}
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