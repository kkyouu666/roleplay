<template>
  <div v-if="isOpen"
    class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
    <!-- Header with title and actions -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ $t('notifications.recentNotifications') }}</h3>
      <div class="flex space-x-2">
        <button v-if="hasUnreadNotifications"
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          @click="markAllAsRead">
          {{ $t('notifications.markAllRead') }}
        </button>
      </div>
    </div>

    <!-- Notification list - Only showing unread notifications -->
    <div class="max-h-96 overflow-y-auto custom-scrollbar">
      <div v-if="notificationStore.isLoading" class="py-8 text-center">
        <div class="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</p>
      </div>

      <div v-else-if="unreadNotifications.length === 0" class="py-10 text-center">
        <Icon name="heroicons:bell-slash" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400">{{ $t('notifications.empty') }}</p>
      </div>

      <div v-else>
        <a v-for="notification in unreadNotifications.slice(0, 5)" :key="notification.id" href="#"
          @click.prevent="handleNotificationClick(notification)"
          class="block px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-indigo-50 dark:bg-indigo-900/20">
          <div class="flex items-start">
            <!-- Avatar -->
            <img :src="notification.data.userAvatar || '/images/avatars/default.jpg'" :alt="notification.data.username"
              class="w-10 h-10 rounded-full object-cover flex-shrink-0 mr-3" />

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900 dark:text-gray-100">
                <span class="font-medium">{{ notification.data.username }}</span>
                <span>
                  {{ getNotificationText(notification) }}
                  <span class="font-medium" v-if="notification.data.characterName">
                    {{ notification.data.characterName }}
                  </span>
                </span>
              </p>

              <p v-if="notification.data.commentText"
                class="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                "{{ notification.data.commentText }}"
              </p>

              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ notificationStore.formatTimestamp(notification.timestamp) }}
              </p>
            </div>

            <!-- Unread indicator -->
            <div class="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-2"></div>
          </div>
        </a>

        <!-- View all link -->
        <div class="p-3 text-center border-t border-gray-100 dark:border-gray-700">
          <NuxtLink to="/notifications"
            class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            @click="close">
            {{ $t('notifications.viewAll') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNotificationStore, type Notification } from '~/stores/notifications';
import { useWindowSize } from '@vueuse/core';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();

const notificationStore = useNotificationStore();
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);

// Load notifications when the panel is opened
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    notificationStore.loadNotifications();
  }
});

const hasUnreadNotifications = computed(() => {
  return notificationStore.hasUnreadNotifications;
});

// Filtered list of only unread notifications
const unreadNotifications = computed(() => {
  return notificationStore.notifications.filter(notification => !notification.read);
});

function close() {
  emit('close');
}

function markAllAsRead() {
  notificationStore.markAllAsRead();
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

function handleNotificationClick(notification: Notification) {
  // Mark as read
  notificationStore.markAsRead(notification.id);

  // On mobile, navigate to the relevant page
  if (isMobile.value) {
    close();

    switch (notification.type) {
      case 'like':
      case 'favorite':
      case 'comment':
        // Navigate to character page
        navigateTo(`/characters/${notification.data.characterId}`);
        break;
      case 'reply':
        // Navigate to comment thread
        navigateTo(`/characters/${notification.data.characterId}`);
        break;
    }
    return;
  }

  // In a real app, navigate to the relevant page
  switch (notification.type) {
    case 'like':
    case 'favorite':
    case 'comment':
      // Navigate to character page
      console.log(`Navigate to character page: ${notification.data.characterId}`);
      break;
    case 'reply':
      // Navigate to comment thread
      console.log(`Navigate to comment thread: ${notification.data.commentId}`);
      break;
  }

  // Close the panel
  close();
}

// Helper for lowercase first letter in translations
function useCasedT(key: string): string {
  const { t } = useI18n();
  const translation = t(key);
  return translation.charAt(0).toLowerCase() + translation.slice(1);
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>