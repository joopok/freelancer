'use client';

import { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, MapPin, Send, ChevronDown, ChevronRight } from 'lucide-react';

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // FAQ 데이터
  const faqData = [
    {
      id: 1,
      question: '프리랜서 수수료는 어떻게 되나요?',
      answer: '잡코리아 빌보드는 프로젝트 성사 시 최종 계약금액의 5%를 수수료로 받습니다. 이는 업계 최저 수준의 수수료입니다.'
    },
    {
      id: 2,
      question: '프로젝트 진행 중 문제가 발생했을 때는 어떻게 하나요?',
      answer: '프로젝트 진행 중 문제가 발생하면 고객센터로 즉시 연락주시기 바랍니다. 전문 상담원이 중재를 도와드리며, 필요시 분쟁 해결 프로세스를 진행합니다.'
    },
    {
      id: 3,
      question: '환불 정책은 어떻게 되나요?',
      answer: '프로젝트 시작 전에는 100% 환불이 가능하며, 진행 중인 프로젝트는 진행률에 따라 부분 환불이 가능합니다. 자세한 사항은 이용약관을 참고해주세요.'
    },
    {
      id: 4,
      question: '프리랜서 인증은 어떻게 진행되나요?',
      answer: '프리랜서 인증은 포트폴리오 검증, 경력 확인, 기술 테스트를 통해 진행됩니다. 인증 완료 시 프로필에 인증 배지가 표시됩니다.'
    },
    {
      id: 5,
      question: '프로젝트 대금은 언제 지급되나요?',
      answer: '프로젝트 완료 후 클라이언트의 최종 승인이 완료되면, 영업일 기준 3일 이내에 등록된 계좌로 대금이 지급됩니다.'
    }
  ];

  // 문의 카테고리
  const categories = [
    { value: 'payment', label: '결제/환불' },
    { value: 'project', label: '프로젝트 문의' },
    { value: 'account', label: '계정 문제' },
    { value: 'dispute', label: '분쟁 해결' },
    { value: 'technical', label: '기술 지원' },
    { value: 'other', label: '기타 문의' }
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 문의 제출 로직
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    setMessage('');
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Phone className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">고객센터</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            무엇을 도와드릴까요? 언제든지 문의해주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 연락처 정보 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 전화 상담 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">전화 상담</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">빠른 상담을 원하신다면</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1588-9999</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">평일 09:00 - 18:00</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">토요일 09:00 - 13:00</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">일요일/공휴일 휴무</p>
              </div>
            </div>

            {/* 이메일 문의 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                  <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">이메일 문의</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">24시간 접수 가능</p>
                </div>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">support@jobkorea.co.kr</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                영업일 기준 24시간 이내 답변
              </p>
            </div>

            {/* 카카오톡 상담 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-4">
                  <MessageCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">카카오톡 상담</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">실시간 채팅 상담</p>
                </div>
              </div>
              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg font-medium transition-colors">
                카카오톡 상담 시작
              </button>
            </div>

            {/* 오시는 길 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">오시는 길</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">직접 방문 상담</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                서울특별시 강남구 테헤란로 123<br />
                잡코리아 빌딩 15층<br />
                (역삼역 3번 출구 도보 5분)
              </p>
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 온라인 문의 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">온라인 문의</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    문의 유형
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">선택해주세요</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    문의 내용
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="문의하실 내용을 자세히 작성해주세요..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  문의 접수하기
                </button>
              </form>
            </div>

            {/* 자주 묻는 질문 */}
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

            {/* 빠른 답변 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    빠른 답변을 원하신다면?
                  </h3>
                  <p className="text-blue-800 dark:text-blue-300 text-sm">
                    평일 오전 9시부터 오후 6시까지 전화 상담을 이용하시면 실시간으로 답변을 받으실 수 있습니다.
                    카카오톡 상담도 실시간으로 운영되고 있으니 편하신 방법으로 문의해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}