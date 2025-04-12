<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ $t('settings.myVirtualProfile') }}</h2>
            <button class="btn btn-primary" @click="showRoleEditor = true">
                {{ $t('settings.createRole') }}
            </button>
        </div>

        <div v-if="isLoading" class="flex justify-center py-12">
            <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="!roles.length" class="text-center py-12">
            <Icon name="heroicons:user-group" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400 mb-4">{{ $t('settings.noRoles') }}</p>
            <button class="btn btn-primary" @click="showRoleEditor = true">
                {{ $t('settings.createFirstRole') }}
            </button>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingsRoleCard v-for="role in roles" :key="role.id" :role="role" @edit="editRole"
                @delete="confirmDeleteRole" @set-default="setDefaultRole" />
        </div>

        <!-- Role Editor Modal -->
        <SettingsRoleEditor v-if="showRoleEditor" :role="editingRole" @save="saveRole" @close="closeRoleEditor" />

        <!-- Delete Role Confirmation Modal -->
        <div v-if="roleToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                <h3 class="text-lg font-bold mb-4 text-red-600 dark:text-red-500">{{ $t('settings.deleteRoleConfirm') }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                    {{ $t('settings.deleteRoleWarning', { roleName: roleToDelete.name }) }}
                </p>

                <div class="flex justify-end gap-3">
                    <button
                        class="btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        @click="roleToDelete = null">
                        {{ $t('common.cancel') }}
                    </button>

                    <button class="btn bg-red-600 text-white hover:bg-red-700" @click="deleteRole">
                        {{ $t('common.delete') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const isLoading = ref(false);

// State
const showRoleEditor = ref(false);
const editingRole = ref(null);
const roleToDelete = ref(null);
const roles = ref([
    {
        id: 'role_1',
        name: 'Default Role',
        age: 25,
        bio: 'This is my default personality for chatting with characters.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isDefault: true
    },
    {
        id: 'role_2',
        name: 'Fantasy Character',
        age: 32,
        bio: 'A brave adventurer seeking new quests and treasures.',
        avatar: 'https://images.unsplash.com/photo-1516914589923-f105f1535f88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        isDefault: false
    }
]);

// Role management functions
function editRole(roleId: string) {
    const role = roles.value.find(r => r.id === roleId);
    if (role) {
        editingRole.value = { ...role };
        showRoleEditor.value = true;
    }
}

function confirmDeleteRole(roleId: string) {
    const role = roles.value.find(r => r.id === roleId);
    if (role) {
        if (role.isDefault) {
            alert(t('settings.cannotDeleteDefault'));
            return;
        }
        roleToDelete.value = role;
    }
}

function deleteRole() {
    if (roleToDelete.value) {
        roles.value = roles.value.filter(r => r.id !== roleToDelete.value.id);
        roleToDelete.value = null;
    }
}

function setDefaultRole(roleId: string) {
    roles.value = roles.value.map(role => ({
        ...role,
        isDefault: role.id === roleId
    }));
}

function saveRole(role: any) {
    const index = roles.value.findIndex(r => r.id === role.id);
    if (index !== -1) {
        // Update existing role
        roles.value[index] = role;
    } else {
        // Add new role
        roles.value.push(role);
    }
    closeRoleEditor();
}

function closeRoleEditor() {
    showRoleEditor.value = false;
    editingRole.value = null;
}

// Load initial data
onMounted(async () => {
    isLoading.value = true;
    try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        roles.value = [
            {
                id: 'role_1',
                name: 'Default Role',
                age: 25,
                bio: 'This is my default personality for chatting with characters.',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                isDefault: true
            },
            {
                id: 'role_2',
                name: 'Fantasy Character',
                age: 32,
                bio: 'A brave adventurer seeking new quests and treasures.',
                avatar: 'https://images.unsplash.com/photo-1516914589923-f105f1535f88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
                isDefault: false
            }
        ];
    } catch (error) {
        console.error('Error loading roles:', error);
    } finally {
        isLoading.value = false;
    }
});
</script>