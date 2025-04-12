<template>
  <div class="container py-6">
    <!-- Login Required Message -->
    <div v-if="!authStore?.isAuthenticated" class="text-center py-12">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto">
        <Icon name="heroicons:currency-yen" class="w-16 h-16 mx-auto text-indigo-500 mb-4" />
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
    
    <div v-else>
      <!-- Points Balance Header -->
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center mb-4 md:mb-0">
            <div class="bg-white bg-opacity-20 rounded-full p-3 mr-4">
              <Icon name="heroicons:currency-yen" class="w-8 h-8" />
            </div>
            <div>
              <h1 class="text-2xl font-bold">{{ $t('bonus.pointsBalance') }}</h1>
              <p class="text-gray-100">{{ $t('bonus.pointsBalanceDesc') }}</p>
            </div>
          </div>
          
          <div class="bg-white bg-opacity-10 rounded-lg p-4">
            <p class="text-sm mb-1">{{ $t('bonus.currentBalance') }}</p>
            <div class="flex items-center">
              <Icon name="heroicons:currency-yen" class="w-6 h-6 mr-2" />
              <span class="text-3xl font-bold">{{ pointsStore.balance }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Tasks and Achievements -->
        <div class="lg:col-span-2 space-y-6">
          <BonusDailyTasks
            :tasks="pointsStore.dailyTasks"
            :is-loading="pointsStore.isLoading"
            @go-complete="goToTaskPage"
            @claim="completeTask"
          />
          
          <BonusInviteTasks
            :tasks="pointsStore.inviteTasks"
            :is-loading="pointsStore.isLoading"
            :invite-link="'https://example.com/register?ref=U12345'"
            @claim="completeTask"
            @copy-link="copyInviteLink"
          />
          
          <BonusAchievements
            :achievements="pointsStore.achievements"
            :is-loading="pointsStore.isLoading"
            @claim="claimAchievement"
          />
        </div>
        
        <!-- Right Column: Purchase and History -->
        <div class="space-y-6">
          <BonusPurchasePoints
            :purchases="pointsStore.purchases"
            :is-loading="pointsStore.isLoading"
            @purchase="purchasePoints"
          />
          
          <BonusPointsHistory
            :history="pointsStore.history"
            :is-loading="pointsStore.isLoading"
            :display-count="5"
            @view-all="showHistoryModal = true"
          />
        </div>
      </div>
    </div>
    
    <!-- Points History Modal -->
    <BonusPointsHistoryModal 
      :is-open="showHistoryModal" 
      @close="showHistoryModal = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { usePointsStore } from '~/stores/points';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const pointsStore = usePointsStore();
const showHistoryModal = ref(false);
const { t } = useI18n();

// Load points data
onMounted(async () => {
  if (authStore?.isAuthenticated) {
    await pointsStore.fetchPointsData();
  }
});

// Go to task page to complete task
function goToTaskPage(taskId: string) {
  // Navigate to the homepage or specific task page
  navigateTo('/');
}

// Complete task
async function completeTask(taskId: string) {
  await pointsStore.completeTask(taskId);
}

// Claim achievement
async function claimAchievement(achievementId: string) {
  await pointsStore.claimAchievement(achievementId);
}

// Purchase points
async function purchasePoints(purchaseId: string) {
  await pointsStore.purchasePoints(purchaseId);
}

// Copy invite link
function copyInviteLink() {
  navigator.clipboard.writeText('https://example.com/register?ref=U12345')
    .then(() => {
      alert('邀请链接已复制到剪贴板');
    })
    .catch((error) => {
      console.error('复制失败:', error);
      alert('复制失败，请手动复制');
    });
}

// Open auth modal
function openAuthModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(true);
    authStore.setAuthModalMode('login');
  }
}
</script>