'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, router]);

  const navigateTo = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-10 relative z-10">
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transition-colors duration-300 will-change-transform"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <motion.span 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl cursor-pointer will-change-transform"
              whileHover={{ scale: 1.1, rotate: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              onClick={() => navigateTo('/project')}
            >
              🔍
            </motion.span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="기술, 직무, 프로젝트 등을 검색해보세요"
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-colors duration-200"
            />
        </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg font-bold text-lg transition-colors will-change-transform"
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            검색하기
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
