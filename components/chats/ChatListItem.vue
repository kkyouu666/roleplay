<template>
  <div
    class="relative group w-full select-none"
    :class="{ 
      'bg-indigo-50 dark:bg-indigo-900': isActive,
      'opacity-60': isLoading
    }"
    @contextmenu.prevent="showContextMenu"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @touchmove="handleTouchMove"
    @selectstart.prevent
  >
    <button
      class="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 select-none"
      :class="{ 
        'pointer-events-none': isLoading
      }"
      @click="$emit('select', chat.id)"
    >
      <div class="relative">
        <img 
          :src="chat.character.avatar" 
          :alt="chat.character.name" 
          class="w-10 h-10 rounded-full object-cover select-none pointer-events-none"
          draggable="false"
        />
        <!-- Loading indicator over avatar when this chat is loading -->
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
          <div class="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate select-none">{{ chat.character.name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 select-none">{{ formatTime(chat.timestamp) }}</p>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate select-none">
          <span v-if="isLoading">{{ $t('common.loading') }}...</span>
          <span v-else>{{ chat.lastMessage }}</span>
        </p>
      </div>
      
      <!-- Unread count badge -->
      <div v-if="chat.unreadCount && chat.unreadCount > 0" class="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] flex items-center justify-center select-none">
        {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
      </div>
    </button>

    <!-- Context Menu -->
    <div 
      v-if="showMenu"
      class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[120px]"
      @click.stop
    >
      <button
        class="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 select-none"
        @click="handleDelete"
      >
        <Icon name="heroicons:trash" class="w-4 h-4" />
        {{ $t('common.delete') }}
      </button>
    </div>

    <!-- Backdrop to close menu -->
    <div 
      v-if="showMenu"
      class="fixed inset-0 z-40"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { format, isToday, isYesterday } from 'date-fns';
import { onUnmounted, ref } from 'vue';
import type { ChatSession } from '~/composables/useApi';

const props = defineProps<{
  chat: ChatSession;
  isActive: boolean;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', chatId: string): void;
  (e: 'delete', chatId: string): void;
}>();

const showMenu = ref(false);
const longPressTimer = ref<NodeJS.Timeout | null>(null);
const touchStartTime = ref(0);
const touchMoved = ref(false);
const isLongPressing = ref(false);

function showContextMenu(event?: MouseEvent) {
  if (event) {
    event.preventDefault();
  }
  showMenu.value = true;
}

function closeMenu() {
  showMenu.value = false;
}

function handleDelete() {
  closeMenu();
  emit('delete', props.chat.id);
}

// Touch event handlers for mobile long press
function handleTouchStart(event: TouchEvent) {
  touchStartTime.value = Date.now();
  touchMoved.value = false;
  isLongPressing.value = false;
  
  // Start long press timer
  longPressTimer.value = setTimeout(() => {
    if (!touchMoved.value) {
      isLongPressing.value = true;
      // Prevent text selection
      event.preventDefault();
      
      // Trigger haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      showContextMenu();
    }
  }, 500); // 500ms for long press
}

function handleTouchEnd(event: TouchEvent) {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
  
  // If we were long pressing, prevent the default behavior
  if (isLongPressing.value) {
    event.preventDefault();
    isLongPressing.value = false;
  }
}

function handleTouchMove(event: TouchEvent) {
  touchMoved.value = true;
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
  
  // If we detect movement, cancel long press
  if (isLongPressing.value) {
    isLongPressing.value = false;
  }
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return `昨天 ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'MM-dd HH:mm');
  }
}

// Clean up timer on component unmount
onUnmounted(() => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
  }
});
</script>

<style scoped>
/* Additional CSS to prevent text selection */
.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}
</style>