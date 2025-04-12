<template>
  <div class="flex-1 flex items-center justify-center p-8">
    <div class="text-center">
      <Icon name="heroicons:chat-bubble-left-right" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <!-- Different message for mobile vs desktop -->
      <template v-if="isMobile">
        <h2 class="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4">{{ $t('roleplay.noChatsYet') }}</h2>
        <NuxtLink 
          to="/"
          class="inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          {{ $t('roleplay.exploreCharacters') }}
        </NuxtLink>
      </template>
      <template v-else>
        <h2 class="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">{{ $t('roleplay.selectChat') }}</h2>
        <p class="text-gray-500 dark:text-gray-400">{{ $t('roleplay.selectChatDescription') }}</p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);
</script>