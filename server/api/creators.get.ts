import usersData from '~/server/mock/users.json'

export default defineEventHandler(async (event) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 20
  const sort = query.sort as string || 'rating'
  const order = query.order as string || 'desc'

  // 从users中筛选出creators（有creator badge的用户）
  const creators = usersData.filter(user =>
    user.badges && user.badges.includes('creator')
  )

  // 排序
  const sortedCreators = creators.sort((a, b) => {
    let aValue, bValue

    switch (sort) {
      case 'followers':
        aValue = a.stats.followers
        bValue = b.stats.followers
        break
      case 'characters':
        aValue = a.stats.characters
        bValue = b.stats.characters
        break
      case 'rating':
        aValue = a.stats.rating || 0
        bValue = b.stats.rating || 0
        break
      case 'joinedAt':
        aValue = new Date(a.joinedAt).getTime()
        bValue = new Date(b.joinedAt).getTime()
        break
      default:
        aValue = a.stats.rating || 0
        bValue = b.stats.rating || 0
    }

    return order === 'desc' ? bValue - aValue : aValue - bValue
  })

  // 分页
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedCreators = sortedCreators.slice(startIndex, endIndex)

  // 转换为creators格式（保持向后兼容）
  const creatorsResponse = paginatedCreators.map(user => ({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    joinedAt: user.joinedAt,
    stats: {
      characters: user.stats.characters,
      followers: user.stats.followers,
      rating: user.stats.rating || 0
    }
  }))

  return {
    creators: creatorsResponse,
    pagination: {
      page,
      pageSize,
      total: sortedCreators.length,
      totalPages: Math.ceil(sortedCreators.length / pageSize)
    }
  }
}) 