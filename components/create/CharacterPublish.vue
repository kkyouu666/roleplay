<template>
  <div class="p-6 space-y-8">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="heroicons:check" class="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ $t('create.publish.confirmation') }}</h2>
      <p class="text-gray-600 dark:text-gray-400">{{ $t('create.publish.confirmationText') }}</p>
    </div>
    
    <!-- Character Preview Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden max-w-md mx-auto">
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
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{{ character.name }}</h3>
        
        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>{{ $t(`roleplay.categories.${character.category}`) }}</span>
        </div>
        
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
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
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center mt-6">
      <button 
        class="btn btn-primary sm:px-8"
        @click="$emit('publish')"
        :disabled="isPublishing"
      >
        <template v-if="isPublishing">
          <span class="mr-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {{ $t('common.loading') }}
        </template>
        <template v-else>
          {{ $t('create.publish.publishButton') }}
        </template>
      </button>
      
      <button 
        class="btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 sm:px-6"
        @click="$emit('back')"
        :disabled="isPublishing"
      >
        {{ $t('common.back') }}
      </button>
    </div>
    
    <!-- Success Message -->
    <div 
      v-if="publishSuccess"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="heroicons:check" class="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('create.publish.success') }}</h2>
          
          <div class="mt-6 space-y-3">
            <button 
              class="w-full btn btn-primary"
              @click="$emit('view-character')"
            >
              {{ $t('create.publish.viewCharacter') }}
            </button>
            
            <button 
              class="w-full btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="$emit('create-another')"
            >
              {{ $t('create.publish.createAnother') }}
            </button>
            
            <NuxtLink 
              to="/"
              class="block w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mt-2"
            >
              {{ $t('create.publish.returnHome') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CharacterCard } from '~/types';

const props = defineProps<{
  character: Partial<CharacterCard>;
  isPublishing?: boolean;
  publishSuccess?: boolean;
}>();

const emit = defineEmits(['publish', 'back', 'view-character', 'create-another']);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>