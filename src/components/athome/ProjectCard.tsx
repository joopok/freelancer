'use client';

import React from 'react';
import Link from 'next/link';
import { AthomeProject } from '@/types/athome';
import { formatDate } from '@/utils/format';

interface ProjectCardProps {
  project: AthomeProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      key={project.id}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-indigo-500 dark:to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
            {formatDate(project.deadline)}
          </span>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-700">
            {project.type}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {project.company}
        </p>

        {project.description && (
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm line-clamp-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">{project.description}</p>
        )}

        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-100 dark:border-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex justify-between text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-300 flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-400 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              {project.duration}
            </span>
            <span className="font-medium text-gray-900 dark:text-white flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-400 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {project.budget}
            </span>
          </div>
        </div>

        <Link
          href={`/athome/${project.id}`}
          className="block w-full text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/50 dark:hover:to-indigo-800/50 text-blue-700 dark:text-blue-300 font-medium py-3 rounded-xl transition-all mt-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 dark:group-hover:from-indigo-500 dark:group-hover:to-purple-500 group-hover:text-white border border-blue-100 dark:border-blue-700 group-hover:border-transparent"
        >
          상세보기
        </Link>
      </div>
    </div>
  );
}
