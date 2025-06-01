import usersData from '~/server/mock/users.json'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication token required'
    })
  }

  // 在真实应用中，这里应该验证JWT token
  // 现在我们简单地检查token格式并从localStorage或用户ID获取用户
  if (!token.startsWith('mock_token_')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  // 从查询参数或其他方式获取用户ID（在真实应用中应该从token中解析）
  const userId = getQuery(event).userId as string

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID required'
    })
  }

  // 查找用户
  const user = usersData.find(u => u.id === userId)

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  // 返回用户信息（不包含密码）
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
    user: userResponse
  }
}) 