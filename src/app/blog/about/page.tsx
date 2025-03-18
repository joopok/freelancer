'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoading } from '@/components/layout/Loading';

export default function BlogAboutPage() {
  const { setLoading } = useLoading();
  const loadingExecutedRef = useRef(false);
  
  // 페이지 로드 시 로딩 효과 표시
  useEffect(() => {
    if (!loadingExecutedRef.current) {
      loadingExecutedRef.current = true;
      setLoading(true, '소개 페이지 로딩 중...');
      
      // 페이지 로딩이 완료되면 로딩 상태 해제
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [setLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 소개 헤더 */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">블로그 소개</h1>
          <p className="text-xl md:text-2xl opacity-90">잡코리아 빌보드 블로그의 목적과 비전</p>
        </div>
      </div>
      
      {/* 소개 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-64 md:h-80">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVhbXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1200&q=60"
              alt="Team working together"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">잡코리아 빌보드 블로그는</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              잡코리아 빌보드 블로그는 프리랜서, 개발자, 취업 준비생들에게 가치 있는 정보와 인사이트를 제공하기 위해 만들어졌습니다. 
              빠르게 변화하는 IT 환경과 취업 시장에서 최신 트렌드와 유용한 정보를 공유함으로써 여러분의 커리어 성장을 돕고자 합니다.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">우리의 목표</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">프리랜서와 취업 준비생들에게 실질적인 도움이 되는 양질의 콘텐츠 제공</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">최신 IT 트렌드와 시장 동향에 대한 깊이 있는 분석 제공</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">성공적인 프리랜서와 개발자들의 경험과 노하우 공유</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">커리어 성장에 도움이 되는 실용적인 팁과 가이드 제공</span>
              </li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-8">블로그 콘텐츠</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              잡코리아 빌보드 블로그에서는 프리랜서 생활, 취업 준비, 포트폴리오 작성, 면접 준비, 기술 트렌드, 재택근무 팁 등 다양한 주제의 콘텐츠를 제공합니다. 
              모든 콘텐츠는 현업 전문가들의 경험과 통찰을 바탕으로 작성되며, 독자 여러분의 실질적인 커리어 성장에 도움이 되는 정보를 담고 있습니다.
            </p>
            
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">운영 팀 소개</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 relative">
                    <Image
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Team member"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-gray-800">김민수</h4>
                  <p className="text-sm text-gray-500">편집장</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 relative">
                    <Image
                      src="https://randomuser.me/api/portraits/women/44.jpg"
                      alt="Team member"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-gray-800">이지영</h4>
                  <p className="text-sm text-gray-500">콘텐츠 디렉터</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 relative">
                    <Image
                      src="https://randomuser.me/api/portraits/men/46.jpg"
                      alt="Team member"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-gray-800">박준혁</h4>
                  <p className="text-sm text-gray-500">기술 에디터</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 relative">
                    <Image
                      src="https://randomuser.me/api/portraits/women/65.jpg"
                      alt="Team member"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-gray-800">최수진</h4>
                  <p className="text-sm text-gray-500">마케팅 매니저</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 블로그로 돌아가기 버튼 */}
        <div className="mt-12 flex justify-center">
          <Link 
            href="/blog"
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            블로그 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 