<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-red-600 dark:text-red-500">{{ $t('settings.dangerZone') }}</h2>

    <div class="space-y-6">
      <div class="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/50">
        <h3 class="text-lg font-medium text-red-800 dark:text-red-200 mb-2">{{ $t('settings.deleteAccount') }}</h3>
        <p class="text-sm text-red-600 dark:text-red-400 mb-4">{{ $t('settings.deleteAccountWarning') }}</p>

        <button type="button"
          class="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600"
          @click="showDeleteConfirm = true">
          {{ $t('settings.deleteAccount') }}
        </button>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <SettingsDeleteAccountModal v-if="showDeleteConfirm" v-model="form" @delete="deleteAccount"
      @close="showDeleteConfirm = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const { t } = useI18n();
const showDeleteConfirm = ref(false);

const form = reactive({
  password: ''
});

async function deleteAccount() {
  if (!form.password) {
    alert(t('settings.passwordRequired'));
    return;
  }

  // In a real app, you would call an API to delete the user's account
  // For now, just log out the user
  if (authStore) {
    authStore.logout();
  }

  // Reset confirmation modal
  showDeleteConfirm.value = false;

  // Redirect to home page
  navigateTo('/');
}
</script>