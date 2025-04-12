<template>
  <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center relative flex-shrink-0">
    <div class="flex-1 flex items-center justify-center">
      <button 
        class="absolute left-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        @click="chatLayoutStore.toggleChatList()"
      >
        <Icon 
          name="heroicons:chat-bubble-left-right" 
          class="w-5 h-5" 
        />
      </button>
      
      <img 
        :src="character.avatar" 
        :alt="character.name" 
        class="w-10 h-10 rounded-full object-cover mr-3"
      />
      <div>
        <h2 class="font-semibold text-gray-900 dark:text-gray-100 truncate">{{ character.name }}</h2>
        <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span class="truncate">{{ $t(`roleplay.categories.${character.category}`) }}</span>
          <span class="mx-1">•</span>
          <span class="flex items-center">
            <Icon name="heroicons:star" class="w-3 h-3 text-yellow-400 mr-0.5" />
            {{ character.stats.rating }}
          </span>
        </div>
      </div>
    </div>
    
    <button 
      class="absolute right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
      @click="chatLayoutStore.toggleCharacterInfo()"
    >
      <Icon 
        name="heroicons:information-circle" 
        class="w-5 h-5" 
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useChatLayoutStore } from '~/stores/chatLayout';
import type { CharacterCard } from '~/types';

const chatLayoutStore = useChatLayoutStore();

defineProps<{
  character: CharacterCard
}>();
</script>