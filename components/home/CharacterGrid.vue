<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading && page === 1" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-gray-600">{{ $t('common.loading') }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="characters.length === 0" class="text-center py-10">
      <p class="text-gray-600">{{ $t('roleplay.noResults') }}</p>
      <button @click="$emit('reset-filters')"
        class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        {{ $t('roleplay.resetFilters') }}
      </button>
    </div>

    <!-- Character Grid -->
    <div v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 auto-rows-fr">
      <div v-for="character in characters" :key="character.id" class="min-w-0">
        <CommonCharacterCard :character="character" @view-character="$emit('view-character', $event)" class="h-full" />
      </div>
    </div>

    <!-- Loading More Indicator -->
    <div v-if="isLoading && page > 1" class="text-center py-4">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Intersection Observer Target -->
    <div v-if="hasMore" ref="loadMoreTrigger" class="h-10 -mt-10"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { CharacterCard } from '~/types';

// Define props
const props = defineProps<{
  characters: CharacterCard[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'view-character', character: CharacterCard): void;
  (e: 'start-chat', character: CharacterCard): void;
  (e: 'reset-filters'): void;
  (e: 'load-more'): void;
}>();

// Ref for intersection observer
const loadMoreTrigger = ref<HTMLElement | null>(null);

// Set up intersection observer
onMounted(() => {
  if (!loadMoreTrigger.value) return;

  const observer = new IntersectionObserver((entries) => {
    const target = entries[0];
    if (target && target.isIntersecting && !props.isLoading) {
      emit('load-more');
    }
  }, {
    rootMargin: '100px'
  });

  observer.observe(loadMoreTrigger.value);

  // Cleanup observer on component unmount
  onUnmounted(() => {
    observer.disconnect();
  });
});
</script>

<style scoped>
/* Responsive grid that adapts to container width rather than just viewport width */
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>