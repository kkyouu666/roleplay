<template>
    <div class="relative group cursor-pointer overflow-hidden rounded-lg shadow-md h-full flex flex-col"
        @click="$emit('view-character', character)">
        <!-- Character Image -->
        <img :src="character.avatar" :alt="character.name" class="w-full aspect-[3/4] object-cover flex-shrink-0" />

        <!-- Favorite Button (Top Right) -->
        <button
            class="absolute top-1.5 right-1.5 w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center bg-black/60 rounded-full hover:bg-black/80 transition-colors"
            @click.stop="toggleFavorite">
            <Icon name="heroicons:star" class="w-5 h-5"
                :class="isFavorited ? 'text-pink-500 fill-pink-500' : 'text-white'"
                :style="{ width: '1rem', height: '1rem', '@media (min-width: 640px)': { width: '1.5rem', height: '1.5rem' } }" />
        </button>

        <!-- Info Section (Bottom) -->
        <div
            class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-2 max-h-[75%] flex flex-col min-w-0">
            <!-- Character Name -->
            <h3 class="text-base sm:text-lg font-semibold text-white line-clamp-1 text-shadow mb-0 sm:mb-1">{{ character.name }}</h3>

            <!-- Category and Actions Row -->
            <div class="flex justify-between items-center mt-0.5 min-w-0">
                <span
                    class="text-[10px] sm:text-xs text-white/80 truncate mr-1">{{ $t(`roleplay.categories.${character.category}`) }}</span>
                <div class="flex items-center space-x-1 bg-black/30 pl-1.5 rounded-full flex-shrink-0">
                    <!-- Like Count -->
                    <div class="flex items-center">
                        <Icon name="heroicons:hand-thumb-up" class="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-0.5" />
                        <span class="text-[8px] sm:text-[10px] text-white">{{ character.stats.rating * 100 | 0 }}</span>
                    </div>

                    <!-- Favorite Count -->
                    <div class="flex items-center">
                        <Icon name="heroicons:star" class="w-3 h-3 sm:w-4 sm:h-4 text-pink-500 mr-0.5" />
                        <span class="text-[8px] sm:text-[10px] text-white">{{ character.stats.favorites }}</span>
                    </div>

                    <!-- Menu Dropdown -->
                    <div class="relative" ref="menuRef">
                        <button @click.stop="isMenuOpen = !isMenuOpen"
                            class="p-0.5 sm:p-1 rounded-full hover:bg-white/20 flex items-center justify-center">
                            <Icon name="heroicons:ellipsis-vertical" class="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </button>

                        <!-- Dropdown Menu -->
                        <div v-if="isMenuOpen"
                            class="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                            <button @click.stop="reportCharacter"
                                class="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                {{ $t('roleplay.characterInfo.report') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Description (3 lines max) -->
            <p class="text-[10px] sm:text-xs text-white/80 line-clamp-2 mt-1">
                {{ character.description }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-0.5 mt-1 overflow-hidden">
                <!-- NSFW/SFW Tag -->
                <span v-if="character.nsfw"
                    class="inline-flex items-center px-1 py-0.5 rounded-full text-[8px] sm:text-[10px] bg-red-400/70 text-white">
                    <Icon name="heroicons:eye-slash" class="w-2.5 h-2.5 mr-0.5" />
                    <span>NSFW</span>
                </span>

                <!-- Image Tag -->
                <span
                    class="inline-flex items-center justify-center px-1 py-0.5 rounded-full text-[8px] sm:text-[10px] bg-orange-400/70 text-white">
                    <Icon name="heroicons:photo" class="w-2.5 h-2.5" />
                </span>

                <!-- Other Tags -->
                <span v-if="character.tags.length > 0"
                    class="inline-block px-1 py-0.5 bg-black/50 text-white rounded-full text-[8px] sm:text-[10px] whitespace-nowrap">
                    #{{ character.tags[0] }}
                </span>
                <span v-if="character.tags.length > 1"
                    class="inline-block px-1 py-0.5 bg-black/50 text-white rounded-full text-[8px] sm:text-[10px] whitespace-nowrap">
                    #{{ character.tags[1] }}
                </span>
                <span v-if="character.tags.length > 2"
                    class="inline-block px-1 py-0.5 bg-black/50 text-white rounded-full text-[8px] sm:text-[10px] whitespace-nowrap">
                    +{{ character.tags.length - 2 }}
                </span>
            </div>

            <!-- Author and Rating -->
            <div class="flex justify-between items-center mt-0.5 pt-1 border-t border-white/20">
                <div class="flex items-center">
                    <Icon name="heroicons:user-circle" class="w-2.5 h-2.5 mr-0.5 text-white/70" />
                    <span
                        class="text-[8px] sm:text-[10px] text-white/70 truncate max-w-[60px] sm:max-w-[80px]">{{ character.creator.username }}</span>
                </div>

                <div class="flex items-center">
                    <div class="flex">
                        <Icon v-for="i in 5" :key="i"
                            :name="i <= Math.round(character.stats.rating) ? 'heroicons:star-solid' : 'heroicons:star'" 
                            class="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-yellow-400" />
                    </div>
                    <span class="text-[8px] sm:text-[10px] sm:text-xs text-white/70">{{ character.stats.rating.toFixed(1) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { onMounted, ref } from 'vue';
import type { CharacterCard } from '~/types';

const props = defineProps<{
    character: CharacterCard;
}>();

const emit = defineEmits<{
    (e: 'view-character', character: CharacterCard): void;
}>();

// Menu state
const isMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const isFavorited = ref(false);

// Close menu when clicking outside
onMounted(() => {
    if (process.client) {
        onClickOutside(menuRef, () => {
            isMenuOpen.value = false;
        });
    }
});

// Toggle favorite status
function toggleFavorite(event: Event) {
    event.stopPropagation();
    isFavorited.value = !isFavorited.value;
    // In a real app, you would call an API to update the favorite status
}

// Report character
function reportCharacter() {
    isMenuOpen.value = false;
    // In a real app, you would show a report dialog or navigate to a report page
    alert('Report functionality would be implemented here');
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    max-height: 2rem;
}

.line-clamp-3 {
    display: -webkit-box !important;
    -webkit-line-clamp: 3 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    max-height: 3.75rem;
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

/* Ensure the card maintains a minimum width */
@media (min-width: 640px) {
    .relative.group {
        min-width: 180px;
    }
    
    .line-clamp-1 {
        max-height: 1.75rem !important;
    }
}
</style>