'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Stat } from '@/types';

export function StatsSection({ stats }: { stats: Stat[] }) {
  const router = useRouter();

  const navigateTo = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return (
    <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-16 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            숫자로 보는 잡코리아 빌보드
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            우리는 신뢰할 수 있는 플랫폼을 통해 최고의 매칭을 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              onClick={() => {
                if (stat.id === 1) navigateTo('/freelancer');
                else if (stat.id === 2) navigateTo('/project');
                else if (stat.id === 3) navigateTo('/project');
                else if (stat.id === 4) navigateTo('/jobs');
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 group cursor-pointer will-change-transform"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 text-4xl group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
