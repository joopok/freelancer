'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import ThemeToggle from '@/components/common/ThemeToggle';
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

  const handleMenuMouseEnter = (href: string) => {
    setActiveMenu(href);
  };

  const handleMenuMouseLeave = () => {
    setActiveMenu(null);
  };

  // 페이지 이동 함수
  const navigateTo = (href: string) => {
    console.log('Navigating to:', href); // 디버깅용 로그
    try {
      setLoading(true);
      
      // 현재 경로와 동일한 경우 리로드
      if (pathname === href) {
        console.log('Same page, reloading...');
        window.location.reload();
        return;
      }
      
      // Next.js router를 먼저 시도
      console.log('Attempting router.push...');
      router.push(href);
      console.log('Navigation completed to:', href);
      
    } catch (error) {
      console.error('Router navigation failed, trying window.location:', error);
      // fallback으로 window.location 사용
      window.location.href = href;
    } finally {
      // 페이지 이동 후 로딩 상태 해제
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
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
        { label: '블로그 메인화면', href: '/blog' },
        { label: '개발테크', href: '/blog/dev-tech' },
        { label: '디자인테크', href: '/blog/design-tech' },
        { label: '구매테크', href: '/blog/purchase-tech' },
        { label: '인사테크', href: '/blog/hr-tech' },
        { label: '홍보&마케팅 테크', href: '/blog/marketing-tech' },
        { label: '물류테크', href: '/blog/logistics-tech' },
        { label: '전략테크', href: '/blog/strategy-tech' },
        { label: '제조테크', href: '/blog/manufacturing-tech' },
        { label: '밸런스 UP', href: '/blog/balance-up' },
        { label: '실리콘밸리 AI 컬럼', href: '/blog/silicon-valley-ai' }
      ]
    },
    { 
      label: '커뮤니티', 
      href: '/community',
      subMenus: [
        { label: '자유게시판', href: '/community/free' },
        { label: '갤러리', href: '/community/gallery' },
        { label: 'QnA', href: '/community/qna' },
        { label: '스터디', href: '/community/study' },
        { label: '프로젝트 리뷰', href: '/community/project-review' },
        { label: '공유게시판', href: '/community/share' },
        { label: '연락처', href: '/community/contact' }
      ]
    },
    { label: '취업정보', href: '/jobs' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/20 shadow-lg shadow-black/5 dark:shadow-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">JobKorea</span>
              <span className="ml-2 text-lg text-gray-600">Billboard</span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center">
            {menuItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <div
                  className="relative"
                  onMouseEnter={() => handleMenuMouseEnter(item.href)}
                  onMouseLeave={handleMenuMouseLeave}
                  ref={(el) => { subMenuRefs.current[item.href] = el; }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-lg font-medium transition-colors duration-200"
                    onClick={(e) => {
                      // 기본 링크 동작을 막고 커스텀 네비게이션 사용
                      e.preventDefault();
                      console.log('Menu clicked:', item.label, item.href); // 디버깅용 로그
                      navigateTo(item.href);
                    }}
                  >
                    {item.label}
                  </Link>
                
                  {/* 서브메뉴 */}
                  {item.subMenus && activeMenu === item.href && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 min-w-48 border border-gray-200 dark:border-gray-700"
                      >
                        {item.subMenus.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 first:rounded-t-md last:rounded-b-md transition-colors duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              console.log('Submenu clicked:', subItem.label, subItem.href); // 디버깅용 로그
                              setActiveMenu(null);
                              navigateTo(subItem.href);
                            }}
                          >
                            {subItem.icon}
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
                
                {/* 메뉴 구분선 (마지막 메뉴가 아닌 경우에만) */}
                {index < menuItems.length - 1 && (
                  <div className="mx-3 h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                )}
              </div>
            ))}
          </nav>

          {/* 데스크톱 테마토글, 로그인/회원가입 */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* 테마 토글 */}
            <ThemeToggle />

            {/* 로그인/로그아웃 */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  안녕하세요, {user?.name || user?.email}님
                </span>
                <motion.button
                  onClick={handleLogout}
                  className="relative px-6 py-2 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">로그아웃</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/login"
                    className="relative text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-400 dark:hover:to-pink-400 transition-all duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLoginClick();
                    }}
                  >
                    로그인
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/register"
                    className="relative px-6 py-2 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-lg overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/register');
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">회원가입</span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* 모바일 테마토글 & 메뉴 버튼 */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* 모바일 테마 토글 */}
            <ThemeToggle />
            
            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div className={clsx(
          "lg:hidden",
          isMenuOpen ? "block" : "hidden"
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            {menuItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Mobile menu clicked:', item.label, item.href); // 디버깅용 로그
                    setIsMenuOpen(false);
                    navigateTo(item.href);
                  }}
                >
                  {item.label}
                </Link>
                {/* 모바일 서브메뉴 */}
                {item.subMenus && (
                  <div className="pl-6 space-y-1">
                    {item.subMenus.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Mobile submenu clicked:', subItem.label, subItem.href); // 디버깅용 로그
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
            
            {/* 모바일 로그인/회원가입 */}
            {isLoggedIn ? (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="px-3 text-sm text-gray-700 mb-2">
                  안녕하세요, {user?.name || user?.email}님
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 pb-3 space-y-1">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
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