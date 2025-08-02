import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  AppNotification, 
  NotificationFilter, 
  NotificationBadge, 
  NotificationSettings,
  NotificationType 
} from '@/types/notification';
import { notificationService } from '@/services/notification';

export interface UseNotificationsReturn {
  notifications: AppNotification[];
  loading: boolean;
  error: string | null;
  badge: NotificationBadge;
  settings: NotificationSettings | null;
  hasMore: boolean;
  fetchNotifications: (filter?: NotificationFilter) => Promise<void>;
  loadMore: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refresh: () => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  sendTestNotification: (type: NotificationType, data: any) => Promise<void>;
}

export function useNotifications(initialFilter: NotificationFilter = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [badge, setBadge] = useState<NotificationBadge>({ count: 0, hasUnread: false });
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<NotificationFilter>(initialFilter);
  const [total, setTotal] = useState(0);
  
  // Ref to track if component is mounted
  const isMounted = useRef(true);
  
  // Memoize filter to prevent object recreation
  const stableFilter = useMemo(() => initialFilter, [
    initialFilter.type,
    initialFilter.read,
    initialFilter.limit,
    initialFilter.offset,
    initialFilter.sortBy,
    initialFilter.sortOrder
  ]);

  // 알림 목록 조회 (최적화: isMounted 체크 추가)
  const fetchNotifications = useCallback(async (filter?: NotificationFilter) => {
    if (!isMounted.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const filterToUse = filter || stableFilter;
      const response = await notificationService.getNotifications(filterToUse);
      
      if (!isMounted.current) return;
      
      if (response.success && response.data) {
        setNotifications(response.data);
        setTotal(response.total || 0);
        setHasMore((response.data.length + (filterToUse.offset || 0)) < (response.total || 0));
        
        // 배지 정보 업데이트
        setBadge({
          count: response.unreadCount || 0,
          hasUnread: (response.unreadCount || 0) > 0
        });
      } else {
        setError(response.error || '알림을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      if (isMounted.current) {
        setError('알림을 불러오는데 실패했습니다.');
        console.error('Failed to fetch notifications:', err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [stableFilter]);

  // 더 많은 알림 로드
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
      
      const newFilter = {
        ...currentFilter,
        offset: notifications.length,
        limit: currentFilter.limit || 10
      };
      
      const response = await notificationService.getNotifications(newFilter);
      
      if (response.success && response.data) {
        setNotifications(prev => [...prev, ...response.data!]);
        setHasMore((notifications.length + response.data.length) < (response.total || 0));
      }
    } catch (err) {
      setError('더 많은 알림을 불러오는데 실패했습니다.');
      console.error('Failed to load more notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [notifications.length, currentFilter, hasMore, loading]);

  // 알림 읽음 처리
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
        
        // 배지 업데이트
        setBadge(prev => ({
          count: Math.max(0, prev.count - 1),
          hasUnread: prev.count > 1
        }));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  // 모든 알림 읽음 처리
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationService.markAllAsRead();
      
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
        
        setBadge({ count: 0, hasUnread: false });
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  // 알림 삭제
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      
      if (response.success) {
        const notification = notifications.find(n => n.id === notificationId);
        
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        // 읽지 않은 알림이었다면 배지 업데이트
        if (notification && !notification.read) {
          setBadge(prev => ({
            count: Math.max(0, prev.count - 1),
            hasUnread: prev.count > 1
          }));
        }
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  }, [notifications]);

  // 알림 목록 새로고침
  const refresh = useCallback(async () => {
    setCurrentFilter(prev => ({ ...prev, offset: 0 }));
    await fetchNotifications({ ...currentFilter, offset: 0 });
  }, [currentFilter, fetchNotifications]);

  // 알림 설정 업데이트
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      const response = await notificationService.updateNotificationSettings(newSettings);
      
      if (response.success) {
        setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      }
    } catch (err) {
      console.error('Failed to update notification settings:', err);
    }
  }, []);

  // 브라우저 알림 권한 요청
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    const permission = await notificationService.requestNotificationPermission();
    
    // 권한이 허용되면 설정 업데이트
    if (permission === 'granted' && settings) {
      await updateSettings({ browserNotifications: true });
    }
    
    return permission;
  }, [settings, updateSettings]);

  // 테스트 알림 전송
  const sendTestNotification = useCallback(async (type: NotificationType, data: any) => {
    try {
      await notificationService.sendNotification(type, data);
      
      // 알림 목록 새로고침
      await refresh();
    } catch (err) {
      console.error('Failed to send test notification:', err);
    }
  }, [refresh]);

  // 알림 설정 로드
  const loadSettings = useCallback(async () => {
    try {
      const settingsData = await notificationService.getNotificationSettings();
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load notification settings:', err);
    }
  }, []);

  // 배지 정보 업데이트 (최적화: 의존성 없음, isMounted 체크)
  const updateBadge = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      const badgeData = await notificationService.getNotificationBadge();
      if (isMounted.current) {
        setBadge(badgeData);
      }
    } catch (err) {
      console.error('Failed to update badge:', err);
    }
  }, []);

  // 초기 데이터 로드 및 cleanup
  useEffect(() => {
    fetchNotifications();
    loadSettings();
    
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array is intentional

  // 주기적으로 배지 업데이트 (1분마다)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMounted.current) {
        updateBadge();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent interval reset

  // 필터 변경 시 알림 재로드 (최적화된 비교)
  useEffect(() => {
    const hasFilterChanged = JSON.stringify(stableFilter) !== JSON.stringify(currentFilter);
    
    if (hasFilterChanged && isMounted.current) {
      setCurrentFilter(stableFilter);
      fetchNotifications(stableFilter);
    }
  }, [stableFilter, currentFilter, fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    badge,
    settings,
    hasMore,
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
    requestPermission,
    updateSettings,
    sendTestNotification
  };
}

// 알림 배지만 사용하는 경우를 위한 간단한 훅
export function useNotificationBadge(): NotificationBadge {
  const [badge, setBadge] = useState<NotificationBadge>({ count: 0, hasUnread: false });

  useEffect(() => {
    const updateBadge = async () => {
      try {
        const badgeData = await notificationService.getNotificationBadge();
        setBadge(badgeData);
      } catch (err) {
        console.error('Failed to update badge:', err);
      }
    };

    updateBadge();
    
    // 30초마다 배지 업데이트
    const interval = setInterval(updateBadge, 30000);
    return () => clearInterval(interval);
  }, []);

  return badge;
}