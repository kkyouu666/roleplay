import memoriesData from '~/server/mock/memories.json'
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

  // 检查隐私设置
  if (!user.settings.isPublicMemories) {
    return {
      memories: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        hasMore: false
      },
      isPrivate: true
    }
  }

  const page = parseInt(query.page as string) || 1
  const pageSize = parseInt(query.pageSize as string) || 10

  // 获取用户创建的记忆
  const userMemories = memoriesData.filter(memory => memory.user.id === id)

  // 分页
  const total = userMemories.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const memories = userMemories.slice(start, end)

  return {
    memories,
    pagination: {
      page,
      pageSize,
      total,
      hasMore: end < total
    },
    isPrivate: false
  }
}) 