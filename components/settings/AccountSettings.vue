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
            <input type="password" v-model="form.currentPassword" class="input" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.newPassword') }}
            </label>
            <input type="password" v-model="form.newPassword" class="input" minlength="6" required />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ $t('settings.passwordMinLength') }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.confirmNewPassword') }}
            </label>
            <input type="password" v-model="form.confirmNewPassword" class="input" minlength="6" required />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary" :disabled="isSaving || !isFormValid">
          <span v-if="isSaving" class="inline-flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            {{ $t('common.saving') }}
          </span>
          <span v-else>{{ $t('common.save') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useApi } from '~/composables/useApi';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const api = useApi();
const { t } = useI18n();

const isSaving = ref(false);

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
});

// 表单验证
const isFormValid = computed(() => {
  return form.currentPassword && 
         form.newPassword && 
         form.confirmNewPassword && 
         form.newPassword === form.confirmNewPassword &&
         form.newPassword.length >= 6;
});

async function saveAccountSettings() {
  if (!authStore?.user?.id) return;

  if (form.newPassword !== form.confirmNewPassword) {
    alert(t('settings.passwordsMustMatch'));
    return;
  }

  if (form.newPassword.length < 6) {
    alert(t('settings.passwordMinLength'));
    return;
  }

  isSaving.value = true;
  try {
    const response = await api.changePassword({
      userId: authStore.user.id,
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmNewPassword: form.confirmNewPassword
    });

    if (response.success) {
      // 显示成功消息
      alert(response.message || t('settings.accountSettingsUpdated'));
      
      // 重置表单
      form.currentPassword = '';
      form.newPassword = '';
      form.confirmNewPassword = '';
    }
  } catch (error: any) {
    console.error('Error changing password:', error);
    alert(error.data?.message || t('common.error'));
  } finally {
    isSaving.value = false;
  }
}
</script>