<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div class="flex items-center">
        <Icon name="heroicons:calendar-days" class="w-5 h-5 text-indigo-500 mr-2" />
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('bonus.dailyTasks') }}</h2>
      </div>
      <div class="flex items-center">
        <span class="text-sm text-gray-500 dark:text-gray-400 mr-2">
          {{ $t('bonus.completed') }} {{ completedTasks }}/{{ totalTasks }}
        </span>
        <div class="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div class="h-2 bg-indigo-500 rounded-full" :style="`width: ${progress}%`"></div>
        </div>
      </div>
    </div>
    
    <div class="p-4">
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
      </div>
      
      <div v-else-if="tasks.length === 0" class="text-center py-8">
        <Icon name="heroicons:calendar" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p class="text-gray-600 dark:text-gray-400">{{ $t('bonus.noHistory') }}</p>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="task in tasks" 
          :key="task.id" 
          class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800': task.completed }"
        >
          <div>
            <div class="flex items-center">
              <Icon 
                :name="task.completed ? 'heroicons:check-circle' : 'heroicons:exclamation-circle'" 
                class="w-5 h-5 mr-2" 
                :class="task.completed ? 'text-green-500' : 'text-gray-400'" 
              />
              <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ $t(`bonus.${getTaskTitleKey(task.title)}`) }}</h3>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 ml-7">{{ $t(`bonus.${getTaskDescKey(task.description)}`) }}</p>
          </div>
          
          <div class="flex items-center">
            <div class="flex items-center mr-4">
              <Icon name="heroicons:currency-yen" class="w-4 h-4 text-indigo-500 mr-1" />
              <span class="text-indigo-600 dark:text-indigo-400 font-semibold">{{ task.reward }}</span>
            </div>
            
            <button 
              v-if="!task.completed && !task.claimed"
              class="btn btn-primary py-1 text-sm"
              @click="$emit('go-complete', task.id)"
            >
              {{ $t('bonus.goComplete') }}
            </button>
            <button 
              v-if="task.completed && !task.claimed"
              class="btn btn-primary py-1 text-sm"
              @click="$emit('claim', task.id)"
            >
              {{ $t('bonus.claim') }}
            </button>
            <span 
              v-if="task.completed && task.claimed" 
              class="text-sm text-green-500 dark:text-green-400 font-semibold"
            >
              {{ $t('bonus.completed') }}
            </span>
          </div>
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
    claimed?: boolean;
  }>;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'go-complete', taskId: string): void;
  (e: 'claim', taskId: string): void;
}>();

const completedTasks = computed(() => props.tasks.filter(task => task.completed && task.claimed).length);
const totalTasks = computed(() => props.tasks.length);
const progress = computed(() => (completedTasks.value / totalTasks.value) * 100);

function getTaskTitleKey(title: string): string {
  const keyMap = {
    '每日登录': 'dailyLogin',
    '每日聊天': 'dailyChat',
    '每日评论': 'dailyComment'
  };
  return keyMap[title] || title;
}

function getTaskDescKey(desc: string): string {
  const keyMap = {
    '登录获取奖励': 'dailyLoginDesc',
    '完成一次聊天': 'dailyChatDesc',
    '评论一个角色': 'dailyCommentDesc'
  };
  return keyMap[desc] || desc;
}
</script>