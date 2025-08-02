import { 
  AppNotification, 
  NotificationType, 
  NotificationSettings, 
  NotificationSubscription,
  NotificationResponse,
  NotificationCreateRequest,
  NotificationFilter,
  NotificationBadge
} from '@/types/notification';
import api from '@/utils/api';

class NotificationService {
  private storageKey = 'local_notifications';
  private settingsKey = 'notification_settings';
  private subscriptionKey = 'notification_subscription';

  // 로컬 스토리지에서 알림 목록 가져오기
  private getLocalNotifications(): AppNotification[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get local notifications:', error);
      return [];
    }
  }

  // 로컬 스토리지에 알림 저장
  private saveLocalNotifications(notifications: AppNotification[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save local notifications:', error);
    }
  }

  // 알림 목록 조회
  async getNotifications(filter: NotificationFilter = {}): Promise<NotificationResponse> {
    try {
      // 개발 환경에서는 Mock 데이터 사용
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        return this.getMockNotifications(filter);
      }

      const response = await api.get('/notifications', { params: filter });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return { success: false, error: 'Failed to fetch notifications' };
    }
  }

  // Mock 알림 데이터 생성
  private getMockNotifications(filter: NotificationFilter): NotificationResponse {
    const mockNotifications: AppNotification[] = [
      {
        id: '1',
        userId: 'user1',
        type: 'project_applied',
        title: '프로젝트 지원 완료',
        message: 'React 웹 개발 프로젝트에 지원하셨습니다.',
        data: { projectId: 'proj1', projectTitle: 'React 웹 개발' },
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: '2',
        userId: 'user1',
        type: 'new_similar_project',
        title: '유사한 프로젝트 등록',
        message: '관심 있어하실 만한 새로운 프로젝트가 등록되었습니다.',
        data: { projectId: 'proj2', projectTitle: 'Vue.js 프로젝트' },
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: '3',
        userId: 'user1',
        type: 'application_accepted',
        title: '지원 승인',
        message: '모바일 앱 개발 프로젝트에 선정되셨습니다!',
        data: { projectId: 'proj3', projectTitle: '모바일 앱 개발' },
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
      },
      {
        id: '4',
        userId: 'user1',
        type: 'freelancer_contacted',
        title: '프리랜서 연락',
        message: '김개발 프리랜서가 연락을 요청했습니다.',
        data: { freelancerId: 'freelancer1', freelancerName: '김개발' },
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
      },
      {
        id: '5',
        userId: 'user1',
        type: 'project_deadline_approaching',
        title: '마감일 임박',
        message: '블록체인 개발 프로젝트 마감까지 2일 남았습니다.',
        data: { projectId: 'proj4', projectTitle: '블록체인 개발', daysLeft: 2 },
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
      }
    ];

    let filteredNotifications = mockNotifications;

    // 필터 적용
    if (filter.type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === filter.type);
    }
    if (filter.read !== undefined) {
      filteredNotifications = filteredNotifications.filter(n => n.read === filter.read);
    }

    // 정렬
    filteredNotifications.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return filter.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    // 페이지네이션
    const offset = filter.offset || 0;
    const limit = filter.limit || 10;
    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit);

    const unreadCount = mockNotifications.filter(n => !n.read).length;

    return {
      success: true,
      data: paginatedNotifications,
      total: filteredNotifications.length,
      unreadCount
    };
  }

  // 알림 읽음 처리
  async markAsRead(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        return { success: true };
      }

      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return { success: false, error: 'Failed to mark notification as read' };
    }
  }

  // 모든 알림 읽음 처리
  async markAllAsRead(): Promise<{ success: boolean; error?: string }> {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        return { success: true };
      }

      const response = await api.patch('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return { success: false, error: 'Failed to mark all notifications as read' };
    }
  }

  // 알림 삭제
  async deleteNotification(notificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        return { success: true };
      }

      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return { success: false, error: 'Failed to delete notification' };
    }
  }

  // 알림 생성
  async createNotification(notification: NotificationCreateRequest): Promise<{ success: boolean; error?: string }> {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        // Mock 환경에서는 로컬 스토리지에 저장
        const notifications = this.getLocalNotifications();
        const newNotification: AppNotification = {
          id: Date.now().toString(),
          ...notification,
          read: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        notifications.unshift(newNotification);
        this.saveLocalNotifications(notifications);
        return { success: true };
      }

      const response = await api.post('/notifications', notification);
      return response.data;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return { success: false, error: 'Failed to create notification' };
    }
  }

  // 알림 설정 조회
  async getNotificationSettings(): Promise<NotificationSettings | null> {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        const stored = localStorage.getItem(this.settingsKey);
        return stored ? JSON.parse(stored) : this.getDefaultSettings();
      }

      const response = await api.get('/notifications/settings');
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      return this.getDefaultSettings();
    }
  }

  // 기본 알림 설정
  private getDefaultSettings(): NotificationSettings {
    return {
      userId: 'user1',
      emailNotifications: true,
      pushNotifications: true,
      browserNotifications: true,
      types: {
        project_applied: true,
        project_bookmarked: true,
        project_status_changed: true,
        new_similar_project: true,
        freelancer_contacted: true,
        freelancer_bookmarked: true,
        project_deadline_approaching: true,
        application_accepted: true,
        application_rejected: true,
        message_received: true,
        system_announcement: true
      },
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      }
    };
  }

  // 알림 설정 업데이트
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<{ success: boolean; error?: string }> {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
        const currentSettings = await this.getNotificationSettings();
        const updatedSettings = { ...currentSettings, ...settings };
        localStorage.setItem(this.settingsKey, JSON.stringify(updatedSettings));
        return { success: true };
      }

      const response = await api.patch('/notifications/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      return { success: false, error: 'Failed to update notification settings' };
    }
  }

  // 브라우저 알림 권한 요청
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  // 브라우저 알림 전송
  async sendBrowserNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        ...options
      });

      // 알림 클릭 시 창 포커스
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // 5초 후 자동 닫기
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }

  // 알림 배지 정보 조회
  async getNotificationBadge(): Promise<NotificationBadge> {
    try {
      const response = await this.getNotifications({ limit: 1 });
      return {
        count: response.unreadCount || 0,
        hasUnread: (response.unreadCount || 0) > 0
      };
    } catch (error) {
      console.error('Failed to get notification badge:', error);
      return { count: 0, hasUnread: false };
    }
  }

  // 알림 타입별 메시지 템플릿
  getNotificationTemplate(type: NotificationType, data: any): { title: string; message: string } {
    const templates = {
      project_applied: {
        title: '프로젝트 지원 완료',
        message: `${data.projectTitle} 프로젝트에 지원하셨습니다.`
      },
      project_bookmarked: {
        title: '프로젝트 북마크',
        message: `${data.projectTitle} 프로젝트를 북마크했습니다.`
      },
      project_status_changed: {
        title: '프로젝트 상태 변경',
        message: `${data.projectTitle} 프로젝트의 상태가 ${data.status}로 변경되었습니다.`
      },
      new_similar_project: {
        title: '유사한 프로젝트 등록',
        message: '관심 있어하실 만한 새로운 프로젝트가 등록되었습니다.'
      },
      freelancer_contacted: {
        title: '프리랜서 연락',
        message: `${data.freelancerName} 프리랜서가 연락을 요청했습니다.`
      },
      freelancer_bookmarked: {
        title: '프리랜서 북마크',
        message: `${data.freelancerName} 프리랜서를 북마크했습니다.`
      },
      project_deadline_approaching: {
        title: '마감일 임박',
        message: `${data.projectTitle} 프로젝트 마감까지 ${data.daysLeft}일 남았습니다.`
      },
      application_accepted: {
        title: '지원 승인',
        message: `${data.projectTitle} 프로젝트에 선정되셨습니다!`
      },
      application_rejected: {
        title: '지원 거절',
        message: `${data.projectTitle} 프로젝트 지원이 거절되었습니다.`
      },
      message_received: {
        title: '새 메시지',
        message: `${data.senderName}님으로부터 새 메시지가 도착했습니다.`
      },
      system_announcement: {
        title: '시스템 공지',
        message: data.message || '새로운 공지사항이 있습니다.'
      }
    };

    return templates[type] || { title: '알림', message: '새로운 알림이 있습니다.' };
  }

  // 조용한 시간 확인
  private isQuietHours(settings: NotificationSettings): boolean {
    if (!settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const start = settings.quietHours.start;
    const end = settings.quietHours.end;
    
    if (start <= end) {
      return currentTime >= start && currentTime <= end;
    } else {
      return currentTime >= start || currentTime <= end;
    }
  }

  // 알림 전송 (설정 고려)
  async sendNotification(type: NotificationType, data: any, userId?: string): Promise<void> {
    const settings = await this.getNotificationSettings();
    if (!settings) return;

    // 해당 타입의 알림이 비활성화되어 있는지 확인
    if (!settings.types[type]) return;

    // 조용한 시간인지 확인
    if (this.isQuietHours(settings)) return;

    const template = this.getNotificationTemplate(type, data);
    
    // 데이터베이스에 알림 저장
    await this.createNotification({
      userId: userId || 'user1',
      type,
      title: template.title,
      message: template.message,
      data
    });

    // 브라우저 알림 전송
    if (settings.browserNotifications && Notification.permission === 'granted') {
      await this.sendBrowserNotification(template.title, {
        body: template.message,
        data: data
      });
    }
  }
}

export const notificationService = new NotificationService();