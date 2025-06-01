<template>
  <div v-if="authStore?.isAuthenticated">
    <!-- Loading state for chat list -->
    <div v-if="roleplayStore.isLoadingChats && !roleplayStore.chats.length" class="p-6 flex flex-col items-center justify-center space-y-4">
      <div class="w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</p>
    </div>
    
    <div v-else-if="roleplayStore.chats.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
      <p>{{ $t('roleplay.noChatsYet') }}</p>
      <NuxtLink 
        to="/"
        class="mt-4 inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
      >
        {{ $t('roleplay.exploreCharacters') }}
      </NuxtLink>
    </div>
    
    <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
      <ChatsChatListItem
        v-for="chat in roleplayStore.chats"
        :key="chat.id"
        :chat="chat"
        :is-active="roleplayStore.activeChat?.id === chat.id"
        :is-loading="isLoadingChat === chat.id"
        @select="loadChat"
        @delete="deleteChat"
      />
    </div>
  </div>
  
  <!-- For unauthenticated users, show login message -->
  <div v-else class="p-6 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-full">
    <Icon name="heroicons:lock-closed" class="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
    <p class="mb-4">{{ $t('auth.loginRequired') }}</p>
    <button 
      class="btn btn-primary"
      @click="openAuthModal"
    >
      {{ $t('auth.login') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoleplayStore } from '~/stores/roleplay';

const authStore = useAuthStore();
const roleplayStore = useRoleplayStore();
const isLoadingChat = ref<string | null>(null);

async function loadChat(chatId: string) {
  // 设置此特定聊天的加载状态
  isLoadingChat.value = chatId;
  
  try {
    // 调用store中的loadChat方法
    await roleplayStore.loadChat(chatId);
  } catch (error) {
    console.error('Error loading chat:', error);
  } finally {
    // 只有当这仍然是活跃的加载聊天时才清除加载状态
    if (isLoadingChat.value === chatId) {
      isLoadingChat.value = null;
    }
  }
}

async function deleteChat(chatId: string) {
  if (!confirm('确定要删除这个聊天吗？此操作无法撤销。')) {
    return;
  }

  try {
    await roleplayStore.deleteChat(chatId);
  } catch (error) {
    console.error('Error deleting chat:', error);
    alert('删除聊天失败，请稍后重试。');
  }
}

function openAuthModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(true);
    authStore.setAuthModalMode('login');
  }
}
</script>