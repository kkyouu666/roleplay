<template>
  <div class="fixed inset-0 overflow-y-auto z-50" @click.self="handleBackdropClick">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0" @click.stop>
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300"
        :class="{ 'opacity-0': isClosing && isMobile, 'opacity-100': !isClosing || !isMobile }"
        @click="handleBackdropClick"></div>

      <!-- Desktop Modal -->
      <div
        class="hidden sm:inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
          @click="closeModal">
          <Icon name="heroicons:x-mark" class="w-6 h-6" />
        </button>

        <!-- Login Form -->
        <div v-if="authStore?.authModalMode === 'login'" class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                {{ $t('auth.login') }}
              </h3>
              <div class="mt-4">
                <form @submit.prevent="handleLogin">
                  <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">
                      {{ $t('auth.email') }}
                    </label>
                    <input type="email" id="email" v-model="loginForm.email" required
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
                  </div>

                  <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">
                      {{ $t('auth.password') }}
                    </label>
                    <input type="password" id="password" v-model="loginForm.password" required
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
                  </div>

                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                      <input id="remember-me" type="checkbox" v-model="loginForm.rememberMe"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                      <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                        {{ $t('auth.rememberMe') }}
                      </label>
                    </div>

                    <div class="text-sm">
                      <a href="#" @click.prevent="switchToForgotPassword"
                        class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                        {{ $t('auth.forgotPassword') }}
                      </a>
                    </div>
                  </div>

                  <div v-if="authStore?.error" class="mb-4 text-sm text-red-600">
                    {{ authStore?.error }}
                  </div>

                  <div>
                    <button type="submit" class="w-full btn btn-primary" :disabled="authStore?.loading">
                      <span v-if="authStore?.loading">{{ $t('common.loading') }}</span>
                      <span v-else>{{ $t('auth.login') }}</span>
                    </button>
                  </div>
                </form>
              </div>

              <div class="mt-4 text-center text-sm">
                <p>
                  {{ $t('auth.noAccount') }}
                  <a href="#" @click.prevent="switchToRegister"
                    class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                    {{ $t('auth.register') }}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Register Form -->
        <div v-else-if="authStore?.authModalMode === 'register'" class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                {{ $t('auth.createAccount') }}
              </h3>
              <div class="mt-4">
                <form @submit.prevent="handleRegister">
                  <div class="mb-4">
                    <label for="register-username" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('auth.username') }}
                    </label>
                    <input type="text" id="register-username" v-model="registerForm.username" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
                  </div>

                  <div class="mb-4">
                    <label for="register-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('auth.email') }}
                    </label>
                    <input type="email" id="register-email" v-model="registerForm.email" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
                  </div>

                  <div class="mb-4">
                    <label for="register-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('auth.password') }}
                    </label>
                    <input type="password" id="register-password" v-model="registerForm.password" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
                  </div>

                  <div class="mb-4">
                    <label for="register-confirm-password"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('auth.confirmPassword') }}
                    </label>
                    <input type="password" id="register-confirm-password" v-model="registerForm.confirmPassword"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
                  </div>

                  <div class="mb-4 flex items-start">
                    <div class="flex items-center h-5">
                      <input id="terms" type="checkbox" v-model="registerForm.agreeTerms" required
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="terms" class="font-medium text-gray-700 dark:text-gray-300">
                        {{ $t('auth.agreeToTerms') }}
                      </label>
                    </div>
                  </div>

                  <div v-if="authStore?.error" class="mb-4 text-sm text-red-600">
                    {{ authStore?.error }}
                  </div>

                  <div>
                    <button type="submit" class="w-full btn btn-primary" :disabled="authStore?.loading">
                      <span v-if="authStore?.loading">{{ $t('common.loading') }}</span>
                      <span v-else>{{ $t('auth.register') }}</span>
                    </button>
                  </div>
                </form>
              </div>

              <div class="mt-4 text-center text-sm">
                <p>
                  {{ $t('auth.alreadyHaveAccount') }}
                  <a href="#" @click.prevent="switchToLogin"
                    class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                    {{ $t('auth.login') }}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Forgot Password Form -->
        <div v-else-if="authStore?.authModalMode === 'forgotPassword'" class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                {{ $t('auth.resetPassword') }}
              </h3>
              <div class="mt-4">
                <form @submit.prevent="handleForgotPassword">
                  <div class="mb-4">
                    <label for="forgot-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {{ $t('auth.email') }}
                    </label>
                    <input type="email" id="forgot-email" v-model="forgotPasswordForm.email" required
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
                  </div>

                  <div v-if="authStore?.error" class="mb-4 text-sm text-red-600 dark:text-red-400">
                    {{ authStore?.error }}
                  </div>

                  <div>
                    <button type="submit" class="w-full btn btn-primary" :disabled="authStore?.loading">
                      <span v-if="authStore?.loading">{{ $t('common.loading') }}</span>
                      <span v-else>{{ $t('auth.sendResetLink') }}</span>
                    </button>
                  </div>
                </form>
              </div>

              <div class="mt-4 text-center text-sm">
                <p>
                  <a href="#" @click.prevent="switchToLogin"
                    class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                    {{ $t('auth.backToLogin') }}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Bottom Sheet -->
      <div class="sm:hidden fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-out z-10"
        :class="{ 'translate-y-0': !isClosing, 'translate-y-full': isClosing }" @touchstart.stop="touchStart"
        @touchmove.stop="touchMove" @touchend.stop="touchEnd">
        <div class="bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto"
          ref="bottomSheetRef">
          <!-- Close Button at the top right -->
          <div class="sticky top-0 w-full bg-white dark:bg-gray-800 pt-2 px-4 flex justify-end">
            <button class="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
              @click="closeWithAnimation">
              <Icon name="heroicons:x-mark" class="w-5 h-5" />
            </button>
          </div>

          <!-- Login Form -->
          <div v-if="authStore?.authModalMode === 'login'" class="px-4 pt-3 pb-6">
            <div class="text-center mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                {{ $t('auth.login') }}
              </h3>
            </div>

            <form @submit.prevent="handleLogin">
              <div class="mb-4">
                <label for="mobile-email" class="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">
                  {{ $t('auth.email') }}
                </label>
                <input type="email" id="mobile-email" v-model="loginForm.email" required
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
              </div>

              <div class="mb-4">
                <label for="mobile-password"
                  class="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">
                  {{ $t('auth.password') }}
                </label>
                <input type="password" id="mobile-password" v-model="loginForm.password" required
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
              </div>

              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <input id="mobile-remember-me" type="checkbox" v-model="loginForm.rememberMe"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                  <label for="mobile-remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                    {{ $t('auth.rememberMe') }}
                  </label>
                </div>

                <div class="text-sm">
                  <a href="#" @click.prevent="switchToForgotPassword"
                    class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                    {{ $t('auth.forgotPassword') }}
                  </a>
                </div>
              </div>

              <div v-if="authStore?.error" class="mb-4 text-sm text-red-600">
                {{ authStore?.error }}
              </div>

              <div>
                <button type="submit" class="w-full btn btn-primary" :disabled="authStore?.loading">
                  <span v-if="authStore?.loading">{{ $t('common.loading') }}</span>
                  <span v-else>{{ $t('auth.login') }}</span>
                </button>
              </div>
            </form>

            <div class="mt-4 text-center text-sm">
              <p>
                {{ $t('auth.noAccount') }}
                <a href="#" @click.prevent="switchToRegister"
                  class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  {{ $t('auth.register') }}
                </a>
              </p>
            </div>
          </div>

          <!-- Register Form -->
          <div v-else-if="authStore?.authModalMode === 'register'" class="px-4 pt-3 pb-6">
            <div class="text-center mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                {{ $t('auth.createAccount') }}
              </h3>
            </div>

            <form @submit.prevent="handleRegister">
              <div class="mb-4">
                <label for="mobile-register-username"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('auth.username') }}
                </label>
                <input type="text" id="mobile-register-username" v-model="registerForm.username" required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
              </div>

              <div class="mb-4">
                <label for="mobile-register-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('auth.email') }}
                </label>
                <input type="email" id="mobile-register-email" v-model="registerForm.email" required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
              </div>

              <div class="mb-4">
                <label for="mobile-register-password"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('auth.password') }}
                </label>
                <input type="password" id="mobile-register-password" v-model="registerForm.password" required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
              </div>

              <div class="mb-4">
                <label for="mobile-register-confirm-password"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('auth.confirmPassword') }}
                </label>
                <input type="password" id="mobile-register-confirm-password" v-model="registerForm.confirmPassword"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
              </div>

              <div class="mb-4 flex items-start">
                <div class="flex items-center h-5">
                  <input id="mobile-terms" type="checkbox" v-model="registerForm.agreeTerms" required
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                </div>
                <div class="ml-3 text-sm">
                  <label for="mobile-terms" class="font-medium text-gray-700 dark:text-gray-300">
                    {{ $t('auth.agreeToTerms') }}
                  </label>
                </div>
              </div>

              <div v-if="authStore?.error" class="mb-4 text-sm text-red-600">
                {{ authStore?.error }}
              </div>

              <div>
                <button type="submit" class="w-full btn btn-primary" :disabled="authStore?.loading">
                  <span v-if="authStore?.loading">{{ $t('common.loading') }}</span>
                  <span v-else>{{ $t('auth.register') }}</span>
                </button>
              </div>
            </form>

            <div class="mt-4 text-center text-sm">
              <p>
                {{ $t('auth.alreadyHaveAccount') }}
                <a href="#" @click.prevent="switchToLogin"
                  class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  {{ $t('auth.login') }}
                </a>
              </p>
            </div>
          </div>

          <!-- Forgot Password Form -->
          <div v-else-if="authStore?.authModalMode === 'forgotPassword'" class="px-4 pt-3 pb-6">
            <div class="text-center mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                {{ $t('auth.resetPassword') }}
              </h3>
            </div>

            <form @submit.prevent="handleForgotPassword">
              <div class="mb-4">
                <label for="mobile-forgot-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ $t('auth.email') }}
                </label>
                <input type="email" id="mobile-forgot-email" v-model="forgotPasswordForm.email" required
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm input" />
              </div>

              <div v-if="authStore?.error" class="mb-4 text-sm text-red-600 dark:text-red-400">
                {{ authStore?.error }}
              </div>

              <div>
                <button type="submit" class="w-full btn btn-primary" :disabled="authStore?.loading">
                  <span v-if="authStore?.loading">{{ $t('common.loading') }}</span>
                  <span v-else>{{ $t('auth.sendResetLink') }}</span>
                </button>
              </div>
            </form>

            <div class="mt-4 text-center text-sm">
              <p>
                <a href="#" @click.prevent="switchToLogin"
                  class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                  {{ $t('auth.backToLogin') }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);
