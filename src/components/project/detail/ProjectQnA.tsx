'use client';

import React, { useState } from 'react';

interface Question {
  id: string | number;
  userId: string;
  userName: string;
  content: string;
  question?: string;
  questionText?: string;
  createdAt: string;
  updatedAt?: string;
  answer?: string;
  answered?: boolean;
}

interface Review {
  id: string | number;
  userId: string;
  userName: string;
  content: string;
  review?: string;
  reviewText?: string;
  rating: number;
  createdAt: string;
  projectName?: string;
}

interface ProjectQnAProps {
  questions: Question[];
  reviews: Review[];
  loading: boolean;
  onShowQuestionModal: () => void;
  onShowReviewModal: () => void;
}

const ProjectQnA = React.memo(({ 
  questions, 
  reviews, 
  loading,
  onShowQuestionModal,
  onShowReviewModal 
}: ProjectQnAProps) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'reviews'>('questions');

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-6">Q&A / 후기</h3>
      
      {/* 탭 메뉴 */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 -mb-px font-medium text-sm transition-colors ${
            activeTab === 'questions'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          질문 ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 -mb-px font-medium text-sm transition-colors ${
            activeTab === 'reviews'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          후기 ({reviews.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">데이터를 불러오는 중...</p>
        </div>
      ) : (
        <>
          {/* 질문 탭 */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <div key={question.id || `question-${index}`} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {question.userName}
                        </span>
                        {question.answered && (
                          <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                            답변완료
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(question.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {question.content || question.question || question.questionText}
                    </p>
                    {question.answer && (
                      <div className="mt-3 pl-4 border-l-2 border-blue-500">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">답변:</span> {question.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">아직 질문이 없습니다.</p>
                  <button
                    onClick={onShowQuestionModal}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    첫 번째 질문을 남겨보세요!
                  </button>
                </div>
              )}
              
              {questions.length > 0 && (
                <button
                  onClick={onShowQuestionModal}
                  className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  질문하기
                </button>
              )}
            </div>
          )}

          {/* 후기 탭 */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={review.id || `review-${index}`} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {review.userName}
                          </span>
                          {renderStars(review.rating)}
                        </div>
                        {review.projectName && (
                          <p className="text-sm text-gray-500">{review.projectName}</p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {review.content || review.review || review.reviewText}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">아직 후기가 없습니다.</p>
                  <button
                    onClick={onShowReviewModal}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    첫 번째 후기를 작성해보세요!
                  </button>
                </div>
              )}
              
              {reviews.length > 0 && (
                <button
                  onClick={onShowReviewModal}
                  className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  후기 작성하기
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
});

ProjectQnA.displayName = 'ProjectQnA';

export default ProjectQnA;