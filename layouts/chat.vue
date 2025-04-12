<template>
  <div class="flex h-[calc(100dvh-64px)] bg-gray-50 dark:bg-gray-950 overflow-hidden">
    <!-- Chat List Sidebar -->
    <div 
      class="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 flex flex-col overflow-hidden z-20"
      :class="{
        'fixed inset-0 top-16 w-full sm:w-80 md:w-64 md:relative md:translate-x-0': isMobile,
        'w-64 translate-x-0': chatLayoutStore.showChatList && !isMobile,
        'w-0 translate-x-[-100%]': !chatLayoutStore.showChatList && !isMobile,
        'translate-x-0': chatLayoutStore.showChatList && isMobile,
        'translate-x-[-100%]': !chatLayoutStore.showChatList && isMobile
      }"
    >
      <div class="h-16 px-4 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0 w-full justify-between">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ $t('navigation.chats') }}</h2>
        <button 
          v-if="isMobile"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          @click="chatLayoutStore.toggleChatList()"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto w-full custom-scrollbar">
        <slot name="chat-list"></slot>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <slot></slot>
    </div>

    <!-- Character Info Sidebar -->
    <div
      class="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 flex flex-col overflow-hidden z-20"
      :class="{ 
        'fixed inset-0 top-16 w-full sm:w-80 md:w-80 md:relative md:translate-x-0': isMobile,
        'w-80 translate-x-0': chatLayoutStore.showCharacterInfo && !isMobile,
        'w-0 translate-x-full': !chatLayoutStore.showCharacterInfo && !isMobile,
        'translate-x-0': chatLayoutStore.showCharacterInfo && isMobile,
        'translate-x-full': !chatLayoutStore.showCharacterInfo && isMobile
      }"
    >
      <div class="h-16 px-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0 w-full">
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ $t('roleplay.characterInfo.title') }}</h2>
        <button 
          v-if="isMobile"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          @click="chatLayoutStore.toggleCharacterInfo()"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto w-full custom-scrollbar">
        <slot name="character-info"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useChatLayoutStore } from '~/stores/chatLayout';

const chatLayoutStore = useChatLayoutStore();
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);
const route = useRoute();

// Initialize layout on mount - always force sidebar collapse on chat pages
onMounted(() => {
  chatLayoutStore.initLayout(isMobile.value, true);
});

// Handle mobile layout changes
watch(isMobile, (newValue) => {
  chatLayoutStore.initLayout(newValue, true);
});
</script>