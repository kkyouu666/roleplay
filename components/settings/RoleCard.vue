<template>
  <div 
    class="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden"
    :class="{ 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800': role.isDefault }"
  >
    <div class="relative">
      <!-- Role avatar -->
      <div class="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
        <img 
          v-if="role.avatar" 
          :src="role.avatar" 
          alt="Role avatar" 
          class="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800"
        />
        <div 
          v-else 
          class="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
        >
          <Icon name="heroicons:user-circle" class="w-10 h-10 text-gray-400" />
        </div>
      </div>
      
      <!-- Default badge -->
      <div v-if="role.isDefault" class="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
        {{ $t('settings.defaultRole') }}
      </div>
    </div>
    
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ role.name }}</h3>
      
      <div class="text-sm text-gray-500 dark:text-gray-400 mb-3">
        <div v-if="role.age" class="flex items-center">
          <span class="font-medium mr-1">{{ $t('settings.age') }}:</span> {{ role.age }}
        </div>
        <div v-else class="flex items-center">
          <span class="font-medium mr-1">{{ $t('settings.age') }}:</span> {{ $t('settings.notSpecified') }}
        </div>
      </div>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {{ role.bio || $t('settings.noBio') }}
      </p>
      
      <div class="flex justify-between">
        <button 
          @click="$emit('edit', role.id)"
          class="text-indigo-600 dark:text-indigo-400 text-sm hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          {{ $t('settings.editRole') }}
        </button>
        
        <div class="flex space-x-2">
          <button 
            v-if="!role.isDefault"
            @click="$emit('set-default', role.id)"
            class="text-green-600 dark:text-green-400 text-sm hover:text-green-800 dark:hover:text-green-300"
          >
            {{ $t('settings.setAsDefault') }}
          </button>
          
          <button 
            v-if="!role.isDefault"
            @click="$emit('delete', role.id)"
            class="text-red-600 dark:text-red-400 text-sm hover:text-red-800 dark:hover:text-red-300"
          >
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  role: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete', 'set-default']);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>