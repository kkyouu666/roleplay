import { defineStore } from 'pinia';
import type { ChatSession } from '~/composables/useApi';
import { useAuthStore } from '~/stores/auth';
import type { CharacterCard, ChatMessage } from '~/types';

export const useRoleplayStore = defineStore('roleplay', {
  state: () => ({
    characters: [] as CharacterCard[],
    filteredCharacters: [] as CharacterCard[],
    isLoading: false,
    page: 1,
    pageSize: 18,
    hasMore: true,
    selectedCharacter: null as CharacterCard | null,
    activeChat: null as { id: string, character: CharacterCard, messages: ChatMessage[] } | null,
    chats: [] as ChatSession[],
    isLoadingChats: false,
    isLoadingMessages: false,
    isSendingMessage: false,
    isTypingCharacter: false,
    streamingMessageId: null as string | null,
    filters: {
      tags: [] as string[],
      search: '',
      category: 'all',
      ranking: 'default',
      gender: 'all',
      showFiltered: true
    },
    memories: [] as any[],
    isLoadingMemories: false,
    memoriesPage: 1,
    hasMoreMemories: true,
    creators: [] as any[],
    isLoadingCreators: false,
    creatorsPage: 1,
    hasMoreCreators: true,
    creatorsSort: 'rating'
  }),

  actions: {
    async loadCharacters() {
      if (this.isLoading || !this.hasMore) return;

      this.isLoading = true;
      try {
        const api = useApi();
        const response = await api.getCharacters({
          page: this.page,
          pageSize: this.pageSize,
          category: this.filters.category,
          tags: this.filters.tags,
          search: this.filters.search,
          ranking: this.filters.ranking,
          gender: this.filters.gender
        });

        this.hasMore = response.pagination.hasMore;

        if (this.page === 1) {
          this.characters = response.characters;
        } else {
          this.characters = [...this.characters, ...response.characters];
        }

        this.page++;
        this.applyFilters();
      } catch (error) {
        console.error('Failed to load characters', error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadMemories() {
      if (this.isLoadingMemories || !this.hasMoreMemories) return;

      this.isLoadingMemories = true;
      try {
        const api = useApi();
        const response = await api.getMemories({
          page: this.memoriesPage,
          pageSize: 6,
          ranking: this.filters.ranking,
          gender: this.filters.gender
        });

        this.memories = this.memoriesPage === 1
          ? response.memories
          : [...this.memories, ...response.memories];

        this.hasMoreMemories = response.pagination.hasMore;
        this.memoriesPage++;
      } catch (error) {
        console.error('Error loading memories:', error);
      } finally {
        this.isLoadingMemories = false;
      }
    },

    async loadCreators() {
      if (this.isLoadingCreators || !this.hasMoreCreators) return;

      this.isLoadingCreators = true;
      try {
        const api = useApi();
        const response = await api.getCreators({
          page: this.creatorsPage,
          pageSize: 8,
          sort: this.creatorsSort
        });

        this.creators = this.creatorsPage === 1
          ? response.creators
          : [...this.creators, ...response.creators];

        this.hasMoreCreators = response.pagination.hasMore;
        this.creatorsPage++;
      } catch (error) {
        console.error('Error loading creators:', error);
      } finally {
        this.isLoadingCreators = false;
      }
    },

    setCreatorsSort(sort: string) {
      this.creatorsSort = sort;
      this.resetCreators();
    },

    resetMemories() {
      this.memoriesPage = 1;
      this.hasMoreMemories = true;
      this.memories = [];
      this.loadMemories();
    },

    resetCreators() {
      this.creatorsPage = 1;
      this.hasMoreCreators = true;
      this.creators = [];
      this.loadCreators();
    },

    selectCharacter(character: CharacterCard) {
      this.selectedCharacter = character;
    },

    clearSelectedCharacter() {
      this.selectedCharacter = null;
    },

    applyFilters() {
      if (!this.filters.showFiltered) {
        this.filteredCharacters = [...this.characters];
        return;
      }

      let result = [...this.characters];

      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        result = result.filter(char =>
          char.name.toLowerCase().includes(searchLower) ||
          char.description.toLowerCase().includes(searchLower)
        );
      }

      if (this.filters.tags.length > 0) {
        result = result.filter(char =>
          this.filters.tags.some(tag => char.tags.includes(tag))
        );
      }

      if (this.filters.category !== 'all') {
        result = result.filter(char => char.category === this.filters.category);
      }

      if (this.filters.gender !== 'all') {
        result = result.filter(char =>
          char.tags.includes(this.filters.gender)
        );
      }

      switch (this.filters.ranking) {
        case 'rating':
          result.sort((a, b) => b.stats.rating - a.stats.rating);
          break;
        case 'chats':
          result.sort((a, b) => b.stats.chats - a.stats.chats);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          break;
      }

      this.filteredCharacters = result;
    },

    setSearchFilter(search: string) {
      this.filters.search = search;
      this.resetAndReload();
    },

    toggleTagFilter(tag: string) {
      const index = this.filters.tags.indexOf(tag);
      if (index === -1) {
        this.filters.tags.push(tag);
      } else {
        this.filters.tags.splice(index, 1);
      }
      this.resetAndReload();
    },

    setCategoryFilter(category: string) {
      this.filters.category = category;
      this.resetAndReload();
    },

    setRankingFilter(ranking: string) {
      this.filters.ranking = ranking;
      this.resetAndReload();
      if (this.memories.length > 0) {
        this.resetMemories();
      }
    },

    setGenderFilter(gender: string) {
      this.filters.gender = gender;
      this.resetAndReload();
      if (this.memories.length > 0) {
        this.resetMemories();
      }
    },

    toggleFilteredView(showFiltered: boolean) {
      this.filters.showFiltered = showFiltered;
      this.applyFilters();
    },

    resetFilters() {
      this.filters = {
        tags: [],
        search: '',
        category: 'all',
        ranking: 'default',
        gender: 'all',
        showFiltered: true
      };
      this.resetAndReload();
      if (this.memories.length > 0) {
        this.resetMemories();
      }
      if (this.creators.length > 0) {
        this.resetCreators();
      }
    },

    resetAndReload() {
      this.page = 1;
      this.hasMore = true;
      this.characters = [];
      this.loadCharacters();
    },

    // 聊天相关方法 - 使用API
    async loadChats() {
      const authStore = useAuthStore();
      if (!authStore?.user?.id) return;

      this.isLoadingChats = true;
      try {
        const api = useApi();
        const response = await api.getUserChats(authStore.user.id);
        if (response.success) {
          this.chats = response.chats;
        }
      } catch (error) {
        console.error('Error loading chats:', error);
      } finally {
        this.isLoadingChats = false;
      }
    },

    async startChat(character: CharacterCard) {
      const authStore = useAuthStore();
      if (!authStore?.user?.id) {
        authStore?.setAuthModalVisibility(true);
        return;
      }

      this.isLoading = true;
      try {
        // 检查是否已存在与该角色的聊天
        const existingChat = this.chats.find(chat => chat.character.id === character.id);

        if (existingChat) {
          // 加载现有聊天
          await this.loadChat(existingChat.id);
        } else {
          // 创建新聊天
          const api = useApi();
          const response = await api.createChat({
            userId: authStore.user.id,
            characterId: character.id
          });

          if (response.success) {
            // 添加到聊天列表
            this.chats.unshift(response.chat);

            // 设置为活跃聊天
            this.activeChat = {
              id: response.chat.id,
              character: response.chat.character,
              messages: [{
                id: `msg_init_${response.chat.id}`,
                sender: 'character',
                content: response.chat.character.greeting || `你好！我是${response.chat.character.name}，很高兴见到你！`,
                timestamp: new Date().toISOString()
              }]
            };
          }
        }
      } catch (error) {
        console.error('Error starting chat:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async loadChat(chatId: string) {
      const authStore = useAuthStore();
      if (!authStore?.user?.id) return;

      this.isLoadingMessages = true;
      try {
        const api = useApi();
        const response = await api.getChatMessages(chatId, authStore.user.id);

        if (response.success) {
          const chat = this.chats.find(c => c.id === chatId);
          if (chat) {
            this.activeChat = {
              id: chatId,
              character: chat.character,
              messages: response.messages
            };
          }
        }
      } catch (error) {
        console.error('Error loading chat messages:', error);
      } finally {
        this.isLoadingMessages = false;
      }
    },

    async sendMessage(content: string) {
      if (!this.activeChat || this.isSendingMessage) return;

      const authStore = useAuthStore();
      if (!authStore?.user?.id) return;

      this.isSendingMessage = true;
      this.isTypingCharacter = false;
      this.streamingMessageId = null;

      try {
        const api = useApi();

        // 使用流式API发送消息
        await api.sendMessageStreamFetch(
          this.activeChat.id,
          {
            userId: authStore.user.id,
            content,
            characterId: this.activeChat.character.id
          },
          (event) => {
            this.handleStreamEvent(event);
          },
          (error) => {
            console.error('Stream error:', error);
            this.isSendingMessage = false;
            this.isTypingCharacter = false;
            this.streamingMessageId = null;
          },
          () => {
            this.isSendingMessage = false;
            this.isTypingCharacter = false;
            this.streamingMessageId = null;
          }
        );
      } catch (error) {
        console.error('Error sending message:', error);
        this.isSendingMessage = false;
        this.isTypingCharacter = false;
        this.streamingMessageId = null;
      }
    },

    handleStreamEvent(event: StreamMessageEvent) {
      if (!this.activeChat) return;

      switch (event.type) {
        case 'user_message':
          // 添加用户消息
          if (event.message) {
            this.activeChat.messages.push(event.message);
            this.updateChatLastMessage(event.message);
            this.isTypingCharacter = true; // 用户消息发送后，显示AI正在输入
          }
          break;

        case 'character_message_start':
          // 开始AI回复，创建一个空的消息对象
          if (event.messageId && event.timestamp) {
            const characterMessage: ChatMessage = {
              id: event.messageId,
              sender: 'character',
              content: '',
              timestamp: event.timestamp
            };
            this.activeChat.messages.push(characterMessage);
            this.streamingMessageId = event.messageId;
            this.isTypingCharacter = true;
          }
          break;

        case 'character_message_chunk':
          // 逐字添加内容
          if (event.messageId && event.chunk) {
            const messageIndex = this.activeChat.messages.findIndex(
              msg => msg.id === event.messageId
            );
            if (messageIndex !== -1) {
              this.activeChat.messages[messageIndex].content += event.chunk;
            }
          }
          break;

        case 'character_message_complete':
          // 消息完成
          if (event.messageId && event.completeContent) {
            const messageIndex = this.activeChat.messages.findIndex(
              msg => msg.id === event.messageId
            );
            if (messageIndex !== -1) {
              // 确保内容完整
              this.activeChat.messages[messageIndex].content = event.completeContent;
              // 更新聊天列表中的最后消息
              this.updateChatLastMessage(this.activeChat.messages[messageIndex]);
            }
            this.isTypingCharacter = false;
            this.streamingMessageId = null;
          }
          break;
      }
    },

    updateChatLastMessage(message: ChatMessage) {
      const chatIndex = this.chats.findIndex(chat => chat.id === this.activeChat?.id);
      if (chatIndex !== -1) {
        this.chats[chatIndex].lastMessage = message.content;
        this.chats[chatIndex].lastMessageSender = message.sender;
        this.chats[chatIndex].timestamp = message.timestamp;
        if (message.sender === 'user') {
          this.chats[chatIndex].messageCount += 1;
        } else if (message.sender === 'character' && !this.streamingMessageId) {
          // 只在消息完成时增加计数
          this.chats[chatIndex].messageCount += 1;
        }
      }
    },

    async deleteChat(chatId: string) {
      const authStore = useAuthStore();
      if (!authStore?.user?.id) return;

      try {
        const api = useApi();
        const response = await api.deleteChat(chatId, authStore.user.id);

        if (response.success) {
          // 从聊天列表中移除
          this.chats = this.chats.filter(chat => chat.id !== chatId);

          // 如果删除的是当前活跃聊天，清除活跃聊天
          if (this.activeChat?.id === chatId) {
            this.activeChat = null;
          }
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
      }
    },

    clearChats() {
      this.chats = [];
      this.activeChat = null;
    }
  }
});