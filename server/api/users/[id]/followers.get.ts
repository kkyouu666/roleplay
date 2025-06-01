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

  // 获取关注者用户信息
  const followerIds = user.followers || []
  const followers = usersData.filter(u => followerIds.includes(u.id))

  // 分页
  const total = followers.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedFollowers = followers.slice(start, end)

  // 处理用户数据，只返回公开信息
  const followerList = paginatedFollowers.map(follower => ({
    id: follower.id,
    username: follower.username,
    avatar: follower.avatar,
    bio: follower.settings.isPublicBio ? follower.bio : null,
    stats: {
      characters: follower.stats.characters,
      followers: follower.stats.followers,
      following: follower.stats.following
    },
    badges: follower.badges,
    joinedAt: follower.joinedAt
  }))

  return {
    followers: followerList,
    pagination: {
      page,
      pageSize,
      total,
      hasMore: end < total
    }
  }
}) 