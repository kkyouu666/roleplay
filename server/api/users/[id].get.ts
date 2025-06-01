import usersData from '~/server/mock/users.json'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  const user = usersData.find(u => u.id === id)

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  // 返回公开的用户信息
  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    bio: user.settings.isPublicBio ? user.bio : null,
    stats: {
      characters: user.stats.characters,
      followers: user.stats.followers,
      following: user.stats.following,
      totalChats: user.stats.totalChats,
      totalFavorites: user.stats.totalFavorites,
      totalMemories: user.stats.totalMemories
    },
    settings: {
      isPublicProfile: user.settings.isPublicProfile,
      isPublicBio: user.settings.isPublicBio,
      isPublicLikes: user.settings.isPublicLikes,
      isPublicFavorites: user.settings.isPublicFavorites,
      isPublicMemories: user.settings.isPublicMemories
    },
    badges: user.badges,
    joinedAt: user.joinedAt,
    lastActive: user.lastActive
  }
}) 