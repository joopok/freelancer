'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Calendar, Clock, MapPin, DollarSign, Filter } from 'lucide-react';

export default function MyProjectsPage() {
  const { user, isLoggedIn } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'completed' | 'applied'>('all');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            내 프로젝트를 확인하려면 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  // 샘플 프로젝트 데이터
  const sampleProjects = [
    {
      id: 1,
      title: 'React 기반 웹 애플리케이션 개발',
      company: '(주)테크스타트업',
      status: 'ongoing',
      budget: '3,000만원',
      duration: '3개월',
      deadline: '2025-05-15',
      progress: 65,
      type: '재택'
    },
    {
      id: 2,
      title: '모바일 앱 UI/UX 디자인',
      company: '(주)모바일솔루션',
      status: 'completed',
      budget: '2,500만원',
      duration: '2개월',
      deadline: '2025-02-28',
      progress: 100,
      type: '상주'
    },
    {
      id: 3,
      title: '데이터 분석 대시보드 구축',
      company: '(주)빅데이터',
      status: 'applied',
      budget: '4,000만원',
      duration: '4개월',
      deadline: '2025-06-30',
      progress: 0,
      type: '재택'
    }
  ];

  const filteredProjects = sampleProjects.filter(project => {
    if (activeTab === 'all') return true;
    return project.status === activeTab;
  });

  const tabs = [
    { id: 'all', label: '전체', count: sampleProjects.length },
    { id: 'ongoing', label: '진행중', count: sampleProjects.filter(p => p.status === 'ongoing').length },
    { id: 'completed', label: '완료', count: sampleProjects.filter(p => p.status === 'completed').length },
    { id: 'applied', label: '지원중', count: sampleProjects.filter(p => p.status === 'applied').length }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ongoing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full dark:bg-blue-900 dark:text-blue-200">진행중</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900 dark:text-green-200">완료</span>;
      case 'applied':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full dark:bg-yellow-900 dark:text-yellow-200">지원중</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">내 프로젝트</h1>
          <p className="text-gray-600 dark:text-gray-400">참여중이거나 완료한 프로젝트를 관리하세요.</p>
        </div>

        {/* 탭 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* 프로젝트 목록 */}
          <div className="p-6">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  프로젝트가 없습니다
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  아직 {activeTab === 'all' ? '' : tabs.find(t => t.id === activeTab)?.label} 프로젝트가 없습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {project.title}
                          </h3>
                          {getStatusBadge(project.status)}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{project.company}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {project.budget}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {project.duration}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {project.type}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {project.deadline}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 진행률 (진행중인 프로젝트만) */}
                    {project.status === 'ongoing' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">진행률</span>
                          <span className="font-medium text-gray-900 dark:text-white">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 액션 버튼 */}
                    <div className="mt-4 flex space-x-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        상세보기
                      </button>
                      {project.status === 'ongoing' && (
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          리포트 작성
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}