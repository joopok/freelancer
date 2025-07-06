'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Freelancer, FeaturedFreelancer } from '@/types/freelancer';

export function FeaturedFreelancers({ freelancers }: { freelancers: FeaturedFreelancer[] }) {
  const router = useRouter();

  const navigateTo = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white transition-colors duration-300">추천 프리랜서</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
              검증된 실력의 맞춤형 프리랜서를 만나보세요
            </p>
          </div>
          <button 
            onClick={() => navigateTo('/freelancer')}
            className="hidden md:block text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            모든 프리랜서 보기 →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {freelancers.map((freelancer) => (
            <motion.div
              key={freelancer.id}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-600 transition-all duration-300 will-change-transform"
              onClick={() => navigateTo(`/freelancer/${freelancer.id}`)}
            >
              <div className="relative h-48 bg-blue-50 dark:bg-blue-900/30 transition-colors duration-300">
                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 overflow-hidden bg-gray-200 dark:bg-gray-600 transition-colors duration-300">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 dark:from-blue-600 dark:to-blue-800">
                      <span className="text-white text-2xl font-bold">{freelancer.name.charAt(0)}</span>
                  </div>
                  </div>
                </div>
                    </div>
                <div className="pt-16 p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-medium dark:text-white transition-colors duration-300">{freelancer.rating}</span>
                      </div>
                  <h3 className="text-xl font-bold mb-1 dark:text-white transition-colors duration-300">{freelancer.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-300">{freelancer.position}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">경력 {freelancer.experience}</p>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {freelancer.skills.map((skill, index) => (
                          <span
                            key={index}
                        className="bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm transition-colors duration-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
              </motion.div>
            ))}
          </div>
          
                      <div className="mt-8 text-center md:hidden">
          <button 
            onClick={() => navigateTo('/freelancer')}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            모든 프리랜서 보기 →
          </button>
        </div>
        </div>
      </section>
  );
}
