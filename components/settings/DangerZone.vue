<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-red-600 dark:text-red-500">{{ $t('settings.dangerZone') }}</h2>

    <div class="space-y-6">
      <div class="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/50">
        <h3 class="text-lg font-medium text-red-800 dark:text-red-200 mb-2">{{ $t('settings.deleteAccount') }}</h3>
        <p class="text-sm text-red-600 dark:text-red-400 mb-4">{{ $t('settings.deleteAccountWarning') }}</p>

        <button type="button"
          class="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600"
          @click="showDeleteConfirm = true"
          :disabled="isDeleting">
          <span v-if="isDeleting" class="inline-flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            {{ $t('common.processing') }}
          </span>
          <span v-else>{{ $t('settings.deleteAccount') }}</span>
        </button>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <SettingsDeleteAccountModal 
      v-if="showDeleteConfirm" 
      v-model="form" 
      :is-deleting="isDeleting"
      @delete="deleteAccount"
      @close="showDeleteConfirm = false" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useApi } from '~/composables/useApi';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const api = useApi();
const { t } = useI18n();

const showDeleteConfirm = ref(false);
const isDeleting = ref(false);

let form = reactive({
  password: '',
  confirmText: ''
});

async function deleteAccount() {
  if (!authStore?.user?.id) return;
  
  if (!form.password) {
    alert(t('settings.passwordRequired'));
    return;
  }

  if (form.confirmText !== 'DELETE MY ACCOUNT') {
    alert(t('settings.confirmDeleteText'));
    return;
  }

  isDeleting.value = true;
  try {
    const response = await api.deleteAccount({
      userId: authStore.user.id,
      password: form.password,
      confirmText: form.confirmText
    });

    if (response.success) {
      // 显示成功消息
      alert(response.message || t('settings.accountDeleted'));
      
      // 登出用户
      if (authStore) {
        authStore.logout();
      }

      // 重定向到首页
      await navigateTo('/');
    }
  } catch (error: any) {
    console.error('Error deleting account:', error);
    alert(error.data?.message || t('common.error'));
  } finally {
    isDeleting.value = false;
    showDeleteConfirm.value = false;
    // 重置表单
    form.password = '';
    form.confirmText = '';
  }
}
</script>