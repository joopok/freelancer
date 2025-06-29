'use client';

import Link from 'next/link';
import { featuredProjects } from '@/data/homeData';

export default function JobList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {featuredProjects.map((job) => (
        <Link 
          key={job.id} 
          href={`/projects/${job.id}`}
          className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg dark:hover:shadow-gray-800/50 transition-all hover:border-blue-200 dark:hover:border-blue-600 bg-white dark:bg-gray-800"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
              <span className={`px-2.5 py-1 text-sm rounded-full ${
                job.type === '재택' 
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                  : 'bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400'
              }`}>
                {job.type}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-3 text-gray-600 dark:text-gray-300">
              <span className="font-medium">{job.company}</span>
              <span>|</span>
              <span>{job.type}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {job.skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-3 py-1 text-sm bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-auto">
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 dark:text-gray-500">예상 기간</span>
                    <span className="font-medium text-gray-900 dark:text-white">{job.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 dark:text-gray-500">예산</span>
                    <span className="font-medium text-gray-900 dark:text-white">{job.budget}</span>
                  </div>
                </div>
                <span className="font-medium text-red-500 dark:text-red-400">{job.deadline}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 