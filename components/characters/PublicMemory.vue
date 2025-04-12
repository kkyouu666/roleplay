<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('characters.publicMemory') }}</h2>
      </div>
    </div>
    
    <div class="p-4">
      <div v-if="memories.length > 0" class="space-y-4">
        <div 
          v-for="memory in memories" 
          :key="memory.id"
          class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
        >
          <!-- Conversation Header -->
          <div class="bg-gray-50 dark:bg-gray-700 p-3 flex items-center justify-between">
            <div class="flex items-center">
              <img 
                :src="memory.user.avatar" 
                :alt="memory.user.username"
                class="w-6 h-6 rounded-full object-cover mr-2"
              />
              <span class="font-medium text-sm text-gray-900 dark:text-gray-100">{{ memory.user.username }}</span>
              <span class="mx-2 text-gray-400 dark:text-gray-500">•</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(memory.timestamp) }}</span>
            </div>
          </div>
          
          <!-- Chat Messages -->
          <div class="p-3 space-y-3">
            <div 
              v-for="message in memory.messages" 
              :key="message.id"
              class="flex"
              :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
            >
              <div 
                class="max-w-[80%] rounded-lg px-3 py-2 text-sm"
                :class="message.sender === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'"
              >
                {{ message.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8">
        <Icon name="heroicons:clock" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400">{{ $t('characters.noMemories') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

defineProps<{
  memories: Array<{
    id: string;
    user: {
      username: string;
      avatar: string;
    };
    messages: Array<{
      id: string;
      sender: 'user' | 'character';
      content: string;
    }>;
    timestamp: string;
  }>;
}>();

function formatDate(dateString: string) {
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
}
</script>