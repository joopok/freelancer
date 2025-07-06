'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { Settings, User, BookOpen, LogOut, Bell, Shield, HelpCircle, Moon, Sun, Building2, UserCheck, Crown, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useLoading } from './Loading';
import api from '@/utils/api';
import { authService } from '@/services/auth';
import NotificationButton from '@/components/common/NotificationButton';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn, setUser, logout } = useAuthStore();
  const { setLoading } = useLoading();
  const { isDarkMode, toggleTheme } = useThemeStore();
  
  // 사용자 역할에 따른 토글 상태 초기화
  const getUserType = () => {
    if (!isLoggedIn || !user?.role) return 'individual';
    return user.role === 'freelancer' ? 'individual' : 'company';
  };
  
  const [userType, setUserType] = useState<'individual' | 'company'>(getUserType());
  
  // 디버깅을 위한 콘솔 로그
  useEffect(() => {
    console.log('Header - 사용자 정보:', {
      isLoggedIn,
      user,
      role: user?.role,
      userType
    });
  }, [isLoggedIn, user, userType]);
  
  // 사용자 로그인 상태 변경 시 토글 상태 업데이트
  useEffect(() => {
    setUserType(getUserType());
  }, [isLoggedIn, user?.role]);
  
  // 서브메뉴 참조 생성
  const subMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const settingsRef = useRef<HTMLDivElement | null>(null);

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
      
      // 설정 메뉴 외부 클릭 감지
      if (isSettingsOpen && settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu, isSettingsOpen]);

  const handleLogout = async () => {
    try {
      // 1. 즉시 로컬 상태 초기화 (로딩 상태 없이)
      logout();
      
      // 2. 로컬 스토리지에서 토큰 제거
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth-storage');
      }
      
      // 3. 백엔드 로그아웃 API 호출 (비동기로 수행, 결과 대기 안함)
      authService.logout().catch(error => {
        console.warn('로그아웃 API 호출 중 오류:', error);
      });
      
      // 4. 즉시 홈으로 이동 (로딩 상태 없이)
      router.push('/');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      // 오류가 발생해도 로컬 로그아웃은 진행
      logout();
      router.push('/');
    }
  };

  const handleMenuMouseEnter = (href: string) => {
    setActiveMenu(href);
  };

  const handleMenuMouseLeave = () => {
    setActiveMenu(null);
  };

  // 네비게이션 함수
  const navigateTo = (href: string) => {
    router.push(href);
  };

  // 로그인 클릭 핸들러
  const handleLoginClick = () => {
    router.push('/login');
  };

  // 메뉴 아이템 정의 (블로그에 서브메뉴 추가)
  const menuItems: MenuItem[] = [
    { label: '프리랜서', href: '/freelancer' },
    { label: '상주 프로젝트', href: '/project' },
    { label: '재택 프로젝트', href: '/athome' },
    { 
      label: '블로그', 
      href: '/blog', // 유니크한 href로 변경
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
      href: '/community', // 유니크한 href로 변경
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
            <Link href="/" className="flex items-center group">
              <motion.span 
                className="text-2xl font-bold text-blue-600"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                JobKorea
              </motion.span>
              <span className="ml-2 text-lg text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">Billboard</span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center overflow-visible">
            {menuItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                <div
                  className="relative group"
                  onMouseEnter={() => item.subMenus && handleMenuMouseEnter(item.href)}
                  onMouseLeave={() => item.subMenus && handleMenuMouseLeave()}
                  ref={(el) => { subMenuRefs.current[item.href] = el; }}
                >
                  {item.subMenus ? (
                    <div
                      className={clsx(
                        "px-3 py-2 text-lg font-medium transition-all duration-200 relative cursor-pointer",
                        pathname === item.href || 
                        (item.subMenus?.some(sub => pathname === sub.href)) ||
                        (item.href === '/project' && pathname?.startsWith('/project/')) ||
                        (item.href === '/freelancer' && pathname?.startsWith('/freelancer/')) ||
                        (item.href === '/athome' && pathname?.startsWith('/athome/'))
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      )}
                      onClick={() => router.push(item.href)}
                    >
                      {item.label}
                      {(pathname === item.href || 
                        (item.subMenus && item.subMenus.some(sub => pathname === sub.href)) ||
                        (item.href === '/project' && pathname?.startsWith('/project/')) ||
                        (item.href === '/freelancer' && pathname?.startsWith('/freelancer/')) ||
                        (item.href === '/athome' && pathname?.startsWith('/athome/'))) && (
                        <motion.div
                          layoutId="activeMenu"
                          className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        "px-3 py-2 text-lg font-medium transition-all duration-200 relative",
                        pathname === item.href || 
                        (item.subMenus?.some(sub => pathname === sub.href)) ||
                        (item.href === '/project' && pathname?.startsWith('/project/')) ||
                        (item.href === '/freelancer' && pathname?.startsWith('/freelancer/')) ||
                        (item.href === '/athome' && pathname?.startsWith('/athome/'))
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      )}
                    >
                      {item.label}
                      {(pathname === item.href || 
                        (item.subMenus && item.subMenus.some(sub => pathname === sub.href)) ||
                        (item.href === '/project' && pathname?.startsWith('/project/')) ||
                        (item.href === '/freelancer' && pathname?.startsWith('/freelancer/')) ||
                        (item.href === '/athome' && pathname?.startsWith('/athome/'))) && (
                        <motion.div
                          layoutId="activeMenu"
                          className="absolute -bottom-[14px] left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  )}
                
                  {/* 서브메뉴 */}
                  {item.subMenus && activeMenu === item.href && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 pt-2 pb-2 bg-transparent z-50"
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg min-w-48 border border-gray-200 dark:border-gray-700 overflow-hidden">
                          {item.subMenus.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={clsx(
                                "flex items-center px-4 py-2 text-sm first:rounded-t-md last:rounded-b-md transition-colors duration-200",
                                pathname === subItem.href
                                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                              )}
                              onClick={() => setActiveMenu(null)}
                            >
                              {subItem.icon}
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
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

          {/* 데스크톱 설정 */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* 알림 버튼 */}
            <NotificationButton />

            {/* 개인/기업 토글 & 설정 아이콘 */}
            <div className="flex items-center space-x-2">
              {/* 개인/기업/관리자 토글 */}
              {isLoggedIn && user?.role && (user.role.toLowerCase() === 'admin' || user.role === 'ADMIN') ? (
                <div className="flex items-center bg-purple-100 dark:bg-purple-800 rounded-lg p-1">
                  <div className="flex items-center px-3 py-1 rounded-md text-sm font-medium bg-purple-500 text-white shadow-sm">
                    <Crown className="h-4 w-4 mr-1" />
                    관리자
                  </div>
                </div>
              ) : (
                <div className={`flex items-center rounded-lg p-1 ${
                  isLoggedIn ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
                }`}>
                  <button
                    onClick={() => {
                      if (!isLoggedIn || (isLoggedIn && user?.role !== 'client')) {
                        setUserType('individual');
                      }
                    }}
                    disabled={!isLoggedIn || (isLoggedIn && user?.role === 'client')}
                    className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      !isLoggedIn
                        ? 'text-gray-400 dark:text-gray-500 cursor-default'
                        : userType === 'individual'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : user?.role === 'client'
                        ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 cursor-pointer'
                    }`}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    개인
                  </button>
                  <button
                    onClick={() => {
                      if (!isLoggedIn || (isLoggedIn && user?.role !== 'freelancer')) {
                        setUserType('company');
                      }
                    }}
                    disabled={!isLoggedIn || (isLoggedIn && user?.role === 'freelancer')}
                    className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      !isLoggedIn
                        ? 'text-gray-400 dark:text-gray-500 cursor-default'
                        : userType === 'company'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : user?.role === 'freelancer'
                        ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 cursor-pointer'
                    }`}
                  >
                    <Building2 className="h-4 w-4 mr-1" />
                    기업
                  </button>
                </div>
              )}
              
              {/* 설정 아이콘 */}
              <div className="relative" ref={settingsRef}>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </motion.button>
              
              {/* 설정 드롭다운 메뉴 */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    {isLoggedIn && (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            안녕하세요, {user?.name || user?.username || '사용자'}님
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email || ''}
                          </p>
                        </div>
                        
                        <div className="py-2">
                          <button
                            onClick={() => {
                              toggleTheme();
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            {isDarkMode ? (
                              <>
                                <Sun className="h-4 w-4 mr-3" />
                                라이트 모드
                              </>
                            ) : (
                              <>
                                <Moon className="h-4 w-4 mr-3" />
                                다크 모드
                              </>
                            )}
                          </button>
                          
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <User className="h-4 w-4 mr-3" />
                            프로필 관리
                          </Link>
                          
                          <Link
                            href="/myprojects"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <BookOpen className="h-4 w-4 mr-3" />
                            내 프로젝트
                          </Link>
                          
                          <Link
                            href="/notifications"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <Bell className="h-4 w-4 mr-3" />
                            알림 설정
                          </Link>
                          
                          <Link
                            href="/security"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <Shield className="h-4 w-4 mr-3" />
                            보안 설정
                          </Link>
                        </div>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                          <Link
                            href="/help"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <HelpCircle className="h-4 w-4 mr-3" />
                            도움말
                          </Link>
                          
                          <Link
                            href="/support"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <Phone className="h-4 w-4 mr-3" />
                            고객센터
                          </Link>
                          
                          <button
                            onClick={() => {
                              setIsSettingsOpen(false);
                              handleLogout();
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            로그아웃
                          </button>
                        </div>
                      </>
                    )}
                    
                    {!isLoggedIn && (
                      <div className="py-2">
                        <button
                          onClick={() => {
                            toggleTheme();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {isDarkMode ? (
                            <>
                              <Sun className="h-4 w-4 mr-3" />
                              라이트 모드
                            </>
                          ) : (
                            <>
                              <Moon className="h-4 w-4 mr-3" />
                              다크 모드
                            </>
                          )}
                        </button>
                        
                        <Link
                          href="/login"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsSettingsOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          로그인
                        </Link>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                          <Link
                            href="/help"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <HelpCircle className="h-4 w-4 mr-3" />
                            도움말
                          </Link>
                          
                          <Link
                            href="/support"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            <Phone className="h-4 w-4 mr-3" />
                            고객센터
                          </Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* 모바일 알림 버튼 */}
            <NotificationButton />
            
            {/* 모바일 설정 아이콘 */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </motion.button>

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
                {item.subMenus ? (
                  <div
                    className={clsx(
                      "block px-3 py-2 text-lg font-medium transition-colors duration-200",
                      pathname === item.href || 
                      (item.subMenus?.some(sub => pathname === sub.href)) ||
                      (item.href === '/project' && pathname?.startsWith('/project/')) ||
                      (item.href === '/freelancer' && pathname?.startsWith('/freelancer/')) ||
                      (item.href === '/athome' && pathname?.startsWith('/athome/'))
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      "block px-3 py-2 text-lg font-medium transition-colors duration-200",
                      pathname === item.href || 
                      (item.subMenus?.some(sub => pathname === sub.href)) ||
                      (item.href === '/project' && pathname?.startsWith('/project/')) ||
                      (item.href === '/freelancer' && pathname?.startsWith('/freelancer/')) ||
                      (item.href === '/athome' && pathname?.startsWith('/athome/'))
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
                {/* 모바일 서브메뉴 */}
                {item.subMenus && (
                  <div className="pl-6 space-y-1">
                    {item.subMenus.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={clsx(
                          "block px-3 py-2 text-sm transition-colors duration-200",
                          pathname === subItem.href
                            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* 모바일 개인/기업 토글 및 로그인/회원가입 */}
            <div className="border-t border-gray-200 pt-4 pb-3 space-y-3">
              {/* 모바일 개인/기업 토글 */}
              <div className="px-3">
                {/* 모바일 개인/기업/관리자 토글 */}
                {isLoggedIn && user?.role && (user.role.toLowerCase() === 'admin' || user.role === 'ADMIN') ? (
                  <div className="flex items-center bg-purple-100 dark:bg-purple-800 rounded-lg p-1">
                    <div className="flex items-center px-3 py-1 rounded-md text-sm font-medium bg-purple-500 text-white shadow-sm flex-1 justify-center">
                      <Crown className="h-4 w-4 mr-1" />
                      관리자
                    </div>
                  </div>
                ) : (
                  <div className={`flex items-center rounded-lg p-1 ${
                    isLoggedIn ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
                  }`}>
                    <button
                      onClick={() => {
                        if (!isLoggedIn || (isLoggedIn && user?.role !== 'client')) {
                          setUserType('individual');
                        }
                      }}
                      disabled={!isLoggedIn || (isLoggedIn && user?.role === 'client')}
                      className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                        !isLoggedIn
                          ? 'text-gray-400 dark:text-gray-500 cursor-default'
                          : userType === 'individual'
                          ? 'bg-blue-500 text-white shadow-sm'
                          : user?.role === 'client'
                          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 cursor-pointer'
                      }`}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      개인
                    </button>
                    <button
                      onClick={() => {
                        if (!isLoggedIn || (isLoggedIn && user?.role !== 'freelancer')) {
                          setUserType('company');
                        }
                      }}
                      disabled={!isLoggedIn || (isLoggedIn && user?.role === 'freelancer')}
                      className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                        !isLoggedIn
                          ? 'text-gray-400 dark:text-gray-500 cursor-default'
                          : userType === 'company'
                          ? 'bg-blue-500 text-white shadow-sm'
                          : user?.role === 'freelancer'
                          ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-500 cursor-pointer'
                      }`}
                    >
                      <Building2 className="h-4 w-4 mr-1" />
                      기업
                    </button>
                  </div>
                )}
              </div>
              
              {isLoggedIn ? (
                <div>
                  <div className="px-3 text-sm text-gray-700 mb-2">
                    안녕하세요, {user?.name || user?.email}님
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
