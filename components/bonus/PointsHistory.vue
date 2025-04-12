<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Icon name="heroicons:clock" class="w-5 h-5 text-blue-500 mr-2" />
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('bonus.pointsHistory') }}</h2>
        </div>
        <button 
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          @click="$emit('view-all')"
        >
          {{ $t('bonus.viewAll') }}
        </button>
      </div>
    </div>
    
    <div class="p-4">
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
      </div>
      
      <div v-else-if="history.length === 0" class="text-center py-8">
        <Icon name="heroicons:clock" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p class="text-gray-600 dark:text-gray-400">{{ $t('bonus.noHistory') }}</p>
      </div>
      
      <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
        <div 
          v-for="item in displayedHistory" 
          :key="item.id" 
          class="py-3 flex justify-between items-center"
        >
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.description }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(item.timestamp) }}</p>
          </div>
          
          <div :class="item.type === 'earn' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            <span class="font-medium">{{ item.type === 'earn' ? '+' : '-' }} {{ item.amount }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="history.length > displayCount" class="mt-4 text-center">
        <button 
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          @click="$emit('view-all')"
        >
          {{ $t('bonus.loadMore') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, isToday, isYesterday } from 'date-fns';

const props = defineProps<{
  history: Array<{
    id: string;
    type: 'earn' | 'spend';
    amount: number;
    description: string;
    timestamp: string;
  }>;
  isLoading: boolean;
  displayCount?: number;
}>();

const emit = defineEmits<{
  (e: 'view-all'): void;
}>();

const displayedHistory = computed(() => {
  return props.history.slice(0, props.displayCount || 5);
});

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return useI18n().t('bonus.today') + ' ' + format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return useI18n().t('bonus.yesterday') + ' ' + format(date, 'HH:mm');
  } else {
    return format(date, 'MM-dd HH:mm');
  }
}
</script>