export default defineEventHandler(async (event) => {
  const characterId = getRouterParam(event, 'id')
  const query = getQuery(event)

  if (!characterId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Character ID is required'
    })
  }

  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    // 读取记忆数据
    const memories = await import('~/server/mock/memories.json').then(m => m.default)

    // 筛选属于该角色的记忆
    let characterMemories = memories.filter(memory => memory.character.id === characterId)

    // 分页参数
    const page = parseInt(query.page as string) || 1
    const pageSize = parseInt(query.pageSize as string) || 5
    const offset = (page - 1) * pageSize

    // 按时间戳倒序排序（最新的在前）
    characterMemories.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // 应用分页
    const paginatedMemories = characterMemories.slice(offset, offset + pageSize)

    return {
      memories: paginatedMemories,
      pagination: {
        page,
        pageSize,
        total: characterMemories.length,
        hasMore: offset + pageSize < characterMemories.length
      }
    }
  } catch (error) {
    console.error('Error loading character memories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load character memories'
    })
  }
}) 