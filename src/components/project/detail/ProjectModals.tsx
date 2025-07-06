'use client';

import React from 'react';
import Image from 'next/image';
import { ProjectDetail } from '@/types/project';
import { formatDate } from '@/utils/format';

interface ProjectModalsProps {
  // Image Modal
  showImageModal: boolean;
  selectedImageIndex: number;
  onCloseImageModal: () => void;
  onNavigateImage: (index: number) => void;
  
  // Company Modal
  showCompanyModal: boolean;
  onCloseCompanyModal: () => void;
  project: ProjectDetail;
  
  // Chat Modal
  showChatModal: boolean;
  onCloseChatModal: () => void;
}

const ProjectModals = React.memo(({ 
  showImageModal,
  selectedImageIndex,
  onCloseImageModal,
  onNavigateImage,
  showCompanyModal,
  onCloseCompanyModal,
  project,
  showChatModal,
  onCloseChatModal
}: ProjectModalsProps) => {
  
  return (
    <>
      {/* 이미지 모달 */}
      {showImageModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40" 
            onClick={onCloseImageModal} 
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  프로젝트 이미지 {selectedImageIndex}
                </h3>
                <button
                  onClick={onCloseImageModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* 모달 이미지 */}
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700">
                <Image
                  src={`/images/project-${selectedImageIndex}.jpg`}
                  alt={`프로젝트 이미지 ${selectedImageIndex}`}
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* 이미지 네비게이션 */}
              <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    const prevIndex = selectedImageIndex > 1 ? selectedImageIndex - 1 : 3;
                    onNavigateImage(prevIndex);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  이전
                </button>
                
                <div className="flex gap-2">
                  {[1, 2, 3].map((index) => (
                    <button
                      key={index}
                      onClick={() => onNavigateImage(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        selectedImageIndex === index 
                          ? 'bg-blue-600 dark:bg-blue-400' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => {
                    const nextIndex = selectedImageIndex < 3 ? selectedImageIndex + 1 : 1;
                    onNavigateImage(nextIndex);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  다음
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 회사 상세 정보 모달 */}
      {showCompanyModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40" 
            onClick={onCloseCompanyModal} 
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">회사 상세 정보</h3>
                  <button
                    onClick={onCloseCompanyModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 회사 기본 정보 */}
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {(project.companyInfo?.name || project.companyName || '회사').charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {project.companyInfo?.name || project.companyName}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {project.companyInfo?.industry || 'IT/소프트웨어'}
                      </p>
                    </div>
                  </div>

                  {/* 회사 상세 정보 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">설립년도</p>
                      <p className="font-medium">{project.companyInfo?.founded || '2015년'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">직원수</p>
                      <p className="font-medium">{project.companyInfo?.employees || '50-100명'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">기업 규모</p>
                      <p className="font-medium">{project.companyInfo?.size || '중견기업'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">위치</p>
                      <p className="font-medium">{project.location}</p>
                    </div>
                  </div>

                  {/* 회사 소개 */}
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">회사 소개</h5>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {project.companyInfo?.description || '혁신적인 기술로 세상을 변화시키는 기업입니다. 최고의 인재들과 함께 성장하며, 더 나은 미래를 만들어갑니다.'}
                    </p>
                  </div>

                  {/* 주요 사업 분야 */}
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-3">주요 사업 분야</h5>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                        웹 개발
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                        모바일 앱
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                        AI/ML
                      </span>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                        클라우드
                      </span>
                    </div>
                  </div>

                  {/* 회사 웹사이트 */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      회사 웹사이트 방문
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 채팅 모달 */}
      {showChatModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40" 
            onClick={onCloseChatModal} 
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">문의하기</h3>
                  <button
                    onClick={onCloseChatModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    채팅 기능은 로그인 후 이용 가능합니다.
                  </p>
                  <p className="text-sm text-gray-500">
                    프로젝트 관련 문의는 지원하기를 통해 메시지를 남겨주세요.
                  </p>
                </div>

                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={onCloseChatModal}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    닫기
                  </button>
                  <button
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    로그인하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
});

ProjectModals.displayName = 'ProjectModals';

export default ProjectModals;