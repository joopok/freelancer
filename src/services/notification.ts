import { api } from '@/utils/api';
import { 
  NotificationData, 
  NotificationResponse, 
  CreateNotificationRequest, 
  NotificationSettings 
} from '@/types/notification';

export class NotificationService {
  private static instance: NotificationService;
  private eventSource: EventSource | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Fetch notifications with pagination
  async getNotifications(
    page: number = 1,
    limit: number = 20,
    unreadOnly: boolean = false
  ): Promise<NotificationResponse> {
    try {
      const response = await api.get('/notifications', {
        params: {
          page,
          limit,
          unreadOnly,
        },
      });
      
      return {
        notifications: response.data.notifications || [],
        total: response.data.total || 0,
        unreadCount: response.data.unreadCount || 0,
        hasMore: response.data.hasMore || false,
      };
    } catch (error) {
      console.error('🔍 NotificationService - getNotifications 오류:', error);
      // Return empty response for offline mode
      return {
        notifications: [],
        total: 0,
        unreadCount: 0,
        hasMore: false,
      };
    }
  }

  // Get unread count
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.count || 0;
    } catch (error) {
      console.error('🔍 NotificationService - getUnreadCount 오류:', error);
      return 0;
    }
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<boolean> {
    try {
      await api.put(`/notifications/${id}/read`);
      return true;
    } catch (error) {
      console.error('🔍 NotificationService - markAsRead 오류:', error);
      return false;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<boolean> {
    try {
      await api.put('/notifications/mark-all-read');
      return true;
    } catch (error) {
      console.error('🔍 NotificationService - markAllAsRead 오류:', error);
      return false;
    }
  }

  // Delete notification
  async deleteNotification(id: string): Promise<boolean> {
    try {
      await api.delete(`/notifications/${id}`);
      return true;
    } catch (error) {
      console.error('🔍 NotificationService - deleteNotification 오류:', error);
      return false;
    }
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<boolean> {
    try {
      await api.delete('/notifications/clear-all');
      return true;
    } catch (error) {
      console.error('🔍 NotificationService - clearAllNotifications 오류:', error);
      return false;
    }
  }

  // Create notification
  async createNotification(request: CreateNotificationRequest): Promise<NotificationData | null> {
    try {
      const response = await api.post('/notifications', request);
      return response.data;
    } catch (error) {
      console.error('🔍 NotificationService - createNotification 오류:', error);
      return null;
    }
  }

  // Get notification settings
  async getSettings(): Promise<NotificationSettings | null> {
    try {
      const response = await api.get('/notifications/settings');
      return response.data;
    } catch (error) {
      console.error('🔍 NotificationService - getSettings 오류:', error);
      return null;
    }
  }

  // Update notification settings
  async updateSettings(settings: Partial<NotificationSettings>): Promise<boolean> {
    try {
      await api.put('/notifications/settings', settings);
      return true;
    } catch (error) {
      console.error('🔍 NotificationService - updateSettings 오류:', error);
      return false;
    }
  }

  // Request browser notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return 'denied';
  }

  // Show browser notification
  showBrowserNotification(
    title: string,
    options: {
      body?: string;
      icon?: string;
      tag?: string;
      requireInteraction?: boolean;
      actions?: NotificationAction[];
    } = {}
  ): Notification | null {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return null;
    }

    const notification = new Notification(title, {
      body: options.body,
      icon: options.icon || '/icons/notification.png',
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
      badge: '/icons/badge.png',
      ...options,
    });

    // Auto close after 5 seconds unless requireInteraction is true
    if (!options.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    return notification;
  }

  // Start real-time notification stream
  startNotificationStream(onNotification: (notification: NotificationData) => void): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    try {
      this.eventSource = new EventSource('/api/notifications/stream');
      
      this.eventSource.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          onNotification(notification);
        } catch (error) {
          console.error('🔍 NotificationService - 스트림 파싱 오류:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('🔍 NotificationService - 스트림 연결 오류:', error);
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          this.startNotificationStream(onNotification);
        }, 5000);
      };
    } catch (error) {
      console.error('🔍 NotificationService - 스트림 시작 오류:', error);
    }
  }

  // Stop real-time notification stream
  stopNotificationStream(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Subscribe to notification type
  async subscribeToType(type: string): Promise<boolean> {
    try {
      await api.post('/notifications/subscribe', { type });
      return true;
    } catch (error) {
      console.error('🔍 NotificationService - subscribeToType 오류:', error);
      return false;
    }
  }

  // Unsubscribe from notification type
  async unsubscribeFromType(type: string): Promise<boolean> {
    try {
      await api.post('/notifications/unsubscribe', { type });
      return true;
    } catch (error) {
      console.error('🔍 NotificationService - unsubscribeFromType 오류:', error);
      return false;
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Mock data for development
export const mockNotifications: NotificationData[] = [
  {
    id: '1',
    type: 'application_received' as any,
    title: '새로운 지원자가 있어요',
    message: '"React 웹 개발자 모집" 프로젝트에 새로운 지원자가 있습니다.',
    data: { projectId: '1', applicantId: '123' },
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    userId: 'user1',
    priority: 'high' as any,
    actions: [
      { id: '1', label: '지원서 보기', action: 'view_application', url: '/project/1/applications' },
      { id: '2', label: '프로젝트 보기', action: 'view_project', url: '/project/1' }
    ]
  },
  {
    id: '2',
    type: 'project_bookmark' as any,
    title: '프로젝트가 북마크되었어요',
    message: '누군가 당신의 "모바일 앱 개발" 프로젝트를 북마크했습니다.',
    data: { projectId: '2' },
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    userId: 'user1',
    priority: 'medium' as any,
  },
  {
    id: '3',
    type: 'similar_project_available' as any,
    title: '관심있을 만한 프로젝트가 있어요',
    message: '당신의 기술과 매치되는 새로운 프로젝트가 등록되었습니다.',
    data: { projectId: '3' },
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    userId: 'user1',
    priority: 'medium' as any,
    actions: [
      { id: '1', label: '프로젝트 보기', action: 'view_project', url: '/project/3' }
    ]
  }
];

// Export mock service for development
export const mockNotificationService = {
  getNotifications: async (page: number = 1, limit: number = 20, unreadOnly: boolean = false) => {
    console.log('🔍 MockNotificationService - getNotifications 호출');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const filtered = unreadOnly ? mockNotifications.filter(n => !n.isRead) : mockNotifications;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedNotifications = filtered.slice(start, end);
    
    return {
      notifications: paginatedNotifications,
      total: filtered.length,
      unreadCount: mockNotifications.filter(n => !n.isRead).length,
      hasMore: end < filtered.length,
    };
  },
  
  getUnreadCount: async () => {
    console.log('🔍 MockNotificationService - getUnreadCount 호출');
    return mockNotifications.filter(n => !n.isRead).length;
  },
  
  markAsRead: async (id: string) => {
    console.log('🔍 MockNotificationService - markAsRead 호출:', id);
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
    return true;
  },
  
  markAllAsRead: async () => {
    console.log('🔍 MockNotificationService - markAllAsRead 호출');
    mockNotifications.forEach(n => n.isRead = true);
    return true;
  },
  
  deleteNotification: async (id: string) => {
    console.log('🔍 MockNotificationService - deleteNotification 호출:', id);
    const index = mockNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
    return true;
  },
};