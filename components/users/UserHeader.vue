<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
    <div class="p-6">
      <div class="flex flex-col sm:flex-row items-center">
        <img 
          :src="user.profileImage || '/images/avatars/default.jpg'" 
          :alt="user.username" 
          class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
        />
        <div class="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ user.username }}</h1>
          <p v-if="user.bio && isPublicBio" class="text-gray-600 dark:text-gray-400 mt-2">{{ user.bio }}</p>
          <div class="flex items-center justify-center sm:justify-start mt-2 text-gray-500 dark:text-gray-400 text-sm">
            <Icon name="heroicons:calendar" class="w-4 h-4 mr-1" />
            <span>{{ $t('users.joinedOn') }} {{ formatDate(user.createdAt) }}</span>
          </div>
        </div>
        <div v-if="user.id !== authStore?.user?.id" class="mt-4 sm:mt-0 flex items-center space-x-2">
          <button 
            @click="$emit('toggle-follow')"
            class="px-4 py-2 rounded-md border text-sm font-medium"
            :class="isFollowing ? 
              'bg-indigo-50 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300' : 
              'bg-indigo-600 dark:bg-indigo-700 border-indigo-600 dark:border-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600'"
          >
            <span v-if="isFollowing">{{ $t('users.following') }}</span>
            <span v-else>{{ $t('users.follow') }}</span>
          </button>
          <button class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md">
            <Icon name="heroicons:ellipsis-horizontal" class="w-5 h-5" />
          </button>
        </div>
        <div v-else class="mt-4 sm:mt-0">
          <NuxtLink to="/profile" class="btn btn-primary">
            {{ $t('users.editProfile') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-3 mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
        <div class="stats-item" @click="$emit('select-tab', 'characters')">
          <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ user.stats?.characters || 0 }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('users.characters') }}</div>
        </div>
        <div class="stats-item" @click="$emit('handle-stats-click', 'followers')">
          <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ followers }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('users.followers') }}</div>
        </div>
        <div class="stats-item" @click="$emit('handle-stats-click', 'following')">
          <div class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ following }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ $t('users.following') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const props = defineProps<{
  user: any;
  isFollowing: boolean;
  followers: number;
  following: number;
  isPublicBio: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-follow'): void;
  (e: 'select-tab', tab: string): void;
  (e: 'handle-stats-click', type: 'followers' | 'following'): void;
}>();

function formatDate(dateString: string) {
  if (!dateString) return '';
  return format(new Date(dateString), 'yyyy-MM-dd');
}
</script>

<style scoped>
.stats-item {
  @apply cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors py-2;
}
</style>