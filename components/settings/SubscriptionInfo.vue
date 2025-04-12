<template>
  <div>
    <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('settings.subscription') }}</h2>
    <p class="text-gray-500 dark:text-gray-400 mb-6">{{ $t('settings.subscriptionDesc') }}</p>

    <div class="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ $t(`subscription.plans.${currentPlan}`) }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('settings.currentPlan') }}</p>
        </div>
        <NuxtLink to="/pricing" class="btn btn-primary text-sm">
          {{ currentPlan === 'free' ? $t('subscription.action.upgrade') : $t('subscription.action.manage') }}
        </NuxtLink>
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">{{ $t('settings.billingInformation') }}</h3>

      <div v-if="currentPlan !== 'free'"
        class="border border-gray-200 dark:border-gray-700 rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        <div class="p-4 flex justify-between items-center">
          <div>
            <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ $t('settings.nextBilling') }}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ nextBillingDate }}</p>
          </div>
          <span
            class="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-2.5 py-0.5 rounded-full">
            {{ $t('settings.active') }}
          </span>
        </div>

        <div class="p-4">
          <h4 class="font-medium mb-2 text-gray-900 dark:text-gray-100">{{ $t('settings.paymentMethod') }}</h4>
          <div class="flex items-center">
            <Icon name="heroicons:credit-card" class="w-5 h-5 text-gray-400 mr-2" />
            <span class="text-gray-900 dark:text-gray-100">•••• •••• •••• {{ lastFourDigits }}</span>
          </div>
        </div>
      </div>

      <div v-else
        class="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
        <Icon name="heroicons:credit-card" class="w-10 h-10 text-gray-400 mx-auto mb-2" />
        <p class="text-gray-500 dark:text-gray-400">{{ $t('settings.noPaymentMethod') }}</p>
        <NuxtLink to="/pricing"
          class="mt-2 inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
          {{ $t('subscription.action.subscribe') }}
        </NuxtLink>
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">{{ $t('settings.billing') }}</h3>

      <div v-if="currentPlan !== 'free'" class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('settings.date') }}
              </th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('settings.description') }}
              </th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('settings.amount') }}
              </th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ $t('settings.status') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(transaction, index) in transactions" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ transaction.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ transaction.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ transaction.amount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  {{ $t('settings.paid') }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else
        class="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
        <p class="text-gray-500 dark:text-gray-400">{{ $t('settings.noBillingHistory') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

// Get current plan from auth store
const currentPlan = computed(() => {
  return authStore?.user?.subscription || 'free' as 'free' | 'standard' | 'premium';
});

// Set default values for optional props
const nextBillingDate = '2025-05-01';
const lastFourDigits = '4242';
const transactions = [
  {
    date: '2025-04-01',
    description: 'Premium Plan - Monthly',
    amount: '$9.99'
  },
  {
    date: '2025-03-01',
    description: 'Premium Plan - Monthly',
    amount: '$9.99'
  }
];
</script>