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

                  <div v-if="characterDetails?.illustrator">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {{ $t('roleplay.characterInfo.illustrator') }}</h3>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ characterDetails.illustrator }}</p>
                  </div>

                  <div v-if="characterDetails?.scriptwriter">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {{ $t('roleplay.characterInfo.scriptwriter') }}</h3>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ characterDetails.scriptwriter }}</p>
                  </div>

                  <div v-if="characterDetails?.voiceActor">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {{ $t('roleplay.characterInfo.voiceActor') }}</h3>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ characterDetails.voiceActor }}</p>
                  </div>

                  <div v-if="characterDetails?.series">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {{ $t('roleplay.characterInfo.series') }}</h3>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ characterDetails.series }}</p>
                  </div>
                </div>
              </div>

              <!-- Comments Section -->
              <div class="mb-6">
                <div class="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {{ $t('roleplay.characterInfo.comments') }}</h3>
                  <button v-if="comments.length > 3"
                    class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    {{ $t('roleplay.characterInfo.viewMore') }}
                  </button>
                </div>

                <div v-if="comments.length === 0" class="text-center py-4">
                  <p class="text-gray-500 dark:text-gray-400">{{ $t('roleplay.characterInfo.noComments') }}</p>
                </div>

                <div v-else class="space-y-4">
                  <div v-for="comment in comments" :key="comment.id"
                    class="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <div class="flex items-start">
                      <img :src="comment.user.avatar" :alt="comment.user.username"
                        class="w-10 h-10 rounded-full mr-3 object-cover" />
                      <div class="flex-1">
                        <div class="flex justify-between">
                          <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ comment.user.username }}</h4>
                          <span
                            class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(comment.createdAt) }}</span>
                        </div>
                        <p class="text-gray-700 dark:text-gray-300 text-sm mt-1">{{ comment.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Memories Section -->
              <div class="mb-6">
                <div class="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {{ $t('roleplay.characterInfo.memories') }}</h3>
                  <button v-if="memories.length > 2"
                    class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    {{ $t('roleplay.characterInfo.viewMore') }}
                  </button>
                </div>

                <div v-if="memories.length === 0" class="text-center py-4">
                  <p class="text-gray-500 dark:text-gray-400">{{ $t('roleplay.characterInfo.noMemories') }}</p>
                </div>

                <div v-else class="space-y-4">
                  <div v-for="memory in memories" :key="memory.id"
                    class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center">
                        <img :src="memory.user.avatar" :alt="memory.user.username"
                          class="w-6 h-6 rounded-full mr-2 object-cover" />
                        <span
                          class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ memory.user.username }}</span>
                      </div>
                      <span
                        class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(memory.timestamp) }}</span>
                    </div>

                    <div class="space-y-2" v-if="memory.messages && memory.messages.length >= 2">
                      <div class="flex justify-end">
                        <div class="bg-indigo-600 text-white rounded-lg rounded-br-none px-3 py-2 text-sm max-w-[80%]">
                          {{ memory.messages.find(m => m.sender === 'user')?.content || '...' }}
                        </div>
                      </div>
                      <div class="flex justify-start">
                        <div
                          class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg rounded-bl-none px-3 py-2 text-sm max-w-[80%]">
                          {{ memory.messages.find(m => m.sender === 'character')?.content || '...' }}
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
                {{ $t('roleplay.characterInfo.viewDetails') }}
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
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                {{ $t('roleplay.characterInfo.creatorInfo.title') }}</h3>

              <div class="flex items-center mb-3">
                <img :src="creatorAvatar" :alt="character.creator.username"
                  class="w-10 h-10 rounded-full object-cover mr-3" />
                <div class="flex-1 min-w-0 truncate">
                  <NuxtLink :to="`/users/${character.creator.id}`"
                    class="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                    {{ character.creator.username }}
                  </NuxtLink>
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Icon name="heroicons:user-group" class="w-3 h-3 mr-1" />
                    {{ creatorStats.characters }}
                    <span class="mx-1">•</span>
                    <Icon name="heroicons:users" class="w-3 h-3 mr-1" />
                    {{ creatorStats.followers }}
                  </div>
                </div>

                <button class="ml-2 px-2 py-1 text-xs rounded-full"
                  :class="isFollowing ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-indigo-600 text-white'"
                  @click.stop="toggleFollow">
                  {{ isFollowing ? $t('roleplay.characterInfo.following') : $t('roleplay.characterInfo.follow') }}
                </button>
              </div>

              <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                {{ creatorBio }}
              </p>

              <!-- Creator's Other Characters -->
              <div v-if="otherCharacters.length > 0">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">其他角色</h4>
                <div class="space-y-2">
                  <div v-for="(otherChar, index) in otherCharacters" :key="index"
                    class="flex p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border border-gray-100 dark:border-gray-700"
                    @click="navigateToCharacter(otherChar.id)">
                    <div class="flex-shrink-0 w-12 h-12 mr-3">
                      <div class="w-12 h-12 rounded-lg overflow-hidden">
                        <img :src="otherChar.avatar" :alt="otherChar.name" class="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h5 class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ otherChar.name }}</h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ otherChar.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
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

              <div
                v-if="characterDetails?.illustrator || characterDetails?.scriptwriter || characterDetails?.voiceActor || characterDetails?.series"
                class="grid grid-cols-2 gap-2 text-sm">
                <div v-if="characterDetails?.illustrator">
                  <span class="text-gray-500 dark:text-gray-400">{{ $t('roleplay.characterInfo.illustrator') }}:</span>
                  <span class="text-gray-900 dark:text-gray-100 ml-1">{{ characterDetails.illustrator }}</span>
                </div>
                <div v-if="characterDetails?.scriptwriter">
                  <span class="text-gray-500 dark:text-gray-400">{{ $t('roleplay.characterInfo.scriptwriter') }}:</span>
                  <span class="text-gray-900 dark:text-gray-100 ml-1">{{ characterDetails.scriptwriter }}</span>
                </div>
                <div v-if="characterDetails?.voiceActor">
                  <span class="text-gray-500 dark:text-gray-400">{{ $t('roleplay.characterInfo.voiceActor') }}:</span>
                  <span class="text-gray-900 dark:text-gray-100 ml-1">{{ characterDetails.voiceActor }}</span>
                </div>
                <div v-if="characterDetails?.series">
                  <span class="text-gray-500 dark:text-gray-400">{{ $t('roleplay.characterInfo.series') }}:</span>
                  <span class="text-gray-900 dark:text-gray-100 ml-1">{{ characterDetails.series }}</span>
                </div>
              </div>
            </div>

            <!-- Creator Info Section -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ $t('roleplay.characterInfo.creatorInfo.title') }}</h3>
              </div>

              <div class="flex items-center mb-3">
                <img :src="creatorAvatar" :alt="character.creator.username"
                  class="w-10 h-10 rounded-full object-cover mr-3" />
                <div class="flex-1 min-w-0 truncate">
                  <NuxtLink :to="`/users/${character.creator.id}`"
                    class="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                    {{ character.creator.username }}
                  </NuxtLink>
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Icon name="heroicons:user-group" class="w-3 h-3 mr-1" />
                    {{ creatorStats.characters }}
                    <span class="mx-1">•</span>
                    <Icon name="heroicons:users" class="w-3 h-3 mr-1" />
                    {{ creatorStats.followers }}
                  </div>
                </div>

                <button class="ml-2 px-2 py-1 text-xs rounded-full"
                  :class="isFollowing ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-indigo-600 text-white'"
                  @click.stop="toggleFollow">
                  {{ isFollowing ? $t('roleplay.characterInfo.following') : $t('roleplay.characterInfo.follow') }}
                </button>
              </div>

              <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                {{ creatorBio }}
              </p>

              <!-- Creator's Other Characters -->
              <div v-if="otherCharacters.length > 0">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">其他角色</h4>
                <div class="space-y-2">
                  <div v-for="(otherChar, index) in otherCharacters" :key="index"
                    class="flex p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border border-gray-100 dark:border-gray-700"
                    @click="navigateToCharacter(otherChar.id)">
                    <div class="flex-shrink-0 w-12 h-12 mr-3">
                      <div class="w-12 h-12 rounded-lg overflow-hidden">
                        <img :src="otherChar.avatar" :alt="otherChar.name" class="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h5 class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ otherChar.name }}</h5>
                      <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ otherChar.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="p-4 border-b border-gray-200 dark:border-gray-700 text-left">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ $t('roleplay.characterInfo.comments') }}</h3>
                <button v-if="comments.length > 2"
                  class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                  {{ $t('roleplay.characterInfo.viewMore') }}
                </button>
              </div>

              <div v-if="comments.length === 0" class="py-2">
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('roleplay.characterInfo.noComments') }}</p>
              </div>

              <div v-else class="space-y-3">
                <div v-for="comment in comments.slice(0, 2)" :key="comment.id"
                  class="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0">
                  <div class="flex items-start">
                    <img :src="comment.user.avatar" :alt="comment.user.username"
                      class="w-8 h-8 rounded-full mr-2 object-cover" />
                    <div class="flex-1">
                      <div class="flex justify-between">
                        <h4 class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ comment.user.username }}
                        </h4>
                        <span
                          class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(comment.createdAt) }}</span>
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
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ $t('roleplay.characterInfo.memories') }}</h3>
                <button v-if="memories.length > 1"
                  class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                  {{ $t('roleplay.characterInfo.viewMore') }}
                </button>
              </div>

              <div v-if="memories.length === 0" class="py-2">
                <p class="text-gray-500 dark:text-gray-400 text-sm">{{ $t('roleplay.characterInfo.noMemories') }}</p>
              </div>

              <div v-else class="space-y-3">
                <div v-for="memory in memories.slice(0, 1)" :key="memory.id"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <img :src="memory.user.avatar" :alt="memory.user.username"
                        class="w-6 h-6 rounded-full mr-2 object-cover" />
                      <span
                        class="text-xs font-medium text-gray-900 dark:text-gray-100">{{ memory.user.username }}</span>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatTimeAgo(memory.timestamp) }}</span>
                  </div>

                  <div class="space-y-2" v-if="memory.messages && memory.messages.length >= 2">
                    <div class="flex justify-end">
                      <div class="bg-indigo-600 text-white rounded-lg rounded-br-none px-3 py-2 text-xs max-w-[80%]">
                        {{ memory.messages.find(m => m.sender === 'user')?.content || '...' }}
                      </div>
                    </div>
                    <div class="flex justify-start">
                      <div
                        class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg rounded-bl-none px-3 py-2 text-xs max-w-[80%]">
                        {{ memory.messages.find(m => m.sender === 'character')?.content || '...' }}
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
import { onClickOutside, useWindowSize } from '@vueuse/core';
import { format, formatDistance } from 'date-fns';
import { useApi, type Character, type Comment, type Creator, type Memory } from '~/composables/useApi';
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

