<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ $t('settings.myCharacters') }}</h2>
      <NuxtLink to="/create" class="btn btn-primary">
        {{ $t('create.fromScratch.button') }}
      </NuxtLink>
    </div>
    
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="!characters.length" class="text-center py-12">
      <Icon name="heroicons:user-plus" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400 mb-4">{{ $t('settings.noCharacters') }}</p>
      <NuxtLink to="/create" class="btn btn-primary">
        {{ $t('create.fromScratch.button') }}
      </NuxtLink>
    </div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="character in characters" 
        :key="character.id"
        class="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
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
              class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
            >
              #{{ tag }}
            </span>
            <span
              v-if="character.tags && character.tags.length > 3"
              class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-xs"
            >
              +{{ character.tags.length - 3 }}
            </span>
          </div>
          
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ $t('roleplay.characterInfo.chats') }}: {{ character.stats.chats }}
            </div>
            <div class="flex space-x-2">
              <button 
                class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                @click="$emit('edit', character)"
              >
                <Icon name="heroicons:pencil-square" class="w-5 h-5" />
              </button>
              <button 
                class="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                @click="$emit('delete', character)"
              >
                <Icon name="heroicons:trash" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CharacterCard } from '~/types';

defineProps<{
  characters: CharacterCard[];
  isLoading?: boolean;
}>();

defineEmits<{
  (e: 'edit', character: CharacterCard): void;
  (e: 'delete', character: CharacterCard): void;
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