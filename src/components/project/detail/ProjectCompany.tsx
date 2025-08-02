'use client';

import React from 'react';
import { ProjectDetail } from '@/types/project';

interface ProjectCompanyProps {
  project: ProjectDetail;
  onShowCompanyModal: () => void;
}

const ProjectCompany = React.memo(({ project, onShowCompanyModal }: ProjectCompanyProps) => {
  return (
    <div className="space-y-8">
      {/* 회사 정보 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold">회사 정보</h3>
          <button
            onClick={onShowCompanyModal}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            자세히 보기
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              {project.companyInfo?.name || project.companyName}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {project.companyInfo?.description || '혁신적인 기술로 성장하는 기업입니다.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-500 text-sm">업종</span>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {project.companyInfo?.industry || 'IT/소프트웨어'}
              </p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">규모</span>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {project.companyInfo?.size || '중견기업'}
              </p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">설립년도</span>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {project.companyInfo?.founded || '2015년'}
              </p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">직원수</span>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {project.companyInfo?.employees || '50-100명'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 회사 설명 */}
      {project.companyInfo?.description && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4">회사 소개</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {project.companyInfo.description}
          </p>
        </div>
      )}

      {/* 담당자 정보 */}
      {project.contactPerson && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4">담당자 정보</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {project.contactPerson.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {project.contactPerson.position}
                </p>
              </div>
            </div>
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {project.contactPerson.email}
                </span>
              </div>
              {project.contactPerson.phone && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {project.contactPerson.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 회사 위치 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">회사 위치</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                {project.location}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {project.location || '상세 주소는 면접 시 안내드립니다.'}
              </p>
            </div>
          </div>
          
          {/* 간단한 지도 표시 영역 */}
          <div className="mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg h-48 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">지도 영역</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ProjectCompany.displayName = 'ProjectCompany';

export default ProjectCompany;