'use client';

import { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter, Settings, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationType, AppNotification } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  
  const {
    notifications,
    loading,
    error,
    badge,
    hasMore,
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh
  } = useNotifications({
    read: activeTab === 'all' ? undefined : activeTab === 'read',
    type: selectedType === 'all' ? undefined : selectedType,
    limit: 20
  });

  // 알림 타입 옵션
  const notificationTypes = [
    { value: 'all', label: '전체' },
    { value: 'project_applied', label: '프로젝트 지원' },
    { value: 'project_bookmarked', label: '프로젝트 북마크' },
    { value: 'new_similar_project', label: '유사 프로젝트' },
    { value: 'freelancer_contacted', label: '프리랜서 연락' },
    { value: 'application_accepted', label: '지원 승인' },
    { value: 'application_rejected', label: '지원 거절' },
    { value: 'project_deadline_approaching', label: '마감일 임박' },
    { value: 'message_received', label: '메시지 수신' },
    { value: 'system_announcement', label: '시스템 공지' }
  ];

  // 알림 타입별 아이콘
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project_applied':
        return '📝';
      case 'project_bookmarked':
        return '⭐';
      case 'project_status_changed':
        return '🔄';
      case 'new_similar_project':
        return '🚀';
      case 'freelancer_contacted':
        return '💬';
      case 'application_accepted':
        return '✅';
      case 'application_rejected':
        return '❌';
      case 'project_deadline_approaching':
        return '⏰';
      case 'message_received':
        return '📨';
      case 'system_announcement':
        return '📢';
      default:
        return '🔔';
    }
  };

  // 알림 클릭 처리
  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // 알림 데이터에 따른 페이지 이동
    if (notification.data?.projectId) {
      window.location.href = `/project/${notification.data.projectId}`;
    } else if (notification.data?.freelancerId) {
      window.location.href = `/freelancer/${notification.data.freelancerId}`;
    }
  };

  // 필터 변경 처리
  const handleFilterChange = (tab: 'all' | 'unread' | 'read', type: NotificationType | 'all') => {
    setActiveTab(tab);
    setSelectedType(type);
    fetchNotifications({
      read: tab === 'all' ? undefined : tab === 'read',
      type: type === 'all' ? undefined : type,
      limit: 20,
      offset: 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Bell className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
                알림
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                총 {badge.count}개의 읽지 않은 알림이 있습니다
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={refresh}
                disabled={loading}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                title="새로고침"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              {notifications.some(n => !n.read) && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>모두 읽음</span>
                </button>
              )}
              
              <Link
                href="/notifications/settings"
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="알림 설정"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 필터 탭 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(['all', 'unread', 'read'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleFilterChange(tab, selectedType)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {tab === 'all' && '전체'}
                    {tab === 'unread' && '읽지 않음'}
                    {tab === 'read' && '읽음'}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedType}
                  onChange={(e) => handleFilterChange(activeTab, e.target.value as NotificationType | 'all')}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {notificationTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 알림 목록 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {loading && notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">알림을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={refresh}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                다시 시도
              </button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {activeTab === 'unread' ? '읽지 않은 알림이 없습니다' : '알림이 없습니다'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* 알림 아이콘 */}
                      <div className="flex-shrink-0 text-3xl">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* 알림 내용 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-medium ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                              {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: ko
                              })}
                            </p>
                          </div>

                          {/* 액션 버튼 */}
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                title="읽음 처리"
                              >
                                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 읽지 않음 표시 */}
                    {!notification.read && (
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* 더 보기 버튼 */}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {loading ? '로딩 중...' : '더 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}