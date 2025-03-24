'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface TechNewsLayoutProps {
  children: ReactNode;
}

export default function TechNewsLayout({ children }: TechNewsLayoutProps) {
  const categories = [
    { name: '전체 뉴스', href: '/tech-news' },
    { name: '개발 테크', href: '/tech-news/dev-tech' },
    { name: '실리콘밸리', href: '/tech-news/silicon-valley' },
    { name: 'AI 컬럼', href: '/tech-news/ai-column' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">기술 뉴스</h1>
        <p className="text-gray-600">
          최신 개발 테크, 실리콘밸리 동향, AI 컬럼을 만나보세요.
        </p>
      </div>

      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8 overflow-x-auto pb-1">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm hover:text-blue-600 hover:border-blue-600 transition-colors ${
                category.href === window.location.pathname
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      <main>{children}</main>

      <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>© 2024 기술 뉴스 센터. All rights reserved.</p>
      </footer>
    </div>
  );
} 