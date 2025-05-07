<template>
  <div class="fixed inset-0 overflow-y-auto z-50" @click.self="handleClose">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0" @click.stop>
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300"
        :class="{ 'transition-opacity duration-300': isMobile, 'opacity-0': isClosing && isMobile, 'opacity-100': !isClosing || !isMobile }"
        @click="handleBackdropClick"></div>
      <!-- Desktop Modal -->
      <div
        class="hidden sm:inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
        <div class="grid grid-cols-4">
          <!-- Main Content (Left Side - 3/4) -->
          <div class="col-span-3 p-6 max-h-[80vh] overflow-y-auto custom-scrollbar relative">
            <!-- Close button for desktop -->
            <button
              class="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 z-10"
              @click="handleClose">
              <Icon name="heroicons:x-mark" class="w-6 h-6" />
            </button>

            <!-- Content wrapper with padding at the bottom for the fixed buttons -->
            <div class="pb-16">
              <!-- Character Basic Info -->
              <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ character.name }}</h2>

                <div class="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                    {{ $t(`roleplay.categories.${character.category}`) }}
                  </span>
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{{ character.stats.rating }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4 mr-1" />
                    <span>{{ character.stats.chats }}</span>
                  </div>
                </div>

                <p class="text-gray-700 dark:text-gray-300 mb-4">{{ character.description }}</p>

                <div class="flex flex-wrap gap-2 mb-4">
                  <span v-for="tag in character.tags" :key="tag"
                    class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                    #{{ tag }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {{ $t('roleplay.characterInfo.creator') }}</h3>
                    <NuxtLink :to="`/users/${character.creator.id}`"
                      class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
                      <span>{{ character.creator.username }}</span>
                    </NuxtLink>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {{ $t('roleplay.characterInfo.created') }}</h3>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(character.createdAt) }}</p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">插画家</h3>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ randomIllustrator }}</p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">剧本家</h3>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ randomScriptwriter }}</p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">声优</h3>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ randomVoiceActor }}</p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">系列</h3>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ randomSeries }}</p>
                  </div>
                </div>
              </div>

              <!-- Comments Section -->
              <div class="mb-6">
                <div class="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">评论</h3>
                  <button v-if="comments.length > 3"
                    class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    查看更多
                  </button>
                </div>

                <div v-if="comments.length === 0" class="text-center py-4">
                  <p class="text-gray-500 dark:text-gray-400">暂无评论</p>
                </div>

                <div v-else class="space-y-4">
                  <div v-for="comment in comments" :key="comment.id"
                    class="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div class="flex items-start">
                      <img :src="comment.user.avatar" :alt="comment.user.name"
                        class="w-10 h-10 rounded-full mr-3 object-cover" />
                      <div class="flex-1">
                        <div class="flex justify-between">
                          <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ comment.user.name }}</h4>
                          <span
                            class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(comment.date) }}</span>
                        </div>
                        <p class="text-gray-700 dark:text-gray-300 text-sm mt-1">{{ comment.content }}</p>

                        <!-- Replies -->
                        <div v-if="comment.replies && comment.replies.length > 0"
                          class="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                          <div v-for="reply in comment.replies" :key="reply.id" class="flex items-start">
                            <img :src="reply.user.avatar" :alt="reply.user.name"
                              class="w-8 h-8 rounded-full mr-2 object-cover" />
                            <div class="flex-1">
                              <div class="flex justify-between">
                                <h5 class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ reply.user.name }}
                                </h5>
                                <span
                                  class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(reply.date) }}</span>
                              </div>
                              <p class="text-gray-700 dark:text-gray-300 text-xs mt-1">{{ reply.content }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Memories Section -->
              <div class="mb-6">
                <div class="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">记忆</h3>
                  <button v-if="memories.length > 2"
                    class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    查看更多
                  </button>
                </div>

                <div v-if="memories.length === 0" class="text-center py-4">
                  <p class="text-gray-500 dark:text-gray-400">暂无记忆</p>
                </div>

                <div v-else class="space-y-4">
                  <div v-for="memory in memories" :key="memory.id"
                    class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center">
                        <img :src="memory.user.avatar" :alt="memory.user.name"
                          class="w-6 h-6 rounded-full mr-2 object-cover" />
                        <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ memory.user.name }}</span>
                      </div>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(memory.date) }}</span>
                    </div>

                    <div class="space-y-2">
                      <div class="flex justify-end">
                        <div class="bg-indigo-600 text-white rounded-lg rounded-br-none px-3 py-2 text-sm max-w-[80%]">
                          {{ memory.userMessage }}
                        </div>
                      </div>
                      <div class="flex justify-start">
                        <div
                          class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg rounded-bl-none px-3 py-2 text-sm max-w-[80%]">
                          {{ memory.characterMessage }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons (Fixed at Bottom) -->
            <div
              class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 pt-2 pb-4 border-t border-gray-200 dark:border-gray-700 flex gap-3 z-10 px-6"
              style="width: calc(75% - 24px);">
              <NuxtLink :to="`/characters/${character.id}`"
                class="flex-1 btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                {{ $t('characters.viewDetails') }}
              </NuxtLink>
              <button class="flex-1 btn btn-primary" @click="$emit('start-chat', character)">
                {{ $t('roleplay.characterInfo.startChat') }}
              </button>
            </div>
          </div>

          <!-- Sidebar (Right Side - 1/4) -->
          <div class="col-span-1 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
            <!-- Character Image Section -->
            <div class="relative">
              <div class="aspect-[3/4] overflow-hidden">
                <img :src="character.avatar" :alt="character.name" class="w-full h-full object-cover" />
              </div>

              <!-- Action Buttons -->
              <div class="absolute top-2 right-2 flex flex-col gap-2">
                <button class="p-2 bg-black/50 rounded-full text-white flex items-center justify-center">
                  <Icon name="heroicons:share" class="w-5 h-5" />
                </button>
                <div class="relative" ref="menuRef">
                  <button @click.stop="isMenuOpen = !isMenuOpen"
                    class="p-2 bg-black/50 rounded-full text-white flex items-center justify-center">
                    <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" />
                  </button>

                  <!-- Dropdown Menu -->
                  <div v-if="isMenuOpen"
                    class="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                    <button @click.stop="reportCharacter"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      {{ $t('roleplay.characterInfo.report') }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Like/Favorite Buttons -->
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <div class="flex justify-between">
                  <button class="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-white text-sm"
                    @click.stop="toggleLike">
                    <Icon :name="isLiked ? 'heroicons:hand-thumb-up-solid' : 'heroicons:hand-thumb-up'" class="w-5 h-5"
                      :class="isLiked ? 'text-blue-500' : 'text-white'" />
                    <span>{{ likeCount }}</span>
                  </button>

                  <button class="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-white text-sm"
                    @click.stop="toggleFavorite">
                    <Icon :name="isFavorited ? 'heroicons:star-solid' : 'heroicons:star'" class="w-5 h-5"
                      :class="isFavorited ? 'text-pink-500' : 'text-white'" />
                    <span>{{ character.stats.favorites }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Creator Info Section -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">创作者</h3>

              <div class="flex items-center mb-3">
                <img :src="creatorAvatar" :alt="character.creator.username"
                  class="w-10 h-10 rounded-full object-cover mr-3" />
                <div class="flex-1 min-w-0">
                  <NuxtLink :to="`/users/${character.creator.id}`"
                    class="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate">
                    {{ character.creator.username }}
                  </NuxtLink>
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ creatorStats.characters }} 角色</span>
                    <span class="mx-1">•</span>
                    <span>{{ creatorStats.followers }} 粉丝</span>
                  </div>
                </div>

                <button class="ml-2 px-2 py-1 text-xs rounded-full"
                  :class="isFollowing ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-indigo-600 text-white'"
                  @click.stop="toggleFollow">
                  {{ isFollowing ? '已关注' : '关注' }}
                </button>
              </div>

              <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                {{ creatorBio }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Bottom Sheet -->
      <div
        class="sm:hidden fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-out z-10 max-h-[85vh] overflow-hidden flex flex-col"
        :class="{ 'translate-y-0': !isClosing, 'translate-y-full': isClosing }">
        <div class="bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl flex flex-col h-full overflow-hidden"
          ref="bottomSheetRef" @touchstart.stop="touchStart" @touchmove.stop="touchMove" @touchend.stop="touchEnd">
          <!-- Scrollable Content Area -->
          <div class="flex-1 overflow-y-auto custom-scrollbar pb-20" ref="scrollableContentRef">
            <!-- Character Image -->
            <div class="relative w-full">
              <img :src="character.avatar" :alt="character.name" class="w-full aspect-[3/4] object-cover" />
              <button
                class="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white flex items-center justify-center"
                @click="closeWithAnimation">
                <Icon name="heroicons:x-mark" class="w-5 h-5" />
              </button>

              <!-- Action Buttons -->
              <div class="absolute top-4 left-4 flex gap-2">
                <button class="p-2 bg-black/50 rounded-full text-white flex items-center justify-center">
                  <Icon name="heroicons:share" class="w-5 h-5" />
                </button>
                <div class="relative">
                  <button @click.stop="isMenuOpen = !isMenuOpen"
                    class="p-2 bg-black/50 rounded-full text-white flex items-center justify-center">
                    <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" />
                  </button>

                  <!-- Dropdown Menu -->
                  <div v-if="isMenuOpen"
                    class="absolute left-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                    <button @click.stop="reportCharacter"
                      class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      {{ $t('roleplay.characterInfo.report') }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Like/Favorite Buttons -->
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <div class="flex justify-between">
                  <button class="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-white text-sm"
                    @click.stop="toggleLike">
                    <Icon :name="isLiked ? 'heroicons:hand-thumb-up-solid' : 'heroicons:hand-thumb-up'" class="w-5 h-5"
                      :class="isLiked ? 'text-blue-500' : 'text-white'" />
                    <span>{{ likeCount }}</span>
                  </button>

                  <button class="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-white text-sm"
                    @click.stop="toggleFavorite">
                    <Icon :name="isFavorited ? 'heroicons:star-solid' : 'heroicons:star'" class="w-5 h-5"
                      :class="isFavorited ? 'text-pink-500' : 'text-white'" />
                    <span>{{ character.stats.favorites }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Character Basic Info -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ character.name }}</h2>

              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  {{ $t(`roleplay.categories.${character.category}`) }}
                </span>
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{{ character.stats.rating }}</span>
                </div>
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4 mr-1" />
                  <span>{{ character.stats.chats }}</span>
                </div>
              </div>

              <p class="text-gray-700 dark:text-gray-300 mb-4">{{ character.description }}</p>

              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="tag in character.tags" :key="tag"
                  class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                  #{{ tag }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-gray-500 dark:text-gray-400">插画家:</span>
                  <span class="text-gray-900 dark:text-gray-100 ml-1">{{ randomIllustrator }}</span>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">剧本家:</span>
                  <span class="text-gray-900 dark:text-gray-100 ml-1">{{ randomScriptwriter }}</span>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">声优:</span>
                  <span class="text-gray-900 dark:text-gray-100 ml-1">{{ randomVoiceActor }}</span>
                </div>
                <div>
                  <span class="text-gray-500 dark:text-gray-400">系列:</span>
                  <span class="text-gray-900 dark:text-gray-100 ml-1">{{ randomSeries }}</span>
                </div>
              </div>
            </div>

            <!-- Creator Info Section -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">创作者</h3>
              </div>

              <div class="flex items-center mb-3">
                <img :src="creatorAvatar" :alt="character.creator.username"
                  class="w-10 h-10 rounded-full object-cover mr-3" />
                <div class="flex-1 min-w-0">
                  <NuxtLink :to="`/users/${character.creator.id}`"
                    class="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate">
                    {{ character.creator.username }}
                  </NuxtLink>
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ creatorStats.characters }} 角色</span>
                    <span class="mx-1">•</span>
                    <span>{{ creatorStats.followers }} 粉丝</span>
                  </div>
                </div>

                <button class="ml-2 px-2 py-1 text-xs rounded-full"
                  :class="isFollowing ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-indigo-600 text-white'"
                  @click.stop="toggleFollow">
                  {{ isFollowing ? '已关注' : '关注' }}
                </button>
              </div>

              <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                {{ creatorBio }}
              </p>
            </div>

            <!-- Comments Section -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">评论</h3>
                <button v-if="comments.length > 2"
                  class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                  查看更多
                </button>
              </div>

              <div v-if="comments.length === 0" class="py-2">
                <p class="text-gray-500 dark:text-gray-400 text-sm">暂无评论</p>
              </div>

              <div v-else class="space-y-3">
                <div v-for="comment in comments.slice(0, 2)" :key="comment.id"
                  class="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                  <div class="flex items-start">
                    <img :src="comment.user.avatar" :alt="comment.user.name"
                      class="w-8 h-8 rounded-full mr-2 object-cover" />
                    <div class="flex-1">
                      <div class="flex justify-between">
                        <h4 class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ comment.user.name }}</h4>
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(comment.date) }}</span>
                      </div>
                      <p class="text-gray-700 dark:text-gray-300 text-xs mt-1">{{ comment.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Memories Section -->
            <div class="p-4 text-left">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">记忆</h3>
                <button v-if="memories.length > 1"
                  class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                  查看更多
                </button>
              </div>

              <div v-if="memories.length === 0" class="py-2">
                <p class="text-gray-500 dark:text-gray-400 text-sm">暂无记忆</p>
              </div>

              <div v-else class="space-y-3">
                <div v-for="memory in memories.slice(0, 1)" :key="memory.id"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <img :src="memory.user.avatar" :alt="memory.user.name"
                        class="w-6 h-6 rounded-full mr-2 object-cover" />
                      <span class="text-xs font-medium text-gray-900 dark:text-gray-100">{{ memory.user.name }}</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(memory.date) }}</span>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-end">
                      <div class="bg-indigo-600 text-white rounded-lg rounded-br-none px-3 py-2 text-xs max-w-[80%]">
                        {{ memory.userMessage }}
                      </div>
                    </div>
                    <div class="flex justify-start">
                      <div
                        class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg rounded-bl-none px-3 py-2 text-xs max-w-[80%]">
                        {{ memory.characterMessage }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fixed Bottom Button -->
          <div
            class="p-4 border-t border-gray-200 dark:border-gray-700 fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 z-20 w-full">
            <button class="w-full btn btn-primary" @click="$emit('start-chat', character)">
              {{ $t('roleplay.characterInfo.startChat') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, formatDistance } from 'date-fns';
import { onClickOutside, useWindowSize } from '@vueuse/core';
import type { CharacterCard } from '~/types';

const props = defineProps<{
  character: CharacterCard
}>();

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'start-chat', character: CharacterCard): void
  (e: 'start-chat', character: CharacterCard): void
}>();

