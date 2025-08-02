// 알림 시스템 타입 정의
export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'project_applied'
  | 'project_bookmarked'
  | 'project_status_changed'
  | 'new_similar_project'
  | 'freelancer_contacted'
  | 'freelancer_bookmarked'
  | 'project_deadline_approaching'
  | 'application_accepted'
  | 'application_rejected'
  | 'message_received'
  | 'system_announcement';

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  browserNotifications: boolean;
  types: Record<NotificationType, boolean>;
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "08:00"
  };
}

export interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationResponse {
  success: boolean;
  data?: AppNotification[];
  error?: string;
  total?: number;
  unreadCount?: number;
}

export interface NotificationCreateRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

export interface NotificationFilter {
  type?: NotificationType;
  read?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface NotificationBadge {
  count: number;
  hasUnread: boolean;
}