<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ mode === 'followers' ? $t('users.followers') : $t('users.following') }}
        </h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500"
        >
          <Icon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>
      
      <div class="max-h-96 overflow-y-auto">
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
        </div>
        
        <div v-else-if="users.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">
            {{ mode === 'followers' ? $t('users.noFollowers') : $t('users.noFollowing') }}
          </p>
        </div>
        
        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="followUser in users" 
            :key="followUser.id"
            class="py-3 flex items-center justify-between"
          >
            <div class="flex items-center">
              <NuxtLink :to="`/users/${followUser.id}`" class="flex items-center" @click="$emit('close')">
                <img 
                  :src="followUser.profileImage || '/images/avatars/default.jpg'" 
                  :alt="followUser.username" 
                  class="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <div class="font-medium text-gray-900 dark:text-gray-100">{{ followUser.username }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('users.characters') }}: {{ followUser.stats?.characters || 0 }}
                  </div>
                </div>
              </NuxtLink>
            </div>
            
            <button 
              v-if="mode === 'following' && isCurrentUser"
              class="text-sm text-gray-500 hover:text-red-500"
              @click="$emit('unfollow', followUser.id)"
            >
              {{ $t('users.unfollow') }}
            </button>
            <button 
              v-else-if="mode === 'followers' && isCurrentUser && !isFollowingUser(followUser.id)"
              class="text-sm text-indigo-600 hover:text-indigo-800"
              @click="$emit('follow', followUser.id)"
            >
              {{ $t('users.followBack') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  mode: 'followers' | 'following';
  users: any[];
  isLoading: boolean;
  isCurrentUser: boolean;
  followingUsers: string[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'follow', userId: string): void;
  (e: 'unfollow', userId: string): void;
}>();

function isFollowingUser(userId: string): boolean {
  return props.followingUsers.includes(userId);
}
</script>