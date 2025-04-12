<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ $t('settings.notifications') }}</h2>

    <form @submit.prevent="saveNotificationSettings">
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
        <button type="submit" class="btn btn-primary">
          {{ $t('common.save') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useNotificationStore } from '~/stores/notifications';

const notificationStore = useNotificationStore();
const { t } = useI18n();

const form = reactive<any>({
  emailEnabled: true,
  pushEnabled: true,
  messageNotifications: true,
  mentionNotifications: true,
  updateNotifications: true,
  marketingNotifications: false
});

async function saveNotificationSettings() {
  // Update notification settings in the store
  notificationStore.updateNotificationSettings(form);

  // Show success message
  alert(t('settings.notificationSettingsUpdated'));
}
</script>