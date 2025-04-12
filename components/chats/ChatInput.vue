<template>
  <div class="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
    <form @submit.prevent="sendMessage">
      <div class="flex">
        <input 
          type="text" 
          v-model="messageInput"
          class="input flex-1"
          :placeholder="$t('roleplay.chat.placeholder')"
          :disabled="isTyping"
        />
        <button 
          type="submit"
          class="ml-2 btn btn-primary"
          :disabled="!messageInput.trim() || isTyping"
        >
          <div class="flex items-center justify-center h-full">
            <div v-if="isTyping" class="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            <Icon v-else name="heroicons:paper-airplane" class="w-5 h-5" />
          </div>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  isTyping: boolean;
}>();

const emit = defineEmits<{
  (e: 'send', message: string): void;
}>();

const messageInput = ref('');

function sendMessage() {
  if (!messageInput.value.trim() || props.isTyping) return;
  
  emit('send', messageInput.value);
  messageInput.value = '';
}
</script>