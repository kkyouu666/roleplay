<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div class="flex items-center">
        <Icon name="heroicons:trophy" class="w-5 h-5 text-yellow-500 mr-2" />
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('bonus.achievements') }}</h2>
      </div>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ $t('bonus.completed') }} {{ completedCount }}/{{ totalCount }}
      </span>
    </div>
    
    <div class="p-4">
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
      </div>
      
      <div v-else-if="achievements.length === 0" class="text-center py-8">
        <Icon name="heroicons:trophy" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p class="text-gray-600 dark:text-gray-400">{{ $t('bonus.noHistory') }}</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.id" 
          class="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          :class="{
            'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800': achievement.completed,
            'bg-gray-50 dark:bg-gray-700/50': !achievement.completed && achievement.progress !== undefined && achievement.progress === achievement.maxProgress
          }"
        >
          <div class="flex items-start">
            <div class="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg mr-3 flex-shrink-0">
              <Icon 
                :name="achievement.icon" 
                class="w-6 h-6" 
                :class="achievement.completed ? 'text-yellow-500' : 'text-gray-500'" 
              />
            </div>
            
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ $t(`bonus.${getAchievementTitleKey(achievement.title)}`) }}</h3>
                <div class="flex items-center">
                  <Icon name="heroicons:currency-yen" class="w-4 h-4 text-yellow-500 mr-1" />
                  <span class="text-yellow-600 dark:text-yellow-400 font-semibold">{{ achievement.reward }}</span>
                </div>
              </div>
              
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ $t(`bonus.${getAchievementDescKey(achievement.description)}`) }}</p>
              
              <div v-if="achievement.progress !== undefined && achievement.maxProgress !== undefined" class="mt-2">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('bonus.progress') }}</span>
                  <span class="text-xs text-gray-700 dark:text-gray-300 font-medium">{{ achievement.progress }}/{{ achievement.maxProgress }}</span>
                </div>
                <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div class="h-2 bg-yellow-500 rounded-full" :style="`width: ${(achievement.progress / achievement.maxProgress) * 100}%`"></div>
                </div>
              </div>
              
              <div class="mt-3 flex justify-end">
                <button 
                  v-if="!achievement.completed && ((achievement.progress !== undefined && achievement.maxProgress !== undefined && achievement.progress >= achievement.maxProgress) || achievement.progress === undefined)"
                  class="btn py-1 px-3 text-sm bg-yellow-500 hover:bg-yellow-600 text-white"
                  @click="$emit('claim', achievement.id)"
                >
                  {{ $t('bonus.claimReward') }}
                </button>
                <span 
                  v-else-if="achievement.completed" 
                  class="text-sm text-green-500 dark:text-green-400 font-semibold"
                >
                  {{ $t('bonus.completed') }}
                </span>
                <span 
                  v-else 
                  class="text-sm text-gray-500 dark:text-gray-400"
                >
                  {{ $t('bonus.inProgress') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    reward: number;
    completed: boolean;
    icon: string;
    progress?: number;
    maxProgress?: number;
  }>;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'claim', achievementId: string): void;
}>();

const completedCount = computed(() => props.achievements.filter(a => a.completed).length);
const totalCount = computed(() => props.achievements.length);

function getAchievementTitleKey(title: string): string {
  const keyMap = {
    '初次点赞': 'firstLike',
    '初次评论': 'firstComment',
    '初次收藏': 'firstFavorite',
    '初次创作': 'firstCreation',
    '连续登录': 'loginStreak',
    '角色大师': 'characterMaster',
    '受欢迎创作者': 'popularCreator',
    '聊天达人': 'chatMaster'
  };
  return keyMap[title] || title;
}

function getAchievementDescKey(desc: string): string {
  const keyMap = {
    '第一次点赞角色': 'firstLikeDesc',
    '第一次评论角色': 'firstCommentDesc',
    '第一次收藏角色': 'firstFavoriteDesc',
    '创建第一个角色': 'firstCreationDesc',
    '连续登录7天': 'loginStreakDesc',
    '创建10个角色': 'characterMasterDesc',
    '角色获得100个点赞': 'popularCreatorDesc',
    '完成100次聊天': 'chatMasterDesc'
  };
  return keyMap[desc] || desc;
}
</script>