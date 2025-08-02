'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types/project';
import { useNumberFormat } from '@/hooks/useNumberFormat';

interface ProjectCardProps {
  project: Project;
}

// 프로젝트 카드 컴포넌트를 메모이제이션하여 불필요한 리렌더링 방지
const ProjectCard = memo(({ project }: ProjectCardProps) => {
  const { formatManwonRange } = useNumberFormat();
  
  // company 정보 추출
  const companyInfo = typeof project.company === 'object' 
    ? project.company 
    : { name: project.companyName || '회사명 비공개', logo: project.companyLogo };
  // 프로젝트 타입 한글 변환
  const getProjectTypeLabel = (type: string) => {
    switch (type) {
      case 'full_time': return '정규직';
      case 'part_time': return '파트타임';
      case 'contract': return '계약직';
      case 'freelance': return '프리랜서';
      case 'internship': return '인턴십';
      default: return type;
    }
  };
  
  // 프로젝트 타입별 색상
  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'full_time':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'part_time':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'contract':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'freelance':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'internship':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // 경력 수준 한글 변환
  const getExperienceLevelLabel = (level: string) => {
    switch (level) {
      case 'junior': return '주니어';
      case 'mid': return '미드레벨';
      case 'senior': return '시니어';
      case 'expert': return '전문가';
      default: return level;
    }
  };
  
  // 경력 수준별 색상
  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'junior':
        return 'text-green-600 dark:text-green-400';
      case 'mid':
        return 'text-blue-600 dark:text-blue-400';
      case 'senior':
        return 'text-purple-600 dark:text-purple-400';
      case 'expert':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Link href={`/project/${project.id}`} className="block" prefetch={true}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 group hover:scale-[1.02] hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer">
        {/* 상단 정보 */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            {companyInfo.logo ? (
              <Image
                src={companyInfo.logo}
                alt={companyInfo.name}
                width={48}
                height={48}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {companyInfo.name?.charAt(0) || 'P'}
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {companyInfo.name}
              </p>
            </div>
          </div>
          
          {/* 프로젝트 타입 태그 */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProjectTypeColor(project.projectType || '')}`}>
            {getProjectTypeLabel(project.projectType || '')}
          </span>
        </div>

        {/* 프로젝트 설명 */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 overflow-hidden">
          {project.description}
        </p>

        {/* 기술 스택 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(project.skills || []).slice(0, 4).map((skill, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-xs"
            >
              {skill}
            </span>
          ))}
          {project.skills && project.skills.length > 4 && (
            <span className="px-2 py-1 text-gray-500 dark:text-gray-400 text-xs">
              +{project.skills.length - 4}
            </span>
          )}
        </div>

        {/* 하단 정보 */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm">
            {/* 근무 형태 */}
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{project.workType}</span>
            </div>

            {/* 경력 */}
            <div className={`flex items-center ${getExperienceLevelColor(project.experienceLevel || '')}`}>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <span>{getExperienceLevelLabel(project.experienceLevel || '')}</span>
            </div>
          </div>

          {/* 예산 */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {project.budgetMin && project.budgetMax 
                  ? formatManwonRange(project.budgetMin, project.budgetMax)
                  : project.budget || '협의'}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">({project.duration || '협의'})</span>
            </div>
          </div>
        </div>

        {/* 긴급/주목 태그 */}
        {(project.isUrgent || project.isFeatured) && (
          <div className="flex gap-2 mt-3">
            {project.isUrgent && (
              <span className="px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded text-xs font-medium">
                긴급
              </span>
            )}
            {project.isFeatured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded text-xs font-medium">
                주목
              </span>
            )}
          </div>
        )}
        
        {/* 상세보기 버튼 */}
        <div
          className="block w-full text-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/50 dark:hover:to-blue-700/50 text-blue-700 dark:text-blue-300 font-medium py-3 rounded-xl transition-all mt-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white border border-blue-100 dark:border-blue-800 group-hover:border-transparent"
        >
          상세보기
        </div>
      </div>
    </Link>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;