'use client';

import React, { memo, useCallback } from 'react';

interface ApplicationModalProps {
  showApplicationModal: boolean;
  setShowApplicationModal: (show: boolean) => void;
}

const ApplicationModal = memo(({ showApplicationModal, setShowApplicationModal }: ApplicationModalProps) => {
  const handleClose = useCallback(() => {
    setShowApplicationModal(false);
  }, [setShowApplicationModal]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // 지원하기 로직 구현
    console.log('Application submitted');
    handleClose();
  }, [handleClose]);

  if (!showApplicationModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">프로젝트 지원하기</h3>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">이름 *</label>
              <input 
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="성명을 입력해주세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">연락처 *</label>
              <input 
                type="tel"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="010-0000-0000"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">이메일 *</label>
            <input 
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">희망 급여</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">희망 급여를 선택해주세요</option>
              <option value="3000-4000">3,000만원 - 4,000만원</option>
              <option value="4000-5000">4,000만원 - 5,000만원</option>
              <option value="5000-6000">5,000만원 - 6,000만원</option>
              <option value="6000+">6,000만원 이상</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">포트폴리오 URL</label>
            <input 
              type="url"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://github.com/username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">자기소개 및 지원동기 *</label>
            <textarea 
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="프로젝트 관련 경험과 지원동기를 상세히 작성해주세요"
              required
            />
          </div>
          
          <div className="flex space-x-3">
            <button 
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              지원하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ApplicationModal.displayName = 'ApplicationModal';

export default ApplicationModal;