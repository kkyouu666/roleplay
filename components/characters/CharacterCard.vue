<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="relative">
      <img 
        :src="character.avatar" 
        :alt="character.name" 
        class="w-full h-64 object-cover"
      />
      <div v-if="character.nsfw" class="absolute top-4 right-4 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
        NSFW
      </div>
    </div>
    
    <div class="p-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ character.name }}</h1>
          <div class="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{{ $t(`roleplay.categories.${character.category}`) }}</span>
            <span class="mx-2">•</span>
            <span class="flex items-center">
              <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
              {{ character.stats.rating }}
            </span>
            <span class="mx-2">•</span>
            <span>{{ character.stats.chats }} {{ $t('characters.chats') }}</span>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
            <Icon name="heroicons:heart" class="w-6 h-6" />
          </button>
          <button class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
            <Icon name="heroicons:star" class="w-6 h-6" />
          </button>
          <button class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
            <Icon name="heroicons:share" class="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ character.description }}</p>
      
      <div class="flex flex-wrap gap-2 mb-6">
        <span 
          v-for="tag in character.tags" 
          :key="tag"
          class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
        >
          #{{ tag }}
        </span>
      </div>
      
      <button 
        class="w-full btn btn-primary"
        @click="$emit('start-chat')"
      >
        {{ $t('roleplay.characterInfo.startChat') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CharacterCard } from '~/types';

defineProps<{
  character: CharacterCard;
}>();

defineEmits<{
  (e: 'start-chat'): void;
}>();
</script>