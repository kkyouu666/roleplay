<template>
  <div class="flex h-dvh bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar Navigation -->
    <SideNavigation
      :is-open="chatLayoutStore.showSidebar"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <TopNavigation @toggle-sidebar="toggleSidebar" />
      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 custom-scrollbar">
        <slot />
      </main>
    </div>

    <!-- Auth Modal -->
    <AuthModal v-if="authStore?.showAuthModal" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useWindowSize } from '@vueuse/core';
import { useChatLayoutStore } from '~/stores/chatLayout';
import AuthModal from '~/components/auth/AuthModal.vue';
import SideNavigation from '~/components/layout/SideNavigation.vue';
import TopNavigation from '~/components/layout/TopNavigation.vue';

const authStore = useAuthStore();
const chatLayoutStore = useChatLayoutStore();
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);
const route = useRoute();

// Toggle sidebar function
function toggleSidebar() {
  chatLayoutStore.toggleSidebar();
}

// Watch window width to handle sidebar state
watch(() => width.value, (newWidth) => {
  chatLayoutStore.initLayout(newWidth < 768, route.path.startsWith('/chats'));
});

// Watch for route changes to properly handle chat page navigation
// This ensures we collapse sidebar on chat pages but preserve state elsewhere
watch(() => route.path, (newPath) => {
  const isChatsPage = newPath.startsWith('/chats');
  chatLayoutStore.initLayout(isMobile.value, isChatsPage);
}, { immediate: true });

// Set initial state
onMounted(() => {
  const isChatsPage = route.path.startsWith('/chats');
  chatLayoutStore.initLayout(isMobile.value, isChatsPage);
});
</script>