const isClosing = ref(true); // Start with closing state to prevent flash
const bottomSheetRef = ref<HTMLElement | null>(null);
const touchStartY = ref(0);
const currentTranslateY = ref(0);
const sheetHeight = ref(0);
const dragThreshold = 100; // Pixels to drag before closing

const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
});

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
});

const forgotPasswordForm = reactive({
  email: ''
});

// Initialize with animation
onMounted(() => {
  // Then animate it in after a brief delay
  setTimeout(() => {
    isClosing.value = false;
  }, 50);

  // Add body class to prevent scrolling
  if (process.client) {
    document.body.classList.add('modal-open');
  }

  // Get the height of the bottom sheet for drag calculations
  if (bottomSheetRef.value) {
    sheetHeight.value = bottomSheetRef.value.offsetHeight;
  }

  // Add event listener for escape key
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);

  // Remove body class when component is unmounted
  if (process.client) {
    document.body.classList.remove('modal-open');
  }
});

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeWithAnimation();
  }
}

function handleBackdropClick() {
  if (isMobile.value) {
    closeWithAnimation();
  } else {
    closeModal();
  }
}

function closeWithAnimation() {
  isClosing.value = true;
  setTimeout(() => closeModal(), 300); // Match the duration of the CSS transition
}

// Touch event handlers for dragging
function touchStart(e: TouchEvent) {
  touchStartY.value = e.touches[0].clientY;
  currentTranslateY.value = 0;

  // Change transition during drag for more responsive feel
  if (bottomSheetRef.value) {
    bottomSheetRef.value.style.transition = 'none';
  }
}

