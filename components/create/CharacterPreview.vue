<template>
  <div class="p-4 space-y-6 h-full overflow-y-auto custom-scrollbar">
    <!-- Character Card Preview - Styled like Character Info panel -->
    <div class="text-center mb-6">
      <!-- Empty avatar placeholder -->
      <div v-if="!character.avatar || character.avatar === ''"
        class="w-32 h-32 rounded-full mx-auto border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <Icon name="heroicons:user-circle" class="w-16 h-16 text-gray-400 dark:text-gray-500" />
      </div>

      <!-- Actual avatar when available -->
      <img v-else :src="character.avatar" alt="Character preview" class="w-32 h-32 rounded-full object-cover mx-auto" />

      <div v-if="character.nsfw" class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
        NSFW
      </div>

      <h2 class="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        {{ character.name || t('create.preview.namePlaceholder') }}</h2>

      <div class="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span>{{ categoryName }}</span>
        <span class="mx-2">•</span>
        <div class="flex items-center">
          <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
          <span>{{ character.stats?.rating || 0 }}</span>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div>
        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          {{ t('common.description') }}
        </h4>
        <p class="text-sm text-gray-900 dark:text-gray-100">
          {{ character.description || t('create.preview.descriptionPlaceholder') }}
        </p>
      </div>

      <div>
        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          {{ t('common.tags') }}
        </h4>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in character.tags" :key="tag"
            class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
            #{{ tag }}
          </span>
          <span v-if="!character.tags || character.tags.length === 0"
            class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 rounded-full text-xs">
            #{{ t('create.preview.tagsPlaceholder') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Chat Simulation -->
    <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
      <div ref="messagesContainer"
        class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-4 space-y-4 max-h-60 overflow-y-auto custom-scrollbar">
        <div v-for="(message, index) in chatMessages" :key="index" class="flex"
          :class="message.sender === 'user' ? 'justify-end' : 'justify-start'">
          <div
            class="max-w-xs md:max-w-sm rounded-lg px-4 py-2 text-sm break-words whitespace-normal overflow-wrap-normal"
            :class="message.sender === 'user'
              ? 'bg-indigo-600 text-white rounded-br-none'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'">
            <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>
          </div>
        </div>

        <!-- Typing indicator when waiting for character response -->
        <div v-if="isTyping" class="flex justify-start">
          <div
            class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg rounded-bl-none px-4 py-2 text-sm">
            <div class="flex space-x-1 items-center">
              <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
              <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-100"></div>
              <div class="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse delay-200"></div>
              <span class="ml-2 text-gray-500 dark:text-gray-400 text-xs">{{ t('roleplay.chat.typing') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Message input simulation -->
      <div class="flex">
        <div class="flex-shrink-0 mr-2">
          <button @click="resetChat"
            class="btn h-full border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Reset chat">
            <Icon name="heroicons:arrow-path" class="w-5 h-5" />
          </button>
        </div>
        <input type="text" v-model="userInput" @keyup.enter="sendMessage" class="input flex-1"
          :placeholder="t('roleplay.chat.placeholder')" :disabled="isTyping" />
        <button class="ml-2 btn btn-primary" @click="sendMessage" :disabled="!userInput.trim() || isTyping">
          <Icon name="heroicons:paper-airplane" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CharacterCard } from '~/types';

const props = defineProps<{
  character: Partial<CharacterCard>
}>();

const { t } = useI18n();

// Chat state
const userInput = ref('');
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

// Chat messages
const chatMessages = ref<{ sender: 'user' | 'character', content: string }[]>([]);

// Initialize chat with greeting
onMounted(() => {
  resetChat();
});

// Watch for changes to character greeting and reset chat
watch(() => props.character.greeting, () => {
  resetChat();
});

// Get localized category name
const categoryName = computed(() => {
  if (!props.character.category) return '';

  return t(`roleplay.categories.${props.character.category}`);
});

// Reset chat to initial state
function resetChat() {
  chatMessages.value = [];
  // Add character's greeting message if it exists, otherwise use placeholder
  const greeting = props.character.greeting || t('create.preview.greetingPlaceholder');
  chatMessages.value.push({
    sender: 'character',
    content: greeting
  });

  // Scroll to bottom after chat reset
  nextTick(() => {
    scrollToBottom();
  });
}

// Send a message
function sendMessage() {
  if (!userInput.value.trim() || isTyping.value) return;

  // Add user message
  chatMessages.value.push({
    sender: 'user',
    content: userInput.value
  });

  // Clear input
  const sentMessage = userInput.value;
  userInput.value = '';

  // Scroll to bottom
  scrollToBottom();

  // Simulate character typing
  isTyping.value = true;

  // Generate character response
  setTimeout(() => {
    isTyping.value = false;

    // Simple response generation based on user input
    let response = '';

    if (sentMessage.toLowerCase().includes('hello') || sentMessage.toLowerCase().includes('hi')) {
      response = t('create.preview.characterResponse');
    } else if (sentMessage.toLowerCase().includes('who are you') || sentMessage.toLowerCase().includes('your name')) {
      response = `${props.character.name ? 'I am ' + props.character.name + '.' : ''} ${props.character.description || ''}`;
    } else if (sentMessage.toLowerCase().includes('help') || sentMessage.toLowerCase().includes('can you')) {
      response = "I'd be happy to help you. What do you need assistance with?";
    } else {
      response = "That's interesting! Tell me more about it.";
    }

    // Add character response
    chatMessages.value.push({
      sender: 'character',
      content: response
    });

    // Scroll to bottom again
    scrollToBottom();
  }, 1000);
}

// Scroll chat to bottom
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
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

.max-h-60 {
  max-height: 15rem;
}
</style>