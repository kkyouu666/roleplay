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
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      <div v-for="character in characters" :key="character.id"
        class="relative group cursor-pointer overflow-hidden rounded-lg" @click="$emit('view-character', character)">
        <!-- Character Image -->
        <img :src="character.avatar" :alt="character.name" class="w-full aspect-[3/4] object-cover relative" />

        <!-- Stats Overlay (Top Right) -->
        <div class="absolute top-2 right-2 flex space-x-2">
          <div class="flex items-center bg-black/60 rounded-full px-2 py-0.5">
            <Icon name="heroicons:heart" class="w-4 h-4 text-pink-500 mr-0.5" />
            <span class="text-[12px] text-white">{{ character.stats.favorites }}</span>
          </div>
          <div class="flex items-center bg-black/60 rounded-full px-2 py-0.5">
            <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-0.5" />
            <span class="text-[12px] text-white">{{ character.stats.rating }}</span>
          </div>
        </div>

        <!-- Default Info Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex flex-col justify-end">
          <div class="space-y-1">
            <h3 class="text-lg sm:text-lg font-semibold text-white line-clamp-1 mb-1">{{ character.name }}</h3>

            <div class="flex items-center text-sm sm:text-xs text-white/80 mt-1">
              <span>{{ $t(`roleplay.categories.${character.category}`) }}</span>
            </div>

            <div class="flex flex-wrap gap-1.5 mt-2 overflow-hidden max-h-[50px]">
              <span v-for="tag in character.tags.slice(0, 3)" :key="tag"
                class="inline-block px-2 py-0.5 bg-white/20 text-white rounded-full text-xs sm:text-[10px] whitespace-nowrap">
                #{{ tag }}
              </span>
              <span v-if="character.tags.length > 3"
                class="inline-block px-2 py-0.5 bg-white/20 text-white rounded-full text-xs sm:text-[10px] whitespace-nowrap">
                +{{ character.tags.length - 3 }}
              </span>
            </div>

            <!-- Description (max 3 lines) -->
            <p class="text-sm sm:text-xs text-white/80 line-clamp-3 mt-2.5">
              {{ character.description }}
            </p>

            <!-- Bottom row with creator and chats -->
            <div class="flex justify-between items-center mt-3 pt-1.5 border-t border-white/20">
              <div class="flex items-center text-sm sm:text-xs text-white/60">
                <Icon name="heroicons:user-circle" class="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
                <span class="truncate max-w-[80px]">{{ character.creator.username }}</span>
              </div>

              <div class="flex items-center text-sm sm:text-xs text-white/60">
                <Icon name="heroicons:chat-bubble-left" class="w-4 h-4 sm:w-3 sm:h-3 mr-1" />
                <span>{{ character.stats.chats }}</span>
              </div>
            </div>
          </div>
        </div>

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
.line-clamp-3 {
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>