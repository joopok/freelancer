"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";
import Image from "next/image";
import { authService } from "@/services/auth";
import { AUTH_TOKEN_NAME } from '@/utils/env';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [username1, setUserName1] = useState("");
  const [password, setPassword] = useState("");
  const [headerScroll, setHeaderScroll] = useState(0);

  // Focus effect for input fields
  const handleFocus = (fieldName: string) => setFocusedField(fieldName);
  const handleBlur = () => setFocusedField(null);

  // Animation effect
  const [showContent, setShowContent] = useState(false);
  useEffect(() => setShowContent(true), []);

  // Adjust viewport height and scale
  useEffect(() => {
    const updateViewportDimensions = () => {
      const currentViewportHeight = window.innerHeight;
      setViewportHeight(currentViewportHeight);

      if (containerRef.current) {
        const containerHeight = containerRef.current.scrollHeight;
        const footerMargin = 40; // Increased bottom margin
        const minPadding = 20; // Minimum padding

        const availableHeight = currentViewportHeight - footerMargin;

        if (containerHeight > availableHeight) {
          const newScale = Math.max(0.85, availableHeight / containerHeight);
          setScale(newScale);
          const maxHeightValue = currentViewportHeight - (minPadding * 2);
          document.documentElement.style.setProperty('--login-max-height', `${maxHeightValue}px`);
        } else {
          setScale(1);
          document.documentElement.style.setProperty('--login-max-height', `${containerHeight}px`);
        }
      }
    };

    const initialTimer = setTimeout(updateViewportDimensions, 50);
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateViewportDimensions, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      clearTimeout(initialTimer);
    };
  }, []);

  // 헤더 스크롤 효과
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHeaderScroll(scrollPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username1 || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      let response;
      try {
        response = await authService.login(username1, password);
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : "로그인 중 오류가 발생했습니다.");
        throw apiError;
      }

      console.log("로그인 응답 상세:", {
        성공여부: response.success,
        사용자정보존재: !!response.user,
        토큰존재: !!response.token,
        에러메시지: response.error || '없음'
      });

      if (response.success && response.user) {
        if (response.token) {
          localStorage.setItem(AUTH_TOKEN_NAME, response.token);
        } else {
          console.warn("주의: 토큰이 제공되지 않았습니다!");
        }

        setUser(response.user);
        setTimeout(() => router.push("/"), 500);
      } else {
        setError(response.error || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 프로세스 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
      {/* 기존 로그인 컨텐츠 */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Background effect */}
        <div className="h-screen w-full relative overflow-hidden flex flex-col justify-center">
          {/* Background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900">
            <div className="absolute w-full h-full opacity-10">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <radialGradient id="radialGradient" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                      <circle id="pattern-circle" cx="10" cy="10" r="1" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#radialGradient)" />
                  <rect width="100%" height="100%" fill="url(#pattern-circles)" />
                </svg>
              </div>
              <div className="absolute w-64 h-64 rounded-full bg-blue-500 opacity-10 top-10 left-10 animate-pulse-slow" />
              <div className="absolute w-96 h-96 rounded-full bg-purple-500 opacity-10 bottom-10 right-20 animate-pulse-slow" />
            </div>
          </div>

          {/* Login form */}
          <div className="relative flex justify-center items-center px-4 sm:px-6 lg:px-8 z-10 py-6" style={{ overflow: 'hidden' }}>
            <div
              ref={containerRef}
              className={`w-full max-w-md transition-all duration-1000 transform ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{
                transform: `${showContent ? 'translateY(0)' : 'translateY(2rem)'} scale(${scale})`,
                transformOrigin: 'center',
                maxHeight: 'calc(100vh - 4rem)',
                overflowY: 'auto'
              }}
            >
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-8 transition-all border border-white border-opacity-20">
                <div className="text-center mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">로그인</h2>
                  <p className="text-blue-200 text-xs md:text-sm">잡코리아 빌보드에 오신 것을 환영합니다</p>
                </div>

                <div className="min-h-[60px] md:min-h-[70px] relative">
                  {error && (
                    <div className="absolute top-0 left-0 right-0 p-2 md:p-3 bg-red-500 bg-opacity-20 backdrop-blur-sm text-white rounded-lg text-xs md:text-sm border border-red-500 border-opacity-30 flex items-center animate-fade-in">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-2 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  )}
                </div>

                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div className={`relative transition-all duration-300 ${focusedField === 'username1' ? 'transform -translate-y-1' : ''}`}>
                    <label htmlFor="username1" className={`block text-xs md:text-sm font-medium mb-1 transition-colors duration-300 ${focusedField === 'username1' ? 'text-blue-300' : 'text-blue-100'}`}>
                      로그인 ID
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="username1"
                        name="username1"
                        type="text"
                        autoComplete="username1"
                        required
                        value={username1}
                        onChange={(e) => setUserName1(e.target.value)}
                        onFocus={() => handleFocus('username1')}
                        onBlur={handleBlur}
                        className="block w-full pl-10 pr-4 py-2 md:py-3 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                        placeholder="아이디를 입력하세요"
                        disabled={isLoading}
                      />
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${focusedField === 'username1' ? 'w-full' : ''}`}></span>
                    </div>
                  </div>

                  <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform -translate-y-1' : ''}`}>
                    <label htmlFor="password" className={`block text-xs md:text-sm font-medium mb-1 transition-colors duration-300 ${focusedField === 'password' ? 'text-blue-300' : 'text-blue-100'}`}>
                      비밀번호
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => handleFocus('password')}
                        onBlur={handleBlur}
                        className="block w-full pl-10 pr-4 py-2 md:py-3 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm md:text-base"
                        placeholder="비밀번호를 입력하세요"
                        disabled={isLoading}
                      />
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${focusedField === 'password' ? 'w-full' : ''}`}></span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 md:py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden text-sm md:text-base"
                      disabled={isLoading}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                      <span className="relative flex items-center justify-center">
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            로그인 중...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                            </svg>
                            로그인
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </form>

                {/* Social login */}
                <div className="mt-6 pt-4 md:mt-8 md:pt-6 border-t border-white border-opacity-10">
                  <p className="text-center text-xs md:text-sm text-blue-200 mb-3 md:mb-4">소셜 계정으로 로그인</p>
                  <div className="flex justify-center gap-3 md:gap-4">
                    <button className="group p-1.5 md:p-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-110" disabled={isLoading}>
                      <div className="relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <div className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center relative z-10 bg-[#1EC800] rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" className="w-4 h-4 md:w-5 md:h-5">
                            <path d="M3 4.5h14v11H3v-11zm7.5 2.25L6.5 9.5h1.75v3.75h2.5V9.5h1.75L10.5 6.75z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    <button className="group p-1.5 md:p-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-110" disabled={isLoading}>
                      <div className="relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <Image src="/images/kakao-icon.png" alt="Kakao" width={24} height={24} className="relative z-10 md:w-7 md:h-7 w-6 h-6" />
                      </div>
                    </button>
                    <button className="group p-1.5 md:p-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-110" disabled={isLoading}>
                      <div className="relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <div className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center relative z-10">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-4 h-4 md:w-5 md:h-5">
                            <path fill="#1877F2" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.879V12.89h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.989C16.343 19.129 20 14.99 20 10z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                    <button className="group p-1.5 md:p-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-full border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-110" disabled={isLoading}>
                      <div className="relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <Image src="/images/google-icon.png" alt="Google" width={24} height={24} className="relative z-10 md:w-7 md:h-7 w-6 h-6" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sign up and find account links */}
                <div className="mt-6 md:mt-8 flex justify-center gap-3 md:gap-5 text-xs md:text-sm text-blue-200">
                  <Link href="/register" className="relative group">
                    <span className="group-hover:text-white transition-colors duration-300">회원가입</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <div className="text-blue-300 text-opacity-50">|</div>
                  <Link href="/find-id" className="relative group">
                    <span className="group-hover:text-white transition-colors duration-300">아이디 찾기</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  <div className="text-blue-300 text-opacity-50">|</div>
                  <Link href="/find-password" className="relative group">
                    <span className="group-hover:text-white transition-colors duration-300">비밀번호 찾기</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background animation effect */}
        <div className="absolute bottom-5 right-5 animate-bounce-slow opacity-50 hidden md:block">
          <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 19l-7-7 7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}