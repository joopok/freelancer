export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
  userId: string;
  priority: NotificationPriority;
  actions?: NotificationAction[];
}

export enum NotificationType {
  APPLICATION_RECEIVED = 'application_received',
  APPLICATION_ACCEPTED = 'application_accepted',
  APPLICATION_REJECTED = 'application_rejected',
  PROJECT_BOOKMARK = 'project_bookmark',
  PROJECT_STATUS_CHANGE = 'project_status_change',
  SIMILAR_PROJECT_AVAILABLE = 'similar_project_available',
  FREELANCER_BOOKMARK = 'freelancer_bookmark',
  PROJECT_DEADLINE_REMINDER = 'project_deadline_reminder',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
  PROFILE_UPDATE = 'profile_update',
  PAYMENT_RECEIVED = 'payment_received',
  REVIEW_REQUEST = 'review_request'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface NotificationAction {
  id: string;
  label: string;
  action: string;
  url?: string;
  style?: 'primary' | 'secondary' | 'success' | 'danger';
}

export interface NotificationSettings {
  userId: string;
  browserNotifications: boolean;
  inAppNotifications: boolean;
  emailNotifications: boolean;
  types: {
    [key in NotificationType]: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

export interface CreateNotificationRequest {
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  priority?: NotificationPriority;
  data?: any;
  actions?: NotificationAction[];
}

export interface NotificationResponse {
  notifications: NotificationData[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

export interface NotificationPermission {
  granted: boolean;
  requested: boolean;
  denied: boolean;
}