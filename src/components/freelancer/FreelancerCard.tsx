'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import type { Freelancer } from '@/types/freelancer';

interface FreelancerCardProps {
  freelancer: Freelancer;
}

const FreelancerCard: React.FC<FreelancerCardProps> = ({ freelancer }) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {freelancer.name?.[0] || 'F'}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{freelancer.name || '이름 없음'}</h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <span>{freelancer.experience}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {freelancer.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-800">
            {freelancer.type}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-600 mb-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 overflow-hidden text-ellipsis">
            {freelancer.description}
          </p>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.isArray(freelancer.skills) && freelancer.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-300 flex items-center mb-1">
                <svg className="w-4 h-4 mr-1 text-blue-400 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                조회 {freelancer.viewCount}회
              </span>
              <span className="font-medium text-gray-900 dark:text-white flex items-center">
                <svg className="w-4 h-4 mr-1 text-blue-400 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                프로젝트 {freelancer.projectCount}건
              </span>
            </div>
            <div className="flex flex-col">
              {freelancer.hourlyRate && (
                <span className="text-green-600 dark:text-green-400 font-bold flex items-center mb-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {typeof freelancer.hourlyRate === 'number'
                    ? `${freelancer.hourlyRate.toLocaleString()}만원/시간`
                    : `${freelancer.hourlyRate}`
                  }
                </span>
              )}
              {freelancer.responseTime && (
                <span className="text-gray-600 dark:text-gray-300 flex items-center text-xs">
                  <svg className="w-3 h-3 mr-1 text-blue-400 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  응답시간: {freelancer.responseTime}
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          href={`/freelancer/${freelancer.id}`}
          className="block w-full text-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 text-blue-700 dark:text-blue-300 font-medium py-3 rounded-xl transition-all mt-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white border border-blue-100 dark:border-blue-800 group-hover:border-transparent"
        >
          상세보기
        </Link>
      </div>
    </div>
  );
};

export default FreelancerCard;