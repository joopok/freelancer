'use client';

import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

interface InquiryModalProps {
  projectTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InquiryFormData) => Promise<void>;
}

export interface InquiryFormData {
  subject: string;
  message: string;
  contactEmail?: string;
  contactPhone?: string;
}

export default function InquiryModal({ projectTitle, isOpen, onClose, onSubmit }: InquiryModalProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<InquiryFormData>({
    subject: '',
    message: '',
    contactEmail: user?.email || '',
    contactPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        subject: '',
        message: '',
        contactEmail: user?.email || '',
        contactPhone: ''
      });
    } catch (error) {
      console.error('Failed to send inquiry:', error);
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
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  프로젝트 문의하기
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {projectTitle}
                </p>
              </div>
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
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                문의 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  dark:bg-gray-700 dark:text-white"
                placeholder="문의 제목을 입력해주세요"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                문의 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  dark:bg-gray-700 dark:text-white"
                placeholder="프로젝트에 대해 궁금한 점을 자세히 작성해주세요..."
                required
              />
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                연락처 정보
              </h3>
              
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  전화번호
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    dark:bg-gray-700 dark:text-white"
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            {/* Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                • 문의 내용은 프로젝트 담당자에게 전달됩니다.<br />
                • 답변은 입력하신 연락처로 전송됩니다.<br />
                • 영업일 기준 1-2일 내 답변을 받으실 수 있습니다.
              </p>
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
                {isSubmitting ? '전송 중...' : '문의하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}