function touchMove(e: TouchEvent) {
  if (!bottomSheetRef.value) return;

  const touchY = e.touches[0].clientY;
  const deltaY = touchY - touchStartY.value;

  // Only allow dragging downward
  if (deltaY < 0) return;

  currentTranslateY.value = deltaY;
  bottomSheetRef.value.style.transform = `translateY(${deltaY}px)`;
}

function touchEnd() {
  if (!bottomSheetRef.value) return;

  // Reset transition for smooth animation
  bottomSheetRef.value.style.transition = 'transform 0.3s ease-out';

  // If dragged past threshold, close the modal
  if (currentTranslateY.value > dragThreshold) {
    closeWithAnimation();
  } else {
    // Otherwise snap back to position
    bottomSheetRef.value.style.transform = 'translateY(0)';
  }
}

// Login handler
async function handleLogin() {
  if (!loginForm.email || !loginForm.password) {
    if (authStore) {
      authStore.error = '请填写邮箱和密码';
    }
    return;
  }

  if (authStore) {
    const result = await authStore.login(loginForm.email, loginForm.password);

    if (result) {
      // Reset form on success
      loginForm.email = '';
      loginForm.password = '';
      loginForm.rememberMe = false;
    }
  }
}

// Register handler
async function handleRegister() {
  if (!registerForm.username || !registerForm.email || !registerForm.password) {
    if (authStore) {
      authStore.error = '请填写所有必填项';
    }
    return;
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    if (authStore) {
      authStore.error = '两次输入的密码不一致';
    }
    return;
  }

  if (!registerForm.agreeTerms) {
    if (authStore) {
      authStore.error = '请同意用户条款';
    }
    return;
  }

  if (authStore) {
    const result = await authStore.register(
      registerForm.username,
      registerForm.email,
      registerForm.password
    );

    if (result) {
      // Reset form on success
      registerForm.username = '';
      registerForm.email = '';
      registerForm.password = '';
      registerForm.confirmPassword = '';
      registerForm.agreeTerms = false;
    }
  }
}

