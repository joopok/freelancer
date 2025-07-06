'use client';

import React from 'react';
import { ProjectDetail, WorkingConditions } from '@/types/project';

interface ProjectDetailsProps {
  project: ProjectDetail;
}

const ProjectDetails = React.memo(({ project }: ProjectDetailsProps) => {
  return (
    <div className="space-y-8">
      {/* 근무 조건 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">근무 조건</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-gray-500 text-sm">근무 시간</span>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {project.workingConditions?.workingHours || '09:00 ~ 18:00'}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">근무 요일</span>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {project.workingConditions?.workingDays || '월요일 ~ 금요일'}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">초과 근무</span>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {project.workingConditions?.overtime || '필요시 협의'}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">재택 근무</span>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {project.workingConditions?.remote ? '가능' : '불가'}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">복장 규정</span>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {project.workingConditions?.dress_code || '자유 복장'}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">장비 지원</span>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              {project.workingConditions?.equipment_provided ? '지원' : '미지원'}
            </p>
          </div>
        </div>
      </div>

      {/* 추가 혜택 */}
      {project.additionalBenefits && project.additionalBenefits.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4">추가 혜택</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {project.additionalBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 개발 환경 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">개발 환경</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">기술 스택</h4>
            <div className="flex flex-wrap gap-2">
              {(project.skills || []).map((skill, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {project.developmentTools && (
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">개발 도구</h4>
              <p className="text-gray-600 dark:text-gray-400">{project.developmentTools}</p>
            </div>
          )}

          {project.collaborationTools && (
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">협업 도구</h4>
              <p className="text-gray-600 dark:text-gray-400">{project.collaborationTools}</p>
            </div>
          )}
        </div>
      </div>

      {/* 팀 구성 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-4">팀 구성</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">현재 팀 규모</span>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {project.teamSize || '1'}명
            </span>
          </div>
          {project.teamComposition && (
            <div className="border-t pt-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">팀 구성원</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{project.teamComposition}</p>
            </div>
          )}
        </div>
      </div>

      {/* 프로젝트 단계 */}
      {project.projectStages && Array.isArray(project.projectStages) && project.projectStages.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4">프로젝트 진행 단계</h3>
          <div className="space-y-4">
            {project.projectStages.map((stage, index) => (
              <div key={index} className="relative pl-8">
                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center
                  ${stage.status === 'completed' ? 'bg-green-500' : 
                    stage.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  {stage.status === 'completed' && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {stage.status === 'current' && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
                {index < project.projectStages.length - 1 && (
                  <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-300"></div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{stage.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stage.description}</p>
                  <p className="text-xs text-gray-500 mt-2">기간: {stage.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

ProjectDetails.displayName = 'ProjectDetails';

export default ProjectDetails;