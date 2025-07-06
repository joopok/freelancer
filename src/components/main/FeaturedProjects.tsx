'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { FeaturedProject } from '@/types/project';

export function FeaturedProjects({ projects }: { projects: FeaturedProject[] }) {
  const router = useRouter();

  const navigateTo = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white transition-colors duration-300">추천 프로젝트</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
              검증된 클라이언트의 맞춤형 프로젝트를 만나보세요. <br />
          </p>
        </div>
          <button
          onClick={() => navigateTo('/project')}
          className="hidden md:block text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          모든 프로젝트 보기 →
          </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <motion.div
              key={project.id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 will-change-transform"
            onClick={() => navigateTo(`/project/${project.id}`)}
          >
            <div className="p-6">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                project.type === '재택' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
              }`}>
                      {project.type}
                  </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-2 dark:text-white transition-colors duration-300">{project.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">{project.company}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                    {project.skills.map((skill, index) => (
                      <span
                        key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm transition-colors duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
              
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 transition-colors duration-300">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">예산</p>
                    <p className="font-semibold dark:text-white transition-colors duration-300">{project.budget}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">기간</p>
                    <p className="font-semibold dark:text-white transition-colors duration-300">{project.duration}</p>
                </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">마감일</p>
                    <p className="font-semibold dark:text-white transition-colors duration-300">{project.deadline}</p>
              </div>
                </div>
              </div>
            </div>
          </motion.div>
          ))}
        </div>
      
      <div className="mt-8 text-center md:hidden">
        <button 
          onClick={() => navigateTo('/project')}
          className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          모든 프로젝트 보기 →
        </button>
      </div>
    </section>
  );
}
