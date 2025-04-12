<template>
  <div class="mb-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="max-w-4xl mx-auto h-[220px] md:h-[270px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 animate-pulse">
      <div class="h-full flex">
        <!-- Image placeholder -->
        <div class="w-[165px] md:w-[300px] bg-gray-200 dark:bg-gray-700"></div>
        
        <!-- Content placeholder -->
        <div class="flex-grow bg-gradient-to-r from-indigo-700 to-purple-700 p-4 md:p-6">
          <div class="flex items-center mb-4 space-x-2">
            <div class="h-6 w-20 bg-white/20 rounded-full"></div>
            <div class="h-6 w-32 bg-white/20 rounded-full"></div>
          </div>
          <div class="h-8 md:h-10 w-3/4 bg-white/20 rounded mb-4"></div>
          <div class="space-y-2">
            <div class="h-4 w-full bg-white/20 rounded"></div>
            <div class="h-4 w-5/6 bg-white/20 rounded"></div>
          </div>
          <div class="flex gap-2 mt-6">
            <div class="h-8 md:h-10 w-28 bg-white/20 rounded"></div>
            <div class="h-8 md:h-10 w-28 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actual Banner -->
    <swiper
      v-else
      :modules="[SwiperAutoplay, SwiperPagination, SwiperNavigation]"
      :slides-per-view="1"
      :loop="true"
      :pagination="{ clickable: true }"
      :navigation="true"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      class="featured-swiper rounded-lg overflow-hidden"
    >
      <swiper-slide v-for="char in characters" :key="char.id">
        <div class="relative">
          <div class="mx-auto max-w-4xl flex h-[220px] md:h-[270px] rounded-lg overflow-hidden">
            <div class="flex-shrink-0 h-full">
              <div class="w-[165px] md:w-[300px] h-[220px] md:h-[270px] relative overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center">
                  <img 
                    :src="char.avatar" 
                    :alt="char.name" 
                    class="w-full h-full object-cover"
                    :style="{
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }"
                  />
                </div>
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20"></div>
              </div>
            </div>
            
            <div class="flex-grow flex flex-col justify-center p-4 md:p-6 bg-gradient-to-r from-indigo-700 to-purple-700">
              <div>
                <div class="flex items-center mb-2">
                  <span class="bg-white/20 text-white text-xs uppercase tracking-wider px-2 py-1 rounded-full">
                    {{ $t(`roleplay.categories.${char.category}`) }}
                  </span>
                  <div class="flex items-center ml-3 text-white/90">
                    <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{{ char.stats.rating }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ char.stats.chats }} {{ $t('characters.chats') }}</span>
                  </div>
                </div>
                
                <h1 class="text-xl md:text-3xl font-bold text-white mb-2">{{ char.name }}</h1>
                
                <p class="text-white/80 text-xs md:text-sm mb-3 line-clamp-2 md:line-clamp-3">
                  {{ char.description }}
                </p>
                
                <div class="flex flex-wrap gap-1 mb-3">
                  <span 
                    v-for="tag in char.tags.slice(0, 3)" 
                    :key="tag"
                    class="inline-block px-2 py-0.5 bg-white/20 text-white rounded-full text-xs"
                  >
                    #{{ tag }}
                  </span>
                </div>
                
                <div class="flex gap-2 md:gap-3 mt-2">
                  <button 
                    class="btn btn-primary text-xs md:text-sm py-1 md:py-2"
                    @click.stop="$emit('start-chat', char)"
                  >
                    {{ $t('roleplay.characterInfo.startChat') }}
                  </button>
                  
                  <button 
                    class="btn bg-white/20 text-white hover:bg-white/30 text-xs md:text-sm py-1 md:py-2"
                    @click.stop="$emit('view-details', char)"
                  >
                    {{ $t('characters.viewDetails') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import type { CharacterCard } from '~/types';

// Rename modules to avoid conflicts with component names
const SwiperAutoplay = Autoplay;
const SwiperPagination = Pagination;
const SwiperNavigation = Navigation;

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
.featured-swiper {
  --swiper-theme-color: #4f46e5;
  --swiper-navigation-size: 22px;
  --swiper-pagination-bullet-inactive-color: #fff;
  --swiper-pagination-bullet-inactive-opacity: 0.5;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  background-color: rgba(255, 255, 255, 0.25);
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

:deep(.swiper-button-next)::after,
:deep(.swiper-button-prev)::after {
  font-size: 16px;
  font-weight: bold;
}

:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  opacity: 0.7;
}

:deep(.swiper-pagination) {
  bottom: 10px !important;
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