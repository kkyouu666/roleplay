export interface Character {
  id: string
  name: string
  avatar: string
  description: string
  greeting: string
  category: string
  tags: string[]
  creator: {
    id: string
    username: string
  }
  stats: {
    rating: number
    chats: number
    favorites: number
  }
  illustrator: string
  scriptwriter: string
  voiceActor: string
  series: string
  createdAt: string
  updatedAt: string
  nsfw: boolean
}

export interface Comment {
  id: string
  characterId: string
  user: {
    id: string
    username: string
    avatar: string
  }
  content: string
  rating: number
  createdAt: string
}

export interface CommentsResponse {
  comments: Comment[]
  pagination: ApiPagination
}

export interface Memory {
  id: string
  title: string
  user: {
    id: string
    username: string
    avatar: string
  }
  character: {
    id: string
    name: string
    avatar: string
  }
  messages: Array<{
    id: string
    sender: 'user' | 'character'
    content: string
  }>
  stats: {
    likes: number
    comments: number
  }
  timestamp: string
}

export interface MemoriesResponse {
  memories: Memory[]
  pagination: ApiPagination
}

export interface Creator {
  id: string
  username: string
  avatar: string
  bio?: string
  stats: {
    characters: number
    totalChats: number
    totalFavorites: number
    averageRating: number
  }
  joinedAt: string
  lastActive: string
}

export interface CreatorCharactersResponse {
  characters: Character[]
  total: number
}

export interface User {
  id: string
  username: string
  avatar: string
  bio?: string | null
  stats: {
    characters: number
    followers: number
    following: number
    totalChats: number
    totalFavorites: number
    totalMemories: number
  }
  settings: {
    isPublicProfile: boolean
    isPublicBio: boolean
    isPublicLikes: boolean
    isPublicFavorites: boolean
    isPublicMemories: boolean
  }
  badges: string[]
  joinedAt: string
  lastActive: string
}

export interface UserPreview {
  id: string
  username: string
  avatar: string
  bio?: string | null
  stats: {
    characters: number
    followers: number
    following: number
  }
  badges: string[]
  joinedAt: string
}

export interface UserCharactersResponse {
  characters: any[]
  pagination: ApiPagination
}

export interface UserLikedCharactersResponse {
  characters: any[]
  pagination: ApiPagination
  isPrivate: boolean
}

export interface UserFavoritedCharactersResponse {
  characters: any[]
  pagination: ApiPagination
  isPrivate: boolean
}

export interface UserFollowersResponse {
  followers: UserPreview[]
  pagination: ApiPagination
}

export interface UserFollowingResponse {
  following: UserPreview[]
  pagination: ApiPagination
}

export interface UserMemoriesResponse {
  memories: Memory[]
  pagination: ApiPagination
  isPrivate: boolean
}

export interface UsersResponse {
  users: UserPreview[]
  pagination: ApiPagination
}

export interface CharacterFilters {
  page?: number
  pageSize?: number
  category?: string
  tags?: string[]
  search?: string
  ranking?: string
  gender?: string
}

export interface MemoryFilters {
  page?: number
  pageSize?: number
  ranking?: string
  gender?: string
}

export interface CreatorFilters {
  page?: number
  pageSize?: number
  sort?: string // rating, followers, characters, joinedAt
  order?: string // desc, asc
}

export interface NotificationFilters {
  page?: number
  pageSize?: number
  filter?: string // all, unread, read
}

export interface UserFilters {
  page?: number
  pageSize?: number
  search?: string
  filter?: string // all, creators, verified
}

