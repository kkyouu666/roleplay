<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('characters.creator') }}</h2>
    </div>
    
    <div class="p-4">
      <NuxtLink :to="`/users/${creator.id}`" class="flex items-center">
        <img 
          :src="creatorAvatar" 
          :alt="creator.username"
          class="w-12 h-12 rounded-full object-cover"
        />
        <div class="ml-3">
          <div class="font-medium text-gray-900 dark:text-gray-100">{{ creator.username }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ stats.characters }} {{ $t('characters.charactersCreated') }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  creator: {
    id: string;
    username: string;
  };
  creatorAvatar: string;
  stats: {
    characters: number;
  };
}>();
</script>