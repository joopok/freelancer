'use client';

import React from 'react';
import { AthomeProject } from '@/types/athome';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  loading: boolean;
  projects: AthomeProject[];
  paginatedProjects: AthomeProject[];
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  resetFilters: () => void;
}

export function ProjectList({
  loading,
  projects,
  paginatedProjects,
  currentPage,
  totalPages,
  handlePageChange,
  resetFilters,
}: ProjectListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300 relative z-10">
        <svg className="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3 transition-colors duration-300">일치하는 프로젝트가 없습니다</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">검색어나 필터 조건을 변경해 보세요.</p>
        <button
          onClick={resetFilters}
          className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          필터 초기화
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
       <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-20 right-20 animate-float opacity-60">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-indigo-600 dark:to-purple-700 rounded-2xl shadow-lg rotate-12 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="absolute top-1/2 right-32 animate-bounce-slow opacity-50">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 dark:from-purple-600 dark:to-pink-700 rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-40 right-16 animate-pulse opacity-40">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-300 to-blue-400 dark:from-indigo-700 dark:to-blue-800 rounded-xl shadow-lg -rotate-12 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="absolute top-1/3 left-1/2 w-96 h-96 opacity-20">
          <svg width="100%" height="100%" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="beam-gradient-remote" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
              </linearGradient>
              <filter id="glow-remote" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g filter="url(#glow-remote)">
              <path d="M 50,200 Q 200,50 350,200" stroke="url(#beam-gradient-remote)" strokeWidth="2" fill="none" opacity="0.6">
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
              </path>
              <path d="M 200,50 Q 300,200 200,350" stroke="url(#beam-gradient-remote)" strokeWidth="2" fill="none" opacity="0.4">
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="5s" repeatCount="indefinite" />
              </path>
            </g>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {projects.length > 0 && (
        <div className="flex justify-center mt-12 relative z-10">
          <nav className="flex items-center space-x-3">
            <button
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm hover:border-indigo-300 hover:text-indigo-600"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              이전
            </button>

            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                let pageNumber: number;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${currentPage === pageNumber
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-sm hover:border-indigo-300 hover:text-indigo-600"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              다음
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
