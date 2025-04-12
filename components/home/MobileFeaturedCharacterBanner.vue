<template>
  <div class="mb-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 animate-pulse">
      <div class="relative h-full">
        <!-- Image placeholder -->
        <div class="absolute inset-0 bg-gray-200 dark:bg-gray-700"></div>
        
        <!-- Content placeholder -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
          <div class="absolute top-2 left-2 right-2 flex justify-between">
            <div class="h-6 w-20 bg-white/20 rounded-full"></div>
            <div class="h-6 w-32 bg-white/20 rounded-full"></div>
          </div>
          
          <div class="absolute bottom-6 left-6 right-6 space-y-2">
            <div class="h-7 w-3/4 bg-white/20 rounded"></div>
            <div class="space-y-1">
              <div class="h-4 w-full bg-white/20 rounded"></div>
              <div class="h-4 w-5/6 bg-white/20 rounded"></div>
            </div>
            <div class="flex gap-1 pt-2">
              <div class="h-6 w-16 bg-white/20 rounded-full"></div>
              <div class="h-6 w-16 bg-white/20 rounded-full"></div>
              <div class="h-6 w-16 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actual Banner -->
    <swiper
      v-else
      :modules="[SwiperAutoplay, SwiperPagination]"
      :slides-per-view="1"
      :loop="true"
      :pagination="{ clickable: true }"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      class="mobile-featured-swiper rounded-lg overflow-hidden shadow-md"
    >
      <swiper-slide 
        v-for="char in characters" 
        :key="char.id" 
        class="cursor-pointer"
        @click="$emit('view-details', char)"
      >
        <div class="relative rounded-lg overflow-hidden h-64">
          <img 
            :src="char.avatar" 
            :alt="char.name" 
            class="absolute inset-0 w-full h-full object-cover"
          />
          
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          
          <div class="absolute inset-0 flex flex-col justify-end p-6">
            <div class="absolute top-2 left-2 right-2 flex justify-between">
              <span class="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                {{ $t(`roleplay.categories.${char.category}`) }}
              </span>
              <div class="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center">
                <Icon name="heroicons:star" class="w-3 h-3 text-yellow-400 mr-1" />
                <span>{{ char.stats.rating }}</span>
                <span class="mx-1">•</span>
                <span>{{ char.stats.chats }}</span>
              </div>
            </div>
            
            <h2 class="text-lg font-bold text-white mb-1">{{ char.name }}</h2>
            
            <p class="text-white/90 text-xs mb-2 line-clamp-2">
              {{ char.description }}
            </p>
            
            <div class="flex flex-wrap gap-1 mb-1">
              <span 
                v-for="tag in char.tags.slice(0, 3)" 
                :key="tag"
                class="inline-block px-2 py-0.5 bg-white/20 text-white rounded-full text-xs"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import type { CharacterCard } from '~/types';

// Rename modules to avoid conflicts with component names
const SwiperAutoplay = Autoplay;
const SwiperPagination = Pagination;

defineProps<{
  characters: CharacterCard[];
  isLoading?: boolean;
}>();

defineEmits<{
  (e: 'start-chat', character: CharacterCard): void;
  (e: 'view-details', character: CharacterCard): void;
}>();
</script>

<style scoped>
.mobile-featured-swiper {
  --swiper-theme-color: #4f46e5;
  --swiper-pagination-bullet-inactive-color: #fff;
  --swiper-pagination-bullet-inactive-opacity: 0.5;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.swiper-pagination-bullet) {
  width: 6px;
  height: 6px;
  opacity: 0.7;
}

:deep(.swiper-pagination) {
  bottom: 8px !important;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>