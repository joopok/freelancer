'use client';

import React from 'react';

export function AthomeAdvantages() {
  return (
    <div className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">잡코리아 빌보드 재택 프로젝트의 장점</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            잡코리아 빌보드는 다양한 산업 분야의 재택 프로젝트를 제공하며, 믿을 수 있는 플랫폼을 통해 안전한 거래를 보장합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">유연한 근무 환경</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">장소와 시간에 구애받지 않고 자신에게 가장 효율적인 환경에서 업무를 수행할 수 있습니다.</p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">안전한 계약과 대금</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">잡코리아 빌보드의 안전한 계약 시스템과 대금보호 서비스로 안심하고 프로젝트를 진행할 수 있습니다.</p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">검증된 고객사</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">잡코리아 빌보드에 등록된 모든 프로젝트와 고객사는 검증 과정을 거쳐 신뢰할 수 있는 파트너입니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-10 rounded-2xl shadow-lg transition-colors duration-300">
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3">94%</p>
            <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">프로젝트 완료율</p>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3">15,000+</p>
            <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">등록된 프리랜서</p>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3">3,500+</p>
            <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">완료된 원격 프로젝트</p>
          </div>
          <div className="text-center transform hover:scale-105 transition-transform duration-300">
            <p className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-3">4.8/5</p>
            <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">고객 만족도</p>
          </div>
        </div>
      </div>
    </div>
  );
}
