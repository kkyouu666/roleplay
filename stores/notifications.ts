import { format, isToday, isYesterday } from 'date-fns';
import { defineStore } from 'pinia';

// Define notification types
export type NotificationType = 'like' | 'favorite' | 'comment' | 'reply';

// Interface for a notification
export interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  data: {
    userId: string;
    username: string;
    userAvatar?: string;
    characterId?: string;
    characterName?: string;
    commentId?: string;
    commentText?: string;
    replyId?: string;
  }
}

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    unreadCount: 0,
    isLoading: false,
    page: 1,
    pageSize: 10,
    hasMore: true,
    showNotificationsPanel: false,
    notificationSettings: {
      likeNotifications: true,
      favoriteNotifications: true,
      commentNotifications: true,
      replyNotifications: true,
      emailNotifications: true,
      pushNotifications: true
    }
  }),

  getters: {
    hasUnreadNotifications: (state) => state.unreadCount > 0
  },

  actions: {
    // Toggle notifications panel
    toggleNotificationsPanel() {
      this.showNotificationsPanel = !this.showNotificationsPanel;
      if (this.showNotificationsPanel) {
        this.loadNotifications();
      }
    },

    // Close notifications panel
    closeNotificationsPanel() {
      this.showNotificationsPanel = false;
    },

    // Load notifications from API
    async loadNotifications(reset: boolean = false) {
      if (this.isLoading || (!this.hasMore && !reset)) return;

      if (reset) {
        this.page = 1;
        this.hasMore = true;
        this.notifications = [];
      }

      this.isLoading = true;
      try {
        const api = useApi();
        const response = await api.getNotifications({
          page: this.page,
          pageSize: this.pageSize,
          filter: 'all'
        });

        if (this.page === 1) {
          this.notifications = response.notifications;
        } else {
          this.notifications = [...this.notifications, ...response.notifications];
        }

        this.hasMore = response.pagination.hasMore;
        this.page++;
        this.countUnread();
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        this.isLoading = false;
      }
    },

    // Load more notifications
    async loadMoreNotifications() {
      if (!this.hasMore || this.isLoading) return;
      await this.loadNotifications();
    },

    // Add a new notification (for real-time notifications)
    addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
      const id = `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: new Date().toISOString(),
        read: false
      };

      this.notifications.unshift(newNotification);
      this.unreadCount++;

      // In a real app, we would also trigger a browser notification or email
      // based on the user's notification settings
      this.triggerBrowserNotification(newNotification);
    },

    // Like notification
    addLikeNotification(userId: string, username: string, userAvatar: string, characterId: string, characterName: string) {
      if (!this.notificationSettings.likeNotifications) return;

      this.addNotification({
        type: 'like',
        data: {
          userId,
          username,
          userAvatar,
          characterId,
          characterName
        }
      });
    },

    // Favorite notification
    addFavoriteNotification(userId: string, username: string, userAvatar: string, characterId: string, characterName: string) {
      if (!this.notificationSettings.favoriteNotifications) return;

      this.addNotification({
        type: 'favorite',
        data: {
          userId,
          username,
          userAvatar,
          characterId,
          characterName
        }
      });
    },

    // Comment notification
    addCommentNotification(userId: string, username: string, userAvatar: string, characterId: string, characterName: string, commentId: string, commentText: string) {
      if (!this.notificationSettings.commentNotifications) return;

      this.addNotification({
        type: 'comment',
        data: {
          userId,
          username,
          userAvatar,
          characterId,
          characterName,
          commentId,
          commentText
        }
      });
    },

    // Reply notification
    addReplyNotification(userId: string, username: string, userAvatar: string, characterId: string, characterName: string, commentId: string, commentText: string, replyId: string) {
      if (!this.notificationSettings.replyNotifications) return;

      this.addNotification({
        type: 'reply',
        data: {
          userId,
          username,
          userAvatar,
          characterId,
          characterName,
          commentId,
          commentText,
          replyId
        }
      });
    },

    // Trigger browser notification if enabled
    triggerBrowserNotification(notification: Notification) {
      if (!process.client || !this.notificationSettings.pushNotifications) return;

      if (Notification && Notification.permission === "granted") {
        let title = '';
        let body = '';

        const { username, characterName } = notification.data;

        // Set title and body based on notification type
        switch (notification.type) {
          case 'like':
            title = 'New Like';
            body = `${username} liked your character ${characterName}`;
            break;
          case 'favorite':
            title = 'New Favorite';
            body = `${username} added your character ${characterName} to favorites`;
            break;
          case 'comment':
            title = 'New Comment';
            body = `${username} commented on your character ${characterName}`;
            break;
          case 'reply':
            title = 'New Reply';
            body = `${username} replied to your comment on ${characterName}`;
            break;
        }

        const options = {
          body,
          icon: notification.data.userAvatar || '/favicon.ico'
        };

        try {
          new Notification(title, options);
        } catch (error) {
          console.error('Error creating notification:', error);
        }
      }
    },

    // Request notification permission
    requestNotificationPermission() {
      if (!process.client) return;

      if (Notification) {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            console.log("Notification permission granted");
          }
        });
      }
    },

    // Count unread notifications
    countUnread() {
      this.unreadCount = this.notifications.filter(notification => !notification.read).length;
    },

    // Mark all notifications as read
    async markAllAsRead() {
      try {
        const api = useApi();
        await api.markAllNotificationsAsRead();

        // Update local state
        this.notifications.forEach(notification => {
          notification.read = true;
        });
        this.unreadCount = 0;
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    },

    // Mark a single notification as read
    async markAsRead(id: string) {
      try {
        const api = useApi();
        await api.markNotificationAsRead(id);

        // Update local state
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
          notification.read = true;
          this.unreadCount--;
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    },

    // Delete a notification
    async deleteNotification(id: string) {
      try {
        const api = useApi();
        await api.deleteNotification(id);

        // Update local state
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
          const notification = this.notifications[index];
          if (!notification.read) {
            this.unreadCount--;
          }
          this.notifications.splice(index, 1);
        }
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    },

    // Delete all notifications
    async deleteAllNotifications() {
      try {
        const api = useApi();
        await api.deleteAllNotifications();

        // Update local state
        this.notifications = [];
        this.unreadCount = 0;
        this.page = 1;
        this.hasMore = true;
      } catch (error) {
        console.error('Failed to delete all notifications:', error);
      }
    },

    // Format timestamp
    formatTimestamp(timestamp: string) {
      const date = new Date(timestamp);

      if (isToday(date)) {
        return format(date, 'HH:mm');
      } else if (isYesterday(date)) {
        return '昨天 ' + format(date, 'HH:mm');
      } else {
        return format(date, 'MM-dd HH:mm');
      }
    },

    // Update notification settings
    updateNotificationSettings(settings: Partial<typeof this.notificationSettings>) {
      this.notificationSettings = {
        ...this.notificationSettings,
        ...settings
      };

      // In a real app, we would save these settings to the server
    }
  }
});