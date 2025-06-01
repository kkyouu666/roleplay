import usersData from '~/server/mock/users.json'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

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

  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 10

  // 获取关注的用户信息
  const followingIds = user.following || []
  const following = usersData.filter(u => followingIds.includes(u.id))

  // 分页
  const total = following.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedFollowing = following.slice(start, end)

  // 处理用户数据，只返回公开信息
  const followingList = paginatedFollowing.map(followedUser => ({
    id: followedUser.id,
    username: followedUser.username,
    avatar: followedUser.avatar,
    bio: followedUser.settings.isPublicBio ? followedUser.bio : null,
    stats: {
      characters: followedUser.stats.characters,
      followers: followedUser.stats.followers,
      following: followedUser.stats.following
    },
    badges: followedUser.badges,
    joinedAt: followedUser.joinedAt
  }))

  return {
    following: followingList,
    pagination: {
      page,
      pageSize,
      total,
      hasMore: end < total
    }
  }
}) 