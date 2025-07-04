'use client';

import React from 'react';
import Link from 'next/link';

export function AthomeInfo() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-24 relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center transition-colors duration-300">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">재택 프로젝트란?</span>
              <div className="ml-4 h-1 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-gray-300 transition-colors duration-300">
              <p className="text-lg leading-relaxed">
                <span className="font-medium text-indigo-600">재택 프로젝트</span>는 장소에 구애받지 않고 온라인으로 진행하는 프로젝트입니다. AI 개발, 웹/앱 개발, 블록체인, IoT 등 다양한 IT 분야의 전문 프로젝트를 재택근무로 수행할 수 있습니다.
              </p>
              <ul className="list-none space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>자유로운 근무 환경과 시간 관리</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>월 평균 3,000만원 ~ 8,000만원 고수익</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Slack, Zoom, Git 등 협업 도구 활용</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>주간 진행상황 보고 및 정기 미팅</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>대기업부터 스타트업까지 다양한 클라이언트</span>
                </li>
              </ul>
              <p className="text-lg leading-relaxed">
                현재 <span className="font-semibold text-indigo-600">12개의 재택 프로젝트</span>가 진행 중이며, Python, React, Node.js, TensorFlow 등 다양한 기술 스택을 요구합니다. 자기주도적 업무 능력과 원격 협업 경험이 있는 프리랜서에게 최적화된 프로젝트들입니다.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-b from-indigo-100 to-purple-100 rounded-bl-full opacity-50 -z-10"></div>
            <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white pb-4 border-b border-gray-200 dark:border-gray-600 flex items-center transition-colors duration-300">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">재택 프로젝트 시작하기</span>
            </h3>
            <div className="space-y-10">
              <div className="flex">
                <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-indigo-600 font-bold text-2xl">1</span>
                </div>
                <div className="ml-6">
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">프로젝트 탐색</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">AI, 블록체인, IoT 등 내 전문 분야의 재택 프로젝트를 검색하고 상세 정보를 확인합니다.</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-indigo-600 font-bold text-2xl">2</span>
                </div>
                <div className="ml-6">
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">포트폴리오 제출</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">관련 경험과 포트폴리오를 포함한 제안서를 작성하여 클라이언트에게 지원합니다.</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-indigo-600 font-bold text-2xl">3</span>
                </div>
                <div className="ml-6">
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">화상 면접 및 계약</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">온라인 면접을 통해 프로젝트 세부사항을 논의하고 안전한 계약을 체결합니다.</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="text-indigo-600 font-bold text-2xl">4</span>
                </div>
                <div className="ml-6">
                  <h4 className="text-xl font-medium text-gray-900 dark:text-white mb-2 transition-colors duration-300">원격 개발 및 납품</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">정해진 일정에 따라 원격으로 개발하고, 정기 보고를 통해 프로젝트를 완성합니다.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <Link
                href="/register"
                className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-4 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                프리랜서 가입하기
              </Link>
              <Link
                href="/jobs"
                className="block w-full bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-800 dark:text-white text-center py-4 rounded-xl font-medium transition-all border border-gray-200 dark:border-gray-500 hover:border-gray-300 dark:hover:border-gray-400"
              >
                모든 프로젝트 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
