<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ $t('settings.notifications') }}</h2>

    <div v-if="isLoading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
    </div>

    <form v-else @submit.prevent="saveNotificationSettings">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">{{ $t('settings.emailNotifications') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('settings.emailNotificationsDesc') }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.emailEnabled" class="sr-only peer">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600">
            </div>
          </label>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">{{ $t('settings.pushNotifications') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('settings.pushNotificationsDesc') }}</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.pushEnabled" class="sr-only peer">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600">
            </div>
          </label>
        </div>

        <div class="mt-6">
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('settings.notificationTypes') }}
          </h3>

          <div class="space-y-3">
            <div class="flex items-center">
              <input id="notifications-messages" type="checkbox" v-model="form.messageNotifications"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="notifications-messages" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('settings.messageNotifications') }}
              </label>
            </div>

            <div class="flex items-center">
              <input id="notifications-mentions" type="checkbox" v-model="form.mentionNotifications"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="notifications-mentions" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('settings.mentionNotifications') }}
              </label>
            </div>

            <div class="flex items-center">
              <input id="notifications-updates" type="checkbox" v-model="form.updateNotifications"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="notifications-updates" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('settings.updateNotifications') }}
              </label>
            </div>

            <div class="flex items-center">
              <input id="notifications-marketing" type="checkbox" v-model="form.marketingNotifications"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="notifications-marketing" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('settings.marketingNotifications') }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button type="submit" class="btn btn-primary" :disabled="isSaving">
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
import { onMounted, reactive, ref } from 'vue';
import { useApi } from '~/composables/useApi';
import { useAuthStore } from '~/stores/auth';
import { useNotificationStore } from '~/stores/notifications';

const authStore = useAuthStore();
const api = useApi();
const notificationStore = useNotificationStore();
const { t } = useI18n();

const isLoading = ref(false);
const isSaving = ref(false);

const form = reactive({
  emailEnabled: true,
  pushEnabled: true,
  messageNotifications: true,
  mentionNotifications: true,
  updateNotifications: true,
  marketingNotifications: false
});

// 在组件挂载时加载用户设置
onMounted(async () => {
  await loadNotificationSettings();
});

// 加载通知设置数据
async function loadNotificationSettings() {
  if (!authStore?.user?.id) return;
  
  isLoading.value = true;
  try {
    const response = await api.getUserSettings(authStore.user.id);
    if (response.success) {
      const { notifications } = response.settings;
      form.emailEnabled = notifications.emailEnabled;
      form.pushEnabled = notifications.pushEnabled;
      form.messageNotifications = notifications.messageNotifications;
      form.mentionNotifications = notifications.mentionNotifications;
      form.updateNotifications = notifications.updateNotifications;
      form.marketingNotifications = notifications.marketingNotifications;
    }
  } catch (error) {
    console.error('Error loading notification settings:', error);
  } finally {
    isLoading.value = false;
  }
}

async function saveNotificationSettings() {
  if (!authStore?.user?.id) return;

  isSaving.value = true;
  try {
    const response = await api.updateNotificationSettings({
      userId: authStore.user.id,
      emailEnabled: form.emailEnabled,
      pushEnabled: form.pushEnabled,
      messageNotifications: form.messageNotifications,
      mentionNotifications: form.mentionNotifications,
      updateNotifications: form.updateNotifications,
      marketingNotifications: form.marketingNotifications
    });

    if (response.success) {
      // 更新通知store中的设置 - 映射到store期望的字段
      notificationStore.updateNotificationSettings({
        emailNotifications: form.emailEnabled,
        pushNotifications: form.pushEnabled,
        likeNotifications: form.messageNotifications,
        favoriteNotifications: form.mentionNotifications,
        commentNotifications: form.updateNotifications,
        replyNotifications: form.marketingNotifications
      });
      
      // 显示成功消息
      alert(response.message || t('settings.notificationSettingsUpdated'));
    }
  } catch (error: any) {
    console.error('Error saving notification settings:', error);
    alert(error.data?.message || t('common.error'));
  } finally {
    isSaving.value = false;
  }
}
</script>