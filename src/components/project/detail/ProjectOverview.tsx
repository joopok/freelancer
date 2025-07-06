'use client';

import React from 'react';
import { ProjectDetail } from '@/types/project';
import { formatCurrency } from '@/utils/format';

interface ProjectOverviewProps {
  project: ProjectDetail;
  realtimeStats: {
    applicants: number;
    views: number;
    bookmarks: number;
  };
  skillMatchScore: number;
  competitionRate: number;
}

const ProjectOverview = React.memo(({ 
  project, 
  realtimeStats, 
  skillMatchScore, 
  competitionRate 
}: ProjectOverviewProps) => {
  return (
    <div className="space-y-8">
      {/* 주요 프로젝트 정보 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-6">프로젝트 핵심 정보</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {realtimeStats.applicants}명
            </div>
            <div className="text-sm text-gray-500">현재 지원자</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
              {competitionRate}:1
            </div>
            <div className="text-sm text-gray-500">경쟁률</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {skillMatchScore}%
            </div>
            <div className="text-sm text-gray-500">매칭 점수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              4.8
            </div>
            <div className="text-sm text-gray-500">클라이언트 평점</div>
          </div>
        </div>
      </div>

      {/* 프로젝트 상세 설명 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">프로젝트 개요</h3>
        <div className="prose max-w-none text-gray-600 dark:text-gray-300">
          {(project.detailedDescription || '').split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>

      {/* 주요 업무 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">주요 업무</h3>
        <ul className="space-y-3">
          {(Array.isArray(project.responsibilities) ? project.responsibilities : []).map((responsibility, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="text-blue-600 text-lg">•</span>
              <span className="text-gray-600 dark:text-gray-300">{responsibility}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 필수 조건 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">필수 조건</h3>
        <ul className="space-y-3">
          {(Array.isArray(project.requirements) ? project.requirements : []).map((requirement, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="text-red-500 text-lg">✓</span>
              <span className="text-gray-600 dark:text-gray-300">{requirement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 우대 조건 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">우대 조건</h3>
        <ul className="space-y-3">
          {(Array.isArray(project.preferredSkills) ? project.preferredSkills : []).map((skill, index) => (
            <li key={index} className="flex items-start space-x-3">
              <span className="text-green-500 text-lg">+</span>
              <span className="text-gray-600 dark:text-gray-300">{skill}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">자주 묻는 질문</h3>
        <div className="space-y-4">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <span className="font-medium">재택근무가 가능한가요?</span>
              <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="text-gray-600 dark:text-gray-400 pb-3">
              주 2회 오피스 미팅이 필요하며, 나머지는 재택근무 가능합니다. 프로젝트 킥오프 첫 주는 오피스 출근이 필요합니다.
            </p>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <span className="font-medium">추가 인력 투입 계획이 있나요?</span>
              <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="text-gray-600 dark:text-gray-400 pb-3">
              프로젝트 2단계에서 프론트엔드 개발자 1명, 백엔드 개발자 1명을 추가로 모집할 예정입니다.
            </p>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <span className="font-medium">유지보수 계약이 포함되어 있나요?</span>
              <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="text-gray-600 dark:text-gray-400 pb-3">
              프로젝트 완료 후 6개월간 유지보수 계약이 포함되어 있으며, 월 단위로 별도 계약 가능합니다.
            </p>
          </details>

          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <span className="font-medium">개발 환경과 도구는 무엇을 사용하나요?</span>
              <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="text-gray-600 dark:text-gray-400 pb-3">
              Git, Jira, Slack을 기본으로 사용하며, CI/CD는 Jenkins를 활용합니다. 개발 IDE는 자유롭게 선택 가능합니다.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
});

ProjectOverview.displayName = 'ProjectOverview';

export default ProjectOverview;