export interface ApiPagination {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

export interface CharactersResponse {
  characters: Character[]
  pagination: ApiPagination
}

export interface CreatorsResponse {
  creators: any[]
  pagination: ApiPagination
}

export interface NotificationsResponse {
  notifications: any[]
  pagination: ApiPagination
}

export interface RelatedCharactersResponse {
  characters: Character[]
}

export interface AuthUser {
  id: string
  username: string
  email: string
  avatar: string
  bio?: string
  stats: {
    characters: number
    followers: number
    following: number
    totalChats: number
    totalFavorites: number
    totalMemories: number
  }
  settings: {
    isPublicProfile: boolean
    isPublicBio: boolean
    isPublicLikes: boolean
    isPublicFavorites: boolean
    isPublicMemories: boolean
  }
  badges: string[]
  joinedAt: string
  lastActive: string
  subscription: 'free' | 'standard' | 'premium'
  points: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface UpdateProfileRequest {
  userId: string
  username?: string
  avatar?: string
  bio?: string
  settings?: Partial<AuthUser['settings']>
}

export interface UserSettings {
  personalInfo: {
    username: string
    email: string
    bio: string
    gender: string
    birthday: string
    avatar: string
  }
  privacy: {
    genderVisibility: string
    birthdayVisibility: string
    bioVisibility: string
    favoritesVisibility: string
    likesVisibility: string
    allowPersonalization: boolean
    allowAnalytics: boolean
  }
  notifications: {
    emailEnabled: boolean
    pushEnabled: boolean
    messageNotifications: boolean
    mentionNotifications: boolean
    updateNotifications: boolean
    marketingNotifications: boolean
  }
  account: {
    language: string
    theme: string
    emailVerified: boolean
    twoFactorEnabled: boolean
  }
  subscription: {
    plan: string
    expiresAt: string | null
    isActive: boolean
    features: string[]
  }
}

export interface UpdatePersonalInfoRequest {
  userId: string
  username?: string
  bio?: string
  gender?: string
  birthday?: string
  avatar?: string
}

export interface UpdatePrivacyRequest {
  userId: string
  genderVisibility?: string
  birthdayVisibility?: string
  bioVisibility?: string
  favoritesVisibility?: string
  likesVisibility?: string
  allowPersonalization?: boolean
  allowAnalytics?: boolean
}

export interface UpdateNotificationsRequest {
  userId: string
  emailEnabled?: boolean
  pushEnabled?: boolean
  messageNotifications?: boolean
  mentionNotifications?: boolean
  updateNotifications?: boolean
  marketingNotifications?: boolean
}

export interface ChangePasswordRequest {
  userId: string
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface DeleteAccountRequest {
  userId: string
  password: string
  confirmText: string
}

export interface AuthResponse {
  success: boolean
  user: AuthUser
  token: string
  message?: string
}

export interface ApiResponse {
  success: boolean
  message: string
}

export interface UserRole {
  id: string
  name: string
  age?: number | null
  bio: string
  avatar: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface UserRolesResponse {
  success: boolean
  roles: UserRole[]
}

export interface CreateRoleRequest {
  userId: string
  name: string
  age?: number | null
  bio?: string
  avatar?: string
}

export interface UpdateRoleRequest {
  userId: string
  name: string
  age?: number | null
  bio?: string
  avatar?: string
}

export interface RoleResponse {
  success: boolean
  message: string
  role: UserRole
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'character' | 'system'
  content: string
  timestamp: string
}

export interface ChatSession {
  id: string
  character: Character
  lastMessage: string
  lastMessageSender: 'user' | 'character'
  timestamp: string
  unreadCount: number
  messageCount: number
}

export interface ChatListResponse {
  success: boolean
  chats: ChatSession[]
}

export interface ChatMessagesResponse {
  success: boolean
  messages: ChatMessage[]
  pagination: ApiPagination
}

export interface CreateChatRequest {
  userId: string
  characterId: string
}

export interface CreateChatResponse {
  success: boolean
  message: string
  chat: ChatSession
}

export interface SendMessageRequest {
  userId: string
  content: string
  characterId?: string
}

export interface SendMessageResponse {
  success: boolean
  messages: ChatMessage[]
}

export interface StreamMessageEvent {
  type: 'user_message' | 'character_message_start' | 'character_message_chunk' | 'character_message_complete'
  message?: ChatMessage
  messageId?: string
  sender?: 'user' | 'character'
  timestamp?: string
  chunk?: string
  completeContent?: string
  isComplete?: boolean
}

export const useApi = () => {
  const getCharacters = async (filters: CharacterFilters = {}): Promise<CharactersResponse> => {
    const params = new URLSearchParams()

    if (filters.page) params.append('page', filters.page.toString())
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())
    if (filters.category) params.append('category', filters.category)
    if (filters.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','))
    if (filters.search) params.append('search', filters.search)
    if (filters.ranking) params.append('ranking', filters.ranking)
    if (filters.gender) params.append('gender', filters.gender)

