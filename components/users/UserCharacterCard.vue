<template>
  <div 
    class="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden cursor-pointer"
    @click="$emit('view')"
  >
    <div class="relative">
      <img 
        :src="character.avatar" 
        :alt="character.name" 
        class="w-full h-48 object-cover"
      />
      <div v-if="character.nsfw" class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
        NSFW
      </div>
    </div>
    
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ character.name }}</h3>
      
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
        <span>{{ $t(`roleplay.categories.${character.category}`) }}</span>
        <span class="mx-2">•</span>
        <span class="flex items-center">
          <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
          {{ character.stats.rating }}
        </span>
      </div>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {{ character.description }}
      </p>
      
      <div class="flex flex-wrap gap-1 mb-3">
        <span 
          v-for="tag in character.tags?.slice(0, 3)" 
          :key="tag"
          class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs"
        >
          #{{ tag }}
        </span>
        <span
          v-if="character.tags && character.tags.length > 3"
          class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full text-xs"
        >
          +{{ character.tags.length - 3 }}
        </span>
      </div>
      
      <div class="flex justify-between items-center">
        <div class="flex items-center" v-if="showCreator">
          <NuxtLink 
            :to="`/users/${character.creator.id}`"
            class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
            @click.stop
          >
            <span>{{ character.creator.username }}</span>
          </NuxtLink>
        </div>
        <button 
          class="btn btn-primary py-1 text-xs"
          @click.stop="$emit('start-chat')"
        >
          {{ $t('roleplay.characterInfo.startChat') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CharacterCard } from '~/types';

defineProps<{
  character: CharacterCard;
  showCreator?: boolean;
}>();

defineEmits<{
  (e: 'view'): void;
  (e: 'start-chat'): void;
}>();
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>