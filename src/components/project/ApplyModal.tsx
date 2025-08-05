'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import type { RemoteProject } from '@/types/remoteProject';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplyFormData) => Promise<void>;
  projectTitle: string;
}

export interface ApplyFormData {
  coverLetter: string;
  portfolio: string;
  expectedRate: string;
  availableDate: string;
}

export default function ApplyModal({ isOpen, onClose, onSubmit, projectTitle }: ApplyModalProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<ApplyFormData>({
    coverLetter: '',
    portfolio: '',
    expectedRate: '',
    availableDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.coverLetter.trim()) {
      alert('자기소개서를 작성해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        coverLetter: '',
        portfolio: '',
        expectedRate: '',
        availableDate: ''
      });
    } catch (error) {
      console.error('Failed to apply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                프로젝트 지원하기
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {projectTitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* User Info */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">지원자 정보</p>
              <p className="font-medium text-gray-900 dark:text-white mt-1">
                {user?.name || '사용자'} ({user?.email})
              </p>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                자기소개서 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  dark:bg-gray-700 dark:text-white"
                placeholder="프로젝트에 지원하는 이유와 본인의 강점을 작성해주세요..."
                required
              />
            </div>

            {/* Portfolio URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                포트폴리오 URL
              </label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  dark:bg-gray-700 dark:text-white"
                placeholder="https://..."
              />
            </div>

            {/* Expected Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                희망 단가
              </label>
              <input
                type="text"
                value={formData.expectedRate}
                onChange={(e) => setFormData({ ...formData, expectedRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  dark:bg-gray-700 dark:text-white"
                placeholder="월 500만원 또는 시간당 5만원"
              />
            </div>

            {/* Available Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                참여 가능일
              </label>
              <input
                type="date"
                value={formData.availableDate}
                onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 
                  dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '지원 중...' : '지원하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}