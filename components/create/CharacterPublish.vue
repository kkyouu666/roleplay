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
    <div class="relative overflow-hidden rounded-lg shadow-md max-w-xs mx-auto group">
      <!-- Character Image -->
      <img 
        :src="character.avatar" 
        :alt="character.name" 
        class="w-full aspect-[3/4] object-cover"
      />

      <!-- Info Section (Bottom) -->
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 max-h-[75%] flex flex-col min-w-0">
        <!-- Character Name -->
        <h3 class="text-lg sm:text-xl font-semibold text-white line-clamp-1 text-shadow mb-1">{{ character.name }}</h3>

        <!-- Category -->
        <div class="flex justify-between items-center mb-2 min-w-0">
          <span class="text-sm text-white/80 truncate">{{ $t(`roleplay.categories.${character.category}`) }}</span>
        </div>

        <!-- Description -->
        <p class="text-sm text-white/80 line-clamp-2 mb-2">
          {{ character.description }}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1 mb-2 overflow-hidden">
          <!-- NSFW Tag -->
          <span 
            v-if="character.nsfw"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-400/70 text-white"
          >
            <Icon name="heroicons:eye-slash" class="w-3 h-3 mr-1" />
            <span>NSFW</span>
          </span>

          <!-- Regular Tags -->
          <span 
            v-for="(tag, index) in character.tags?.slice(0, 2)" 
            :key="tag"
            class="inline-block px-2 py-1 bg-black/50 text-white rounded-full text-xs whitespace-nowrap"
          >
            #{{ tag }}
          </span>
          <span
            v-if="character.tags && character.tags.length > 2"
            class="inline-block px-2 py-1 bg-black/50 text-white rounded-full text-xs whitespace-nowrap"
          >
            +{{ character.tags.length - 2 }}
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
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
  max-height: 2.5rem;
  line-height: 1.25;
}

.line-clamp-1 {
  display: -webkit-box !important;
  -webkit-line-clamp: 1 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
  max-height: 1.5rem !important;
  line-height: 1.2 !important;
}

.truncate {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.text-shadow {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

/* Ensure the card maintains proper sizing */
@media (min-width: 640px) {
  .line-clamp-1 {
    max-height: 1.75rem !important;
  }
}
</style>