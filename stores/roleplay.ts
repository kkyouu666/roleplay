import { defineStore } from 'pinia';
import type { CharacterCard, ChatMessage } from '~/types';
import { useAuthStore } from '~/stores/auth';

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
    chats: [] as { id: string, character: CharacterCard, lastMessage: string, timestamp: string }[],
    filters: {
      tags: [] as string[],
      search: '',
      category: 'all',
      ranking: 'default',
      gender: 'all',
      showFiltered: true
    }
  }),

  actions: {
    async simulateNetworkDelay() {
      if (process.env.NODE_ENV === 'development') {
        const delay = Math.random() * 1000 + 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    },

    async loadCharacters() {
      if (this.isLoading || !this.hasMore) return;

      this.isLoading = true;
      try {
        await this.simulateNetworkDelay();

        const response = await import('~/mock/characters.json');
        const allCharacters = response.default;

        const start = (this.page - 1) * this.pageSize;
        const end = start + this.pageSize;
        const newCharacters = allCharacters.slice(start, end);

        this.hasMore = end < allCharacters.length;

        if (this.page === 1) {
          this.characters = newCharacters;
        } else {
          this.characters = [...this.characters, ...newCharacters];
        }

        this.page++;
        this.applyFilters();
      } catch (error) {
        console.error('Failed to load characters', error);
      } finally {
        this.isLoading = false;
      }
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
      this.applyFilters();
    },

    toggleTagFilter(tag: string) {
      const index = this.filters.tags.indexOf(tag);
      if (index === -1) {
        this.filters.tags.push(tag);
      } else {
        this.filters.tags.splice(index, 1);
      }
      this.applyFilters();
    },

    setCategoryFilter(category: string) {
      this.filters.category = category;
      this.applyFilters();
    },

    setRankingFilter(ranking: string) {
      this.filters.ranking = ranking;
      this.applyFilters();
    },

    setGenderFilter(gender: string) {
      this.filters.gender = gender;
      this.applyFilters();
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
      this.applyFilters();
    },

    startChat(character: CharacterCard) {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        return;
      }

      this.isLoading = true;

      const existingChatIndex = this.chats.findIndex(chat => chat.character.id === character.id);

      this.simulateNetworkDelay().then(() => {
        if (existingChatIndex !== -1) {
          const chatId = this.chats[existingChatIndex].id;
          this.loadChat(chatId);
        } else {
          const chatId = `chat_${Date.now()}`;

          this.activeChat = {
            id: chatId,
            character,
            messages: [{
              id: `msg_${Date.now()}`,
              sender: 'character',
              content: character.greeting || `Hello! I'm ${character.name}. How can I help you today?`,
              timestamp: new Date().toISOString()
            }]
          };

          this.chats.unshift({
            id: chatId,
            character,
            lastMessage: this.activeChat.messages[0].content,
            timestamp: new Date().toISOString()
          });
        }
        this.isLoading = false;
      });
    },

    loadChat(chatId: string) {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        return;
      }

      this.isLoading = true;

      this.simulateNetworkDelay().then(() => {
        const chatIndex = this.chats.findIndex(chat => chat.id === chatId);

        if (chatIndex !== -1) {
          const character = this.chats[chatIndex].character;

          this.activeChat = {
            id: chatId,
            character,
            messages: [{
              id: `msg_init_${chatId}`,
              sender: 'character',
              content: character.greeting || `Hello! I'm ${character.name}. How can I help you today?`,
              timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
            }]
          };
        }
        this.isLoading = false;
      });
    },

    sendMessage(content: string) {
      if (!this.activeChat) return;

      const userMessageId = `msg_user_${Date.now()}`;
      this.activeChat.messages.push({
        id: userMessageId,
        sender: 'user',
        content,
        timestamp: new Date().toISOString()
      });

      const chatIndex = this.chats.findIndex(chat => chat.id === this.activeChat?.id);
      if (chatIndex !== -1) {
        this.chats[chatIndex].lastMessage = content;
        this.chats[chatIndex].timestamp = new Date().toISOString();
      }

      setTimeout(() => {
        if (!this.activeChat) return;

        const character = this.activeChat.character;
        const responseId = `msg_char_${Date.now()}`;

        let response = `I'm ${character.name}. `;

        if (content.includes('hello') || content.includes('hi')) {
          response += 'Hello there! How are you doing today?';
        } else if (content.includes('how are you')) {
          response += "I'm doing great! Thank you for asking. How about you?";
        } else if (content.includes('help')) {
          response += "I'd be happy to help you. What do you need assistance with?";
        } else {
          response += "That's interesting! Tell me more about it.";
        }

        this.activeChat.messages.push({
          id: responseId,
          sender: 'character',
          content: response,
          timestamp: new Date().toISOString()
        });

        const chatIndex = this.chats.findIndex(chat => chat.id === this.activeChat?.id);
        if (chatIndex !== -1) {
          this.chats[chatIndex].lastMessage = response;
          this.chats[chatIndex].timestamp = new Date().toISOString();
        }
      }, 1000);
    },

    clearChats() {
      this.chats = [];
      this.activeChat = null;
    }
  }
});