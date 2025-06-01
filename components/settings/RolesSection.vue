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

                    <button class="btn bg-red-600 text-white hover:bg-red-700" @click="deleteRole" :disabled="isDeleting">
                        <span v-if="isDeleting" class="inline-flex items-center">
                            <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            {{ $t('common.processing') }}
                        </span>
                        <span v-else>{{ $t('common.delete') }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApi, type UserRole } from '~/composables/useApi';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const api = useApi();
const { t } = useI18n();

// 状态管理
const isLoading = ref(false);
const isDeleting = ref(false);
const isSaving = ref(false);
const showRoleEditor = ref(false);
const editingRole = ref<UserRole | null>(null);
const roleToDelete = ref<UserRole | null>(null);
const roles = ref<UserRole[]>([]);

// 在组件挂载时加载角色数据
onMounted(async () => {
  await loadUserRoles();
});

// 加载用户角色数据
async function loadUserRoles() {
  if (!authStore?.user?.id) return;
  
  isLoading.value = true;
  try {
    const response = await api.getUserRoles(authStore.user.id);
    if (response.success) {
      roles.value = response.roles;
    }
  } catch (error) {
    console.error('Error loading user roles:', error);
  } finally {
    isLoading.value = false;
  }
}

// 编辑角色
function editRole(roleId: string) {
    const role = roles.value.find(r => r.id === roleId);
    if (role) {
        editingRole.value = { ...role };
        showRoleEditor.value = true;
    }
}

// 确认删除角色
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

// 删除角色
async function deleteRole() {
    if (!roleToDelete.value || !authStore?.user?.id) return;

    isDeleting.value = true;
    try {
        const response = await api.deleteRole(roleToDelete.value.id, authStore.user.id);
        if (response.success) {
            // 从本地列表中移除
            roles.value = roles.value.filter(r => r.id !== roleToDelete.value?.id);
            roleToDelete.value = null;
            
            // 显示成功消息
            alert(response.message || t('settings.roleDeleted'));
        }
    } catch (error: any) {
        console.error('Error deleting role:', error);
        alert(error.data?.message || t('common.error'));
    } finally {
        isDeleting.value = false;
    }
}

// 设置默认角色
async function setDefaultRole(roleId: string) {
    if (!authStore?.user?.id) return;

    try {
        const response = await api.setDefaultRole(roleId, authStore.user.id);
        if (response.success) {
            // 更新本地状态
            roles.value = roles.value.map(role => ({
                ...role,
                isDefault: role.id === roleId
            }));
            
            // 显示成功消息
            alert(response.message || t('settings.defaultRoleSet'));
        }
    } catch (error: any) {
        console.error('Error setting default role:', error);
        alert(error.data?.message || t('common.error'));
    }
}

// 保存角色（创建或更新）
async function saveRole(roleData: any) {
    if (!authStore?.user?.id) return;

    isSaving.value = true;
    try {
        const data = {
            userId: authStore.user.id,
            name: roleData.name,
            age: roleData.age || null,
            bio: roleData.bio || '',
            avatar: roleData.avatar || ''
        };

        let response;
        if (roleData.id && roleData.id !== `role_${Date.now()}`) {
            // 更新现有角色
            response = await api.updateRole(roleData.id, data);
        } else {
            // 创建新角色
            response = await api.createRole(data);
        }

        if (response.success) {
            const savedRole = response.role;
            const index = roles.value.findIndex(r => r.id === savedRole.id);
            
            if (index !== -1) {
                // 更新现有角色
                roles.value[index] = savedRole;
            } else {
                // 添加新角色
                roles.value.push(savedRole);
            }
            
            // 显示成功消息
            alert(response.message || t('settings.roleSaved'));
            closeRoleEditor();
        }
    } catch (error: any) {
        console.error('Error saving role:', error);
        alert(error.data?.message || t('common.error'));
    } finally {
        isSaving.value = false;
    }
}

// 关闭角色编辑器
function closeRoleEditor() {
    showRoleEditor.value = false;
    editingRole.value = null;
}
</script>