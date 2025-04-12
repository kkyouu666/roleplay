<template>
  <button
    class="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
    :class="{ 
      'bg-indigo-50 dark:bg-indigo-900': isActive,
      'opacity-60 pointer-events-none': isLoading
    }"
    @click="$emit('select', chat.id)"
  >
    <div class="relative">
      <img 
        :src="chat.character.avatar" 
        :alt="chat.character.name" 
        class="w-10 h-10 rounded-full object-cover"
      />
      <!-- Loading indicator over avatar when this chat is loading -->
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
        <div class="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
      </div>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex justify-between">
        <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ chat.character.name }}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(chat.timestamp) }}</p>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
        <span v-if="isLoading">{{ $t('common.loading') }}...</span>
        <span v-else>{{ chat.lastMessage }}</span>
      </p>
    </div>
  </button>
</template>

<script setup lang="ts">
import { format, isToday, isYesterday } from 'date-fns';

const props = defineProps<{
  chat: {
    id: string;
    character: {
      name: string;
      avatar: string;
    };
    lastMessage: string;
    timestamp: string;
  };
  isActive: boolean;
  isLoading: boolean;
}>();

defineEmits<{
  (e: 'select', chatId: string): void;
}>();

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return `昨天 ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'MM-dd HH:mm');
  }
}
</script>