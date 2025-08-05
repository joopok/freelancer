'use client';

import React from 'react';
import { Project } from '@/types/project';
import { useNumberFormat } from '@/hooks/useNumberFormat';

interface ProjectSidebarProps {
  project: Project;
  realtimeStats: {
    applicants: number;
    views: number;
    bookmarks: number;
  };
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onShowApplicationModal: () => void;
  onShowChatModal: () => void;
}

const ProjectSidebar = React.memo(({ 
  project, 
  realtimeStats,
  isBookmarked,
  onToggleBookmark,
  onShowApplicationModal,
  onShowChatModal
}: ProjectSidebarProps) => {
  const { formatManwonRange } = useNumberFormat();
  
  return (
    <div className="space-y-6">
      {/* 예산 정보 카드 */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">예산 정보</h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">예상 금액</span>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {project.budgetMin && project.budgetMax 
                ? formatManwonRange(project.budgetMin, project.budgetMax)
                : project.budget || '협의'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">프로젝트 기간</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{project.duration}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">마감일</span>
              <p className="font-medium text-gray-900 dark:text-gray-100">{project.deadline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 지원 현황 카드 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">지원 현황</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">지원자 수</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {realtimeStats.applicants}명
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">조회수</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {realtimeStats.views}회
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">북마크</span>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {realtimeStats.bookmarks}개
            </span>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-3">
        <button
          onClick={onShowApplicationModal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl"
        >
          프로젝트 지원하기
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onShowChatModal}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>문의하기</span>
          </button>
          
          <button
            onClick={onToggleBookmark}
            className={`font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
              isBookmarked 
                ? 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/30 text-yellow-700 dark:text-yellow-300' 
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <svg 
              className="w-5 h-5" 
              fill={isBookmarked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>{isBookmarked ? '저장됨' : '저장'}</span>
          </button>
        </div>
      </div>

      {/* 클라이언트 정보 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">클라이언트 정보</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
{(project.companyName || (typeof project.company === 'object' ? project.company.name : project.company) || '회사').charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
{project.companyName || (typeof project.company === 'object' ? project.company.name : project.company)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                IT/소프트웨어
              </p>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">평균 평점</span>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">4.8</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">완료 프로젝트</span>
              <span className="font-medium">23개</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">재계약률</span>
              <span className="font-medium">92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 공유하기 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">프로젝트 공유</h3>
        <div className="flex space-x-2">
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded-lg transition-colors">
            <svg className="w-5 h-5 mx-auto text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded-lg transition-colors">
            <svg className="w-5 h-5 mx-auto text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
            </svg>
          </button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 py-2 rounded-lg transition-colors">
            <svg className="w-5 h-5 mx-auto text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

ProjectSidebar.displayName = 'ProjectSidebar';

export default ProjectSidebar;