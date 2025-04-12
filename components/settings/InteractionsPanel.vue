<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ $t('settings.interactions') }}</h2>

    <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex space-x-1">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" class="py-2 px-4 text-sm font-medium"
          :class="activeTab === tab.id ?
            'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' :
            'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
          {{ $t(tab.label) }}
        </button>
      </div>
    </div>

    <div class="pb-6">
      <!-- Likes -->
      <div v-if="activeTab === 'likes'" class="space-y-4">
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="!likes.length" class="text-center py-12">
          <Icon name="heroicons:heart" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">{{ $t('settings.noLikes') }}</p>
        </div>

        <div v-else>
          <div v-for="character in likes" :key="character.id"
            class="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-3">
            <img :src="character.avatar" :alt="character.name" class="w-16 h-16 rounded-lg object-cover mr-4" />

            <div class="flex-1 min-w-0">
              <h3 class="text-md font-semibold text-gray-900 dark:text-gray-100">{{ character.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t(`roleplay.categories.${character.category}`) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">{{ character.description }}</p>
            </div>

            <div class="flex flex-col items-end space-y-2">
              <div class="flex items-center">
                <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ character.stats.rating }}</span>
              </div>

              <div class="flex space-x-2">
                <button @click="viewCharacter(character.id)"
                  class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                  {{ $t('settings.viewCharacter') }}
                </button>
                <button @click="unlikeCharacter(character.id)"
                  class="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                  {{ $t('settings.unlike') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Favorites -->
      <div v-if="activeTab === 'favorites'" class="space-y-4">
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="!favorites.length" class="text-center py-12">
          <Icon name="heroicons:star" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">{{ $t('settings.noFavorites') }}</p>
        </div>

        <div v-else>
          <div v-for="character in favorites" :key="character.id"
            class="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-3">
            <img :src="character.avatar" :alt="character.name" class="w-16 h-16 rounded-lg object-cover mr-4" />

            <div class="flex-1 min-w-0">
              <h3 class="text-md font-semibold text-gray-900 dark:text-gray-100">{{ character.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t(`roleplay.categories.${character.category}`) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">{{ character.description }}</p>
            </div>

            <div class="flex flex-col items-end space-y-2">
              <div class="flex items-center">
                <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ character.stats.rating }}</span>
              </div>

              <div class="flex space-x-2">
                <button @click="viewCharacter(character.id)"
                  class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                  {{ $t('settings.viewCharacter') }}
                </button>
                <button @click="unfavoriteCharacter(character.id)"
                  class="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                  {{ $t('settings.unfavorite') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comments -->
      <div v-if="activeTab === 'comments'" class="space-y-4">
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="!comments.length" class="text-center py-12">
          <Icon name="heroicons:chat-bubble-left-text" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-500 dark:text-gray-400">{{ $t('settings.noComments') }}</p>
        </div>

        <div v-else>
          <div v-for="comment in comments" :key="comment.id"
            class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow mb-3">
            <div class="flex items-center mb-2">
              <img :src="comment.character.avatar" :alt="comment.character.name"
                class="w-8 h-8 rounded-full object-cover mr-2" />
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ comment.character.name }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(comment.timestamp) }}</p>
              </div>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ comment.content }}</p>

            <div class="flex justify-end space-x-2">
              <button @click="viewComment(comment.id)"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                {{ $t('settings.viewComment') }}
              </button>
              <button @click="deleteComment(comment.id)"
                class="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                {{ $t('settings.deleteComment') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const tabs = [
  { id: 'likes', label: 'notifications.likes' },
  { id: 'favorites', label: 'notifications.favorites' },
  { id: 'comments', label: 'notifications.comments' }
];

const activeTab = ref('likes');
const isLoading = ref(false);
const likes = ref<any>([]);
const favorites = ref<any>([]);
const comments = ref<any>([]);

onMounted(() => {
  loadData();
});

watch(activeTab, () => {
  loadData();
});

function loadData() {
  isLoading.value = true;

  // Mock data loading
  setTimeout(() => {
    if (activeTab.value === 'likes') {
      // Mock likes data
      likes.value = [
        {
          id: 'char_001',
          name: '美杜莎',
          avatar: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          description: '来自希腊神话的蛇发女妖，对视线接触非常敏感。她有着复杂的过去和神秘的力量。',
          category: 'fantasy',
          stats: {
            rating: 4.8,
            chats: 3250
          }
        },
        {
          id: 'char_002',
          name: '赤井秀一',
          avatar: 'https://images.unsplash.com/photo-1564510714747-69c3bc1fab41?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          description: 'FBI探员，代号"银色子弹"。冷静沉着，精通各种武器和格斗技巧，有着敏锐的观察力和推理能力。',
          category: 'anime',
          stats: {
            rating: 4.9,
            chats: 5680
          }
        }
      ];
    } else if (activeTab.value === 'favorites') {
      // Mock favorites data
      favorites.value = [
        {
          id: 'char_005',
          name: '雷神',
          avatar: 'https://images.unsplash.com/photo-1535063406830-27dfae54262a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          description: '风雨雷电之神，手持雷神之锤，保护九界安全。虽然勇猛无畏，但也逐渐学会了谦逊和智慧。',
          category: 'movie',
          stats: {
            rating: 4.6,
            chats: 6540
          }
        },
        {
          id: 'char_008',
          name: '梅长苏',
          avatar: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          description: '琅琊榜中的主角，原名林殊，用智谋和计策为冤死的赤焰军平反，同时辅佐明君即位。',
          category: 'original',
          stats: {
            rating: 4.9,
            chats: 7450
          }
        }
      ];
    } else if (activeTab.value === 'comments') {
      // Mock comments data
      comments.value = [
        {
          id: 'comment_001',
          character: {
            id: 'char_003',
            name: '夜神月',
            avatar: 'https://images.unsplash.com/photo-1581382575275-97901c2635b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
          },
          content: '这个角色的设计非常出色，特别是他的心理描写非常深刻。希望能增加更多有关Death Note的内容！',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
        },
        {
          id: 'comment_002',
          character: {
            id: 'char_016',
            name: '花木兰',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
          },
          content: '木兰的性格塑造的很好，勇敢又坚强，同时保持了对家庭的忠诚。但是希望能有更多关于她军中生活的细节。',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
        }
      ];
    }

    isLoading.value = false;
  }, 1000);
}

// Interaction handlers
function viewCharacter(characterId: string) {
  // In a real app, navigate to the character page
  navigateTo(`/characters/${characterId}`);
}

function unlikeCharacter(characterId: string) {
  // In a real app, call API to unlike character
  likes.value = likes.value.filter(char => char.id !== characterId);
}

function unfavoriteCharacter(characterId: string) {
  // In a real app, call API to unfavorite character
  favorites.value = favorites.value.filter(char => char.id !== characterId);
}

function viewComment(commentId: string) {
  // In a real app, navigate to the comment
  const comment = comments.value.find(c => c.id === commentId);
  if (comment) {
    navigateTo(`/characters/${comment.character.id}#comment-${commentId}`);
  }
}

function deleteComment(commentId: string) {
  // In a real app, call API to delete comment
  comments.value = comments.value.filter(c => c.id !== commentId);
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);

  // If less than 24 hours ago, show relative time
  if (new Date().getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  // Otherwise show formatted date
  return format(date, 'yyyy-MM-dd HH:mm');
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>