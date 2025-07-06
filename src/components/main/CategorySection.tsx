'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Category } from '@/types/category';

export function CategorySection({ categories }: { categories: Category[] }) {
  const router = useRouter();

  const navigateTo = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16 relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-10 w-40 h-40 bg-gradient-to-r from-blue-300 to-pink-300 rounded-full filter blur-[100px] opacity-50"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">인기 카테고리</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-5 transition-colors duration-300">
            다양한 분야의 프로젝트와 재능 있는 프리랜서들을 만나보세요
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-2"></div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: category.id * 0.1 }}
            whileHover={{ 
              y: -10,
              scale: 1.03,
              transition: { 
                type: "spring",
                stiffness: 300,
                damping: 20
              } 
            }}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer h-80 will-change-transform"
            onClick={() => navigateTo(`/freelancer?tab=${encodeURIComponent(category.tab)}`)}
          >
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40 group-hover:bg-black/10 dark:group-hover:bg-black/30 transition-all duration-300 z-10"></div>
            <div className="absolute inset-0">
              <div className={`w-full h-full bg-gradient-to-br ${category.bgGradient} group-hover:scale-110 transition-all duration-700`}></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20 dark:opacity-10 mix-blend-overlay"></div>
      </div>

            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 group-hover:glow-white-sm rounded-2xl z-20 transition-all duration-500"></div>
            
            <motion.div 
              whileHover={{ rotateY: 5, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute inset-0 z-30 preserve-3d"
              style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
            >
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-30">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-white/25 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 border border-white/20 dark:border-gray-700">
                    <span className="text-3xl drop-shadow-md">
                      {category.id === 1 && '💻'}
                      {category.id === 2 && '📱'}
                      {category.id === 3 && '🎨'}
                      {category.id === 4 && '📊'}
                      {category.id === 5 && '📝'}
                      {category.id === 6 && '📋'}
                    </span>
                  </div>
              </div>

              <motion.h3 
                className="text-white text-2xl lg:text-3xl font-bold mb-3 transform origin-left group-hover:translate-x-2 transition-transform duration-300 drop-shadow-lg"
              >
                {category.name}
              </motion.h3>
              
              <div className="flex justify-between items-center">
                <div className="bg-white/25 dark:bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full text-white dark:text-gray-200 text-sm font-medium border border-white/20 dark:border-gray-700 shadow-md">
                  {category.count}+ 프로젝트
                </div>
                <div className="w-10 h-10 bg-white/25 dark:bg-gray-800/50 backdrop-blur-md rounded-full flex items-center justify-center transform translate-x-0 group-hover:translate-x-2 transition-all duration-300 border border-white/20 dark:border-gray-700 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => navigateTo('/freelancer')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-400/30 hover:shadow-xl group will-change-transform"
        >
          모든 카테고리 보기
          <span className="transform group-hover:translate-x-1 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </motion.button>
      </div>
    </section>
  );
}