const { width } = useWindowSize();
const isMobile = computed(() => width.value < 640); // sm breakpoint is 640px

const isClosing = ref(false);
const bottomSheetRef = ref<HTMLElement | null>(null);
const touchStartY = ref(0);
const scrollableContentRef = ref<HTMLElement | null>(null);
const currentTranslateY = ref(0);
const menuRef = ref<HTMLElement | null>(null);
const isMenuOpen = ref(false);
const isLiked = ref(false);
const isFavorited = ref(false);
const isFollowing = ref(false);
const likeCount = ref(Math.floor(Math.random() * 1000) + 100);

// Watch for screen size changes to handle modal state
watch(isMobile, (newValue) => {
  // Reset closing state when switching between mobile and desktop
  if (newValue && bottomSheetRef.value) {
    bottomSheetRef.value.style.maxHeight = '85vh';
  }

  if (isClosing.value) {
    isClosing.value = false;
  }
});

// Random creator data
const creatorAvatar = ref('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
const creatorStats = ref({
  characters: Math.floor(Math.random() * 50) + 5,
  followers: Math.floor(Math.random() * 1000) + 100
});
const creatorBio = ref('这是一位充满创造力的角色设计师，擅长打造有深度的AI角色。热爱探索人物性格的多样性，致力于创造能引起共鸣的角色体验。');

// Random staff names
const randomIllustrator = computed(() => {
  const illustrators = ['佐藤雅子', '田中健太', '山本美咲', '铃木大辅', '高桥优子'];
  return illustrators[Math.floor(Math.random() * illustrators.length)];
});

const randomScriptwriter = computed(() => {
  const scriptwriters = ['中村隆太', '小林千夏', '伊藤悠', '渡边诚', '木村花子'];
  return scriptwriters[Math.floor(Math.random() * scriptwriters.length)];
});

const randomVoiceActor = computed(() => {
  const voiceActors = ['林志玲', '黄渤', '杨幂', '刘德华', '赵丽颖'];
  return voiceActors[Math.floor(Math.random() * voiceActors.length)];
});

// Random series names
const randomSeries = computed(() => {
  const series = ['原创世界', '幻想大陆', '未来纪元', '古代传说', '现代都市'];
  return series[Math.floor(Math.random() * series.length)];
});

// Mock comments data
const comments = ref([
  {
    id: 'comment1',
    user: {
      name: '用户A',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    content: '这个角色的设计非常棒！性格描写很到位，对话也很自然。',
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    replies: [
      {
        id: 'reply1',
        user: {
          name: '用户B',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
        },
        content: '我也这么觉得，特别是那些细节描写，让角色更加立体。',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      }
    ]
  },
  {
    id: 'comment2',
    user: {
      name: '用户C',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    content: '聊天体验很流畅，回复很有角色特色，希望能有更多这样的角色！',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    replies: []
  },
  {
    id: 'comment3',
    user: {
      name: '用户D',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    content: '这个角色的背景设定很有深度，聊天时能感受到丰富的情感层次。',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    replies: []
  },
  {
    id: 'comment4',
    user: {
      name: '用户D',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    content: '这个角色的背景设定很有深度，聊天时能感受到丰富的情感层次。',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    replies: []
  }
]);

// Mock memories data
const memories = ref([
  {
    id: 'memory1',
    user: {
      name: '用户E',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    userMessage: '你对人工智能的未来有什么看法？',
    characterMessage: '我认为AI将在未来扮演越来越重要的角色，但同时我们也需要注意伦理和安全问题。',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
  },
  {
    id: 'memory2',
    user: {
      name: '用户F',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    userMessage: '如果有机会穿越到未来，你最想看到什么？',
    characterMessage: '我最想看到人类是否成功实现了星际旅行。太空探索一直是人类最伟大的冒险之一。',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'memory3',
    user: {
      name: '用户F',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    userMessage: '如果有机会穿越到未来，你最想看到什么？',
    characterMessage: '我最想看到人类是否成功实现了星际旅行。太空探索一直是人类最伟大的冒险之一。',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  }
]);
const sheetHeight = ref(0);
const dragThreshold = 100; // Pixels to drag before closing

// Initialize with animation
onMounted(() => {
  // Set initial height for mobile bottom sheet
  if (isMobile.value && bottomSheetRef.value) {
    bottomSheetRef.value.style.maxHeight = '85vh';
  }

  if (isMobile.value) {
    // Start with the sheet offscreen
    isClosing.value = true;

    // Then animate it in after a brief delay
    setTimeout(() => {
      isClosing.value = false;
    }, 50);
  }

  // Get the height of the bottom sheet for drag calculations
  if (bottomSheetRef.value) {
    sheetHeight.value = bottomSheetRef.value.offsetHeight;
  }

  // Add event listener for escape key
  window.addEventListener('keydown', handleKeyDown);

  // Set up click outside for menu
  if (process.client) {
    onClickOutside(menuRef, () => {
      isMenuOpen.value = false;
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeWithAnimation();
  }
}

function handleClose() {
  if (isMobile.value) {
    closeWithAnimation();
  } else {
    emit('close');
  }
}

function handleBackdropClick() {
  if (isMobile.value) {
    closeWithAnimation();
  } else {
    emit('close');
  }
}

function closeWithAnimation() {
  isClosing.value = true;
  setTimeout(() => {
    emit('close');
  }, 300); // Match the duration of the CSS transition
}

// Touch event handlers for dragging
function touchStart(e: TouchEvent) {
  // Only allow dragging when scroll is at the top
  if (scrollableContentRef.value && scrollableContentRef.value.scrollTop > 0) {
    return;
  }

  touchStartY.value = e.touches[0].clientY;
  currentTranslateY.value = 0;

  // Change transition during drag for more responsive feel
  if (bottomSheetRef.value) {
    bottomSheetRef.value.style.transition = 'none';
  }
}

function touchMove(e: TouchEvent) {
  if (!bottomSheetRef.value) return;

  // Only allow dragging when scroll is at the top
  if (scrollableContentRef.value && scrollableContentRef.value.scrollTop > 0) {
    return;
  }

  const touchY = e.touches[0].clientY;
  const deltaY = touchY - touchStartY.value;

  // Only allow dragging downward
  if (deltaY < 0) return;

  currentTranslateY.value = deltaY;
  bottomSheetRef.value.style.transform = `translateY(${deltaY}px)`;
}

function touchEnd() {
  if (!bottomSheetRef.value) return;

  // Only allow dragging when scroll is at the top
  if (scrollableContentRef.value && scrollableContentRef.value.scrollTop > 0) {
    return;
  }

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

// Format time ago
function formatTimeAgo(dateString: string) {
  return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
}

// Toggle like
function toggleLike() {
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    likeCount.value++;
  } else {
    likeCount.value--;
  }
}

// Toggle favorite
function toggleFavorite() {
  isFavorited.value = !isFavorited.value;
  // In a real app, you would update the character's favorites count
}

// Toggle follow
function toggleFollow() {
  isFollowing.value = !isFollowing.value;
  // In a real app, you would update the creator's followers count
}

// Report character
function reportCharacter() {
  isMenuOpen.value = false;
  alert('举报功能将在后续版本中实现');
}

function formatDate(dateString: string) {
  return format(new Date(dateString), 'yyyy-MM-dd');
}
</script>

<style scoped>
/* Prevent scrolling on body when modal is open */
body.modal-open {
  overflow: hidden;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-indigo-500 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-indigo-600;
}

/* Line clamp utilities */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth drag animation */
.ease-out {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Fix for mobile bottom sheet */
@media (max-width: 639px) {
  .fixed.bottom-0.left-0.right-0.z-20 {
    width: 100%;
  }
}
</style>