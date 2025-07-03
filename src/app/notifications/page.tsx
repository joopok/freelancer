'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Bell, Settings, Mail, MessageSquare, Briefcase, Clock, Check, X } from 'lucide-react';

export default function NotificationsPage() {
  const { user, isLoggedIn } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            알림을 확인하려면 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  // 샘플 알림 데이터
  const sampleNotifications = [
    {
      id: 1,
      type: 'project',
      title: '새로운 프로젝트 매칭',
      message: '귀하의 스킬과 매칭되는 React 개발 프로젝트가 등록되었습니다.',
      time: '2시간 전',
      read: false,
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      id: 2,
      type: 'message',
      title: '새로운 메시지',
      message: '(주)테크스타트업에서 메시지를 보냈습니다.',
      time: '5시간 전',
      read: false,
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: 3,
      type: 'system',
      title: '프로필 업데이트 완료',
      message: '프로필 정보가 성공적으로 업데이트되었습니다.',
      time: '1일 전',
      read: true,
      icon: <Check className="h-5 w-5" />
    },
    {
      id: 4,
      type: 'reminder',
      title: '프로젝트 마감일 알림',
      message: 'React 웹 애플리케이션 개발 프로젝트의 마감일이 3일 남았습니다.',
      time: '2일 전',
      read: true,
      icon: <Clock className="h-5 w-5" />
    }
  ];

  const filteredNotifications = sampleNotifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'settings') return false; // 설정 탭은 다른 UI
    return true;
  });

  const getNotificationColor = (type: string, read: boolean) => {
    const opacity = read ? 'opacity-60' : '';
    switch (type) {
      case 'project':
        return `text-blue-600 dark:text-blue-400 ${opacity}`;
      case 'message':
        return `text-green-600 dark:text-green-400 ${opacity}`;
      case 'system':
        return `text-purple-600 dark:text-purple-400 ${opacity}`;
      case 'reminder':
        return `text-orange-600 dark:text-orange-400 ${opacity}`;
      default:
        return `text-gray-600 dark:text-gray-400 ${opacity}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">알림</h1>
          <p className="text-gray-600 dark:text-gray-400">새로운 알림과 메시지를 확인하세요.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {/* 탭 */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'all', label: '전체', count: sampleNotifications.length },
                { id: 'unread', label: '읽지 않음', count: sampleNotifications.filter(n => !n.read).length },
                { id: 'settings', label: '설정', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label} {tab.count !== null && `(${tab.count})`}
                </button>
              ))}
            </nav>
          </div>

          {/* 내용 */}
          <div className="p-6">
            {activeTab === 'settings' ? (
              /* 알림 설정 */
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">알림 설정</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">이메일 알림</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">새로운 프로젝트와 메시지를 이메일로 받기</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">프로젝트 알림</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">새로운 프로젝트 매칭 알림</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">메시지 알림</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">새로운 메시지와 댓글 알림</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">마감일 알림</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">프로젝트 마감일과 중요한 일정 알림</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    설정 저장
                  </button>
                </div>
              </div>
            ) : (
              /* 알림 목록 */
              <div>
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      알림이 없습니다
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      새로운 알림이 있으면 여기에 표시됩니다.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border ${
                          notification.read
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'
                            : 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={getNotificationColor(notification.type, notification.read)}>
                              {notification.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-medium ${notification.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                {notification.title}
                              </h4>
                              <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}