// API数据
const isLoading = ref(false);
const characterDetails = ref<Character | null>(null);
const creator = ref<Creator | null>(null);
const comments = ref<Comment[]>([]);
const memories = ref<Memory[]>([]);

// Creator's other characters
const otherCharacters = ref<Character[]>([]);

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

// Random creator data (fallback)
const creatorAvatar = ref('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80');
const creatorStats = ref({
  characters: Math.floor(Math.random() * 50) + 5,
  followers: Math.floor(Math.random() * 1000) + 100
});
const creatorBio = ref('这是一位充满创造力的角色设计师，擅长打造有深度的AI角色。热爱探索人物性格的多样性，致力于创造能引起共鸣的角色体验。');

const sheetHeight = ref(0);
const dragThreshold = 100; // Pixels to drag before closing

// Initialize with animation
onMounted(async () => {
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

  // 加载数据
  await loadCharacterData();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// 加载角色详细数据
async function loadCharacterData() {
  if (!props.character?.id) return;
  
  isLoading.value = true;
  
  try {
    const api = useApi();
    
    // 并行加载所有数据
    const [characterData, commentsData, memoriesData] = await Promise.allSettled([
      api.getCharacter(props.character.id),
      api.getCharacterComments(props.character.id, 1, 4), // 限制评论数量
      api.getCharacterMemories(props.character.id, 1, 3)  // 限制记忆数量
    ]);

    // 处理角色详细信息
    if (characterData.status === 'fulfilled') {
      characterDetails.value = characterData.value;
      // 加载创建者信息
      await loadCreator();
    }

    // 处理评论数据
    if (commentsData.status === 'fulfilled') {
      comments.value = commentsData.value.comments;
    }

    // 处理记忆数据
    if (memoriesData.status === 'fulfilled') {
      memories.value = memoriesData.value.memories;
    }

  } catch (error) {
    console.error('Error loading character data:', error);
  } finally {
    isLoading.value = false;
  }
}

async function loadCreator() {
  if (!characterDetails.value) return;
  
  try {
    const api = useApi();
    const creatorData = await api.getCreator(characterDetails.value.creator.id);
    creator.value = creatorData;
    
    // 更新创建者信息
    creatorAvatar.value = creatorData.avatar;
    creatorStats.value = {
      characters: creatorData.stats.characters,
      followers: Math.floor(Math.random() * 1000) + 100 // followers暂时用随机数
    };
    creatorBio.value = creatorData.bio || creatorBio.value;

    // Load other characters by the same creator
    await loadOtherCharacters();
  } catch (error) {
    console.error('Error loading creator:', error);
    // 保持默认值
  }
}

// Load other characters by the same creator
async function loadOtherCharacters() {
  if (!characterDetails.value) return;
  
  try {
    const api = useApi();
    const response = await api.getCreatorCharacters(
      characterDetails.value.creator.id, 
      characterDetails.value.id, // 排除当前角色
      3 // 限制3个角色
    );
    otherCharacters.value = response.characters;
  } catch (error) {
    console.error('Error loading other characters:', error);
    // 保持为空数组，不提供fallback数据
    otherCharacters.value = [];
  }
}

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

// Format time ago - 适配API数据格式
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

// Navigate to another character
function navigateToCharacter(characterId: string) {
  // 关闭当前模态框
  emit('close');
  // 跳转到角色详情页
  navigateTo(`/characters/${characterId}`);
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