import usersData from '~/server/mock/users.json'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  // 查找用户
  const user = usersData.find(u => u.email === email)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }

  // 验证密码（在真实应用中应该使用哈希密码）
  if (user.password !== password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }

  // 生成简单的token（在真实应用中应该使用JWT）
  const token = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // 返回用户信息（不包含密码）和token
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
    user: userResponse,
    token
  }
}) 