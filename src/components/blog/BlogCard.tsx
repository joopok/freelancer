'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatNumber } from '@/utils/format';
import type { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link
        href={`/blog/posts/${post.id}`}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 block"
      >
        <div className="relative h-48">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
          />
          {post.role && (
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              {post.role}
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-blue-600">
              {post.category}
            </span>
            <span className="text-sm text-gray-500">
              {post.date}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{post.author}</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center group">
                <svg 
                  className="w-4 h-4 mr-1 transition-colors group-hover:text-blue-500" 
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
                <span className="group-hover:text-blue-500 transition-colors">
                  {formatNumber(post.views)}
                </span>
              </span>
              <span className="flex items-center group">
                <svg 
                  className="w-4 h-4 mr-1 transition-colors group-hover:text-red-500" 
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
                <span className="group-hover:text-red-500 transition-colors">
                  {formatNumber(post.likes)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 