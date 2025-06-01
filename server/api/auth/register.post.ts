import usersData from '~/server/mock/users.json'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password } = body

  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username, email and password are required'
    })
  }

  // 检查邮箱是否已存在
  const existingUser = usersData.find(u => u.email === email)
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Email already exists'
    })
  }

  // 检查用户名是否已存在
  const existingUsername = usersData.find(u => u.username === username)
  if (existingUsername) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Username already exists'
    })
  }

  // 生成新用户ID
  const newUserId = `user_${Date.now()}`

  // 生成简单的token（在真实应用中应该使用JWT）
  const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // 创建新用户对象
  const newUser = {
    id: newUserId,
    username,
    email,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    bio: '新用户，欢迎来到AI角色世界！',
    stats: {
      characters: 0,
      followers: 0,
      following: 0,
      totalChats: 0,
      totalFavorites: 0,
      totalMemories: 0
    },
    settings: {
      isPublicProfile: true,
      isPublicBio: true,
      isPublicLikes: true,
      isPublicFavorites: true,
      isPublicMemories: true
    },
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    badges: ['newcomer'],
    following: [],
    followers: [],
    likedCharacters: [],
    favoritedCharacters: [],
    likedMemories: [],
    favoritedMemories: [],
    subscription: 'free',
    points: 200, // 新用户初始积分
    password
  }

  // 在真实应用中，这里应该将新用户保存到数据库
  // 这里我们只是模拟返回成功响应

  // 返回用户信息（不包含密码）和token
  const userResponse = {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    avatar: newUser.avatar,
    bio: newUser.bio,
    stats: newUser.stats,
    settings: newUser.settings,
    badges: newUser.badges,
    joinedAt: newUser.joinedAt,
    lastActive: newUser.lastActive,
    subscription: newUser.subscription,
    points: newUser.points
  }

  return {
    success: true,
    message: 'Registration successful',
    user: userResponse,
    token
  }
}) 