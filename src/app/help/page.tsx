'use client';

import { useState } from 'react';
import { Search, MessageCircle, Book, Video, Download, ChevronDown, ChevronRight } from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ 데이터
  const faqData = [
    {
      id: 1,
      question: '프리랜서로 등록하려면 어떻게 해야 하나요?',
      answer: '회원가입 후 프로필 설정에서 프리랜서 모드를 선택하고, 포트폴리오와 기술 스택을 등록하시면 됩니다. 프로필 완성도가 높을수록 더 많은 프로젝트 매칭 기회를 얻을 수 있습니다.'
    },
    {
      id: 2,
      question: '프로젝트 지원 후 선정 과정은 어떻게 진행되나요?',
      answer: '프로젝트 지원 후 클라이언트가 프로필을 검토하고, 면접 또는 추가 자료 요청을 할 수 있습니다. 선정되면 계약 조건을 협의하고 프로젝트를 시작하게 됩니다.'
    },
    {
      id: 3,
      question: '수수료는 얼마나 되나요?',
      answer: '잡코리아 빌보드는 프로젝트 성사 시 최종 계약금액의 5%를 수수료로 받습니다. 이는 업계 최저 수준의 수수료입니다.'
    },
    {
      id: 4,
      question: '결제는 어떻게 이루어지나요?',
      answer: '프로젝트 완료 후 클라이언트가 결제를 승인하면, 플랫폼을 통해 안전하게 대금이 지급됩니다. 에스크로 시스템을 통해 양측의 안전한 거래를 보장합니다.'
    },
    {
      id: 5,
      question: '분쟁이 발생했을 때는 어떻게 해결하나요?',
      answer: '플랫폼 내 분쟁 해결 시스템을 통해 중재를 요청할 수 있습니다. 전문 중재팀이 객관적으로 판단하여 공정한 해결을 도와드립니다.'
    }
  ];

  // 도움말 카테고리
  const helpCategories = [
    {
      title: '시작하기',
      description: '플랫폼 사용법과 회원가입 가이드',
      icon: <Book className="h-6 w-6" />,
      items: ['회원가입', '프로필 설정', '첫 프로젝트 찾기']
    },
    {
      title: '프로젝트 관리',
      description: '프로젝트 지원부터 완료까지',
      icon: <MessageCircle className="h-6 w-6" />,
      items: ['프로젝트 지원', '진행 관리', '완료 처리']
    },
    {
      title: '결제 및 수수료',
      description: '결제 시스템과 수수료 정책',
      icon: <Download className="h-6 w-6" />,
      items: ['결제 방법', '수수료 정책', '세금 정보']
    },
    {
      title: '문제 해결',
      description: '일반적인 문제와 해결방법',
      icon: <Video className="h-6 w-6" />,
      items: ['로그인 문제', '결제 오류', '분쟁 해결']
    }
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">도움말 센터</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            필요한 정보를 빠르게 찾아보세요
          </p>
          
          {/* 검색 바 */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="궁금한 것을 검색해보세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 도움말 카테고리 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {helpCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {category.description}
              </p>
              <ul className="space-y-1">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a
                      href="#"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">자주 묻는 질문</h2>
              <div className="space-y-4">
                {faqData.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </span>
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 연락처 및 추가 지원 */}
          <div className="space-y-6">
            {/* 연락하기 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">문제가 해결되지 않았나요?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                직접 문의하시면 빠른 답변을 받을 수 있습니다.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  1:1 문의하기
                </button>
                <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  이메일 보내기
                </button>
              </div>
            </div>

            {/* 운영 시간 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">고객지원 운영시간</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">평일</span>
                  <span className="text-gray-900 dark:text-white">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">토요일</span>
                  <span className="text-gray-900 dark:text-white">09:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">일요일/공휴일</span>
                  <span className="text-gray-900 dark:text-white">휴무</span>
                </div>
              </div>
            </div>

            {/* 가이드 다운로드 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">가이드 다운로드</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-sm text-gray-900 dark:text-white">프리랜서 시작 가이드</span>
                  <Download className="h-4 w-4 text-gray-400" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-sm text-gray-900 dark:text-white">클라이언트 이용 가이드</span>
                  <Download className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}