<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ $t('settings.accountSettings') }}</h2>

    <form @submit.prevent="saveAccountSettings">
      <div class="mb-6">
        <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">{{ $t('settings.changePassword') }}</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.currentPassword') }}
            </label>
            <input type="password" v-model="form.currentPassword" class="input" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.newPassword') }}
            </label>
            <input type="password" v-model="form.newPassword" class="input" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.confirmNewPassword') }}
            </label>
            <input type="password" v-model="form.confirmNewPassword" class="input" />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">
          {{ $t('common.save') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useLanguageStore } from '~/stores/language';

const languageStore = useLanguageStore();
const { t } = useI18n();

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});

async function saveAccountSettings() {
  if (form.newPassword && form.newPassword !== form.confirmNewPassword) {
    alert(t('settings.passwordsMustMatch'));
    return;
  }

  // In a real app, you would call an API to update the user's account settings
  // For now, just show a success message
  alert(t('settings.accountSettingsUpdated'));

  // Reset password fields
  form.currentPassword = '';
  form.newPassword = '';
  form.confirmNewPassword = '';
}
</script>