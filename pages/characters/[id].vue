<template>
  <div class="container py-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="!character && !isLoading" class="text-center py-12">
      <Icon name="heroicons:exclamation-circle" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('characters.notFound') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('characters.notFoundDesc') }}</p>
      <NuxtLink to="/" class="btn btn-primary">
        {{ $t('common.back') }}
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <CharactersCharacterCard
          :character="character"
          @start-chat="startChat"
        />
        
        <CharactersCommentSection
          :comments="comments"
          @submit-comment="submitComment"
        />
      </div>
      
      <div class="space-y-6">
        <CharactersCreatorInfo
          :creator="character.creator"
          :creator-avatar="creatorAvatar"
          :stats="creatorStats"
        />
        
        <CharactersPublicMemory
          :memories="memories"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoleplayStore } from '~/stores/roleplay';
import type { CharacterCard } from '~/types';

const route = useRoute();
const authStore = useAuthStore();
const roleplayStore = useRoleplayStore();

const isLoading = ref(true);
const character = ref<CharacterCard | null>(null);
const comments = ref<any[]>([]);
const memories = ref<any[]>([]);

// Mock creator data
const creatorAvatar = ref('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
const creatorStats = ref({
  characters: 16,
  followers: 245
});

onMounted(async () => {
  await loadCharacter();
  await loadComments();
  await loadMemories();
});

async function loadCharacter() {
  try {
    // In a real app, this would be an API call
    const allCharacters = await import('~/mock/characters.json');
    const foundCharacter = allCharacters.default.find(c => c.id === route.params.id);
    
    if (foundCharacter) {
      character.value = foundCharacter;
    }
  } catch (error) {
    console.error('Error loading character:', error);
  } finally {
    isLoading.value = false;
  }
}

async function loadComments() {
  // Mock comments data
  comments.value = [
    {
      id: 'comment1',
      user: {
        id: 'user1',
        username: 'User1',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      },
      content: '这个角色的设计非常棒！性格描写很到位。',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: 'comment2',
      user: {
        id: 'user2',
        username: 'User2',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      },
      content: '对话很自然，很有代入感。希望能有更多这样的角色！',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  ];
}

async function loadMemories() {
  // Mock memories data
  memories.value = [
    {
      id: 'memory1',
      user: {
        id: 'user1',
        username: 'User1',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      },
      messages: [
        {
          id: 'msg1',
          sender: 'user',
          content: '你对人工智能的未来发展有什么看法？'
        },
        {
          id: 'msg2',
          sender: 'character',
          content: '我认为AI将在未来扮演越来越重要的角色，但同时我们也需要注意伦理和安全问题。'
        }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    },
    {
      id: 'memory2',
      user: {
        id: 'user2',
        username: 'User2',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
      },
      messages: [
        {
          id: 'msg4',
          sender: 'user',
          content: '最近有什么有趣的科技新闻吗？'
        },
        {
          id: 'msg5',
          sender: 'character',
          content: '最近量子计算领域有一些突破性进展，我们可以讨论一下。'
        }
      ],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    }
  ];
}

function startChat() {
  if (!character.value) return;
  
  // Check if user is logged in
  if (!authStore?.isAuthenticated) {
    if (authStore) {
      authStore.setAuthModalVisibility(true);
    }
    return;
  }
  
  // Start chat and navigate to chat page
  roleplayStore.startChat(character.value);
  navigateTo('/chats');
}

async function submitComment(content: string) {
  if (!content.trim()) return;
  
  // In a real app, this would be an API call
  comments.value.unshift({
    id: `comment${Date.now()}`,
    user: {
      id: authStore?.user?.id,
      username: authStore?.user?.username,
      avatar: authStore?.user?.profileImage || '/images/avatars/default.jpg'
    },
    content: content,
    createdAt: new Date().toISOString()
  });
}
</script>