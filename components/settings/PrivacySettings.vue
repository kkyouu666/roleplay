<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ $t('settings.privacy') }}</h2>

    <form @submit.prevent="savePrivacySettings">
      <div class="space-y-6">
        <!-- Profile Information Visibility -->
        <div>
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
            {{ $t('settings.profileInfoVisibility') }}</h3>

          <div class="space-y-4">
            <!-- Gender Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('settings.gender') }}
              </label>
              <select v-model="form.genderVisibility" class="input">
                <option value="public">{{ $t('settings.visibilityPublic') }}</option>
                <option value="characters">{{ $t('settings.visibilityCharacters') }}</option>
                <option value="private">{{ $t('settings.visibilityPrivate') }}</option>
              </select>
            </div>

            <!-- Birthday Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('settings.birthday') }}
              </label>
              <select v-model="form.birthdayVisibility" class="input">
                <option value="public">{{ $t('settings.visibilityPublic') }}</option>
                <option value="characters">{{ $t('settings.visibilityCharacters') }}</option>
                <option value="private">{{ $t('settings.visibilityPrivate') }}</option>
              </select>
            </div>

            <!-- Bio Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('settings.bio') }}
              </label>
              <select v-model="form.bioVisibility" class="input">
                <option value="public">{{ $t('settings.visibilityPublic') }}</option>
                <option value="characters">{{ $t('settings.visibilityCharacters') }}</option>
                <option value="private">{{ $t('settings.visibilityPrivate') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Content Visibility -->
        <div>
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('settings.contentVisibility') }}
          </h3>

          <div class="space-y-4">
            <!-- Favorites Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('settings.favoritesVisibility') }}
              </label>
              <select v-model="form.favoritesVisibility" class="input">
                <option value="public">{{ $t('settings.visibilityPublic') }}</option>
                <option value="private">{{ $t('settings.visibilityPrivate') }}</option>
              </select>
            </div>

            <!-- Likes Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('settings.likesVisibility') }}
              </label>
              <select v-model="form.likesVisibility" class="input">
                <option value="public">{{ $t('settings.visibilityPublic') }}</option>
                <option value="private">{{ $t('settings.visibilityPrivate') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- General Privacy Settings -->
        <div>
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('settings.generalPrivacy') }}
          </h3>

          <div class="space-y-3">
            <div class="flex items-center">
              <input id="data-personalization" type="checkbox" v-model="form.allowPersonalization"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="data-personalization" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('settings.allowPersonalization') }}
              </label>
            </div>

            <div class="flex items-center">
              <input id="data-analytics" type="checkbox" v-model="form.allowAnalytics"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="data-analytics" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('settings.allowAnalytics') }}
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

const { t } = useI18n();

const form = reactive({
  genderVisibility: 'public',
  birthdayVisibility: 'public',
  bioVisibility: 'public',
  favoritesVisibility: 'public',
  likesVisibility: 'public',
  allowPersonalization: true,
  allowAnalytics: true
});

async function savePrivacySettings() {
  // In a real app, you would call an API to update the user's privacy settings
  // For now, just show a success message
  alert(t('settings.privacySettingsUpdated'));
}
</script>