'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useNotificationBadge } from '@/hooks/useNotifications';
import { notificationService } from '@/services/notification';
import { AppNotification } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

// 알림 타입별 아이콘 맵 (컴포넌트 외부에 정의)
const NOTIFICATION_ICONS: Record<string, string> = {
  'project_applied': '📝',
  'project_bookmarked': '⭐',
  'project_status_changed': '🔄',
  'new_similar_project': '🚀',
  'freelancer_contacted': '💬',
  'application_accepted': '✅',
  'application_rejected': '❌',
  'project_deadline_approaching': '⏰',
  'message_received': '📨',
  'system_announcement': '📢'
};

interface NotificationBellProps {
  className?: string;
}

const NotificationBell = React.memo(({ className = '' }: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const badge = useNotificationBadge();

  // 알림 목록 로드 (useCallback으로 최적화, loading 의존성 제거)
  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications({ 
        limit: 5, 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      });
      
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []); // 빈 의존성 배열로 함수가 재생성되지 않도록 함

  // 알림 읽음 처리 (useCallback으로 최적화)
  const handleMarkAsRead = useCallback(async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // 모든 알림 읽음 처리 (useCallback으로 최적화)
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  // 알림 삭제 (useCallback으로 최적화)
  const handleDeleteNotification = useCallback(async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, []);

  // 알림 타입별 아이콘 가져오기 (메모이제이션된 함수)
  const getNotificationIcon = useCallback((type: string) => {
    return NOTIFICATION_ICONS[type] || '🔔';
  }, []);

  // 알림 클릭 처리 (useCallback으로 최적화)
  const handleNotificationClick = useCallback(async (notification: AppNotification) => {
    // 읽지 않은 알림이면 읽음 처리
    if (!notification.read) {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }

    // 알림 데이터에 따른 페이지 이동
    if (notification.data?.projectId) {
      window.location.href = `/project/${notification.data.projectId}`;
    } else if (notification.data?.freelancerId) {
      window.location.href = `/freelancer/${notification.data.freelancerId}`;
    }

    setIsOpen(false);
  }, []);

  // 클릭 외부 감지 (최적화: isOpen이 true일 때만 이벤트 리스너 등록)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 드롭다운 열릴 때 알림 로드 (loadNotifications 의존성 제거)
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]); // loadNotifications는 안정적이므로 의존성에서 제외

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 알림 벨 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="알림"
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        
        {/* 알림 배지 */}
        <AnimatePresence>
          {badge.hasUnread && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium"
            >
              {badge.count > 99 ? '99+' : badge.count}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* 알림 드롭다운 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            {/* 드롭다운 헤더 */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  알림
                </h3>
                <div className="flex items-center space-x-2">
                  {notifications.some(n => !n.read) && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center space-x-1"
                      title="모두 읽음"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>모두 읽음</span>
                    </button>
                  )}
                  <Link
                    href="/notifications/settings"
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="알림 설정"
                  >
                    <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </Link>
                </div>
              </div>
            </div>

            {/* 알림 목록 */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    알림을 불러오는 중...
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    새로운 알림이 없습니다
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        {/* 알림 아이콘 */}
                        <div className="flex-shrink-0 text-2xl">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* 알림 내용 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.read 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                {formatDistanceToNow(new Date(notification.createdAt), {
                                  addSuffix: true,
                                  locale: ko
                                })}
                              </p>
                            </div>

                            {/* 액션 버튼 */}
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <button
                                  onClick={(e) => handleMarkAsRead(notification.id, e)}
                                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                  title="읽음 처리"
                                >
                                  <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                </button>
                              )}
                              <button
                                onClick={(e) => handleDeleteNotification(notification.id, e)}
                                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                title="삭제"
                              >
                                <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 읽지 않음 표시 */}
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* 드롭다운 푸터 */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href="/notifications"
                  className="block w-full text-center py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  모든 알림 보기
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

NotificationBell.displayName = 'NotificationBell';

export default NotificationBell;