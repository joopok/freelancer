'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth';

export function CtaSection() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const router = useRouter();

  const navigateTo = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-purple-600 to-purple-800 dark:from-gray-800 dark:to-gray-900 text-white py-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white transition-colors duration-300 leading-tight">
          지금 시작하세요<br />
          더 나은 내일이 기다립니다
        </h2>
        <p className="text-xl text-purple-100 dark:text-gray-300 max-w-4xl mx-auto mb-10 transition-colors duration-300 leading-relaxed">
          프리랜서로 시작해서 성공적인 사업가가 된 수만 명의 전문가들이<br />
          이미 프리랜스 프로와 함께하고 있습니다
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => navigateTo('/register')}
            className="bg-white dark:bg-gray-200 text-purple-700 dark:text-gray-800 hover:bg-purple-50 dark:hover:bg-gray-100 px-10 py-5 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl will-change-transform"
          >
            회원가입
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={() => navigateTo('/login')}
            className="bg-transparent border-2 border-white dark:border-gray-300 text-white dark:text-gray-300 hover:bg-white dark:hover:bg-gray-300 hover:text-purple-700 dark:hover:text-gray-800 px-10 py-5 rounded-lg font-bold text-lg transition-all will-change-transform"
          >
            로그인
        </motion.button>
      </div>
</div>
  </section>
  );
}
