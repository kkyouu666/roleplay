<template>
  <div class="container py-6">
    <div v-if="!authStore?.isAuthenticated" class="text-center py-12">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto">
        <Icon name="heroicons:user-circle" class="w-16 h-16 mx-auto text-indigo-500 mb-4" />
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('auth.loginRequired') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('auth.loginToAccess') }}</p>
        <div class="flex justify-center">
          <button class="btn btn-primary" @click="openAuthModal">
            {{ $t('auth.login') }}
          </button>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- Mobile View - Hierarchical Navigation -->
      <div class="md:hidden">
        <!-- Back button when viewing a section -->
        <div v-if="showMobileSection" class="mb-4">
          <button @click="showMobileSection = false" class="flex items-center text-indigo-600 dark:text-indigo-400">
            <Icon name="heroicons:arrow-left" class="w-5 h-5 mr-2" />
            <span>{{ $t('common.back') }}</span>
          </button>
        </div>

        <!-- Settings Menu List (first level) -->
        <div v-if="!showMobileSection" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ $t('navigation.settings') }}</h2>
          </div>

          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <button v-for="(item, index) in profileMenuItems" :key="index"
              class="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between text-gray-700 dark:text-gray-300"
              @click="selectMobileSection(item.id)">
              <div class="flex items-center gap-3">
                <Icon :name="item.icon" class="w-5 h-5" />
                <span>{{ $t(item.label) }}</span>
              </div>
              <Icon name="heroicons:chevron-right" class="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Settings Content (second level) -->
        <div v-if="showMobileSection" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div v-if="currentSection === 'personal'">
            <SettingsPersonalInfo />
          </div>

          <div v-else-if="currentSection === 'roles'">
            <SettingsRolesSection />
          </div>

          <div v-else-if="currentSection === 'interactions'">
            <SettingsInteractionsPanel />
          </div>

          <div v-else-if="currentSection === 'account'">
            <SettingsAccountSettings />
          </div>

          <div v-else-if="currentSection === 'notifications'">
            <SettingsNotificationSettings />
          </div>

          <div v-else-if="currentSection === 'privacy'">
            <SettingsPrivacySettings />
          </div>

          <div v-else-if="currentSection === 'subscription'">
            <SettingsSubscriptionInfo />
          </div>

          <div v-else-if="currentSection === 'danger'">
            <SettingsDangerZone />
          </div>
        </div>
      </div>

      <!-- Desktop View - Side-by-side Layout -->
      <div class="hidden md:grid md:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <div class="md:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ $t('navigation.settings') }}</h2>
            </div>

            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <button v-for="(item, index) in profileMenuItems" :key="index"
                class="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300"
                :class="{ 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300': currentSection === item.id }"
                @click="currentSection = item.id">
                <Icon :name="item.icon" class="w-5 h-5" />
                <span>{{ $t(item.label) }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="md:col-span-3">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div v-if="currentSection === 'personal'">
              <SettingsPersonalInfo />
            </div>

            <!-- My Roles -->
            <div v-else-if="currentSection === 'roles'">
              <SettingsRolesSection />
            </div>

            <!-- Interactions -->
            <div v-else-if="currentSection === 'interactions'">
              <SettingsInteractionsPanel />
            </div>

            <!-- Account Settings -->
            <div v-else-if="currentSection === 'account'">
              <SettingsAccountSettings />
            </div>

            <!-- Notifications -->
            <div v-else-if="currentSection === 'notifications'">
              <SettingsNotificationSettings />
            </div>

            <!-- Privacy -->
            <div v-else-if="currentSection === 'privacy'">
              <SettingsPrivacySettings />
            </div>

            <!-- Subscription -->
            <div v-else-if="currentSection === 'subscription'">
              <SettingsSubscriptionInfo />
            </div>

            <!-- Danger Zone -->
            <div v-else-if="currentSection === 'danger'">
              <SettingsDangerZone />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const currentSection = ref('personal');
const showMobileSection = ref(false);

// For responsive design
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);

// Settings menu items
const profileMenuItems = [
  { id: 'personal', icon: 'heroicons:user', label: 'settings.userInfo' },
  { id: 'roles', icon: 'heroicons:user-group', label: 'settings.myVirtualProfile' },
  { id: 'interactions', icon: 'heroicons:heart', label: 'settings.interactions' },
  { id: 'account', icon: 'heroicons:cog-6-tooth', label: 'settings.accountSettings' },
  { id: 'notifications', icon: 'heroicons:bell', label: 'settings.notifications' },
  { id: 'privacy', icon: 'heroicons:lock-closed', label: 'settings.privacy' },
  { id: 'subscription', icon: 'heroicons:credit-card', label: 'settings.subscription' },
  { id: 'danger', icon: 'heroicons:exclamation-triangle', label: 'settings.dangerZone' }
];

// Function to select a section in mobile view
function selectMobileSection(sectionId: string) {
  currentSection.value = sectionId;
  showMobileSection.value = true;
}

// Reset mobile view when switching to desktop
watch(isMobile, (newValue) => {
  if (!newValue) {
    showMobileSection.value = false;
  }
});

function openAuthModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(true);
    authStore.setAuthModalMode('login');
  }
}
</script>

<style scoped>
/* Additional profile page styles can be added here */
.dark .bg-red-900\/50 {
  background-color: rgb(127, 29, 29, 0.5);
}
</style>