    const url = `/api/characters${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getCharacter = async (id: string): Promise<Character> => {
    return await $fetch(`/api/characters/${id}`)
  }

  const getRelatedCharacters = async (id: string, limit: number = 6): Promise<RelatedCharactersResponse> => {
    return await $fetch(`/api/characters/${id}/related?limit=${limit}`)
  }

  const getCharacterComments = async (characterId: string, page: number = 1, pageSize: number = 10): Promise<CommentsResponse> => {
    const params = new URLSearchParams()

    if (page) params.append('page', page.toString())
    if (pageSize) params.append('pageSize', pageSize.toString())

    const url = `/api/characters/${characterId}/comments${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getCharacterMemories = async (characterId: string, page: number = 1, pageSize: number = 5): Promise<MemoriesResponse> => {
    const params = new URLSearchParams()

    if (page) params.append('page', page.toString())
    if (pageSize) params.append('pageSize', pageSize.toString())

    const url = `/api/characters/${characterId}/memories${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getMemories = async (filters: MemoryFilters = {}): Promise<MemoriesResponse> => {
    const params = new URLSearchParams()

    if (filters.page) params.append('page', filters.page.toString())
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())
    if (filters.ranking) params.append('ranking', filters.ranking)
    if (filters.gender) params.append('gender', filters.gender)

    const url = `/api/memories${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getCreators = async (filters: CreatorFilters = {}): Promise<CreatorsResponse> => {
    const params = new URLSearchParams()

    if (filters.page) params.append('page', filters.page.toString())
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.order) params.append('order', filters.order)

    const url = `/api/creators${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getCreator = async (id: string): Promise<Creator> => {
    return await $fetch(`/api/creators/${id}`)
  }

  const getCreatorCharacters = async (creatorId: string, excludeId?: string, limit: number = 3): Promise<CreatorCharactersResponse> => {
    const params = new URLSearchParams()

    if (excludeId) params.append('exclude', excludeId)
    if (limit) params.append('limit', limit.toString())

    const url = `/api/creators/${creatorId}/characters${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getNotifications = async (filters: NotificationFilters = {}): Promise<NotificationsResponse> => {
    const params = new URLSearchParams()

    if (filters.page) params.append('page', filters.page.toString())
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())
    if (filters.filter) params.append('filter', filters.filter)

    const url = `/api/notifications${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const markNotificationAsRead = async (id: string): Promise<ApiResponse> => {
    return await $fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH'
    })
  }

  const deleteNotification = async (id: string): Promise<ApiResponse> => {
    return await $fetch(`/api/notifications/${id}/delete`, {
      method: 'DELETE'
    })
  }

  const markAllNotificationsAsRead = async (): Promise<ApiResponse> => {
    return await $fetch('/api/notifications/mark-all-read', {
      method: 'PATCH'
    })
  }

  const deleteAllNotifications = async (): Promise<ApiResponse> => {
    return await $fetch('/api/notifications/delete-all', {
      method: 'DELETE'
    })
  }

  const getUsers = async (filters: UserFilters = {}): Promise<UsersResponse> => {
    const params = new URLSearchParams()

    if (filters.page) params.append('page', filters.page.toString())
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())
    if (filters.search) params.append('search', filters.search)
    if (filters.filter) params.append('filter', filters.filter)

    const url = `/api/users${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getUser = async (id: string): Promise<User> => {
    return await $fetch(`/api/users/${id}`)
  }

  const getUserCharacters = async (userId: string, page: number = 1, pageSize: number = 10): Promise<UserCharactersResponse> => {
    const params = new URLSearchParams()

    if (page) params.append('page', page.toString())
    if (pageSize) params.append('pageSize', pageSize.toString())

    const url = `/api/users/${userId}/characters${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getUserLikedCharacters = async (userId: string, page: number = 1, pageSize: number = 10): Promise<UserLikedCharactersResponse> => {
    const params = new URLSearchParams()

    if (page) params.append('page', page.toString())
    if (pageSize) params.append('pageSize', pageSize.toString())

    const url = `/api/users/${userId}/liked-characters${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getUserFavoritedCharacters = async (userId: string, page: number = 1, pageSize: number = 10): Promise<UserFavoritedCharactersResponse> => {
    const params = new URLSearchParams()

    if (page) params.append('page', page.toString())
    if (pageSize) params.append('pageSize', pageSize.toString())

    const url = `/api/users/${userId}/favorited-characters${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getUserFollowers = async (userId: string, page: number = 1, pageSize: number = 10): Promise<UserFollowersResponse> => {
    const params = new URLSearchParams()

    if (page) params.append('page', page.toString())
    if (pageSize) params.append('pageSize', pageSize.toString())

    const url = `/api/users/${userId}/followers${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getUserFollowing = async (userId: string, page: number = 1, pageSize: number = 10): Promise<UserFollowingResponse> => {
    const params = new URLSearchParams()

    if (page) params.append('page', page.toString())
    if (pageSize) params.append('pageSize', pageSize.toString())

    const url = `/api/users/${userId}/following${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  const getUserMemories = async (userId: string, page: number = 1, pageSize: number = 10): Promise<UserMemoriesResponse> => {
    const params = new URLSearchParams()

    if (page) params.append('page', page.toString())
    if (pageSize) params.append('pageSize', pageSize.toString())

    const url = `/api/users/${userId}/memories${params.toString() ? '?' + params.toString() : ''}`
    return await $fetch(url)
  }

  // 鉴权相关API方法
  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    return await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
  }

  const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: userData
    })
  }

  const getCurrentUser = async (userId: string, token: string): Promise<{ success: boolean; user: AuthUser }> => {
    return await $fetch(`/api/auth/me?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
  }

  const updateProfile = async (profileData: UpdateProfileRequest, token: string): Promise<{ success: boolean; message: string; user: AuthUser }> => {
    return await $fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: profileData
    })
  }

  // 设置相关API方法
  const getUserSettings = async (userId: string): Promise<{ success: boolean; settings: UserSettings }> => {
    return await $fetch(`/api/user/settings?userId=${userId}`)
  }

  const updatePersonalInfo = async (data: UpdatePersonalInfoRequest): Promise<{ success: boolean; message: string; user: AuthUser }> => {
    return await $fetch('/api/user/profile', {
      method: 'PUT',
      body: data
    })
  }

  const updatePrivacySettings = async (data: UpdatePrivacyRequest): Promise<{ success: boolean; message: string; settings: any }> => {
    return await $fetch('/api/user/privacy', {
      method: 'PUT',
      body: data
    })
  }

  const updateNotificationSettings = async (data: UpdateNotificationsRequest): Promise<{ success: boolean; message: string; settings: any }> => {
    return await $fetch('/api/user/notifications', {
      method: 'PUT',
      body: data
    })
  }

  const changePassword = async (data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> => {
    return await $fetch('/api/user/password', {
      method: 'PUT',
      body: data
    })
  }

  const deleteAccount = async (data: DeleteAccountRequest): Promise<{ success: boolean; message: string }> => {
    return await $fetch('/api/user/delete', {
      method: 'DELETE',
      body: data
    })
  }

  // 角色相关API方法
  const getUserRoles = async (userId: string): Promise<UserRolesResponse> => {
    return await $fetch(`/api/user/roles?userId=${userId}`)
  }

  const createRole = async (data: CreateRoleRequest): Promise<RoleResponse> => {
    return await $fetch('/api/user/roles', {
      method: 'POST',
      body: data
    })
  }

  const updateRole = async (roleId: string, data: UpdateRoleRequest): Promise<RoleResponse> => {
    return await $fetch(`/api/user/roles/${roleId}`, {
      method: 'PUT',
      body: data
    })
  }

  const deleteRole = async (roleId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    return await $fetch(`/api/user/roles/${roleId}?userId=${userId}`, {
      method: 'DELETE'
    })
  }

  const setDefaultRole = async (roleId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    return await $fetch(`/api/user/roles/${roleId}/default`, {
      method: 'PATCH',
      body: { userId }
    })
  }

  // 聊天相关API方法
  const getUserChats = async (userId: string): Promise<ChatListResponse> => {
    return await $fetch(`/api/chats?userId=${userId}`)
  }

  const createChat = async (data: CreateChatRequest): Promise<CreateChatResponse> => {
    return await $fetch('/api/chats', {
      method: 'POST',
      body: data
    })
  }

  const getChatMessages = async (chatId: string, userId: string, page: number = 1, pageSize: number = 50): Promise<ChatMessagesResponse> => {
    const params = new URLSearchParams()
    params.append('userId', userId)
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())

    return await $fetch(`/api/chats/${chatId}/messages?${params.toString()}`)
  }

  const sendMessage = async (chatId: string, data: SendMessageRequest): Promise<SendMessageResponse> => {
    return await $fetch(`/api/chats/${chatId}/messages`, {
      method: 'POST',
      body: data
    })
  }

  const sendMessageStream = (chatId: string, data: SendMessageRequest): EventSource => {
    // 创建SSE连接
    const eventSource = new EventSource(`/api/chats/${chatId}/stream`, {
      // 注意：EventSource的第二个参数在某些浏览器中可能不支持POST
      // 我们需要使用fetch API来实现SSE
    })

    return eventSource
  }

  // 使用fetch实现SSE流式发送
  const sendMessageStreamFetch = async (
    chatId: string,
    data: SendMessageRequest,
    onEvent: (event: StreamMessageEvent) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/chats/${chatId}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body reader available')
      }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          onComplete?.()
          break
        }

        buffer += decoder.decode(value, { stream: true })

        // 处理SSE事件
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // 保留可能不完整的最后一行

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6)) as StreamMessageEvent
              onEvent(eventData)
            } catch (e) {
              console.error('Error parsing SSE event:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('SSE stream error:', error)
      onError?.(error as Error)
    }
  }

  const deleteChat = async (chatId: string, userId: string): Promise<{ success: boolean; message: string }> => {
    return await $fetch(`/api/chats/${chatId}?userId=${userId}`, {
      method: 'DELETE'
    })
  }

  return {
    getCharacters,
    getCharacter,
    getRelatedCharacters,
    getCharacterComments,
    getCharacterMemories,
    getMemories,
    getCreators,
    getCreator,
    getCreatorCharacters,
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    markAllNotificationsAsRead,
    deleteAllNotifications,
    getUsers,
    getUser,
    getUserCharacters,
    getUserLikedCharacters,
    getUserFavoritedCharacters,
    getUserFollowers,
    getUserFollowing,
    getUserMemories,
    login,
    register,
    getCurrentUser,
    updateProfile,
    getUserSettings,
    updatePersonalInfo,
    updatePrivacySettings,
    updateNotificationSettings,
    changePassword,
    deleteAccount,
    // 用户虚拟人设相关方法
    getUserRoles,
    createRole,
    updateRole,
    deleteRole,
    setDefaultRole,
    // 聊天相关方法
    getUserChats,
    createChat,
    getChatMessages,
    sendMessage,
    sendMessageStreamFetch,
    deleteChat
  }
} 