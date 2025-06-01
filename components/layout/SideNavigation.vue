<template>
  <ClientOnly>
    <div
      class="fixed md:relative inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20 overflow-hidden hide-scrollbar"
      :class="{
        '-translate-x-full md:translate-x-0': !chatLayoutStore.showSidebar,
        'w-64 lg:w-64 md:w-48': chatLayoutStore.showSidebar,
        'w-14': !chatLayoutStore.showSidebar
      }">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="h-16 flex items-center" :class="chatLayoutStore.showSidebar ? 'px-4' : 'px-3'">
          <div class="flex items-center">
            <span
              class="text-xl font-bold text-indigo-600 transition-all duration-300 whitespace-nowrap overflow-hidden"
              :class="chatLayoutStore.showSidebar ? 'w-auto' : 'w-0'">RolePlay</span>
            <span class="text-xl font-bold text-indigo-600 transition-all duration-300"
              :class="!chatLayoutStore.showSidebar ? 'w-auto' : 'w-0'">RP</span>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 overflow-y-auto py-4 hide-scrollbar">
          <div :class="[chatLayoutStore.showSidebar ? 'px-3 mb-6' : 'px-2']">
            <div
              class="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-opacity duration-300 whitespace-nowrap"
              :class="{ 'opacity-0 h-0 mb-0 overflow-hidden': !chatLayoutStore.showSidebar }">
              {{ $t('navigation.main') }}
            </div>

            <ul>
              <li v-for="item in navigationItems" :key="item.name">
                <NuxtLink :to="item.to"
                  class="flex items-center text-gray-700 dark:text-gray-300 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 overflow-hidden whitespace-nowrap my-1"
                  :class="[
                    { 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400': isActive(item.to) },
                    chatLayoutStore.showSidebar ? 'px-3 py-2' : 'px-2 py-2 justify-center'
                  ]">
                  <Icon :name="item.icon" class="w-5 h-5 flex-shrink-0"
                    :class="chatLayoutStore.showSidebar ? 'mr-3' : ''" />
                  <span class="transition-all duration-300 whitespace-nowrap overflow-hidden"
                    :class="chatLayoutStore.showSidebar ? 'w-auto' : 'w-0'">{{ $t(item.label) }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Subscription Section -->
          <div :class="[chatLayoutStore.showSidebar ? 'px-3 mb-6' : 'px-2']">
            <div
              class="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider transition-opacity duration-300 whitespace-nowrap"
              :class="{ 'opacity-0 h-0 mb-0 overflow-hidden': !chatLayoutStore.showSidebar }">
              {{ $t('navigation.subscription') }}
            </div>

            <NuxtLink to="/pricing"
              class="flex items-center text-gray-700 dark:text-gray-300 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 overflow-hidden whitespace-nowrap my-1"
              :class="[
                { 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400': isActive('/pricing') },
                chatLayoutStore.showSidebar ? 'px-3 py-2' : 'px-2 py-2 justify-center'
              ]">
              <Icon name="heroicons:credit-card" class="w-5 h-5 flex-shrink-0"
                :class="chatLayoutStore.showSidebar ? 'mr-3' : ''" />
              <span class="transition-all duration-300 whitespace-nowrap overflow-hidden"
                :class="chatLayoutStore.showSidebar ? 'w-auto' : 'w-0'">{{ $t('navigation.pricing') }}</span>
            </NuxtLink>

            <NuxtLink to="/bonus"
              class="flex items-center text-gray-700 dark:text-gray-300 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 overflow-hidden whitespace-nowrap my-1"
              :class="[
                { 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400': isActive('/bonus') },
                chatLayoutStore.showSidebar ? 'px-3 py-2' : 'px-2 py-2 justify-center'
              ]">
              <Icon name="heroicons:gift" class="w-5 h-5 flex-shrink-0"
                :class="chatLayoutStore.showSidebar ? 'mr-3' : ''" />
              <span class="transition-all duration-300 whitespace-nowrap overflow-hidden"
                :class="chatLayoutStore.showSidebar ? 'w-auto' : 'w-0'">{{ $t('navigation.bonus') }}</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- Theme Toggle -->
        <div class="border-t border-gray-200 dark:border-gray-700" :class="chatLayoutStore.showSidebar ? 'p-4' : 'p-2'">
          <div class="flex items-center justify-center h-8"
            :class="[chatLayoutStore.showSidebar ? 'gap-2' : '', !chatLayoutStore.showSidebar && themeStore.theme === 'system' ? 'justify-center' : '']">
            <button class="p-2 rounded-lg transition-colors duration-150 flex items-center justify-center" :class="[
              themeStore.theme === 'light' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400'
            ]" @click="themeStore.setTheme('light')" :title="$t('common.themeLight')"
              v-show="chatLayoutStore.showSidebar || (!chatLayoutStore.showSidebar && (themeStore.theme === 'dark' || (themeStore.theme === 'system' && isDarkMode)))">
              <Icon name="heroicons:sun" class="w-5 h-5" />
            </button>
            <button class="p-2 rounded-lg transition-colors duration-150 flex items-center justify-center" :class="[
              themeStore.theme === 'dark' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400'
            ]" @click="themeStore.setTheme('dark')" :title="$t('common.themeDark')"
              v-show="chatLayoutStore.showSidebar || (!chatLayoutStore.showSidebar && (themeStore.theme === 'light' || (themeStore.theme === 'system' && !isDarkMode)))">
              <Icon name="heroicons:moon" class="w-5 h-5" />
            </button>
            <button class="p-2 rounded-lg transition-colors duration-150 flex items-center justify-center" :class="[
              themeStore.theme === 'system' ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400'
            ]" @click="themeStore.setTheme('system')" :title="$t('common.themeSystem')"
              v-show="chatLayoutStore.showSidebar">
              <Icon name="heroicons:computer-desktop" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- User Profile Section -->
        <div class="border-t border-gray-200 dark:border-gray-700" :class="chatLayoutStore.showSidebar ? 'p-4' : 'p-3'">
          <div v-if="authStore?.isAuthenticated">
            <div class="flex items-center">
              <img :src="authStore?.user?.avatar || '/images/avatars/default.jpg'" :class="[
                'rounded-full object-cover flex-shrink-0',
                chatLayoutStore.showSidebar ? 'w-10 h-10' : 'w-8 h-8'
              ]" alt="Profile" />
              <div class="transition-all duration-300 whitespace-nowrap overflow-hidden"
                :class="chatLayoutStore.showSidebar ? 'ml-3 w-auto' : 'w-0'">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ authStore?.user?.username }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ authStore?.user?.subscription }}</div>
              </div>
              <button
                class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-300 whitespace-nowrap overflow-hidden"
                :class="chatLayoutStore.showSidebar ? 'ml-auto w-auto' : 'w-0'" @click="authStore?.logout()">
                <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div v-else>
            <button v-if="chatLayoutStore.showSidebar" class="w-full btn btn-primary" @click="openAuthModal">
              <span>{{ $t('auth.login') }}</span>
            </button>
            <button v-else
              class="w-8 h-8 p-0 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
              @click="openAuthModal">
              <Icon name="heroicons:user" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
  <div v-if="!isClientRendered"
    class="fixed md:relative inset-y-0 left-0 bg-white shadow-lg flex-shrink-0 border-r border-gray-200 w-56 md:w-56 lg:w-64 z-20">
    <div class="h-16 border-b border-gray-200 px-4 flex items-center">
      <div class="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div class="p-4 space-y-4">
      <div v-for="i in 5" :key="i" class="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>

  <!-- Overlay Backdrop -->
  <div v-if="chatLayoutStore.showSidebar" class="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
    @click="toggleSidebar"></div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useChatLayoutStore } from '~/stores/chatLayout';
