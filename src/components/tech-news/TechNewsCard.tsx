'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatNumber } from '@/utils/format';
import type { TechNewsItem } from '@/types/techNews';

interface TechNewsCardProps {
  item: TechNewsItem;
}

export default function TechNewsCard({ item }: TechNewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={`/tech-news/${item.category === '개발 테크' ? 'dev-tech' : item.category === '실리콘밸리' ? 'silicon-valley' : 'ai-column'}/${item.id}`}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 block"
      >
        <div className="relative h-48">
          <Image
            src={item.thumbnail || '/images/tech-news/default-thumbnail.jpg'}
            alt={item.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
            {item.category}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              {item.date}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {item.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{item.author || '관리자'}</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>
                  {formatNumber(item.views || 0)}
                </span>
              </span>
              <span className="flex items-center">
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>
                  {formatNumber(item.likes || 0)}
                </span>
              </span>
            </div>
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag} 
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-gray-400 text-xs">+{item.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
} 