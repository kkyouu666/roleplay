<template>
  <NuxtLayout name="chat">
    <template #chat-list>
      <ChatsChatList />
    </template>

    <template #default>
      <div v-if="!authStore?.isAuthenticated" class="flex-1 flex items-center justify-center">
        <div class="text-center p-8">
          <Icon name="heroicons:chat-bubble-left-right" class="w-16 h-16 mx-auto text-indigo-500 mb-4" />
          <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('auth.loginRequired') }}</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('auth.loginToAccess') }}</p>
          <div class="flex justify-center">
            <button 
              class="btn btn-primary"
              @click="openAuthModal"
            >
              {{ $t('auth.login') }}
            </button>
          </div>
        </div>
      </div>
      
      <div v-else-if="!roleplayStore.activeChat" class="flex-1">
        <ChatsEmptyState />
      </div>
      
      <!-- Loading state for initial chat loading -->
      <div v-else-if="roleplayStore.isLoading && !roleplayStore.activeChat.messages.length" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</p>
        </div>
      </div>
      
      <!-- Loading state when switching between existing chats -->
      <div v-else-if="isLoadingChat === roleplayStore.activeChat.id" class="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
        <div class="text-center">
          <div class="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ $t('common.loading') }}</p>
        </div>
      </div>
      
      <div v-else class="flex-1 flex flex-col h-full bg-white dark:bg-gray-800">
        <ChatsChatHeader :character="roleplayStore.activeChat.character" />
        <ChatsChatMessages 
          :messages="roleplayStore.activeChat.messages"
          :is-typing="isWaitingForResponse"
        />
        <ChatsChatInput 
          :is-typing="isWaitingForResponse"
          @send="sendMessage"
        />
      </div>
    </template>

    <template #character-info>
      <ChatsCharacterInfo 
        v-if="roleplayStore.activeChat"
        :character="roleplayStore.activeChat.character"
      />
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoleplayStore } from '~/stores/roleplay';

const authStore = useAuthStore();
const roleplayStore = useRoleplayStore();
const isWaitingForResponse = ref(false);
const isLoadingChat = ref<string | null>(null);

function sendMessage(content: string) {
  if (!roleplayStore.activeChat || isWaitingForResponse.value) return;
  
  // Set waiting state
  isWaitingForResponse.value = true;
  
  roleplayStore.sendMessage(content);
  
  // Simulate waiting for character response
  setTimeout(() => {
    isWaitingForResponse.value = false;
  }, 1000); // This should match the delay in the roleplay store
}

function openAuthModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(true);
    authStore.setAuthModalMode('login');
  }
}
</script>