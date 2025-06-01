import usersData from '~/server/mock/users.json'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 10
  const search = query.search as string || ''
  const filter = query.filter as string || 'all' // all, creators, verified

  // 过滤用户
  let filteredUsers = [...usersData]

  // 搜索过滤
  if (search) {
    const searchLower = search.toLowerCase()
    filteredUsers = filteredUsers.filter(user =>
      user.username.toLowerCase().includes(searchLower) ||
      user.bio.toLowerCase().includes(searchLower)
    )
  }

  // 类型过滤
  if (filter === 'creators') {
    filteredUsers = filteredUsers.filter(user =>
      user.badges.includes('creator')
    )
  } else if (filter === 'verified') {
    filteredUsers = filteredUsers.filter(user =>
      user.badges.includes('verified')
    )
  }

  // 排序：按粉丝数降序
  filteredUsers.sort((a, b) => b.stats.followers - a.stats.followers)

  // 分页
  const total = filteredUsers.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const users = filteredUsers.slice(start, end)

  // 处理用户数据，移除敏感信息
  const publicUsers = users.map(user => ({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    bio: user.settings.isPublicBio ? user.bio : null,
    stats: {
      characters: user.stats.characters,
      followers: user.stats.followers,
      following: user.stats.following
    },
    badges: user.badges,
    joinedAt: user.joinedAt,
    lastActive: user.lastActive
  }))

  return {
    users: publicUsers,
    pagination: {
      page,
      pageSize,
      total,
      hasMore: end < total
    }
  }
}) 