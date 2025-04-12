<template>
  <div class="fixed inset-0 overflow-y-auto z-50" @click.self="handleClose">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0" @click.stop>
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75"
        :class="{ 'transition-opacity duration-300': isMobile, 'opacity-0': isClosing && isMobile, 'opacity-100': !isClosing || !isMobile }"
        @click="handleBackdropClick"></div>
      <!-- Desktop Modal -->
      <div
        class="hidden sm:inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <div class="grid grid-cols-3">
          <!-- Character Image -->
          <div class="col-span-1 bg-gray-100">
            <img :src="character.avatar" :alt="character.name" class="w-full h-full object-cover" />
          </div>

          <!-- Character Info -->
          <div class="col-span-2 p-6">
            <div class="mb-4">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ character.name }}</h2>
                <div class="flex items-center space-x-3">
                  <div class="flex space-x-2">
                    <button class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                      <Icon name="heroicons:heart" class="w-5 h-5" />
                    </button>
                    <button class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                      <Icon name="heroicons:share" class="w-5 h-5" />
                    </button>
                  </div>
                  <button class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                    @click="handleClose">
                    <Icon name="heroicons:x-mark" class="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div class="flex items-center mt-1">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ $t(`roleplay.categories.${character.category}`) }}
                </span>
                <div class="mx-2 text-gray-500">•</div>
                <div class="flex items-center text-sm text-gray-500">
                  <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
                  {{ character.stats.rating }} ({{ character.stats.chats }} chats)
                </div>
              </div>
            </div>

            <div class="mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('roleplay.characterInfo.creator') }}</h3>
              <NuxtLink :to="`/users/${character.creator.id}`"
                class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
                <span>{{ character.creator.username }}</span>
              </NuxtLink>
            </div>

            <div class="mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                {{ $t('roleplay.characterInfo.created') }}</h3>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(character.createdAt) }}</p>
            </div>

            <div class="mb-4">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('common.description') }}</h3>
              <p class="text-sm text-gray-900 dark:text-gray-100 mt-1">{{ character.description }}</p>
            </div>

            <div class="mb-6">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{{ $t('common.tags') }}</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in character.tags" :key="tag"
                  class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                  #{{ tag }}
                </span>
              </div>
            </div>

            <div class="mt-6">
              <div class="flex gap-3">
                <NuxtLink :to="`/characters/${character.id}`"
                  class="flex-1 btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  {{ $t('characters.viewDetails') }}
                </NuxtLink>
                <button class="flex-1 btn btn-primary" @click="$emit('start-chat', character)">
                  {{ $t('roleplay.characterInfo.startChat') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Bottom Sheet -->
      <div class="sm:hidden fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-out z-10"
        :class="{ 'translate-y-0': !isClosing, 'translate-y-full': isClosing }" @touchstart="touchStart"
        @touchmove="touchMove" @touchend="touchEnd">
        <div class="bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto"
          ref="bottomSheetRef">
          <!-- Character Image -->
          <div class="relative w-full h-64">
            <img :src="character.avatar" :alt="character.name" class="w-full h-full object-cover" />
            <button
              class="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white flex items-center justify-center"
              @click="closeWithAnimation">
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-4">
            <div class="mb-4">
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ character.name }}</h2>

              <div class="flex items-center space-x-2 mb-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ $t(`roleplay.categories.${character.category}`) }}
                </span>
                <div class="flex items-center text-sm text-gray-500">
                  <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
                  {{ character.stats.rating }}
                </div>
              </div>

              <p class="text-sm text-gray-600 dark:text-gray-400">{{ character.description }}</p>
            </div>

            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in character.tags" :key="tag"
                class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                #{{ tag }}
              </span>
            </div>

            <div class="flex items-center justify-between mb-4 text-sm">
              <NuxtLink :to="`/users/${character.creator.id}`"
                class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
                <span>{{ character.creator.username }}</span>
              </NuxtLink>

              <span class="text-gray-500 dark:text-gray-400">
                {{ formatDate(character.createdAt) }}
              </span>
            </div>

            <div class="flex gap-3 pt-2 pb-6">
              <NuxtLink :to="`/characters/${character.id}`"
                class="flex-1 btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                {{ $t('characters.viewDetails') }}
              </NuxtLink>
              <button class="flex-1 btn btn-primary" @click="$emit('start-chat', character)">
                {{ $t('roleplay.characterInfo.startChat') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { CharacterCard } from '~/types';
import { useWindowSize } from '@vueuse/core';

const props = defineProps<{
  character: CharacterCard
}>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'start-chat', character: CharacterCard): void
}>();

const { width } = useWindowSize();
const isMobile = computed(() => width.value < 640); // sm breakpoint is 640px

const isClosing = ref(false);
const bottomSheetRef = ref<HTMLElement | null>(null);
const touchStartY = ref(0);
const currentTranslateY = ref(0);
const sheetHeight = ref(0);
const dragThreshold = 100; // Pixels to drag before closing

// Initialize with animation
onMounted(() => {
  // Start with the sheet offscreen
  isClosing.value = true;

  // Then animate it in after a brief delay
  setTimeout(() => {
    isClosing.value = false;
  }, 50);

  // Get the height of the bottom sheet for drag calculations
  if (bottomSheetRef.value) {
    sheetHeight.value = bottomSheetRef.value.offsetHeight;
  }

  // Add event listener for escape key
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeWithAnimation();
  }
}

function handleClose() {
  if (isMobile.value) {
    closeWithAnimation();
  } else {
    emit('close');
  }
}

function handleBackdropClick() {
  if (isMobile.value) {
    closeWithAnimation();
  } else {
    emit('close');
  }
}

function closeWithAnimation() {
  isClosing.value = true;
  setTimeout(() => emit('close'), 300); // Match the duration of the CSS transition
}

// Touch event handlers for dragging
function touchStart(e: TouchEvent) {
  touchStartY.value = e.touches[0].clientY;
  currentTranslateY.value = 0;

  // Change transition during drag for more responsive feel
  if (bottomSheetRef.value) {
    bottomSheetRef.value.style.transition = 'none';
  }
}

function touchMove(e: TouchEvent) {
  if (!bottomSheetRef.value) return;

  const touchY = e.touches[0].clientY;
  const deltaY = touchY - touchStartY.value;

  // Only allow dragging downward
  if (deltaY < 0) return;

  currentTranslateY.value = deltaY;
  bottomSheetRef.value.style.transform = `translateY(${deltaY}px)`;
}

function touchEnd() {
  if (!bottomSheetRef.value) return;

  // Reset transition for smooth animation
  bottomSheetRef.value.style.transition = 'transform 0.3s ease-out';

  // If dragged past threshold, close the modal
  if (currentTranslateY.value > dragThreshold) {
    closeWithAnimation();
  } else {
    // Otherwise snap back to position
    bottomSheetRef.value.style.transform = 'translateY(0)';
  }
}

function formatDate(dateString: string) {
  return format(new Date(dateString), 'yyyy-MM-dd');
}
</script>

<style scoped>
/* Prevent scrolling on body when modal is open */
:global(body.modal-open) {
  overflow: hidden;
}

/* Smooth drag animation */
.ease-out {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>