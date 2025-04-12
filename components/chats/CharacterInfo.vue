<template>
  <!-- Only show character info for authenticated users -->
  <template v-if="authStore?.isAuthenticated">
    <!-- Loading state for character info -->
    <div v-if="roleplayStore.isLoading && (!character)" class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</p>
      </div>
    </div>
    
    <div v-else class="p-4">
      <div class="text-center mb-6">
        <img 
          :src="character.avatar" 
          :alt="character.name"
          class="w-32 h-32 rounded-full object-cover mx-auto"
        />
        <h3 class="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100 truncate px-2">
          {{ character.name }}
        </h3>
        <div class="mt-2 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <span class="truncate">{{ $t(`roleplay.categories.${character.category}`) }}</span>
          <span class="mx-2">•</span>
          <span class="flex items-center">
            <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
            {{ character.stats.rating }}
          </span>
        </div>
      </div>
      
      <div class="space-y-6">
        <div>
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            {{ $t('common.description') }}
          </h4>
          <p class="text-sm text-gray-900 dark:text-gray-100 line-clamp-3">
            {{ character.description }}
          </p>
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            {{ $t('common.tags') }}
          </h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in character.tags" 
              :key="tag"
              class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            {{ $t('roleplay.characterInfo.stats') }}
          </h4>
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {{ character.stats.chats }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ $t('roleplay.characterInfo.chats') }}
              </div>
            </div>
            <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {{ character.stats.favorites }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ $t('roleplay.characterInfo.favorites') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <!-- For unauthenticated users, show login message -->
  <div v-else class="p-6 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-full">
    <Icon name="heroicons:lock-closed" class="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
    <p class="mb-4">{{ $t('auth.loginRequired') }}</p>
    <button 
      class="btn btn-primary"
      @click="openAuthModal"
    >
      {{ $t('auth.login') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useRoleplayStore } from '~/stores/roleplay';
import type { CharacterCard } from '~/types';

const authStore = useAuthStore();
const roleplayStore = useRoleplayStore();

defineProps<{
  character: CharacterCard
}>();

function openAuthModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(true);
    authStore.setAuthModalMode('login');
  }
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>