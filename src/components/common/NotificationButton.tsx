'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, Settings, Trash2, Eye, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/store/notification';
import { useAuthStore } from '@/store/auth';
import { NotificationData, NotificationType } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NotificationButtonProps {
  className?: string;
}

export default function NotificationButton({ className = '' }: NotificationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    setNotifications,
    setUnreadCount,
    isLoading,
    error
  } = useNotificationStore();

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 알림 가져오기
  useEffect(() => {
    if (isLoggedIn && user) {
      loadNotifications();
    }
  }, [isLoggedIn, user]);

  const loadNotifications = async () => {
    if (!isLoggedIn) return;
    
    setLoading(true);
    try {
      // Mock 데이터 사용
      const mockNotifications: NotificationData[] = [
        {
          id: '1',
          type: NotificationType.APPLICATION_RECEIVED,
          title: '새로운 지원자가 있어요',
          message: '"React 웹 개발자 모집" 프로젝트에 새로운 지원자가 있습니다.',
          data: { projectId: '1', applicantId: '123' },
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
          userId: user?.id || 'user1',
          priority: 'high' as any,
          actions: [
            { id: '1', label: '지원서 보기', action: 'view_application', url: '/project/1/applications' },
            { id: '2', label: '프로젝트 보기', action: 'view_project', url: '/project/1' }
          ]
        },
        {
          id: '2',
          type: NotificationType.PROJECT_BOOKMARK,
          title: '프로젝트가 북마크되었어요',
          message: '누군가 당신의 "모바일 앱 개발" 프로젝트를 북마크했습니다.',
          data: { projectId: '2' },
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
          userId: user?.id || 'user1',
          priority: 'medium' as any,
        },
        {
          id: '3',
          type: NotificationType.SIMILAR_PROJECT_AVAILABLE,
          title: '관심있을 만한 프로젝트가 있어요',
          message: '당신의 기술과 매치되는 새로운 프로젝트가 등록되었습니다.',
          data: { projectId: '3' },
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
          userId: user?.id || 'user1',
          priority: 'medium' as any,
          actions: [
            { id: '1', label: '프로젝트 보기', action: 'view_project', url: '/project/3' }
          ]
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('알림 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      // 실제 API 호출은 여기에 구현
      console.log('알림 읽음 처리:', id);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // 실제 API 호출은 여기에 구현
      console.log('모든 알림 읽음 처리');
    } catch (error) {
      console.error('모든 알림 읽음 처리 실패:', error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      // 실제 API 호출은 여기에 구현
      console.log('알림 삭제:', id);
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  const handleNotificationClick = (notification: NotificationData) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    // 액션이 있는 경우 첫 번째 액션의 URL로 이동
    if (notification.actions && notification.actions.length > 0) {
      const firstAction = notification.actions[0];
      if (firstAction.url) {
        router.push(firstAction.url);
        setIsOpen(false);
      }
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.APPLICATION_RECEIVED:
        return '👥';
      case NotificationType.PROJECT_BOOKMARK:
        return '🔖';
      case NotificationType.SIMILAR_PROJECT_AVAILABLE:
        return '💡';
      case NotificationType.APPLICATION_ACCEPTED:
        return '✅';
      case NotificationType.APPLICATION_REJECTED:
        return '❌';
      case NotificationType.PROJECT_STATUS_CHANGE:
        return '📋';
      case NotificationType.SYSTEM_ANNOUNCEMENT:
        return '📢';
      default:
        return '🔔';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200"
        aria-label="알림"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* 헤더 */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  알림
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      모두 읽음
                    </button>
                  )}
                  <Link
                    href="/notifications"
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    전체보기
                  </Link>
                </div>
              </div>
            </div>

            {/* 알림 목록 */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  알림을 불러오는 중...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>새로운 알림이 없습니다</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.slice(0, 10).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="text-xl">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: ko })}
                            </span>
                            <div className="flex items-center space-x-1">
                              <div className={`w-1 h-1 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification.id);
                                }}
                                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 푸터 */}
            {notifications.length > 10 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Link
                  href="/notifications"
                  className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  더 많은 알림 보기
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}