'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatNumber } from '@/utils/format';
import type { TechNewsItem } from '@/types/techNews';

interface TechNewsCardProps {
  item: TechNewsItem;
}

// React.memo로 컴포넌트 최적화
const TechNewsCard = memo(function TechNewsCard({ item }: TechNewsCardProps) {
  // 카테고리에 따른 URL 경로 생성
  const getCategoryPath = (): string => {
    switch(item.category) {
      case '개발 테크':
        return 'dev-tech';
      case '실리콘밸리':
        return 'silicon-valley';
      case 'AI 컬럼':
        return 'ai-column';
      default:
        return 'tech-news';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={`/tech-news/${getCategoryPath()}/${item.id}`}
        className="group flex flex-col h-full overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
      >
        <div className="relative h-48">
          <Image
            src={item.thumbnail || '/images/tech-news/default-thumbnail.jpg'}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {item.category}
          </div>
        </div>
        
        <div className="flex-1 p-4">
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {item.excerpt}
          </p>
          
          <div className="mt-auto flex justify-between items-center text-xs text-gray-500">
            <span>{item.date}</span>
            <span>조회수 {item.views}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

TechNewsCard.displayName = 'TechNewsCard';

export default TechNewsCard; 