import { useThemeStore } from '~/stores/theme';

const authStore = useAuthStore();
const chatLayoutStore = useChatLayoutStore();
const themeStore = useThemeStore();
const route = useRoute();
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);
const isClientRendered = ref(false);

const isDarkMode = ref(false);

const props = defineProps<{
  isOpen: boolean  // This prop is still needed for compatibility
}>();

const emit = defineEmits(['toggle-sidebar']);

function toggleSidebar() {
  emit('toggle-sidebar');
}

const navigationItems = [
  { name: 'home', to: '/', icon: 'heroicons:home', label: 'navigation.home' },
  { name: 'chats', to: '/chats', icon: 'heroicons:chat-bubble-left-right', label: 'navigation.chats' },
  { name: 'create', to: '/create', icon: 'heroicons:plus-circle', label: 'navigation.create' },
  { name: 'profile', to: '/profile', icon: 'heroicons:user-circle', label: 'navigation.profile' },
  { name: 'notifications', to: '/notifications', icon: 'heroicons:bell', label: 'navigation.notifications' }
];

function isActive(path: string) {
  return route.path === path;
}

function openAuthModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(true);
    authStore.setAuthModalMode('login');
  }
}

onMounted(() => {
  isClientRendered.value = true;
  themeStore.initTheme();

  // Initialize system theme detection
  if (process.client && window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    isDarkMode.value = darkModeQuery.matches;

    // Watch for system theme changes
    darkModeQuery.addEventListener('change', (e) => {
      isDarkMode.value = e.matches;
    });
  }
});
</script>