import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NotificationData, NotificationSettings, NotificationType, NotificationPermission } from '@/types/notification';

interface NotificationState {
  notifications: NotificationData[];
  unreadCount: number;
  settings: NotificationSettings | null;
  permission: NotificationPermission;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addNotification: (notification: NotificationData) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  setNotifications: (notifications: NotificationData[]) => void;
  setUnreadCount: (count: number) => void;
  setSettings: (settings: NotificationSettings) => void;
  setPermission: (permission: NotificationPermission) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utility functions
  getNotificationsByType: (type: NotificationType) => NotificationData[];
  getUnreadNotifications: () => NotificationData[];
  isNotificationEnabled: (type: NotificationType) => boolean;
  isInQuietHours: () => boolean;
}

const defaultSettings: NotificationSettings = {
  userId: '',
  browserNotifications: true,
  inAppNotifications: true,
  emailNotifications: false,
  types: {
    [NotificationType.APPLICATION_RECEIVED]: true,
    [NotificationType.APPLICATION_ACCEPTED]: true,
    [NotificationType.APPLICATION_REJECTED]: true,
    [NotificationType.PROJECT_BOOKMARK]: true,
    [NotificationType.PROJECT_STATUS_CHANGE]: true,
    [NotificationType.SIMILAR_PROJECT_AVAILABLE]: true,
    [NotificationType.FREELANCER_BOOKMARK]: true,
    [NotificationType.PROJECT_DEADLINE_REMINDER]: true,
    [NotificationType.SYSTEM_ANNOUNCEMENT]: true,
    [NotificationType.PROFILE_UPDATE]: false,
    [NotificationType.PAYMENT_RECEIVED]: true,
    [NotificationType.REVIEW_REQUEST]: true,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      settings: null,
      permission: {
        granted: false,
        requested: false,
        denied: false,
      },
      isLoading: false,
      error: null,

      addNotification: (notification: NotificationData) => {
        set((state) => {
          const existingIndex = state.notifications.findIndex(n => n.id === notification.id);
          if (existingIndex !== -1) {
            // Update existing notification
            const updatedNotifications = [...state.notifications];
            updatedNotifications[existingIndex] = notification;
            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter(n => !n.isRead).length,
            };
          } else {
            // Add new notification
            const newNotifications = [notification, ...state.notifications];
            return {
              notifications: newNotifications,
              unreadCount: newNotifications.filter(n => !n.isRead).length,
            };
          }
        });
      },

      markAsRead: (id: string) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
          );
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter(n => !n.isRead).length,
          };
        });
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
      },

      deleteNotification: (id: string) => {
        set((state) => {
          const updatedNotifications = state.notifications.filter(n => n.id !== id);
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter(n => !n.isRead).length,
          };
        });
      },

      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      setNotifications: (notifications: NotificationData[]) => {
        set({
          notifications,
          unreadCount: notifications.filter(n => !n.isRead).length,
        });
      },

      setUnreadCount: (count: number) => {
        set({ unreadCount: count });
      },

      setSettings: (settings: NotificationSettings) => {
        set({ settings });
      },

      setPermission: (permission: NotificationPermission) => {
        set({ permission });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      getNotificationsByType: (type: NotificationType) => {
        const { notifications } = get();
        return notifications.filter(n => n.type === type);
      },

      getUnreadNotifications: () => {
        const { notifications } = get();
        return notifications.filter(n => !n.isRead);
      },

      isNotificationEnabled: (type: NotificationType) => {
        const { settings } = get();
        if (!settings) return true;
        return settings.types[type] ?? true;
      },

      isInQuietHours: () => {
        const { settings } = get();
        if (!settings?.quietHours.enabled) return false;

        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const { start, end } = settings.quietHours;
        
        // Handle cases where quiet hours span midnight
        if (start > end) {
          return currentTime >= start || currentTime <= end;
        } else {
          return currentTime >= start && currentTime <= end;
        }
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        settings: state.settings,
        permission: state.permission,
      }),
    }
  )
);

// Initialize default settings
export const initializeNotificationSettings = (userId: string) => {
  const { setSettings } = useNotificationStore.getState();
  setSettings({ ...defaultSettings, userId });
};