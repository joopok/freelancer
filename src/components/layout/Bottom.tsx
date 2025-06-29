'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLoading } from './Loading';

export default function Bottom() {
  const router = useRouter();
  const { setLoading } = useLoading();

  // 페이지 이동 함수
  const navigateTo = (href: string) => {
    setLoading(true);
    router.push(href);
    
    // 로딩 상태 3초 후 해제 (페이지 전환 효과를 위해)
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const footerLinks = {
    company: [
      { label: '회사소개', href: '/about' },
      { label: '이용약관', href: '/terms' },
      { label: '개인정보처리방침', href: '/privacy' },
      { label: '공지사항', href: '/notices' },
    ],
    support: [
      { label: '파트너 가이드', href: '/guide/partner' },
      { label: '클라이언트 가이드', href: '/guide/client' },
      { label: '자주 묻는 질문', href: '/faq' },
      { label: '고객센터', href: '/support' },
    ],
    contact: {
      phone: '1544-0000',
      email: 'support@jobkorea.co.kr',
      address: '서울특별시 서초구 서초대로 301 동익성봉빌딩 16~18층',
      business: '사업자등록번호: 120-81-84429',
      operatingHours: '운영시간: 평일 09:00 ~ 18:00',
    },
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-12 pb-6 w-full bottom-0 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* 통합된 푸터 정보 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          {/* 회사 정보 */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">회사정보</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(link.href);
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">고객지원</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(link.href);
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 고객센터 */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">고객센터</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {footerLinks.contact.phone}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {footerLinks.contact.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {footerLinks.contact.operatingHours}
            </p>
          </div>
          
          {/* 회사 정보 주소 */}
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/images/jobkorea-logo.png"
                alt="JobKorea Logo"
                width={120}
                height={30}
                className="mr-4"
              />
              <span className="text-gray-500 dark:text-gray-400">(주)잡코리아 빌보드에</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{footerLinks.contact.address}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{footerLinks.contact.business}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} JobKorea. All rights reserved.
            </p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3" />

        {/* SNS 링크 */}
        <div className="flex justify-center gap-4 mt-4">
          <Link 
            href="https://facebook.com" 
            className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              window.open('https://facebook.com', '_blank');
              setLoading(false); // 외부 링크이므로 로딩 상태 해제
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
            </svg>
          </Link>
          <Link 
            href="https://twitter.com" 
            className="text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              window.open('https://twitter.com', '_blank');
              setLoading(false); // 외부 링크이므로 로딩 상태 해제
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M22.162 5.65593C21.3986 5.99362 20.589 6.2154 19.76 6.31393C20.6337 5.79136 21.2877 4.96894 21.6 3.99993C20.78 4.48793 19.881 4.82993 18.944 5.01493C18.3146 4.34151 17.4804 3.89489 16.5709 3.74451C15.6615 3.59413 14.7279 3.74842 13.9153 4.18338C13.1026 4.61834 12.4564 5.30961 12.0771 6.14972C11.6978 6.98983 11.6067 7.93171 11.818 8.82893C10.1551 8.74558 8.52832 8.31345 7.04328 7.56059C5.55823 6.80773 4.24812 5.75098 3.19799 4.45893C2.82628 5.09738 2.63095 5.82315 2.63199 6.56193C2.63199 8.01193 3.36999 9.29293 4.49199 10.0429C3.828 10.022 3.17862 9.84271 2.59799 9.51993V9.57193C2.59819 10.5376 2.93236 11.4735 3.54384 12.221C4.15532 12.9684 5.00647 13.4814 5.95299 13.6729C5.33661 13.84 4.6903 13.8646 4.06299 13.7449C4.32986 14.5762 4.85 15.3031 5.55058 15.824C6.25117 16.345 7.09712 16.6337 7.96999 16.6499C7.10247 17.3313 6.10917 17.8349 5.04687 18.1321C3.98458 18.4293 2.87412 18.5142 1.77899 18.3819C3.69069 19.6114 5.91609 20.2641 8.18899 20.2619C15.882 20.2619 20.089 13.8889 20.089 8.36193C20.089 8.18193 20.084 7.99993 20.076 7.82193C20.8949 7.2301 21.6016 6.49695 22.163 5.65693L22.162 5.65593Z" />
            </svg>
          </Link>
          <Link 
            href="https://instagram.com" 
            className="text-gray-400 dark:text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              window.open('https://instagram.com', '_blank');
              setLoading(false); // 외부 링크이므로 로딩 상태 해제
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
} 