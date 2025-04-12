<template>
  <div class="container py-6">
    <div v-if="!authStore?.isAuthenticated" class="text-center py-12">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto">
        <Icon name="heroicons:bell-slash" class="w-16 h-16 mx-auto text-indigo-500 mb-4" />
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('auth.loginRequired') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('auth.loginToAccess') }}</p>
        <div class="flex justify-center">
          <button 
            class="btn btn-primary"
            @click="openAuthModal"
          >
            {{ $t('auth.login') }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-else>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ $t('navigation.notifications') }}</h1>
          <div class="flex space-x-3">
            <button 
              v-if="notificationStore.hasUnreadNotifications"
              class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              @click="notificationStore.markAllAsRead()"
            >
              {{ $t('notifications.markAllRead') }}
            </button>
            <button
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              @click="toggleDeleteConfirm"
              :disabled="notificationStore.notifications.length === 0"
            >
              {{ $t('notifications.deleteAll') }}
            </button>
          </div>
        </div>
        
        <!-- Notification filters -->
        <div class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <!-- Filter buttons in scrollable container -->
          <div class="flex-1 overflow-x-auto hide-scrollbar pr-2">
            <div class="flex gap-2 min-w-max">
              <button
                @click="currentFilter = 'all'"
                class="px-3 py-1 text-sm rounded-full whitespace-nowrap"
                :class="currentFilter === 'all' 
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'"
              >
                {{ $t('common.all') }}
              </button>
              <button
                @click="currentFilter = 'like'"
                class="px-3 py-1 text-sm rounded-full whitespace-nowrap"
                :class="currentFilter === 'like' 
                  ? 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 font-medium' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'"
              >
                {{ $t('notifications.likes') }}
              </button>
              <button
                @click="currentFilter = 'favorite'"
                class="px-3 py-1 text-sm rounded-full whitespace-nowrap"
                :class="currentFilter === 'favorite' 
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 font-medium' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'"
              >
                {{ $t('notifications.favorites') }}
              </button>
              <button
                @click="currentFilter = 'comment'"
                class="px-3 py-1 text-sm rounded-full whitespace-nowrap"
                :class="currentFilter === 'comment' 
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'"
              >
                {{ $t('notifications.comments') }}
              </button>
              <button
                @click="currentFilter = 'reply'"
                class="px-3 py-1 text-sm rounded-full whitespace-nowrap"
                :class="currentFilter === 'reply' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'"
              >
                {{ $t('notifications.replies') }}
              </button>
            </div>
          </div>
          
          <!-- Unread only toggle, separate and fixed -->
          <button
            @click="showOnlyUnread = !showOnlyUnread"
            class="px-3 py-1 text-sm rounded-full whitespace-nowrap ml-2 flex-shrink-0"
            :class="showOnlyUnread 
              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'"
          >
            {{ $t('notifications.unreadOnly') }}
          </button>
        </div>
        
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <!-- Loading state -->
          <div v-if="notificationStore.isLoading" class="py-16 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p class="mt-4 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
          </div>
          
          <!-- Empty state -->
          <div v-else-if="filteredNotifications.length === 0" class="py-16 text-center">
            <Icon name="heroicons:bell-slash" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400 mb-2">{{ $t('notifications.empty') }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('notifications.emptyMessage') }}</p>
          </div>
          
          <!-- Notification list -->
          <div 
            v-else
            v-for="notification in filteredNotifications" 
            :key="notification.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-indigo-50 dark:bg-indigo-900/20': !notification.read }"
          >
            <div class="flex items-start">
              <!-- Avatar -->
              <div class="mr-4">
                <img 
                  :src="notification.data.userAvatar || '/images/avatars/default.jpg'" 
                  :alt="notification.data.username" 
                  class="w-12 h-12 rounded-full object-cover"
                />
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-md text-gray-900 dark:text-gray-100">
                      <span class="font-medium">{{ notification.data.username }}</span>
                      <span>
                        {{ getNotificationText(notification) }}
                        <span class="font-medium" v-if="notification.data.characterName">
                          {{ notification.data.characterName }}
                        </span>
                      </span>
                    </p>
                    
                    <p v-if="notification.data.commentText" class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      "{{ notification.data.commentText }}"
                    </p>
                    
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {{ notificationStore.formatTimestamp(notification.timestamp) }}
                    </p>
                  </div>
                  
                  <div class="flex space-x-2">
                    <button
                      @click="notificationStore.deleteNotification(notification.id)"
                      class="text-sm text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      title="Delete notification"
                    >
                      <Icon name="heroicons:trash" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <!-- Action buttons -->
                <div class="mt-3 flex flex-wrap gap-2 items-center justify-between">
                  <div class="flex overflow-x-auto hide-scrollbar max-w-[75%]">
                    <div class="flex gap-2 min-w-max">
                      <button 
                        class="px-3 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 whitespace-nowrap"
                        @click="viewCharacter(notification)"
                      >
                        {{ $t('notifications.viewCharacter') }}
                      </button>
                      
                      <button 
                        v-if="notification.type === 'comment' || notification.type === 'reply'"
                        class="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 whitespace-nowrap"
                        @click="viewComment(notification)"
                      >
                        {{ notification.type === 'comment' ? $t('notifications.viewComment') : $t('notifications.viewReply') }}
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    v-if="!notification.read"
                    @click="notificationStore.markAsRead(notification.id)"
                    class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto whitespace-nowrap"
                  >
                    {{ $t('notifications.markRead') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Delete All Confirmation Dialog -->
    <div v-if="showDeleteAllConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('common.confirm') }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('notifications.confirmDeleteAll') }}</p>
        
        <div class="flex justify-end gap-3">
          <button 
            class="btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="showDeleteAllConfirm = false"
          >
            {{ $t('common.cancel') }}
          </button>
          
          <button 
            class="btn bg-red-600 text-white hover:bg-red-700"
            @click="deleteAllNotifications"
          >
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useNotificationStore, type Notification } from '~/stores/notifications';
import { useAuthStore } from '~/stores/auth';

const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const currentFilter = ref('all');
const showOnlyUnread = ref(false);
const showDeleteAllConfirm = ref(false);

// Load notifications when component is mounted
onMounted(() => {
  if (authStore?.isAuthenticated) {
    notificationStore.loadNotifications();
  }
});

// Filter notifications based on current filter and unread status
const filteredNotifications = computed(() => {
  let filtered = [...notificationStore.notifications];
  
  // Apply type filter
  if (currentFilter.value !== 'all') {
    filtered = filtered.filter(n => n.type === currentFilter.value);
  }
  
  // Apply unread filter
  if (showOnlyUnread.value) {
    filtered = filtered.filter(n => !n.read);
  }
  
  return filtered;
});

// Toggle delete confirmation dialog
function toggleDeleteConfirm() {
  if (notificationStore.notifications.length > 0) {
    showDeleteAllConfirm.value = true;
  }
}

function getNotificationText(notification: Notification): string {
  switch (notification.type) {
    case 'like':
      return ' ' + useCasedT('notifications.likedCharacter') + ' ';
    case 'favorite':
      return ' ' + useCasedT('notifications.favoritedCharacter') + ' ';
    case 'comment':
      return ' ' + useCasedT('notifications.commentedCharacter') + ' ';
    case 'reply':
      return ' ' + useCasedT('notifications.repliedComment') + ' ';
    default:
      return ' ' + useCasedT('notifications.interactedCharacter') + ' ';
  }
}

// Helper function for lowercase first letter in translations
function useCasedT(key: string): string {
  const { t } = useI18n();
  const translation = t(key);
  return translation.charAt(0).toLowerCase() + translation.slice(1);
}

function viewCharacter(notification: Notification) {
  // Mark as read
  notificationStore.markAsRead(notification.id);
  
  // In a real app, navigate to the character page
  // For now, just display a message
  alert(`Viewing character: ${notification.data.characterName}`);
}

function viewComment(notification: Notification) {
  // Mark as read
  notificationStore.markAsRead(notification.id);
  
  // In a real app, navigate to the comment
  // For now, just display a message
  alert(`Viewing ${notification.type}: ${notification.data.commentText}`);
}

function deleteAllNotifications() {
  // Delete all notifications that match the current filters
  filteredNotifications.value.forEach(notification => {
    notificationStore.deleteNotification(notification.id);
  });
  
  // Close confirmation dialog
  showDeleteAllConfirm.value = false;
}

function openAuthModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(true);
    authStore.setAuthModalMode('login');
  }
}
</script>

<style scoped>
/* Hide scrollbars but keep functionality */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>