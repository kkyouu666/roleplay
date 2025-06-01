<template>
  <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref="messagesContainer">
    <div 
      v-for="message in messages" 
      :key="message.id"
      class="flex"
      :class="message.sender === 'user' ? 'justify-end' : 'justify-start'"
    >
      <div 
        class="max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 text-sm break-words whitespace-normal overflow-wrap-normal"
        :class="message.sender === 'user' 
          ? 'bg-indigo-600 text-white rounded-br-none' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'"
      >
        <p class="whitespace-pre-wrap break-words">
          {{ message.content }}
          <!-- 光标效果，只在流式传输时显示 -->
          <span 
            v-if="message.sender === 'character' && isStreamingMessage(message.id)"
            class="inline-block w-0.5 h-4 bg-gray-500 dark:bg-gray-400 animate-pulse ml-0.5"
          ></span>
        </p>
        <div 
          class="text-xs mt-1 text-right" 
          :class="message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'"
        >
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
    
    <!-- Typing indicator when waiting for character response -->
    <div v-if="isTypingCharacter && !hasStreamingMessage" class="flex justify-start">
      <div class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg rounded-bl-none px-4 py-2 text-sm">
        <div class="flex space-x-1 items-center">
          <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
          <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-100"></div>
          <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-200"></div>
          <span class="ml-2 text-gray-500 dark:text-gray-400 text-xs">{{ $t('roleplay.chat.typing') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, isToday, isYesterday } from 'date-fns';
import { computed, nextTick, ref, watch } from 'vue';
import { useRoleplayStore } from '~/stores/roleplay';
import type { ChatMessage } from '~/types';

const props = defineProps<{
  messages: ChatMessage[];
  isTyping: boolean;
}>();

const roleplayStore = useRoleplayStore();
const messagesContainer = ref<HTMLElement | null>(null);

// 计算属性：是否有正在流式传输的消息
const hasStreamingMessage = computed(() => {
  return roleplayStore.streamingMessageId !== null;
});

// 计算属性：AI是否正在输入
const isTypingCharacter = computed(() => {
  return roleplayStore.isTypingCharacter;
});

// 检查是否是正在流式传输的消息
function isStreamingMessage(messageId: string): boolean {
  return roleplayStore.streamingMessageId === messageId;
}

// Scroll to bottom when messages change or when streaming
watch(() => [props.messages, roleplayStore.streamingMessageId], () => {
  scrollToBottom();
}, { deep: true });

// 也监听消息内容的变化（用于流式更新）
watch(() => props.messages.map(m => m.content), () => {
  scrollToBottom();
}, { deep: true });

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
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
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}

.break-words {
  word-break: break-word;
}

.delay-100 {
  animation-delay: 100ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-indigo-500 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-indigo-600;
}
</style>