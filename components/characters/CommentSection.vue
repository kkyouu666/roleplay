<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('characters.comments') }}</h2>
    </div>
    
    <div class="p-4">
      <!-- Comment Input -->
      <div v-if="authStore?.isAuthenticated" class="mb-6">
        <textarea 
          v-model="newComment"
          rows="3"
          class="input mb-2"
          :placeholder="$t('characters.writeComment')"
        ></textarea>
        <div class="flex justify-end">
          <button 
            class="btn btn-primary"
            @click="submitComment"
          >
            {{ $t('characters.submitComment') }}
          </button>
        </div>
      </div>
      
      <!-- Comments List -->
      <div v-if="comments.length > 0" class="space-y-4">
        <div 
          v-for="comment in comments" 
          :key="comment.id"
          class="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0"
        >
          <div class="flex items-start">
            <NuxtLink :to="`/users/${comment.user.id}`" class="flex-shrink-0">
              <img 
                :src="comment.user.avatar" 
                :alt="comment.user.username"
                class="w-10 h-10 rounded-full object-cover"
              />
            </NuxtLink>
            <div class="ml-3 flex-1">
              <div class="flex items-center justify-between">
                <NuxtLink 
                  :to="`/users/${comment.user.id}`"
                  class="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {{ comment.user.username }}
                </NuxtLink>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(comment.createdAt) }}
                </span>
              </div>
              <p class="mt-1 text-gray-600 dark:text-gray-400">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-8">
        <Icon name="heroicons:chat-bubble-left-right" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p class="text-gray-500 dark:text-gray-400">{{ $t('characters.noComments') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { format } from 'date-fns';

const authStore = useAuthStore();
const newComment = ref('');

const props = defineProps<{
  comments: any[];
}>();

const emit = defineEmits<{
  (e: 'submit-comment', content: string): void;
}>();

function formatDate(dateString: string) {
  return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
}

function submitComment() {
  if (!newComment.value.trim()) return;
  emit('submit-comment', newComment.value);
  newComment.value = '';
}
</script>