// Forgot password handler
async function handleForgotPassword() {
  if (!forgotPasswordForm.email) {
    if (authStore) {
      authStore.error = '请填写邮箱地址';
    }
    return;
  }

  // In a real application, you would call an API endpoint to send reset email
  // For now, we'll just show a success message
  if (authStore) {
    authStore.error = null;
  }
  alert('密码重置链接已发送到您的邮箱。');

  // Close modal and return to login
  switchToLogin();

  // Reset form
  forgotPasswordForm.email = '';
}

// Mode switchers
function switchToLogin() {
  if (authStore) {
    authStore.setAuthModalMode('login');
    authStore.error = null;
  }
}

function switchToRegister() {
  if (authStore) {
    authStore.setAuthModalMode('register');
    authStore.error = null;
  }
}

function switchToForgotPassword() {
  if (authStore) {
    authStore.setAuthModalMode('forgotPassword');
    authStore.error = null;
  }
}

// Close modal
function closeModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(false);
    authStore.error = null;

    // Remove body class when modal is closed
    if (process.client) {
      document.body.classList.remove('modal-open');
    }
  }

  // Reset all forms
  loginForm.email = '';
  loginForm.password = '';
  loginForm.rememberMe = false;

  registerForm.username = '';
  registerForm.email = '';
  registerForm.password = '';
  registerForm.confirmPassword = '';
  registerForm.agreeTerms = false;

  forgotPasswordForm.email = '';
}
</script>

<style scoped>
/* Prevent scrolling on body when modal is open */
body.modal-open {
  overflow: hidden;
}

/* Smooth drag animation */
.ease-out {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>