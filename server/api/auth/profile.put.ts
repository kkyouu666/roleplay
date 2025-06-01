import usersData from '~/server/mock/users.json'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  const body = await readBody(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication token required'
    })
  }

  // 验证token格式
  if (!token.startsWith('mock_token_')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  const { userId, username, avatar, bio, settings } = body

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID required'
    })
  }

  // 查找用户
  const userIndex = usersData.findIndex(u => u.id === userId)

  if (userIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  const user = usersData[userIndex]

  // 如果更新用户名，检查是否已存在
  if (username && username !== user.username) {
    const existingUser = usersData.find(u => u.username === username && u.id !== userId)
    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username already exists'
      })
    }
    user.username = username
  }

  // 更新其他字段
  if (avatar) user.avatar = avatar
  if (bio !== undefined) user.bio = bio
  if (settings) {
    user.settings = { ...user.settings, ...settings }
  }

  // 更新最后活跃时间
  user.lastActive = new Date().toISOString()

  // 在真实应用中，这里应该将更新保存到数据库
  // 现在我们只是模拟更新成功

  // 返回更新后的用户信息（不包含密码）
  const userResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    stats: user.stats,
    settings: user.settings,
    badges: user.badges,
    joinedAt: user.joinedAt,
    lastActive: user.lastActive,
    subscription: user.subscription,
    points: user.points
  }

  return {
    success: true,
    message: 'Profile updated successfully',
    user: userResponse
  }
}) 