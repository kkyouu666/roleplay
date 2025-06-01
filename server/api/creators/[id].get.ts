import usersData from '~/server/mock/users.json'

export default defineEventHandler(async (event) => {
  const creatorId = getRouterParam(event, 'id')

  if (!creatorId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Creator ID is required'
    })
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200))

  // 从users中查找creator（有creator badge的用户）
  const creator = usersData.find(user =>
    user.id === creatorId &&
    user.badges && user.badges.includes('creator')
  )

  if (!creator) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Creator not found'
    })
  }

  // 转换为creator格式（保持向后兼容）
  const creatorResponse = {
    id: creator.id,
    username: creator.username,
    avatar: creator.avatar,
    bio: creator.bio,
    joinedAt: creator.joinedAt,
    stats: {
      characters: creator.stats.characters,
      followers: creator.stats.followers,
      rating: creator.stats.rating || 0
    },
    // 添加完整的用户信息（如果需要的话）
    email: creator.email,
    badges: creator.badges,
    subscription: creator.subscription,
    points: creator.points,
    settings: creator.settings,
    lastActive: creator.lastActive
  }

  return creatorResponse
}) 