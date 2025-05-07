<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm z-30">
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 relative">
      <!-- Left Side: Mobile Menu Button -->
      <button class="mr-4 text-gray-500 hover:text-gray-700" @click="toggleSidebar">
        <Icon name="heroicons:bars-3" class="w-6 h-6" />
      </button>

      <!-- Search Bar -->
      <div ref="searchContainerRef" class="flex-1 transition-all duration-300 mx-4" :class="{
        'max-w-md': !isSearchExpanded || !isMobile,
        'absolute inset-x-0 px-4 mx-0 bg-white dark:bg-gray-800 z-40': isSearchExpanded && isMobile
      }">
        <div class="relative flex items-center">
          <!-- Search Icon Button (Mobile) -->
          <button class="md:hidden absolute left-0 p-2" v-if="!isSearchExpanded" @click="expandSearch">
            <Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </button>

          <!-- Search Input Container -->
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="heroicons:magnifying-glass" class="h-5 w-5 text-gray-400"
              v-if="isSearchExpanded || !isMobile" />
          </div>
          <input type="text" ref="searchInputRef" v-show="shouldShowSearchInput"
            class="block w-full py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 pl-10 text-gray-900 dark:text-gray-100"
            :class="{
              'opacity-0': !shouldShowSearchInput
            }" :placeholder="$t('common.search')" v-model="searchQuery" @input="search" />

          <!-- Close Search Button (Mobile) -->
          <button v-if="isSearchExpanded && isMobile" class="absolute right-2 text-gray-400" @click="collapseSearch">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center space-x-4 transition-all duration-300 flex-shrink-0"
        :class="{ 'hidden': isSearchExpanded && isMobile }">
        <!-- Language Selector -->
        <CommonLanguageSelector />

        <!-- Notifications -->
        <div class="relative" ref="notificationMenuRef">
          <button class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 relative"
            @click="handleNotificationClick">
            <Icon name="heroicons:bell" class="h-6 w-6" />
            <span v-if="notificationStore.unreadCount > 0"
              class="absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs">
              {{ formatUnreadCount(notificationStore.unreadCount) }}
            </span>
          </button>

          <!-- Notification Panel - Only show if not on notifications page -->
          <CommonNotificationPanel v-if="!isNotificationsPage" :is-open="showNotifications"
            @close="showNotifications = false" />
        </div>

        <!-- User Menu (only if authenticated) -->
        <div v-if="authStore?.isAuthenticated" class="relative" ref="userMenuRef">
          <button @click="toggleUserMenu"
            class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
            <img class="h-8 w-8 rounded-full object-cover"
              :src="authStore?.user?.profileImage || '/images/avatars/default.jpg'" alt="User profile" />
          </button>

          <!-- Dropdown -->
          <div v-if="isUserMenuOpen"
            class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 focus:outline-none z-40"
            role="menu">
            <div class="py-1" role="none">
              <NuxtLink to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem" @click="closeUserMenu">
                {{ $t('navigation.settings') }}
              </NuxtLink>

              <button @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem">
                {{ $t('auth.logout') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Login/Register button (if not authenticated) -->
        <button v-else @click="openAuthModal" class="btn btn-primary">
          {{ $t('auth.login') }}
        </button>
      </div>
    </div>
    <div v-if="!isClientRendered" class="h-16 px-4 border-b border-gray-200 flex items-center justify-between">
      <div class="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
      <div class="w-48 h-8 bg-gray-200 rounded animate-pulse"></div>
      <div class="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWindowSize, onClickOutside } from '@vueuse/core';
import { useAuthStore } from '~/stores/auth';
import { useRoleplayStore } from '~/stores/roleplay';
import { useNotificationStore } from '~/stores/notifications';

const emit = defineEmits(['toggle-sidebar']);
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);
const isSearchExpanded = ref(false);
const shouldShowSearchInput = computed(() => !isMobile.value || isSearchExpanded.value);
const roleplayStore = useRoleplayStore();

const isUserMenuOpen = ref(false);
const showNotifications = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);
const notificationMenuRef = ref<HTMLElement | null>(null);
const searchContainerRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref('');
const isClientRendered = ref(false);

// Get current route to check if we're on notifications page
const route = useRoute();
const isNotificationsPage = computed(() => route.path === '/notifications');

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  // Close notifications if open
  if (isUserMenuOpen.value && showNotifications.value) {
    showNotifications.value = false;
  }
}

// Handle notification button click based on screen size
function handleNotificationClick() {
  // On mobile, navigate to notifications page
  if (isMobile.value) {
    // Only navigate if we're not already on the notifications page
    if (!isNotificationsPage.value) {
      navigateTo('/notifications');
    }
    return;
  }

  // Only toggle panel if we're not on notifications page
  if (!isNotificationsPage.value) {
    toggleNotifications();
  }
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value;
  // Close user menu if open
  if (showNotifications.value && isUserMenuOpen.value) {
    isUserMenuOpen.value = false;
  }
}

function toggleSidebar() {
  emit('toggle-sidebar');
}

function expandSearch() {
  isSearchExpanded.value = true;
  searchQuery.value = '';
  // Focus the input after the transition
  nextTick(() => {
    searchInputRef.value?.focus();
  });
}

function collapseSearch() {
  isSearchExpanded.value = false;
}

function search() {
  roleplayStore.setSearchFilter(searchQuery.value);
}

function openAuthModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(true);
    authStore.setAuthModalMode('login');
  }
}

function closeUserMenu() {
  isUserMenuOpen.value = false;
}

function handleLogout() {
  if (authStore) {
    authStore.logout();
    closeUserMenu();
    // Optionally navigate to home page
    navigateTo('/');
  }
}

// Format unread count (show 9+ if more than 9)
function formatUnreadCount(count: number): string {
  return count > 9 ? '9+' : count.toString();
}

// Only use onClickOutside in client-side environment
onMounted(() => {
  isClientRendered.value = true;

  // Initialize notification store
  if (authStore?.isAuthenticated) {
    notificationStore.loadNotifications();
  }

  if (process.client && typeof document !== 'undefined') {
    // Handle user menu click outside
    onClickOutside(userMenuRef, () => {
      isUserMenuOpen.value = false;
    });

    // Handle notification panel click outside
    onClickOutside(notificationMenuRef, () => {
      showNotifications.value = false;
    });

    // Handle search click outside on mobile
    onClickOutside(searchContainerRef, () => {
      if (isMobile.value && isSearchExpanded.value) {
        collapseSearch();
      }
    });
  }
});
</script>

<style scoped>
/* Hide scrollbars but keep functionality */
.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari and Opera */
}
</style>