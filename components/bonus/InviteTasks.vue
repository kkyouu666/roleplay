<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <Icon name="heroicons:user-plus" class="w-5 h-5 text-pink-500 mr-2" />
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('bonus.inviteTasks') }}</h2>
      </div>
    </div>
    
    <div class="p-4">
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
      </div>
      
      <div v-else-if="tasks.length === 0" class="text-center py-8">
        <Icon name="heroicons:user-plus" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p class="text-gray-600 dark:text-gray-400">{{ $t('bonus.noHistory') }}</p>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="task in tasks" 
          :key="task.id" 
          class="flex flex-col p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          :class="{ 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800': task.completed }"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <Icon 
                :name="task.completed ? 'heroicons:check-circle' : 'heroicons:user-plus'" 
                class="w-5 h-5 mr-2" 
                :class="task.completed ? 'text-green-500' : 'text-pink-500'" 
              />
              <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ $t(`bonus.${getTaskTitleKey(task.title)}`) }}</h3>
            </div>
            
            <div class="flex items-center">
              <Icon name="heroicons:currency-yen" class="w-4 h-4 text-pink-500 mr-1" />
              <span class="text-pink-600 dark:text-pink-400 font-semibold">{{ task.reward }}</span>
            </div>
          </div>
          
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ $t(`bonus.${getTaskDescKey(task.description)}`) }}</p>
          
          <div v-if="task.progress !== undefined && task.maxProgress !== undefined" class="mt-1">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('bonus.progress') }}</span>
              <span class="text-xs text-gray-700 dark:text-gray-300 font-medium">{{ task.progress }}/{{ task.maxProgress }}</span>
            </div>
            <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div class="h-2 bg-pink-500 rounded-full" :style="`width: ${(task.progress / task.maxProgress) * 100}%`"></div>
            </div>
          </div>
          
          <div class="mt-3 flex justify-end">
            <button 
              v-if="!task.completed && task.progress === task.maxProgress"
              class="btn btn-secondary py-1 text-sm"
              @click="$emit('claim', task.id)"
            >
              {{ $t('bonus.claimReward') }}
            </button>
            <span 
              v-else-if="task.completed"
              class="text-sm text-green-500 dark:text-green-400 font-semibold"
            >
              {{ $t('bonus.completed') }}
            </span>
          </div>
        </div>
      </div>
      
      <!-- Invite Link Section -->
      <div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t('bonus.inviteLink') }}</span>
          <button 
            class="text-indigo-600 dark:text-indigo-400 text-sm hover:text-indigo-800 dark:hover:text-indigo-300"
            @click="$emit('copy-link')"
          >
            {{ $t('bonus.copy') }}
          </button>
        </div>
        <div class="mt-2 p-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 text-sm text-gray-500 dark:text-gray-300 truncate">
          {{ inviteLink }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    reward: number;
    completed: boolean;
    progress?: number;
    maxProgress?: number;
  }>;
  isLoading: boolean;
  inviteLink: string;
}>();

const emit = defineEmits<{
  (e: 'claim', taskId: string): void;
  (e: 'copy-link'): void;
}>();

function getTaskTitleKey(title: string): string {
  const keyMap = {
    '邀请用户': 'inviteUsers',
    '邀请付费用户': 'invitePremium'
  };
  return keyMap[title] || title;
}

function getTaskDescKey(desc: string): string {
  const keyMap = {
    '邀请新用户注册': 'inviteUsersDesc',
    '被邀请用户成为付费会员': 'invitePremiumDesc'
  };
  return keyMap[desc] || desc;
}
</script>